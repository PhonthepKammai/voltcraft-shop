import type { ClientSession, Types } from "mongoose";
import { Cart, Coupon, CouponRedemption, Product } from "@/models";
import { badRequest, conflict, notFound } from "@/lib/errors";
import { calcShippingFee } from "@/lib/config";
import { pageMeta, skipOf } from "@/lib/pagination";
import type { Session } from "@/lib/session";
import { assertObjectId, escapeRegex, round2 } from "@/lib/utils";
import type {
  CreateCouponInput, ListCouponsQuery, UpdateCouponInput, ValidateCouponInput,
} from "@/validators/coupon.schema";
import * as audit from "./audit.service";

type Db = ClientSession | undefined;

/* ═══════ CRUD (admin) ═══════ */

export async function list(q: ListCouponsQuery) {
  const filter: Record<string, unknown> = {};
  if (q.q) filter.code = new RegExp(escapeRegex(q.q), "i");
  if (q.active) filter.isActive = q.active === "true";

  const [items, total] = await Promise.all([
    Coupon.find(filter).sort({ createdAt: -1 }).skip(skipOf(q.page, q.limit)).limit(q.limit).lean(),
    Coupon.countDocuments(filter),
  ]);
  return { items, meta: pageMeta(total, q.page, q.limit) };
}

export async function getById(id: string) {
  assertObjectId(id, "coupon id");
  const c = await Coupon.findById(id).lean();
  if (!c) throw notFound("ไม่พบคูปอง");
  return c;
}

export async function create(session: Session, input: CreateCouponInput) {
  const c = await Coupon.create({ ...input, createdBy: session.userId });
  await audit.log({ actorId: session.userId, action: "coupon.create", entity: "Coupon", entityId: c._id, after: { code: c.code } });
  return c;
}

export async function update(session: Session, id: string, input: UpdateCouponInput) {
  assertObjectId(id, "coupon id");
  const c = await Coupon.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true }).lean();
  if (!c) throw notFound("ไม่พบคูปอง");
  await audit.log({ actorId: session.userId, action: "coupon.update", entity: "Coupon", entityId: id, after: input });
  return c;
}

export async function remove(session: Session, id: string) {
  assertObjectId(id, "coupon id");
  if (await CouponRedemption.exists({ couponId: id })) {
    throw conflict("คูปองนี้มีประวัติการใช้งานแล้ว ให้ปิดใช้งาน (isActive: false) แทนการลบ");
  }
  const res = await Coupon.deleteOne({ _id: id });
  if (res.deletedCount === 0) throw notFound("ไม่พบคูปอง");
  await audit.log({ actorId: session.userId, action: "coupon.delete", entity: "Coupon", entityId: id });
}

/* ═══════ คำนวณส่วนลด (ใช้ร่วมกับ order.service) ═══════ */

export interface DiscountLine {
  productId: string;
  categoryId?: string;
  lineTotal: number;
}

export async function calculateDiscount(input: {
  code: string;
  userId: string;
  subtotal: number;
  shippingFee: number;
  lines: DiscountLine[];
}) {
  const coupon = await Coupon.findOne({ code: input.code }).lean();
  if (!coupon || !coupon.isActive) throw badRequest("ไม่พบคูปองนี้หรือปิดใช้งานแล้ว");

  const now = new Date();
  if (now < coupon.startsAt) throw badRequest("คูปองยังไม่ถึงเวลาใช้งาน");
  if (now > coupon.expiresAt) throw badRequest("คูปองหมดอายุแล้ว");
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    throw badRequest("คูปองถูกใช้ครบจำนวนแล้ว");
  }
  if (input.subtotal < coupon.minOrderAmount) {
    throw badRequest(`ต้องมียอดสั่งซื้อขั้นต่ำ ${coupon.minOrderAmount} บาท`);
  }
  const used = await CouponRedemption.countDocuments({ couponId: coupon._id, userId: input.userId });
  if (used >= coupon.perUserLimit) throw badRequest("คุณใช้สิทธิ์คูปองนี้ครบแล้ว");

  // จำกัดสินค้า/หมวด: คิดส่วนลดจากยอดของสินค้าที่เข้าเงื่อนไขเท่านั้น
  const prodSet = new Set(coupon.applicableProductIds.map(String));
  const catSet = new Set(coupon.applicableCategoryIds.map(String));
  const restricted = prodSet.size > 0 || catSet.size > 0;
  const eligible = restricted
    ? input.lines.filter((l) => prodSet.has(l.productId) || (l.categoryId && catSet.has(l.categoryId)))
    : input.lines;
  const eligibleTotal = eligible.reduce((s, l) => s + l.lineTotal, 0);
  if (restricted && eligibleTotal === 0) throw badRequest("คูปองนี้ใช้กับสินค้าในออเดอร์ไม่ได้");

  let discount = 0;
  if (coupon.type === "percent") {
    discount = (eligibleTotal * coupon.value) / 100;
    if (coupon.maxDiscount != null) discount = Math.min(discount, coupon.maxDiscount);
  } else if (coupon.type === "fixed") {
    discount = Math.min(coupon.value, eligibleTotal);
  } else {
    discount = input.shippingFee; // free_shipping
  }

  return { coupon, discountAmount: round2(discount) };
}

