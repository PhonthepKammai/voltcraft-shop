import { z } from "zod";
import { objectId, paginationQuery } from "./common";

export const listCouponsQuery = paginationQuery.extend({
  q: z.string().trim().max(50).optional(),
  active: z.enum(["true", "false"]).optional(),
});

const couponBase = z.object({
  code: z.string().trim().toUpperCase().min(3).max(30).regex(/^[A-Z0-9_-]+$/),
  description: z.string().max(300).optional(),
  type: z.enum(["percent", "fixed", "free_shipping"]),
  value: z.number().min(0).default(0),
  maxDiscount: z.number().min(0).optional(),
  minOrderAmount: z.number().min(0).default(0),
  applicableProductIds: z.array(objectId).default([]),
  applicableCategoryIds: z.array(objectId).default([]),
  usageLimit: z.number().int().min(1).optional(),
  perUserLimit: z.number().int().min(1).default(1),
  startsAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
  isActive: z.boolean().default(true),
});

export const createCouponSchema = couponBase.superRefine((c, ctx) => {
  if (c.type === "percent" && (c.value <= 0 || c.value > 100)) {
    ctx.addIssue({ code: "custom", path: ["value"], message: "เปอร์เซ็นต์ต้องอยู่ระหว่าง 1-100" });
  }
  if (c.type === "fixed" && c.value <= 0) {
    ctx.addIssue({ code: "custom", path: ["value"], message: "ส่วนลดต้องมากกว่า 0" });
  }
  if (c.expiresAt <= c.startsAt) {
    ctx.addIssue({ code: "custom", path: ["expiresAt"], message: "วันหมดอายุต้องหลังวันเริ่ม" });
  }
});

export const updateCouponSchema = couponBase
  .omit({ code: true })
  .partial()
  .refine((o) => Object.keys(o).length > 0, "ไม่มีข้อมูลให้แก้ไข");

/** ไม่ส่ง items = ตรวจกับตะกร้าของผู้ใช้ */
export const validateCouponSchema = z.object({
  code: z.string().trim().toUpperCase().min(1).max(30),
  items: z
    .array(z.object({ productId: objectId, quantity: z.number().int().min(1).max(999) }))
    .min(1)
    .optional(),
});

export type ListCouponsQuery = z.infer<typeof listCouponsQuery>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
