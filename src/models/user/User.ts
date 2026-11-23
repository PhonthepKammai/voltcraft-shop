import { Schema } from "mongoose";
import { opts, ref, registerModel } from "../_shared/helpers";
import { ROLES } from "../_shared/constants";
import { AddressSchema } from "../_shared/address.schema";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    phone: String,
    // 1 user มีได้หลาย role เช่น ["sales", "customer"]
    roles: {
      type: [{ type: String, enum: ROLES }],
      default: ["customer"],
      validate: [(v: string[]) => v.length > 0, "ต้องมีอย่างน้อย 1 role"],
      index: true, // multikey index: query { roles: "sales" } ได้
    },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
    addresses: [AddressSchema], // ใช้กับ customer
    assignedSalesId: ref("User"), // customer ถูกดูแลโดย sales คนไหน
    lastLoginAt: Date,
  },
  opts
);

export const User = registerModel("User", UserSchema);
