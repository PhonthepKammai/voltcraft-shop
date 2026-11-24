import { withAuth } from "@/lib/with-auth";
import { ok } from "@/lib/response";
import * as auditService from "@/services/audit.service";
import { listAuditLogsQuery } from "@/validators/audit.schema";

// GET /api/audit-logs  (admin)
export const GET = withAuth({ permission: "audit:read" }, async (req) => {
  const query = listAuditLogsQuery.parse(Object.fromEntries(req.nextUrl.searchParams));
  return ok(await auditService.list(query));
});
