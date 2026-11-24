import type { ClientSession } from "mongoose";
import { Inventory, Product, StockMovement } from "@/models";
import { badRequest, conflict, notFound } from "@/lib/errors";
import { pageMeta, skipOf } from "@/lib/pagination";
import type { Session } from "@/lib/session";
import { runInTransaction } from "@/lib/transaction";
import { assertObjectId, escapeRegex } from "@/lib/utils";
import type {
  AdjustStockInput, ListInventoryQuery, ListMovementsQuery, ReceiveStockInput,
} from "@/validators/inventory.schema";
import * as audit from "./audit.service";

type Db = ClientSession | undefined;
const sess = (db: Db) => db ?? null;

/* ═══════ ส่วนที่ route เรียก ═══════ */

type ProductRef = { name: string; sku: string; images?: string[]; status?: string } | null;

export async function list(q: ListInventoryQuery) {
  const filter: Record<string, unknown> = {};
  if (q.q) {
    const re = new RegExp(escapeRegex(q.q), "i");
    filter.productId = { $in: await Product.find({ $or: [{ name: re }, { sku: re }] }).distinct("_id") };
  }
  if (q.lowStock) {
    filter.$expr = { $lte: [{ $subtract: ["$onHand", "$reserved"] }, "$reorderPoint"] };
  }

  const [rows, total] = await Promise.all([
    Inventory.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skipOf(q.page, q.limit))
      .limit(q.limit)
      .populate<{ productId: ProductRef }>("productId", "name sku images status")
      .lean(),
    Inventory.countDocuments(filter),
  ]);
  const items = rows.map((r) => ({ ...r, available: Math.max(0, r.onHand - r.reserved) }));
  return { items, meta: pageMeta(total, q.page, q.limit) };
}

export async function getByProduct(productId: string) {
  assertObjectId(productId, "product id");
  const inv = await Inventory.findOne({ productId })
    .populate<{ productId: ProductRef }>("productId", "name sku images status")
    .lean();
  if (!inv) throw notFound("ไม่พบข้อมูลสต็อกของสินค้านี้");
  return { ...inv, available: Math.max(0, inv.onHand - inv.reserved) };
}

/** ปรับสต็อกเป็นค่าที่นับได้จริง (compare-and-set กันชนกับออเดอร์ที่กำลังจอง) */
export async function adjust(session: Session, productId: string, input: AdjustStockInput) {
  assertObjectId(productId, "product id");

  return runInTransaction(async (db) => {
    const inv = await Inventory.findOne({ productId }).session(sess(db));
    if (!inv) throw notFound("ไม่พบข้อมูลสต็อกของสินค้านี้");
    if (input.onHand < inv.reserved) {
      throw badRequest(`ปรับต่ำกว่ายอดที่ถูกจอง (${inv.reserved}) ไม่ได้`);
    }
    const diff = input.onHand - inv.onHand;
    if (diff === 0) return inv.toObject();

    const updated = await Inventory.findOneAndUpdate(
      { productId, onHand: inv.onHand },
      { $set: { onHand: input.onHand } },
      { new: true, session: db }
    );
    if (!updated) throw conflict("สต็อกถูกเปลี่ยนโดยรายการอื่น กรุณาโหลดใหม่แล้วลองอีกครั้ง");

    await StockMovement.create(
      [{
        productId, type: "adjust", quantity: diff, balanceAfter: updated.onHand,
        refType: "manual", note: input.note, createdBy: session.userId,
      }],
      { session: db }
    );
    await audit.log(
      {
        actorId: session.userId, action: "inventory.adjust", entity: "Inventory", entityId: productId,
        before: { onHand: inv.onHand }, after: { onHand: updated.onHand }, },
      db
    );
    return updated.toObject();
  });
}

export async function receive(session: Session, input: ReceiveStockInput) {
  // รวมรายการสินค้าซ้ำ
  const merged = new Map<string, number>();
  for (const i of input.items) merged.set(i.productId, (merged.get(i.productId) ?? 0) + i.quantity);

  return runInTransaction(async (db) => {
    const results = [];
    for (const [productId, quantity] of [...merged].sort(([a], [b]) => a.localeCompare(b))) {
      const inv = await Inventory.findOneAndUpdate(
        { productId }, { $inc: { onHand: quantity } }, { new: true, session: db }
      );
      if (!inv) throw notFound(`ไม่พบสต็อกของสินค้า ${productId}`);

      await StockMovement.create(
        [{
          productId, type: "receive", quantity, balanceAfter: inv.onHand,
          refType: "supplier", note: input.note, createdBy: session.userId,
        }],
        { session: db }
      );
      results.push(inv.toObject());
    }
    await audit.log(
      { actorId: session.userId, action: "inventory.receive", entity: "Inventory", after: input.items },
      db
    );
    return results;
  });
}

