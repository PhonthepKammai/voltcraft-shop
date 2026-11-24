import { withAuth } from "@/lib/with-auth";
import { ok, created } from "@/lib/response";
import * as productService from "@/services/product.service";
import { listProductsQuery, createProductSchema } from "@/validators/product.schema";

// GET /api/products  สาธารณะ (ค้นหา/กรอง/แบ่งหน้า) — admin เห็นสถานะ draft ด้วย
export const GET = withAuth({ public: true }, async (req, { session }) => {
  const query = listProductsQuery.parse(Object.fromEntries(req.nextUrl.searchParams));
  return ok(await productService.list(session, query));
});

// POST /api/products  (admin)
export const POST = withAuth({ permission: "product:create" }, async (req, { session }) => {
  const input = createProductSchema.parse(await req.json());
  return created(await productService.create(session, input));
});
