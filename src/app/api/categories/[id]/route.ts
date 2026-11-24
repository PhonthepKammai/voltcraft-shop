import { withAuth } from "@/lib/with-auth";
import { ok, noContent } from "@/lib/response";
import * as categoryService from "@/services/category.service";
import { updateCategorySchema } from "@/validators/category.schema";

type P = { id: string };

export const GET = withAuth<P>({ public: true }, async (_req, { params }) =>
  ok(await categoryService.getById(params.id))
);

export const PATCH = withAuth<P>({ permission: "category:update" }, async (req, { session, params }) => {
  const input = updateCategorySchema.parse(await req.json());
  return ok(await categoryService.update(session, params.id, input));
});

export const DELETE = withAuth<P>({ permission: "category:delete" }, async (_req, { session, params }) => {
  await categoryService.remove(session, params.id);
  return noContent();
});
