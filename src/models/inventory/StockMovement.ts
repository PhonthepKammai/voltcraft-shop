import { Schema } from "mongoose";
import { ref, registerModel } from "../_shared/helpers";

const StockMovementSchema = new Schema(
  {
    productId: { ...ref("Product"), required: true, index: true },
    type: {
      type: String,
      enum: ["receive", "reserve", "release", "ship", "adjust", "return"],
      required: true,
    },
    quantity: { type: Number, required: true }, // บวก/ลบ ตามทิศทาง
    balanceAfter: Number, // onHand หลังเคลื่อนไหว
    refType: { type: String, enum: ["order", "manual", "supplier"] },
    refId: Schema.Types.ObjectId,
    note: String,
    createdBy: { ...ref("User"), required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const StockMovement = registerModel("StockMovement", StockMovementSchema);
