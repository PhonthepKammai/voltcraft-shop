import { withAuth } from "@/lib/with-auth";
import { ok } from "@/lib/response";
import * as orderService from "@/services/order.service";

type P = { id: string };

// GET /api/orders/:id  (service เช็คความเป็นเจ้าของ/สิทธิ์ตาม role)
export const GET = withAuth<P>({ permission: "order:read" }, async (_req, { session, params }) =>
  ok(await orderService.getById(session, params.id))
);
