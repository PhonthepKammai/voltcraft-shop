import { z } from "zod";
import { ROLES } from "@/models";
import { objectId, paginationQuery } from "./common";

const roles = z
  .array(z.enum(ROLES))
  .min(1, "ต้องมีอย่างน้อย 1 role")
  .transform((r) => [...new Set(r)]);

export const addressSchema = z.object({
  label: z.string().max(50).optional(),
  recipient: z.string().min(1).max(100),
  phone: z.string().regex(/^[0-9+\-\s]{8,20}$/, "เบอร์โทรไม่ถูกต้อง"),
  line1: z.string().min(1).max(200),
  subdistrict: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  province: z.string().min(1).max(100),
  postalCode: z.string().regex(/^\d{5}$/, "รหัสไปรษณีย์ต้องมี 5 หลัก"),
  isDefault: z.boolean().optional(),
});

export const listUsersQuery = paginationQuery.extend({
  role: z.enum(ROLES).optional(),
  status: z.enum(["active", "suspended"]).optional(),
  q: z.string().trim().max(100).optional(),
});

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(72),
  phone: z.string().regex(/^[0-9+\-\s]{8,20}$/).optional(),
  roles: roles.default(["customer"]),
  assignedSalesId: objectId.optional(),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    phone: z.string().regex(/^[0-9+\-\s]{8,20}$/),
    roles,
    status: z.enum(["active", "suspended"]),
    assignedSalesId: objectId.nullable(),
  })
  .partial()
  .refine((o) => Object.keys(o).length > 0, "ไม่มีข้อมูลให้แก้ไข");

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    phone: z.string().regex(/^[0-9+\-\s]{8,20}$/),
  })
  .partial()
  .refine((o) => Object.keys(o).length > 0, "ไม่มีข้อมูลให้แก้ไข");

export type AddressInput = z.infer<typeof addressSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuery>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
