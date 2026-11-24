import { z } from "zod";
import { objectId, paginationQuery } from "./common";

export const listProductsQuery = paginationQuery.extend({
  q: z.string().trim().max(100).optional(),
  categoryId: objectId.optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  status: z.enum(["draft", "active", "archived"]).optional(), // เฉพาะ admin
  sort: z.enum(["newest", "price_asc", "price_desc", "rating"]).default("newest"),
});

const productBase = z.object({
  sku: z.string().trim().min(1).max(50),
  name: z.string().trim().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(10000).optional(),
  categoryId: objectId,
  price: z.number().min(0),
  images: z.array(z.string().url()).max(10).default([]),
  attributes: z.record(z.string(), z.string()).optional(),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
  // ใช้ตอนสร้างเท่านั้น
  initialStock: z.number().int().min(0).default(0),
  reorderPoint: z.number().int().min(0).default(0),
});

export const createProductSchema = productBase;

export const updateProductSchema = productBase
  .omit({ initialStock: true, reorderPoint: true })
  .partial()
  .refine((o) => Object.keys(o).length > 0, "ไม่มีข้อมูลให้แก้ไข");

export type ListProductsQuery = z.infer<typeof listProductsQuery>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
