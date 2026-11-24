import { withAuth } from "@/lib/with-auth";
import { ok, noContent } from "@/lib/response";
import * as reviewService from "@/services/review.service";
import { moderateReviewSchema } from "@/validators/review.schema";

type P = { id: string };

// PATCH /api/reviews/:id  ซ่อน/แสดงรีวิว (admin)
export const PATCH = withAuth<P>({ permission: "review:moderate" }, async (req, { session, params }) => {
  const input = moderateReviewSchema.parse(await req.json());
  return ok(await reviewService.moderate(session, params.id, input));
});

// DELETE /api/reviews/:id  (admin หรือเจ้าของรีวิว — service เช็คความเป็นเจ้าของ)
export const DELETE = withAuth<P>({ permission: "review:delete" }, async (_req, { session, params }) => {
  await reviewService.remove(session, params.id);
  return noContent();
});
