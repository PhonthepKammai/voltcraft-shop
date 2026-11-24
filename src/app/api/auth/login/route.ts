import { withAuth } from "@/lib/with-auth";
import { ok } from "@/lib/response";
import { setSessionCookie } from "@/lib/session";
import * as authService from "@/services/auth.service";
import { loginSchema } from "@/validators/auth.schema";

// POST /api/auth/login  เข้าสู่ระบบ ตั้ง JWT เป็น httpOnly cookie
export const POST = withAuth({ public: true }, async (req) => {
  const input = loginSchema.parse(await req.json());
  const { user, token } = await authService.login(input);
  const res = ok(user);
  setSessionCookie(res, token);
  return res;
});