/** ตัดสิทธิ์คูปอง (เรียกใน transaction ของ order.create) */
export async function redeem(
  coupon: { _id: Types.ObjectId; usageLimit?: number | null; perUserLimit: number },
  userId: string, orderId: unknown, discountAmount: number, db: Db
) {
  const filter: Record<string, unknown> = { _id: coupon._id, isActive: true };
  if (coupon.usageLimit != null) filter.usedCount = { $lt: coupon.usageLimit };

  // atomic: กันคนใช้พร้อมกันจนเกินจำนวน
  const hit = await Coupon.findOneAndUpdate(filter, { $inc: { usedCount: 1 } }, { session: db });
  if (!hit) throw conflict("คูปองถูกใช้ครบจำนวนแล้ว");

  const used = await CouponRedemption.countDocuments({ couponId: coupon._id, userId }).session(db ?? null);
  if (used >= coupon.perUserLimit) throw conflict("คุณใช้สิทธิ์คูปองนี้ครบแล้ว");

  await CouponRedemption.create(
    [{ couponId: coupon._id, userId, orderId, discountAmount } as never],
    { session: db }
  );
}

/** คืนสิทธิ์คูปอง (ยกเลิกออเดอร์) */
export async function rollback(orderId: Types.ObjectId | string, db: Db) {
  const red = await CouponRedemption.findOneAndDelete({ orderId }, { session: db });
  if (red) {
    await Coupon.updateOne({ _id: red.couponId, usedCount: { $gt: 0 } }, { $inc: { usedCount: -1 } }, { session: db });
  }
}

/* ═══════ POST /coupons/validate ═══════ */

export async function validate(session: Session, input: ValidateCouponInput) {
  let raw = input.items;
  if (!raw) {
    const cart = await Cart.findOne({ customerId: session.userId }).lean();
    raw = (cart?.items ?? []).map((i) => ({ productId: String(i.productId), quantity: i.quantity }));
  }
  if (raw.length === 0) throw badRequest("ตะกร้าว่าง");

  const products = await Product.find({ _id: { $in: raw.map((i) => i.productId) }, status: "active" })
    .select("price categoryId").lean();
  const pm = new Map(products.map((p) => [String(p._id), p]));

  const lines: DiscountLine[] = [];
  for (const i of raw) {
    const p = pm.get(i.productId);
    if (!p) throw badRequest("มีสินค้าบางรายการไม่พร้อมจำหน่าย");
    lines.push({
      productId: i.productId,
      categoryId: p.categoryId ? String(p.categoryId) : undefined,
      lineTotal: round2(p.price * i.quantity),
    });
  }
  const subtotal = round2(lines.reduce((s, l) => s + l.lineTotal, 0));
  const shippingFee = calcShippingFee(subtotal);

  const { coupon, discountAmount } = await calculateDiscount({
    code: input.code, userId: session.userId, subtotal, shippingFee, lines,
  });
  return {
    code: coupon.code,
    type: coupon.type,
    description: coupon.description,
    discountAmount,
    subtotal,
    shippingFee,
    total: Math.max(0, round2(subtotal + shippingFee - discountAmount)),
  };
}
