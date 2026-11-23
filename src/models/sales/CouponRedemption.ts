import { Schema } from "mongoose";
import { ref, registerModel } from "../_shared/helpers";

const CouponRedemptionSchema = new Schema(
  {
    couponId: { ...ref("Coupon"), required: true, index: true },
    userId: { ...ref("User"), required: true },
    orderId: { ...ref("Order"), required: true },
    discountAmount: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
CouponRedemptionSchema.index({ couponId: 1, orderId: 1 }, { unique: true });
CouponRedemptionSchema.index({ couponId: 1, userId: 1 }); // เช็ค perUserLimit

export const CouponRedemption = registerModel("CouponRedemption", CouponRedemptionSchema);