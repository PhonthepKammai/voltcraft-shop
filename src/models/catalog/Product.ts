import { Schema } from "mongoose";
import { opts, ref, registerModel } from "../_shared/helpers";

const ProductSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    categoryId: { ...ref("Category"), index: true },
    price: { type: Number, required: true, min: 0 }, // ราคาปัจจุบัน

    sale: {
      isActive: { type: Boolean, default: false },
      type: { type: String, enum: ["percent", "fixed"], default: "fixed" }, // ลด % หรือลดเป็นบาท
      value: { type: Number, default: 0, min: 0 }, // เช่น 10 (%) หรือ 1500 (บาท)
      startsAt: Date, // เริ่มลดเมื่อไหร่ (ว่าง = ลดทันที)
      expiresAt: Date, // หมดเขตเมื่อไหร่ (ว่าง = ลดจนกว่าจะปิด)
    },
    
    images: [String],
    attributes: { type: Map, of: String }, // สี, ขนาด, แรงดัน ฯลฯ
    status: { type: String, enum: ["draft", "active", "archived"], default: "draft", index: true },
    ratingAvg: { type: Number, default: 0 }, // คำนวณจาก Review (denormalized)
    ratingCount: { type: Number, default: 0 },
  },
  opts
);
ProductSchema.index({ name: "text", sku: "text" });

export const Product = registerModel("Product", ProductSchema);