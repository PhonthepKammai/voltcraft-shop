import { withAuth } from "@/lib/with-auth";
import { ok } from "@/lib/response";
import * as shipmentService from "@/services/shipment.service";
import { updateShipmentSchema } from "@/validators/shipment.schema";

type P = { orderId: string };

// GET /api/shipments/:orderId
export const GET = withAuth<P>({ permission: "shipment:read" }, async (_req, { session, params }) =>
  ok(await shipmentService.getByOrder(session, params.orderId))
);

// PATCH /api/shipments/:orderId  ใส่ขนส่ง/เลขพัสดุ/สถานะ (warehouse)
export const PATCH = withAuth<P>({ permission: "shipment:update" }, async (req, { session, params }) => {
  const input = updateShipmentSchema.parse(await req.json());
  return ok(await shipmentService.update(session, params.orderId, input));
});
