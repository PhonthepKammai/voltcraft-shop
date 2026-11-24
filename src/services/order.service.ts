import type { ClientSession, Types } from "mongoose";
import { Cart, Counter, Order, Payment, Product, Shipment, User } from "@/models";
import { calcShippingFee, config } from "@/lib/config";
import { badRequest, conflict, forbidden, notFound } from "@/lib/errors";
import { pageMeta, skipOf } from "@/lib/pagination";
import { hasRole, isAdmin, type Role } from "@/lib/rbac";
import type { Session } from "@/lib/session";
import { runInTransaction } from "@/lib/transaction";
import { assertObjectId, escapeRegex, round2 } from "@/lib/utils";
import type {
  CancelOrderInput, CreateOrderInput, ListOrdersQuery, UpdateOrderStatusInput,
} from "@/validators/order.schema";
import * as audit from "./audit.service";
import * as couponService from "./coupon.service";
import * as inventoryService from "./inventory.service";

type Db = ClientSession | undefined;

/* ═══════ ใครเห็นออเดอร์ไหนได้ ═══════
 * customer  = ของตัวเอง
 * sales     = ที่ตัวเองดูแล/สร้าง
 * warehouse = ที่ต้องแพ็ค/ส่ง (confirmed, packing, shipped)
 * admin     = ทั้งหมด
 * user หลาย role → เห็นรวมกัน (OR)
 */
export function orderScope(session: Session): Record<string, unknown> {
  if (isAdmin(session)) return {};
  const or: Record<string, unknown>[] = [];
  if (session.roles.includes("customer")) or.push({ customerId: session.userId });
  if (session.roles.includes("sales")) or.push({ salesId: session.userId }, { createdBy: session.userId });
  if (session.roles.includes("warehouse")) or.push({ status: { $in: ["confirmed", "packing", "shipped"] } });
  return or.length > 0 ? { $or: or } : { _id: null }; // ไม่มีสิทธิ์ = ไม่เห็นอะไรเลย
}

/* ═══════ รายการ / รายละเอียด ═══════ */

export async function list(session: Session, q: ListOrdersQuery) {
  const extra: Record<string, unknown> = {};
  if (q.status) extra.status = q.status;
  if (q.paymentStatus) extra.paymentStatus = q.paymentStatus;
  if (q.customerId) extra.customerId = q.customerId;
  if (q.q) extra.orderNo = new RegExp(escapeRegex(q.q), "i");
  if (q.from || q.to) {
    extra.createdAt = { ...(q.from && { $gte: q.from }), ...(q.to && { $lte: q.to }) };
  }
  const filter = { $and: [orderScope(session), extra] };

  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skipOf(q.page, q.limit))
      .limit(q.limit)
      .populate("customerId", "name email phone")
      .lean(),
    Order.countDocuments(filter),
  ]);
  return { items, meta: pageMeta(total, q.page, q.limit) };
}

async function loadVisible(session: Session, id: string) {
  assertObjectId(id, "order id");
  // ไม่มีสิทธิ์ก็ตอบ "ไม่พบ" เหมือนกัน ไม่เปิดเผยว่ามีออเดอร์นี้อยู่
  const order = await Order.findOne({ $and: [{ _id: id }, orderScope(session)] }).lean();
  if (!order) throw notFound("ไม่พบออเดอร์");
  return order;
}

export async function getById(session: Session, id: string) {
  assertObjectId(id, "order id");
  const order = await Order.findOne({ $and: [{ _id: id }, orderScope(session)] })
    .populate("customerId", "name email phone")
    .populate("salesId", "name")
    .lean();
  if (!order) throw notFound("ไม่พบออเดอร์");
  const shipment = await Shipment.findOne({ orderId: id }).lean();
  return { ...order, shipment };
}

/* ═══════ สร้างออเดอร์ ═══════ */

