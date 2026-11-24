import { withAuth } from "@/lib/with-auth";
import { ok, created } from "@/lib/response";
import * as categoryService from "@/services/category.service";
import { listCategoriesQuery, createCategorySchema } from "@/validators/category.schema";

// GET /api/categories  สาธารณะ
export const GET = withAuth({ public: true }, async (req) => {
  const query = listCategoriesQuery.parse(Object.fromEntries(req.nextUrl.searchParams));
  return ok(await categoryService.list(query));
});

// POST /api/categories  (admin)
export const POST = withAuth({ permission: "category:create" }, async (req, { session }) => {
  const input = createCategorySchema.parse(await req.json());
  return created(await categoryService.create(session, input));
});
