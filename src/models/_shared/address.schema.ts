import { Schema } from "mongoose";

export const AddressSchema = new Schema(
  {
    label: String, // บ้าน / ที่ทำงาน
    recipient: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    subdistrict: String,
    district: String,
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);