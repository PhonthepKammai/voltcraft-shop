import { z } from "zod";
import { objectId, paginationQuery } from "./common";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug ใช้ a-z 0-9 และ - เท่านั้น");

export const listCategoriesQuery = paginationQuery.extend({
  parentId: objectId.optional(),
  isActive: z.enum(["true", "false", "all"]).default("true"),
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug,
  parentId: objectId.nullable().optional(),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema
  .partial()
  .refine((o) => Object.keys(o).length > 0, "ไม่มีข้อมูลให้แก้ไข");

export type ListCategoriesQuery = z.infer<typeof listCategoriesQuery>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
