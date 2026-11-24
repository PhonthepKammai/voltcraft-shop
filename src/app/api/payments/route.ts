import { withAuth } from "@/lib/with-auth";
import { ok, created } from "@/lib/response";
import * as paymentService from "@/services/payment.service";
import { listPaymentsQuery, createPaymentSchema } from "@/validators/payment.schema";

// GET /api/payments
export const GET = withAuth({ permission: "payment:read" }, async (req, { session }) => {
  const query = listPaymentsQuery.parse(Object.fromEntries(req.nextUrl.searchParams));
  return ok(await paymentService.list(session, query));
});

// POST /api/payments  แจ้งชำระเงิน / แนบสลิป (customer)
export const POST = withAuth({ permission: "payment:create" }, async (req, { session }) => {
  const input = createPaymentSchema.parse(await req.json());
  return created(await paymentService.create(session, input));
});
