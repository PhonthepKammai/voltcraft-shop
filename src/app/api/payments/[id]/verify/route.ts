import { withAuth } from "@/lib/with-auth";
import { ok } from "@/lib/response";
import * as paymentService from "@/services/payment.service";
import { verifyPaymentSchema } from "@/validators/payment.schema";

type P = { id: string };

// POST /api/payments/:id/verify  ตรวจสลิป อนุมัติ/ปฏิเสธ (admin / sales)
export const POST = withAuth<P>({ permission: "payment:verify" }, async (req, { session, params }) => {
  const input = verifyPaymentSchema.parse(await req.json());
  return ok(await paymentService.verify(session, params.id, input));
});
