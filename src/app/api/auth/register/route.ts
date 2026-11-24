import { withAuth } from "@/lib/with-auth";
import { created } from "@/lib/response";
import * as authService from "@/services/auth.service";
import { registerSchema } from "@/validators/auth.schema";

// POST /api/auth/register  สมัครสมาชิก (role เริ่มต้น = customer)
export const POST = withAuth({ public: true }, async (req) => {
  const input = registerSchema.parse(await req.json());
  return created(await authService.register(input));
});
