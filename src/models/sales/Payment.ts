import { Schema } from "mongoose";
import { opts, ref, registerModel } from "../_shared/helpers";

const PaymentSchema = new Schema(
  {
    orderId: { ...ref("Order"), required: true, index: true },
    method: { type: String, enum: ["promptpay", "transfer", "card", "cod"], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "verified", "rejected", "refunded"], default: "pending" },
    slipUrl: String,
    paidAt: Date,
    verifiedBy: ref("User"), // admin/sales ที่ตรวจสลิป
  },
  opts
);

export const Payment = registerModel("Payment", PaymentSchema);