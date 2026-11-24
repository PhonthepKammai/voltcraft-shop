import { withAuth } from "@/lib/with-auth";
import { ok } from "@/lib/response";
import * as paymentService from "@/services/payment.service";

type P = { id: string };

export const GET = withAuth<P>({ permission: "payment:read" }, async (_req, { session, params }) =>
  ok(await paymentService.getById(session, params.id))
);
