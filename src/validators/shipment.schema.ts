import { z } from "zod";

export const updateShipmentSchema = z
  .object({
    carrier: z.string().trim().min(1).max(50),
    trackingNo: z.string().trim().min(1).max(100),
  })
  .partial()
  .refine((o) => Object.keys(o).length > 0, "ไม่มีข้อมูลให้แก้ไข");

export type UpdateShipmentInput = z.infer<typeof updateShipmentSchema>;
