import type { Types } from "mongoose";
import { Category, Inventory, Order, Product, StockMovement } from "@/models";
import { conflict, notFound } from "@/lib/errors";
import { pageMeta, skipOf } from "@/lib/pagination";
import { isAdmin } from "@/lib/rbac";
import type { Session } from "@/lib/session";
import { runInTransaction } from "@/lib/transaction";
import { assertObjectId, escapeRegex } from "@/lib/utils";
import type {
  CreateProductInput, ListProductsQuery, UpdateProductInput,
} from "@/validators/product.schema";
import * as audit from "./audit.service";

/** แนบจำนวนที่ขายได้จริง (onHand - reserved) — ไม่เปิดเผย onHand ให้ลูกค้า */
async function withAvailability<T extends { _id: Types.ObjectId }>(products: T[]) {
  const inv = await Inventory.find({ productId: { $in: products.map((p) => p._id) } }).lean();
  const map = new Map(inv.map((i) => [String(i.productId), i]));
  return products.map((p) => {
    const i = map.get(String(p._id));
    return { ...p, available: i ? Math.max(0, i.onHand - i.reserved) : 0 };
  });
}

const SORTS = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating: { ratingAvg: -1, ratingCount: -1 },
} as const;

export async function list(session: Session | null, q: ListProductsQuery) {
  const admin = !!session && isAdmin(session);
  const filter: Record<string, unknown> = {};

  // คนทั่วไปเห็นเฉพาะสินค้า active; admin กรองสถานะเองได้
  if (admin) { if (q.status) filter.status = q.status; }
  else filter.status = "active";

  if (q.categoryId) filter.categoryId = q.categoryId;
  if (q.minPrice !== undefined || q.maxPrice !== undefined) {
    filter.price = {
      ...(q.minPrice !== undefined && { $gte: q.minPrice }),
      ...(q.maxPrice !== undefined && { $lte: q.maxPrice }),
    };
  }
  if (q.q) {
    // ใช้ regex แทน $text เพราะ text index ตัดคำภาษาไทยไม่ได้
    const re = new RegExp(escapeRegex(q.q), "i");
    filter.$or = [{ name: re }, { sku: re }];
  }

  const [rows, total] = await Promise.all([
    Product.find(filter).sort(SORTS[q.sort]).skip(skipOf(q.page, q.limit)).limit(q.limit).lean(),
    Product.countDocuments(filter),
  ]);
  return { items: await withAvailability(rows), meta: pageMeta(total, q.page, q.limit) };
}

export async function getById(session: Session | null, id: string) {
  assertObjectId(id, "product id");
  const filter: Record<string, unknown> = { _id: id };
  if (!session || !isAdmin(session)) filter.status = "active";

  const product = await Product.findOne(filter).lean();
  if (!product) throw notFound("ไม่พบสินค้า");
  return (await withAvailability([product]))[0];
}

export async function create(session: Session, input: CreateProductInput) {
  if (!(await Category.exists({ _id: input.categoryId }))) throw notFound("ไม่พบหมวดหมู่");
  const { initialStock, reorderPoint, ...data } = input;

  const product = await runInTransaction(async (db) => {
    const [p] = await Product.create([data], { session: db });
    await Inventory.create([{ productId: p._id, onHand: initialStock, reorderPoint }], { session: db });
    if (initialStock > 0) {
      await StockMovement.create(
        [{
          productId: p._id, type: "receive", quantity: initialStock, balanceAfter: initialStock,
          refType: "manual", note: "สต็อกเริ่มต้น", createdBy: session.userId,
        }],
        { session: db }
      );
    }
    await audit.log(
      { actorId: session.userId, action: "product.create", entity: "Product", entityId: p._id, after: { sku: p.sku, price: p.price } },
      db
    );
    return p;
  });
  return product;
}

export async function update(session: Session, id: string, input: UpdateProductInput) {
  assertObjectId(id, "product id");
  if (input.categoryId && !(await Category.exists({ _id: input.categoryId }))) throw notFound("ไม่พบหมวดหมู่");

  const before = await Product.findById(id).select("price status sku").lean();
  if (!before) throw notFound("ไม่พบสินค้า");

  const product = await Product.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true }).lean();
  await audit.log({
    actorId: session.userId, action: "product.update", entity: "Product", entityId: id,
    before: { price: before.price, status: before.status }, after: input,
  });
  return product;
}

/** สินค้าที่เคยถูกสั่งแล้วลบจริงไม่ได้ (ประวัติออเดอร์ต้องอยู่) → archive แทน */
export async function remove(session: Session, id: string) {
  assertObjectId(id, "product id");
  const product = await Product.findById(id).select("sku").lean();
  if (!product) throw notFound("ไม่พบสินค้า");

  if (await Order.exists({ "items.productId": id })) {
    await Product.updateOne({ _id: id }, { status: "archived" });
    await audit.log({ actorId: session.userId, action: "product.archive", entity: "Product", entityId: id });
    return;
  }

  const inv = await Inventory.findOne({ productId: id }).lean();
  if (inv && (inv.onHand > 0 || inv.reserved > 0)) {
    throw conflict("ยังมีสต็อกคงเหลือ ปรับสต็อกเป็น 0 หรือ archive สินค้าก่อน");
  }
  await runInTransaction(async (db) => {
    await Inventory.deleteOne({ productId: id }, { session: db });
    await Product.deleteOne({ _id: id }, { session: db });
    await audit.log({ actorId: session.userId, action: "product.delete", entity: "Product", entityId: id, before: { sku: product.sku } }, db);
  });
}
