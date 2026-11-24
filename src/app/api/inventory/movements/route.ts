import { withAuth } from "@/lib/with-auth";
import { ok } from "@/lib/response";
import * as inventoryService from "@/services/inventory.service";
import { listMovementsQuery } from "@/validators/inventory.schema";

// GET /api/inventory/movements  ประวัติการเคลื่อนไหวสต็อก (กรองตามสินค้า/ประเภท/ช่วงวันที่)
export const GET = withAuth({ permission: "inventory:read" }, async (req) => {
  const query = listMovementsQuery.parse(Object.fromEntries(req.nextUrl.searchParams));
  return ok(await inventoryService.listMovements(query));
});