async function nextOrderNo(db: Db) {
  const d = new Date();
  const yymm = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}`;
  const counter = await Counter.findOneAndUpdate(
    { key: `order-${yymm}` },
    { $inc: { seq: 1 } },
    { upsert: true, new: true, session: db }
  );
  return `VC-${yymm}-${String(counter.seq).padStart(6, "0")}`;
}

export async function create(session: Session, input: CreateOrderInput) {
  /* 1) ลูกค้าเจ้าของออเดอร์ */
  const onBehalf = !!input.customerId && input.customerId !== session.userId;
  let customerId = session.userId;

  if (onBehalf) {
    if (!hasRole(session, "sales", "admin")) throw forbidden("สร้างออเดอร์แทนลูกค้าได้เฉพาะ sales/admin");
    customerId = input.customerId!;
  } else if (!session.roles.includes("customer")) {
    throw badRequest("ต้องระบุ customerId (บัญชีนี้ไม่ใช่ลูกค้า)");
  }

  const customer = await User.findById(customerId).lean();
  if (!customer || !customer.roles.includes("customer") || customer.status !== "active") {
    throw notFound("ไม่พบลูกค้า");
  }
  if (onBehalf && !isAdmin(session) && String(customer.assignedSalesId) !== session.userId) {
    throw forbidden("ลูกค้านี้ไม่ได้อยู่ในความดูแลของคุณ");
  }
  const salesId = onBehalf && hasRole(session, "sales")
    ? session.userId
    : customer.assignedSalesId ? String(customer.assignedSalesId) : undefined;

  /* 2) รายการสินค้า: จาก input หรือจากตะกร้า */
  let raw = input.items;
  const fromCart = !raw;
  if (!raw) {
    const cart = await Cart.findOne({ customerId }).lean();
    raw = (cart?.items ?? []).map((i) => ({ productId: String(i.productId), quantity: i.quantity }));
  }
  if (raw.length === 0) throw badRequest("ไม่มีสินค้าในออเดอร์");

  const qty = new Map<string, number>();
  for (const i of raw) qty.set(i.productId, (qty.get(i.productId) ?? 0) + i.quantity);

  const products = await Product.find({ _id: { $in: [...qty.keys()] }, status: "active" })
    .select("sku name price categoryId").lean();
  if (products.length !== qty.size) throw badRequest("มีสินค้าบางรายการไม่พร้อมจำหน่ายหรือไม่มีอยู่ในระบบ");

  // snapshot ชื่อ/ราคา ณ ตอนสั่ง
  const items = products.map((p) => {
    const quantity = qty.get(String(p._id))!;
    return {
      productId: p._id, sku: p.sku, name: p.name, unitPrice: p.price,
      quantity, lineTotal: round2(p.price * quantity),
    };
  });

  /* 3) ที่อยู่จัดส่ง (snapshot) */
  let shippingAddress;
  if (input.addressId) {
    const a = customer.addresses.find((x) => String(x._id) === input.addressId);
    if (!a) throw notFound("ไม่พบที่อยู่จัดส่ง");
    const { recipient, phone, line1, subdistrict, district, province, postalCode } = a;
    shippingAddress = { recipient, phone, line1, subdistrict, district, province, postalCode };
  } else {
    shippingAddress = input.shippingAddress!;
  }

  /* 4) ยอดเงิน + คูปอง */
  const subtotal = round2(items.reduce((s, i) => s + i.lineTotal, 0));
  const shippingFee = calcShippingFee(subtotal);

  const couponResult = input.couponCode
    ? await couponService.calculateDiscount({
        code: input.couponCode,
        userId: customerId,
        subtotal,
        shippingFee,
        lines: items.map((i) => {
          const p = products.find((x) => String(x._id) === String(i.productId))!;
          return {
            productId: String(i.productId),
            categoryId: p.categoryId ? String(p.categoryId) : undefined,
            lineTotal: i.lineTotal,
          };
        }),
      })
    : null;

  const discount = couponResult?.discountAmount ?? 0;
  const tax = round2(Math.max(0, subtotal - Math.min(discount, subtotal)) * config.taxRate);
  const total = Math.max(0, round2(subtotal + shippingFee - discount + tax));

  /* 5) บันทึกทั้งก้อนใน transaction: เลขออเดอร์ + ออเดอร์ + จองสต็อก + ตัดสิทธิ์คูปอง + ล้างตะกร้า */
  const order = await runInTransaction(async (db) => {
    const orderNo = await nextOrderNo(db);

    const [created] = await Order.create(
      [{
        orderNo,
        customerId,
        salesId,
        createdBy: session.userId,
        channel: onBehalf ? "sales" : "online",
        items,
        shippingAddress,
        subtotal,
        coupon: couponResult
          ? { couponId: couponResult.coupon._id, code: couponResult.coupon.code, discountAmount: discount }
          : undefined,
        discount,
        shippingFee,
        tax,
        total,
        status: "pending",
        paymentStatus: "unpaid",
        statusHistory: [{ status: "pending", by: session.userId, at: new Date() }],
        note: input.note,
      }],
      { session: db }
    );

    // จองสต็อกตั้งแต่ตอนสร้างออเดอร์ กันขายเกิน; ไม่พอ = throw → rollback ทั้งก้อน
    await inventoryService.reserve(
      items.map((i) => ({ productId: String(i.productId), quantity: i.quantity, name: i.name })),
      created._id, session.userId, db
    );

    if (couponResult) {
      await couponService.redeem(couponResult.coupon, customerId, created._id, discount, db);
    }
    if (fromCart) {
      await Cart.updateOne({ customerId }, { $set: { items: [] } }, { session: db });
    }
    await audit.log(
      { actorId: session.userId, action: "order.create", entity: "Order", entityId: created._id, after: { orderNo, total } },
      db
    );
    return created;
  });

  return order;
}

/* ═══════ เปลี่ยนสถานะ ═══════ */

const TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed"],
  confirmed: ["packing"],
  packing: ["shipped"],
  shipped: ["delivered"],
  delivered: ["returned"],
};

/** role ไหนเปลี่ยนไปสถานะปลายทางอะไรได้บ้าง */
const ROLE_TARGETS: Record<Role, string[]> = {
  customer: [],
  sales: ["confirmed"],
  warehouse: ["packing", "shipped", "delivered"],
  admin: ["confirmed", "packing", "shipped", "delivered", "returned"],
};

async function syncShipment(orderId: Types.ObjectId, status: string, actorId: string, db: Db) {
  const set: Record<string, unknown> = {};
  if (status === "packing") set.packedBy = actorId;
  if (status === "shipped") Object.assign(set, { status: "shipped", shippedAt: new Date() });
  if (status === "delivered") Object.assign(set, { status: "delivered", deliveredAt: new Date() });

  await Shipment.updateOne(
    { orderId },
    Object.keys(set).length > 0 ? { $set: set } : { $setOnInsert: { status: "preparing" } },
    { upsert: true, session: db }
  );
}

export async function updateStatus(session: Session, id: string, input: UpdateOrderStatusInput) {
  const order = await loadVisible(session, id);
  const next = input.status;

  if (!session.roles.some((r) => ROLE_TARGETS[r]?.includes(next))) {
    throw forbidden(`บทบาทของคุณเปลี่ยนสถานะเป็น "${next}" ไม่ได้`);
  }
  if (!TRANSITIONS[order.status]?.includes(next)) {
    throw badRequest(`เปลี่ยนสถานะจาก "${order.status}" เป็น "${next}" ไม่ได้`);
  }
  if (next === "confirmed" && order.paymentStatus !== "paid") {
    // ยืนยันได้เมื่อชำระแล้ว หรือเป็นออเดอร์เก็บเงินปลายทาง
    if (!(await Payment.exists({ orderId: order._id, method: "cod" }))) {
      throw badRequest("ออเดอร์ยังไม่ได้ชำระเงิน ยืนยันไม่ได้");
    }
  }

  const lines = order.items.map((i) => ({ productId: String(i.productId), quantity: i.quantity, name: i.name }));

  return runInTransaction(async (db) => {
    const set: Record<string, unknown> = { status: next };

    if (next === "shipped") await inventoryService.ship(lines, order._id, session.userId, db);
    if (next === "returned") await inventoryService.restock(lines, order._id, session.userId, db);
    if (next === "delivered") {
      // เก็บเงินปลายทาง: ส่งถึงแล้ว = ได้รับเงินแล้ว
      const cod = await Payment.findOneAndUpdate(
        { orderId: order._id, method: "cod", status: "pending" },
        { status: "verified", paidAt: new Date(), verifiedBy: session.userId },
        { session: db }
      );
      if (cod) set.paymentStatus = "paid";
    }
    if (["confirmed", "packing", "shipped", "delivered"].includes(next)) {
      await syncShipment(order._id, next, session.userId, db);
    }

    // เงื่อนไข status เดิม = กันสองคนกดพร้อมกัน
    const updated = await Order.findOneAndUpdate(
      { _id: order._id, status: order.status },
      {
        $set: set,
        $push: { statusHistory: { status: next, by: session.userId, at: new Date(), note: input.note } },
      } as never,
      { new: true, session: db }
    );
    if (!updated) throw conflict("สถานะออเดอร์ถูกเปลี่ยนไปแล้ว กรุณาโหลดใหม่");

    await audit.log(
      { actorId: session.userId, action: "order.status", entity: "Order", entityId: order._id, before: { status: order.status }, after: { status: next } },
      db
    );
    return updated.toObject();
  });
}

/* ═══════ ยกเลิก ═══════ */

export async function cancel(session: Session, id: string, input: CancelOrderInput) {
  const order = await loadVisible(session, id);

  // customer ยกเลิกเองได้เฉพาะตอน pending; sales/admin ยกเลิกได้จนถึงก่อนส่งของ
  const staff = hasRole(session, "sales", "admin");
  const cancellable = staff ? ["pending", "confirmed", "packing"] : ["pending"];
  if (!cancellable.includes(order.status)) {
    throw badRequest(
      staff
        ? `ยกเลิกออเดอร์สถานะ "${order.status}" ไม่ได้ (หลังส่งของต้องทำเป็นการคืนสินค้า)`
        : "ลูกค้ายกเลิกได้เฉพาะออเดอร์ที่ยังรอยืนยัน กรุณาติดต่อร้าน"
    );
  }

  const lines = order.items.map((i) => ({ productId: String(i.productId), quantity: i.quantity, name: i.name }));

  return runInTransaction(async (db) => {
    const updated = await Order.findOneAndUpdate(
      { _id: order._id, status: order.status },
      {
        $set: { status: "cancelled" },
        $push: { statusHistory: { status: "cancelled", by: session.userId, at: new Date(), note: input.reason } },
      } as never,
      { new: true, session: db }
    );
    if (!updated) throw conflict("สถานะออเดอร์ถูกเปลี่ยนไปแล้ว กรุณาโหลดใหม่");

    await inventoryService.release(lines, order._id, session.userId, db); // คืนสต็อกที่จอง
    await couponService.rollback(order._id, db); // คืนสิทธิ์คูปอง
    await Payment.updateMany({ orderId: order._id, status: "pending" }, { status: "rejected" }, { session: db });

    await audit.log(
      { actorId: session.userId, action: "order.cancel", entity: "Order", entityId: order._id, before: { status: order.status }, after: { reason: input.reason, paymentStatus: order.paymentStatus } },
      db
    );
    return updated.toObject();
  });
}
