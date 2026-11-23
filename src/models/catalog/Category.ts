import { Schema } from "mongoose";
import { opts, ref, registerModel } from "../_shared/helpers";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parentId: ref("Category"), // หมวดซ้อนหมวด
    isActive: { type: Boolean, default: true },
  },
  opts
);

export const Category = registerModel("Category", CategorySchema);