import { withAuth } from "@/lib/with-auth";
import { ok } from "@/lib/response";
import * as orderService from "@/services/order.service";
import { cancelOrderSchema } from "@/validators/order.schema";

type P = { id: string };

// POST /api/orders/:id/cancel  ยกเลิก (คืนสต็อกที่จอง + คืนสิทธิ์คูปอง)
export const POST = withAuth<P>({ permission: "order:cancel" }, async (req, { session, params }) => {
  const input = cancelOrderSchema.parse(await req.json().catch(() => ({})));
  return ok(await orderService.cancel(session, params.id, input));
});
