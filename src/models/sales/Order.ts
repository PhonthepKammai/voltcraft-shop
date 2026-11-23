import { Schema } from "mongoose";
import { opts, ref, registerModel } from "../_shared/helpers";
import { ORDER_STATUS } from "../_shared/constants";

const OrderItemSchema = new Schema(
  {
    productId: { ...ref("Product"), required: true },
    sku: String, // snapshot
    name: String, // snapshot
    unitPrice: { type: Number, required: true }, // snapshot ราคาตอนสั่ง
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderNo: { type: String, required: true, unique: true }, // เช่น VC-2611-000123
    customerId: { ...ref("User"), required: true, index: true },
    salesId: { ...ref("User"), index: true }, // sales ผู้ดูแลออเดอร์
    createdBy: { ...ref("User"), required: true }, // customer เอง หรือ sales สร้างแทน
    channel: { type: String, enum: ["online", "sales"], default: "online" },
    items: { type: [OrderItemSchema], validate: (v: unknown[]) => v.length > 0 },
    shippingAddress: {
      recipient: String, phone: String, line1: String,
      subdistrict: String, district: String, province: String, postalCode: String,
    }, // snapshot ไม่อ้างอิง addresses ของ user
    subtotal: { type: Number, required: true },
    coupon: {
      couponId: ref("Coupon"),
      code: String, // snapshot
      discountAmount: Number, // ส่วนลดที่ใช้จริง
    },
    discount: { type: Number, default: 0 }, // ส่วนลดรวมทั้งหมด (คูปอง + อื่นๆ)
    shippingFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, enum: ORDER_STATUS, default: "pending", index: true },
    paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
    statusHistory: [
      {
        status: String,
        by: ref("User"),
        at: { type: Date, default: Date.now },
        note: String,
        _id: false,
      },
    ],
    note: String,
  },
  opts
);
OrderSchema.index({ createdAt: -1 });

export const Order = registerModel("Order", OrderSchema);