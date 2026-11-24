import { withAuth } from "@/lib/with-auth";
import { ok, noContent } from "@/lib/response";
import * as cartService from "@/services/cart.service";

// GET /api/cart  ตะกร้าของตัวเอง (พร้อมราคาปัจจุบันและยอดรวม)
export const GET = withAuth({ permission: "cart:manage" }, async (_req, { session }) =>
  ok(await cartService.get(session))
);

// DELETE /api/cart  ล้างตะกร้า
export const DELETE = withAuth({ permission: "cart:manage" }, async (_req, { session }) => {
  await cartService.clear(session);
  return noContent();
});
