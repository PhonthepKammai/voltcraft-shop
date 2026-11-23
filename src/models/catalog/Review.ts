import { Schema } from "mongoose";
import { opts, ref, registerModel } from "../_shared/helpers";

const ReviewSchema = new Schema(
  {
    productId: { ...ref("Product"), required: true, index: true },
    customerId: { ...ref("User"), required: true },
    orderId: { ...ref("Order"), required: true }, // รีวิวได้เฉพาะออเดอร์ที่ delivered
    rating: { type: Number, required: true, min: 1, max: 5, validate: Number.isInteger },
    comment: { type: String, maxlength: 2000 },
    images: {
      type: [{ url: { type: String, required: true }, _id: false }],
      validate: [(v: unknown[]) => v.length <= 5, "แนบรูปได้ไม่เกิน 5 รูป"],
    },
    status: { type: String, enum: ["pending", "published", "hidden"], default: "published", index: true },
    reply: { text: String, by: ref("User"), at: Date }, // admin/sales ตอบกลับ
  },
  opts
);
// 1 คน รีวิวสินค้า 1 ชิ้นต่อ 1 ออเดอร์ ได้ครั้งเดียว
ReviewSchema.index({ customerId: 1, productId: 1, orderId: 1 }, { unique: true });
ReviewSchema.index({ productId: 1, status: 1, createdAt: -1 }); // หน้าสินค้าดึงรีวิวล่าสุด


export const Review = registerModel("Review", ReviewSchema);