import { withAuth } from "@/lib/with-auth";
import { ok } from "@/lib/response";
import * as inventoryService from "@/services/inventory.service";
import { adjustStockSchema } from "@/validators/inventory.schema";

type P = { productId: string };

// GET /api/inventory/:productId
export const GET = withAuth<P>({ permission: "inventory:read" }, async (_req, { params }) =>
  ok(await inventoryService.getByProduct(params.productId))
);

// PATCH /api/inventory/:productId  ปรับสต็อก (ตรวจนับ/ของเสีย) บันทึก StockMovement
export const PATCH = withAuth<P>({ permission: "inventory:adjust" }, async (req, { session, params }) => {
  const input = adjustStockSchema.parse(await req.json());
  return ok(await inventoryService.adjust(session, params.productId, input));
});
