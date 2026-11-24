import { withAuth } from "@/lib/with-auth";
import { ok, created } from "@/lib/response";
import * as reviewService from "@/services/review.service";
import { listReviewsQuery, createReviewSchema } from "@/validators/review.schema";

type P = { id: string };

// GET /api/products/:id/reviews  รีวิวที่ published ของสินค้า (สาธารณะ)
export const GET = withAuth<P>({ public: true }, async (req, { params }) => {
  const query = listReviewsQuery.parse(Object.fromEntries(req.nextUrl.searchParams));
  return ok(await reviewService.listByProduct(params.id, query));
});

// POST /api/products/:id/reviews  เขียนรีวิว (ต้องซื้อจริงและออเดอร์ delivered)
export const POST = withAuth<P>({ permission: "review:create" }, async (req, { session, params }) => {
  const input = createReviewSchema.parse(await req.json());
  return created(await reviewService.create(session, params.id, input));
});
