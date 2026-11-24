import { withAuth } from "@/lib/with-auth";
import { ok, created } from "@/lib/response";
import * as userService from "@/services/user.service";
import { listUsersQuery, createUserSchema } from "@/validators/user.schema";

// GET /api/users  รายการผู้ใช้ (admin)
export const GET = withAuth({ permission: "user:list" }, async (req) => {
  const query = listUsersQuery.parse(Object.fromEntries(req.nextUrl.searchParams));
  return ok(await userService.list(query));
});

// POST /api/users  สร้างผู้ใช้พร้อมกำหนด roles (admin)
export const POST = withAuth({ permission: "user:create" }, async (req, { session }) => {
  const input = createUserSchema.parse(await req.json());
  return created(await userService.create(session, input));
});
