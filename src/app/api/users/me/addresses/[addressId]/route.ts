import { withAuth } from "@/lib/with-auth";
import { ok, noContent } from "@/lib/response";
import * as userService from "@/services/user.service";
import { addressSchema } from "@/validators/user.schema";

type P = { addressId: string };

// PATCH /api/users/me/addresses/:addressId
export const PATCH = withAuth<P>({}, async (req, { session, params }) => {
  const input = addressSchema.partial().parse(await req.json());
  return ok(await userService.updateAddress(session, params.addressId, input));
});

// DELETE /api/users/me/addresses/:addressId
export const DELETE = withAuth<P>({}, async (_req, { session, params }) => {
  await userService.removeAddress(session, params.addressId);
  return noContent();
});
