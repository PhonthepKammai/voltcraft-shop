import { withAuth } from "@/lib/with-auth";
import { ok } from "@/lib/response";
import * as reviewService from "@/services/review.service";
import { replyReviewSchema } from "@/validators/review.schema";

type P = { id: string };

// POST /api/reviews/:id/reply  ร้านตอบกลับรีวิว (admin / sales)
export const POST = withAuth<P>({ permission: "review:reply" }, async (req, { session, params }) => {
  const input = replyReviewSchema.parse(await req.json());
  return ok(await reviewService.reply(session, params.id, input));
});
