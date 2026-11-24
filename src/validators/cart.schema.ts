import { z } from "zod";
import { objectId } from "./common";

export const addCartItemSchema = z.object({
  productId: objectId,
  quantity: z.number().int().min(1).max(999).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(999),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
