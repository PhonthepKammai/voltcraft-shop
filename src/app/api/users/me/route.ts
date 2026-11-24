import { withAuth } from "@/lib/with-auth";
import { ok } from "@/lib/response";
import * as userService from "@/services/user.service";
import { updateProfileSchema } from "@/validators/user.schema";

// GET /api/users/me  โปรไฟล์ตัวเอง
export const GET = withAuth({}, async (_req, { session }) =>
  ok(await userService.getProfile(session))
);

// PATCH /api/users/me  แก้โปรไฟล์ตัวเอง (แก้ roles ไม่ได้)
export const PATCH = withAuth({}, async (req, { session }) => {
  const input = updateProfileSchema.parse(await req.json());
  return ok(await userService.updateProfile(session, input));
});
