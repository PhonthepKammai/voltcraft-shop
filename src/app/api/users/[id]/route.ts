import { withAuth } from "@/lib/with-auth";
import { ok, noContent } from "@/lib/response";
import * as userService from "@/services/user.service";
import { updateUserSchema } from "@/validators/user.schema";

type P = { id: string };

// GET /api/users/:id
export const GET = withAuth<P>({ permission: "user:read" }, async (_req, { session, params }) =>
  ok(await userService.getById(session, params.id))
);

// PATCH /api/users/:id  แก้ข้อมูล / roles / status (admin)
export const PATCH = withAuth<P>({ permission: "user:update" }, async (req, { session, params }) => {
  const input = updateUserSchema.parse(await req.json());
  return ok(await userService.update(session, params.id, input));
});

// DELETE /api/users/:id
export const DELETE = withAuth<P>({ permission: "user:delete" }, async (_req, { session, params }) => {
  await userService.remove(session, params.id);
  return noContent();
});
