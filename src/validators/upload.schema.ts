import { z } from "zod";

export const createUploadSchema = z.object({
  purpose: z.enum(["product", "review", "slip"]),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  size: z.number().int().min(1).max(5 * 1024 * 1024, "ไฟล์ต้องไม่เกิน 5 MB"),
});

export type CreateUploadInput = z.infer<typeof createUploadSchema>;
