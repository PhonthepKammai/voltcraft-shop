import { Order, Shipment } from "@/models";
import { badRequest, notFound } from "@/lib/errors";
import type { Session } from "@/lib/session";
import { assertObjectId } from "@/lib/utils";
import type { UpdateShipmentInput } from "@/validators/shipment.schema";
import * as audit from "./audit.service";
import { orderScope } from "./order.service";

async function assertOrderVisible(session: Session, orderId: string) {
  assertObjectId(orderId, "order id");
  const order = await Order.findOne({ $and: [{ _id: orderId }, orderScope(session)] }).select("status").lean();
  if (!order) throw notFound("ไม่พบออเดอร์");
  return order;
}

export async function getByOrder(session: Session, orderId: string) {
  await assertOrderVisible(session, orderId);
  const shipment = await Shipment.findOne({ orderId }).lean();
  if (!shipment) throw notFound("ยังไม่มีข้อมูลการจัดส่ง");
  return shipment;
}

/** warehouse ใส่ขนส่ง/เลขพัสดุ — สถานะ shipment เปลี่ยนผ่าน PATCH /orders/:id/status เท่านั้น */
export async function update(session: Session, orderId: string, input: UpdateShipmentInput) {
  const order = await assertOrderVisible(session, orderId);
  if (!["confirmed", "packing", "shipped"].includes(order.status)) {
    throw badRequest(`แก้ข้อมูลจัดส่งของออเดอร์สถานะ "${order.status}" ไม่ได้`);
  }
  const shipment = await Shipment.findOneAndUpdate(
    { orderId },
    { $set: input },
    { upsert: true, new: true, runValidators: true }
  ).lean();

  await audit.log({ actorId: session.userId, action: "shipment.update", entity: "Shipment", entityId: orderId, after: input });
  return shipment;
}
