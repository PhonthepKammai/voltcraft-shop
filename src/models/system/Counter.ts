import { Schema } from "mongoose";
import { registerModel } from "../_shared/helpers";

const CounterSchema = new Schema({
  key: { type: String, required: true, unique: true }, // เช่น "order-2611"
  seq: { type: Number, default: 0 },
});

export const Counter = registerModel("Counter", CounterSchema);