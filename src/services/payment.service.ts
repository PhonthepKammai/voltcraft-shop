import { Order, Payment } from "@/models";
import { badRequest, conflict, notFound } from "@/lib/errors";
import { pageMeta, skipOf } from "@/lib/pagination";
import { isAdmin } from "@/lib/rbac";
import type { Session } from "@/lib/session";
import { runInTransaction } from "@/lib/transaction";
import { isOwnFileUrl } from "@/lib/storage";
import { assertObjectId, round2 } from "@/lib/utils";
import type {
  CreatePaymentInput, ListPaymentsQuery, VerifyPaymentInput,
} from "@/validators/payment.schema";
import * as audit from "./audit.service";
import { orderScope } from "./order.service";

/** payment เห็นได้เท่าที่ออเดอร์ของมันเห็นได้ */
async function visibleOrderIds(session: Session) {
  return Order.find(orderScope(session)).distinct("_id");
}

export async function list(session: Session, q: ListPaymentsQuery) {
  const filter: Record<string, unknown> = {};
  if (q.status) filter.status = q.status;
  if (q.orderId) filter.orderId = q.orderId;
  if (!isAdmin(session)) {
    const ids = await visibleOrderIds(session);
    filter.orderId = q.orderId
      ? { $in: ids.filter((id) => String(id) === q.orderId) }
      : { $in: ids };
  }

  const [items, total] = await Promise.all([
    Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skipOf(q.page, q.limit))
      .limit(q.limit)
      .populate("orderId", "orderNo total status")
      .lean(),
    Payment.countDocuments(filter),
  ]);
  return { items, meta: pageMeta(total, q.page, q.limit) };
}

export async function getById(session: Session, id: string) {
  assertObjectId(id, "payment id");
  const payment = await Payment.findById(id).lean();
  if (!payment) throw notFound("ไม่พบรายการชำระเงิน");
  const visible = await Order.exists({ $and: [{ _id: payment.orderId }, orderScope(session)] });
  if (!visible) throw notFound("ไม่พบรายการชำระเงิน");
  return payment;
}

/** ลูกค้าแจ้งชำระเงินของออเดอร์ตัวเอง */
export async function create(session: Session, input: CreatePaymentInput) {
  const order = await Order.findOne({ _id: input.orderId, customerId: session.userId }).lean();
  if (!order) throw notFound("ไม่พบออเดอร์");
  if (order.status !== "pending" || order.paymentStatus !== "unpaid") {
    throw badRequest("ออเดอร์นี้ไม่อยู่ในสถานะที่ชำระเงินได้");
  }
  if (round2(input.amount) !== round2(order.total)) {
    throw badRequest(`ยอดชำระต้องเท่ากับยอดออเดอร์ ${order.total} บาท`);
  }
  if (input.slipUrl && !isOwnFileUrl(input.slipUrl)) {
    throw badRequest("สลิปต้องอัปโหลดผ่านระบบ (POST /api/uploads) เท่านั้น");
  }
  if (await Payment.exists({ orderId: order._id, status: { $in: ["pending", "verified"] } })) {
    throw conflict("ออเดอร์นี้มีรายการชำระเงินอยู่แล้ว");
  }

  return Payment.create({
    orderId: order._id, method: input.method, amount: input.amount, slipUrl: input.slipUrl, status: "pending",
  });
}

/** sales/admin ตรวจสลิป */
export async function verify(session: Session, id: string, input: VerifyPaymentInput) {
  assertObjectId(id, "payment id");
  const payment = await Payment.findById(id).lean();
  if (!payment) throw notFound("ไม่พบรายการชำระเงิน");
  if (payment.status !== "pending") throw conflict("รายการนี้ถูกตรวจสอบไปแล้ว");

  const order = await Order.findOne({ $and: [{ _id: payment.orderId }, orderScope(session)] }).lean();
  if (!order) throw notFound("ไม่พบออเดอร์ของรายการนี้");
  if (order.status === "cancelled") throw badRequest("ออเดอร์ถูกยกเลิกแล้ว");

  return runInTransaction(async (db) => {
    const updated = await Payment.findOneAndUpdate(
      { _id: id, status: "pending" },
      {
        status: input.approved ? "verified" : "rejected",
        verifiedBy: session.userId,
        ...(input.approved && { paidAt: new Date() }),
      },
      { new: true, session: db }
    );
    if (!updated) throw conflict("รายการนี้ถูกตรวจสอบไปแล้ว");

    if (input.approved) {
      await Order.updateOne({ _id: order._id }, { paymentStatus: "paid" }, { session: db });
    }
    await audit.log(
      { actorId: session.userId, action: input.approved ? "payment.verify" : "payment.reject", entity: "Payment", entityId: id, after: { orderId: order._id } },
      db
    );
    return updated.toObject();
  });
}
