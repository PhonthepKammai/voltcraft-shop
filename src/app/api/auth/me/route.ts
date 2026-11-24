import { withAuth } from "@/lib/with-auth";
import { ok } from "@/lib/response";
import * as authService from "@/services/auth.service";

// GET /api/auth/me  ข้อมูลผู้ใช้จาก session ปัจจุบัน
export const GET = withAuth({}, async (_req, { session }) =>
  ok(await authService.me(session))
);
