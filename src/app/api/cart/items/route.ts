import { withAuth } from "@/lib/with-auth";
import { created } from "@/lib/response";
import * as cartService from "@/services/cart.service";
import { addCartItemSchema } from "@/validators/cart.schema";

// POST /api/cart/items  เพิ่มสินค้าลงตะกร้า
export const POST = withAuth({ permission: "cart:manage" }, async (req, { session }) => {
  const input = addCartItemSchema.parse(await req.json());
  return created(await cartService.addItem(session, input));
});
