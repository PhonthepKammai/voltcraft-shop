import { withAuth } from "@/lib/with-auth";
import { ok } from "@/lib/response";
import { clearSessionCookie } from "@/lib/session";

// POST /api/auth/logout
export const POST = withAuth({ public: true }, async () => {
  const res = ok({ loggedOut: true });
  clearSessionCookie(res);
  return res;
});
