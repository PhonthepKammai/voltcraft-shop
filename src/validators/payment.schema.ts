import { z } from "zod";
import { objectId, paginationQuery } from "./common";

export const listPaymentsQuery = paginationQuery.extend({
  status: z.enum(["pending", "verified", "rejected", "refunded"]).optional(),
  orderId: objectId.optional(),
});

export const createPaymentSchema = z
  .object({
    orderId: objectId,
    method: z.enum(["promptpay", "transfer", "card", "cod"]),
    amount: z.number().positive(),
    slipUrl: z.string().url().optional(),
  })
  .refine((p) => p.method === "cod" || !!p.slipUrl, {
    message: "ต้องแนบสลิปการชำระเงิน",
    path: ["slipUrl"],
  });

export const verifyPaymentSchema = z.object({
  approved: z.boolean(),
});

export type ListPaymentsQuery = z.infer<typeof listPaymentsQuery>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
