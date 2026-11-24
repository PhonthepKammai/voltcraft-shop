import { z } from "zod";

export const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/, "รูปแบบ ID ไม่ถูกต้อง");

export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const boolQuery = z.enum(["true", "false"]).transform((v) => v === "true");
