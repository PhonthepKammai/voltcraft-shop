import { withAuth } from "@/lib/with-auth";
import { created } from "@/lib/response";
import * as inventoryService from "@/services/inventory.service";
import { receiveStockSchema } from "@/validators/inventory.schema";

// POST /api/inventory/receive  รับสินค้าเข้าคลัง (หลายรายการต่อครั้งได้)
export const POST = withAuth({ permission: "inventory:receive" }, async (req, { session }) => {
  const input = receiveStockSchema.parse(await req.json());
  return created(await inventoryService.receive(session, input));
});