export async function listMovements(q: ListMovementsQuery) {
  const filter: Record<string, unknown> = {};
  if (q.productId) filter.productId = q.productId;
  if (q.type) filter.type = q.type;
  if (q.from || q.to) {
    filter.createdAt = { ...(q.from && { $gte: q.from }), ...(q.to && { $lte: q.to }) };
  }
  const [items, total] = await Promise.all([
    StockMovement.find(filter)
      .sort({ createdAt: -1 })
      .skip(skipOf(q.page, q.limit))
      .limit(q.limit)
      .populate("productId", "name sku")
      .populate("createdBy", "name")
      .lean(),
    StockMovement.countDocuments(filter),
  ]);
  return { items, meta: pageMeta(total, q.page, q.limit) };
}

/* ═══════ ส่วนที่ order.service เรียกภายใน transaction ═══════
 * ความหมายของ StockMovement.quantity:
 *   reserve +n (reserved เพิ่ม) · release -n (reserved ลด)
 *   ship -n (onHand ลด) · return +n (onHand เพิ่ม)
 */

export interface StockLine {
  productId: string;
  quantity: number;
  name?: string | null;
}

// เรียงตาม productId เสมอ เพื่อลดโอกาส deadlock ระหว่างออเดอร์ที่ทำพร้อมกัน
const ordered = (lines: StockLine[]) =>
  [...lines].sort((a, b) => a.productId.localeCompare(b.productId));

async function record(
  db: Db, productId: string, type: "reserve" | "release" | "ship" | "return",
  quantity: number, balanceAfter: number, orderId: unknown, actorId: string
) {
  await StockMovement.create(
    [{ productId, type, quantity, balanceAfter, refType: "order", refId: orderId as never, createdBy: actorId }],
    { session: db }
  );
}

/** จองสต็อก: สำเร็จเฉพาะเมื่อ (onHand - reserved) พอ — atomic ใน query เดียว */
export async function reserve(lines: StockLine[], orderId: unknown, actorId: string, db: Db) {
  for (const l of ordered(lines)) {
    const inv = await Inventory.findOneAndUpdate(
      {
        productId: l.productId,
        $expr: { $gte: [{ $subtract: ["$onHand", "$reserved"] }, l.quantity] },
      },
      { $inc: { reserved: l.quantity } },
      { new: true, session: db }
    );
    if (!inv) {
      throw conflict(`สินค้า "${l.name ?? l.productId}" มีสต็อกไม่เพียงพอ`, { productId: l.productId });
    }
    await record(db, l.productId, "reserve", l.quantity, inv.onHand, orderId, actorId);
  }
}

export async function release(lines: StockLine[], orderId: unknown, actorId: string, db: Db) {
  for (const l of ordered(lines)) {
    const inv = await Inventory.findOneAndUpdate(
      { productId: l.productId, reserved: { $gte: l.quantity } },
      { $inc: { reserved: -l.quantity } },
      { new: true, session: db }
    );
    if (!inv) throw conflict(`ยอดจองของสินค้า ${l.productId} ไม่สอดคล้อง กรุณาตรวจสอบสต็อก`);
    await record(db, l.productId, "release", -l.quantity, inv.onHand, orderId, actorId);
  }
}

/** ตัดของออกจากคลังจริง (ตอนส่งของ): onHand ลด และ reserved ลดพร้อมกัน */
export async function ship(lines: StockLine[], orderId: unknown, actorId: string, db: Db) {
  for (const l of ordered(lines)) {
    const inv = await Inventory.findOneAndUpdate(
      { productId: l.productId, onHand: { $gte: l.quantity }, reserved: { $gte: l.quantity } },
      { $inc: { onHand: -l.quantity, reserved: -l.quantity } },
      { new: true, session: db }
    );
    if (!inv) throw conflict(`สต็อกของสินค้า ${l.name ?? l.productId} ไม่พอสำหรับการส่งของ`);
    await record(db, l.productId, "ship", -l.quantity, inv.onHand, orderId, actorId);
  }
}

/** คืนของเข้าคลัง (ออเดอร์ returned) */
export async function restock(lines: StockLine[], orderId: unknown, actorId: string, db: Db) {
  for (const l of ordered(lines)) {
    const inv = await Inventory.findOneAndUpdate(
      { productId: l.productId },
      { $inc: { onHand: l.quantity } },
      { new: true, session: db }
    );
    if (!inv) continue; // สินค้าถูกลบไปแล้ว
    await record(db, l.productId, "return", l.quantity, inv.onHand, orderId, actorId);
  }
}
