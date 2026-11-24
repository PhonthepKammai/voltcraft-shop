import { withAuth } from "@/lib/with-auth";
import { ok, noContent } from "@/lib/response";
import * as couponService from "@/services/coupon.service";
import { updateCouponSchema } from "@/validators/coupon.schema";

type P = { id: string };

export const GET = withAuth<P>({ permission: "coupon:read" }, async (_req, { params }) =>
  ok(await couponService.getById(params.id))
);

export const PATCH = withAuth<P>({ permission: "coupon:manage" }, async (req, { session, params }) => {
  const input = updateCouponSchema.parse(await req.json());
  return ok(await couponService.update(session, params.id, input));
});

export const DELETE = withAuth<P>({ permission: "coupon:manage" }, async (_req, { session, params }) => {
  await couponService.remove(session, params.id);
  return noContent();
});
