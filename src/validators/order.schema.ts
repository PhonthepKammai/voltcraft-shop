import { z } from "zod";
import { objectId, paginationQuery } from "./common";
import { addressSchema } from "./user.schema";

const shippingAddress = addressSchema.omit({ label: true, isDefault: true });

export const listOrdersQuery = paginationQuery.extend({
  status: z.enum(["pending", "confirmed", "packing", "shipped", "delivered", "cancelled", "returned"]).optional(),
  paymentStatus: z.enum(["unpaid", "paid", "refunded"]).optional(),
  customerId: objectId.optional(),
  q: z.string().trim().max(50).optional(), // เลขออเดอร์
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const createOrderSchema = z
  .object({
    customerId: objectId.optional(), // sales/admin สร้างแทนลูกค้า
    items: z
      .array(z.object({ productId: objectId, quantity: z.number().int().min(1).max(999) }))
      .min(1)
      .max(100)
      .optional(), // ไม่ส่ง = ใช้ตะกร้า
    addressId: objectId.optional(),
    shippingAddress: shippingAddress.optional(),
    couponCode: z.string().trim().toUpperCase().max(30).optional(),
    note: z.string().trim().max(500).optional(),
  })
  .refine((o) => !!o.addressId !== !!o.shippingAddress, {
    message: "ระบุที่อยู่จัดส่งอย่างใดอย่างหนึ่ง: addressId หรือ shippingAddress",
    path: ["addressId"],
  });

export const updateOrderStatusSchema = z.object({
  status: z.enum(["confirmed", "packing", "shipped", "delivered", "returned"]),
  note: z.string().trim().max(500).optional(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().trim().max(500).optional(),
});

export type ListOrdersQuery = z.infer<typeof listOrdersQuery>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
