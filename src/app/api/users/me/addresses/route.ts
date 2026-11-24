import { withAuth } from "@/lib/with-auth";
import { ok, created } from "@/lib/response";
import * as userService from "@/services/user.service";
import { addressSchema } from "@/validators/user.schema";

// GET /api/users/me/addresses
export const GET = withAuth({}, async (_req, { session }) =>
  ok(await userService.listAddresses(session))
);

// POST /api/users/me/addresses
export const POST = withAuth({}, async (req, { session }) => {
  const input = addressSchema.parse(await req.json());
  return created(await userService.addAddress(session, input));
});
