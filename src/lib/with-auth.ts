import type { NextRequest } from "next/server";
import { connectDB } from "./db";
import { fail } from "./response";
import { forbidden, unauthorized } from "./errors";
import { readToken, verifyToken, type Session } from "./session";
import { can, type Permission } from "./rbac";
import { User } from "@/models";

type DefaultParams = Record<string, string>;
type RouteHandler<P> = (
  req: NextRequest,
  ctx: { params: Promise<P> }
) => Promise<Response>;

type Handler<P, S> = (
  req: NextRequest,
  ctx: { session: S; params: P }
) => Promise<Response> | Response;

async function resolveSession(req: NextRequest): Promise<Session | null> {
  const token = readToken(req);
  if (!token) return null;
  const userId = await verifyToken(token);
  if (!userId) return null;

  const user = await User.findById(userId).select("roles status").lean();
  if (!user || user.status !== "active") return null;
  return { userId, roles: user.roles as Session["roles"] };
}

/** route สาธารณะ: session เป็น null ได้ */
export function withAuth<P = DefaultParams>(
  options: { public: true },
  handler: Handler<P, Session | null>
): RouteHandler<P>;
/** route ที่ต้อง login (+ เช็ค permission ถ้าระบุ) */
export function withAuth<P = DefaultParams>(
  options: { public?: false; permission?: Permission },
  handler: Handler<P, Session>
): RouteHandler<P>;
export function withAuth(
  options: { public?: boolean; permission?: Permission },
  handler: Handler<any, any>
) {
  return async (req: NextRequest, ctx: { params?: Promise<unknown> }) => {
    try {
      await connectDB();
      const session = await resolveSession(req);

      if (!options.public) {
        if (!session) throw unauthorized();
        if (options.permission && !can(session.roles, options.permission)) {
          throw forbidden();
        }
      }

      const params = ctx?.params ? await ctx.params : {};
      return await handler(req, { session, params });
    } catch (err) {
      return fail(err);
    }
  };
}
