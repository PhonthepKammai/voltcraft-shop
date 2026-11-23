import { Schema } from "mongoose";
import { opts, ref, registerModel } from "../_shared/helpers";

const InventorySchema = new Schema(
  {
    productId: { ...ref("Product"), required: true, unique: true },
    onHand: { type: Number, default: 0, min: 0 }, // ของจริงในคลัง
    reserved: { type: Number, default: 0, min: 0 }, // ถูกจองโดยออเดอร์ที่ยังไม่ส่ง
    reorderPoint: { type: Number, default: 0 }, // ต่ำกว่านี้ให้แจ้งเตือน
    location: String, // ชั้นวาง/โซนในคลัง
  },
  opts
);
// available = onHand - reserved (คำนวณตอนอ่าน ไม่เก็บ)

export const Inventory = registerModel("Inventory", InventorySchema);