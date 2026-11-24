import { withAuth } from "@/lib/with-auth";
import { ok, noContent } from "@/lib/response";
import * as productService from "@/services/product.service";
import { updateProductSchema } from "@/validators/product.schema";

type P = { id: string };

export const GET = withAuth<P>({ public: true }, async (_req, { session, params }) =>
  ok(await productService.getById(session, params.id))
);

export const PATCH = withAuth<P>({ permission: "product:update" }, async (req, { session, params }) => {
  const input = updateProductSchema.parse(await req.json());
  return ok(await productService.update(session, params.id, input));
});

export const DELETE = withAuth<P>({ permission: "product:delete" }, async (_req, { session, params }) => {
  await productService.remove(session, params.id);
  return noContent();
});
