import { Schema } from "mongoose";
import { opts, ref, registerModel } from "../_shared/helpers";

const CartSchema = new Schema(
  {
    customerId: { ...ref("User"), required: true, unique: true },
    items: [
      {
        productId: { ...ref("Product"), required: true },
        quantity: { type: Number, required: true, min: 1 },
        _id: false,
      },
    ],
  },
  opts
);

export const Cart = registerModel("Cart", CartSchema);