import { withAuth } from "@/lib/with-auth";
import { ok } from "@/lib/response";
import * as cartService from "@/services/cart.service";
import { updateCartItemSchema } from "@/validators/cart.schema";

type P = { productId: string };

// PATCH /api/cart/items/:productId  เปลี่ยนจำนวน
export const PATCH = withAuth<P>({ permission: "cart:manage" }, async (req, { session, params }) => {
  const input = updateCartItemSchema.parse(await req.json());
  return ok(await cartService.updateItem(session, params.productId, input));
});

// DELETE /api/cart/items/:productId  เอาออกจากตะกร้า
export const DELETE = withAuth<P>({ permission: "cart:manage" }, async (_req, { session, params }) =>
  ok(await cartService.removeItem(session, params.productId))
);
