import { withAuth } from "@/lib/with-auth";
import { ok } from "@/lib/response";
import * as orderService from "@/services/order.service";
import { updateOrderStatusSchema } from "@/validators/order.schema";

type P = { id: string };

// PATCH /api/orders/:id/status  confirmed → packing → shipped → delivered
// service ตรวจลำดับสถานะที่อนุญาต และเรียก inventory.reserve/ship ตามขั้น
export const PATCH = withAuth<P>({ permission: "order:update_status" }, async (req, { session, params }) => {
  const input = updateOrderStatusSchema.parse(await req.json());
  return ok(await orderService.updateStatus(session, params.id, input));
});
