import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  // bcrypt ใช้ได้สูงสุด 72 ไบต์
  password: z.string().min(8, "รหัสผ่านอย่างน้อย 8 ตัวอักษร").max(72),
  phone: z.string().regex(/^[0-9+\-\s]{8,20}$/).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
