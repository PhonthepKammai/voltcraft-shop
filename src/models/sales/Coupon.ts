import { Schema } from "mongoose";
import { opts, ref, registerModel } from "../_shared/helpers";

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: String,
    type: { type: String, enum: ["percent", "fixed", "free_shipping"], required: true },
    value: { type: Number, default: 0, min: 0 }, // percent: 0-100, fixed: บาท
    maxDiscount: Number, // เพดานส่วนลดสำหรับแบบ percent
    minOrderAmount: { type: Number, default: 0 },
    // เงื่อนไขขอบเขต (ว่าง = ใช้ได้ทั้งหมด)
    applicableProductIds: [ref("Product")],
    applicableCategoryIds: [ref("Category")],
    // จำกัดการใช้
    usageLimit: Number, // ใช้ได้รวมทั้งระบบกี่ครั้ง (ว่าง = ไม่จำกัด)
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    startsAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true, index: true },
    createdBy: ref("User"),
  },
  opts
);

export const Coupon = registerModel("Coupon", CouponSchema);