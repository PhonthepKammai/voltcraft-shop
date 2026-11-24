import { z } from "zod";
import { objectId, paginationQuery } from "./common";

export const listAuditLogsQuery = paginationQuery.extend({
  actorId: objectId.optional(),
  entity: z.string().max(50).optional(),
  action: z.string().max(100).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type ListAuditLogsQuery = z.infer<typeof listAuditLogsQuery>;
