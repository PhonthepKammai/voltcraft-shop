import { z } from "zod";
import { objectId, paginationQuery, boolQuery } from "./common";

export const listInventoryQuery = paginationQuery.extend({
  q: z.string().trim().max(100).optional(),
  lowStock: boolQuery.optional(),
});

/** ปรับสต็อกเป็นค่าใหม่ (ตรวจนับ) ต้องมีเหตุผลเสมอ */
export const adjustStockSchema = z.object({
  onHand: z.number().int().min(0),
  note: z.string().trim().min(3, "ระบุเหตุผลอย่างน้อย 3 ตัวอักษร").max(500),
});

export const receiveStockSchema = z.object({
  items: z
    .array(z.object({ productId: objectId, quantity: z.number().int().min(1).max(1_000_000) }))
    .min(1)
    .max(100),
  note: z.string().trim().max(500).optional(),
});

export const listMovementsQuery = paginationQuery.extend({
  productId: objectId.optional(),
  type: z.enum(["receive", "reserve", "release", "ship", "adjust", "return"]).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type ListInventoryQuery = z.infer<typeof listInventoryQuery>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
export type ReceiveStockInput = z.infer<typeof receiveStockSchema>;
export type ListMovementsQuery = z.infer<typeof listMovementsQuery>;
