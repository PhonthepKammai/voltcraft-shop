import { withAuth } from "@/lib/with-auth";
import { ok } from "@/lib/response";
import * as inventoryService from "@/services/inventory.service";
import { listInventoryQuery } from "@/validators/inventory.schema";

// GET /api/inventory  รายการสต็อก (กรอง low stock ได้)
export const GET = withAuth({ permission: "inventory:read" }, async (req) => {
  const query = listInventoryQuery.parse(Object.fromEntries(req.nextUrl.searchParams));
  return ok(await inventoryService.list(query));
});
