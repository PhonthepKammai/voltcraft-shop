import { Schema } from "mongoose";
import { opts, ref, registerModel } from "../_shared/helpers";

const ShipmentSchema = new Schema(
  {
    orderId: { ...ref("Order"), required: true, unique: true },
    carrier: String, // Kerry, Flash, ไปรษณีย์ไทย
    trackingNo: String,
    status: { type: String, enum: ["preparing", "shipped", "delivered", "failed"], default: "preparing" },
    packedBy: ref("User"), // warehouse
    shippedAt: Date,
    deliveredAt: Date,
  },
  opts
);

export const Shipment = registerModel("Shipment", ShipmentSchema);