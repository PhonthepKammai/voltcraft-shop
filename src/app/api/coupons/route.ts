import { withAuth } from "@/lib/with-auth";
import { ok, created } from "@/lib/response";
import * as couponService from "@/services/coupon.service";
import { listCouponsQuery, createCouponSchema } from "@/validators/coupon.schema";

// GET /api/coupons  (admin / sales)
export const GET = withAuth({ permission: "coupon:read" }, async (req) => {
  const query = listCouponsQuery.parse(Object.fromEntries(req.nextUrl.searchParams));
  return ok(await couponService.list(query));
});

// POST /api/coupons  (admin)
export const POST = withAuth({ permission: "coupon:manage" }, async (req, { session }) => {
  const input = createCouponSchema.parse(await req.json());
  return created(await couponService.create(session, input));
});
