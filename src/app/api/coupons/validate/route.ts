import { withAuth } from "@/lib/with-auth";
import { ok } from "@/lib/response";
import * as couponService from "@/services/coupon.service";
import { validateCouponSchema } from "@/validators/coupon.schema";

// POST /api/coupons/validate  ตรวจคูปองกับตะกร้า/ยอดสั่งซื้อ คืนส่วนลดที่จะได้ (ยังไม่ตัดสิทธิ์)
export const POST = withAuth({ permission: "coupon:validate" }, async (req, { session }) => {
  const input = validateCouponSchema.parse(await req.json());
  return ok(await couponService.validate(session, input));
});
