import type { Dispatch, SetStateAction } from "react";
import { THEME } from "../theme";
import type { AuditEventType, AuditLogEntry } from "../types";
import AuditMobileCard from "./AuditMobileCard";
import AuditTableRow from "./AuditTableRow";

interface AuditTabProps {
  auditLogs: AuditLogEntry[];
  auditEventFilter: "ALL" | AuditEventType;
  setAuditEventFilter: Dispatch<SetStateAction<"ALL" | AuditEventType>>;
  filteredAuditLogs: AuditLogEntry[];
}

export default function AuditTab({
  auditLogs,
  auditEventFilter,
  setAuditEventFilter,
  filteredAuditLogs,
}: AuditTabProps) {
  return (
    <section className={`${THEME.colors.surface} overflow-hidden`}>
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              System Security & Operational Audit Trail
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-slate-100 text-slate-800 border border-slate-300">
              Immutable Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chronological compliance logs recording pricing changes, S/N scans, and RBAC modifications.
          </p>
        </div>

        <select
          value={auditEventFilter}
          onChange={(e) =>
            setAuditEventFilter(
              e.target.value as "ALL" | AuditEventType
            )
          }
          className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 sm:py-2 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
        >
          <option value="ALL">
            All Event Types ({auditLogs.length})
          </option>
          <option value="PRICE_OVERRIDE">PRICE_OVERRIDE</option>
          <option value="PROMOTION_APPLIED">PROMOTION_APPLIED</option>
          <option value="RESTOCK_INTAKE">RESTOCK_INTAKE</option>
          <option value="ROLE_MODIFIED">ROLE_MODIFIED</option>
          <option value="ORDER_DISPATCHED">ORDER_DISPATCHED</option>
        </select>
      </div>

      {/* MOBILE AUDIT TIMELINE CARDS (< lg) */}
      <div className="divide-y divide-slate-200 lg:hidden">
        {filteredAuditLogs.map((log) => (
          <AuditMobileCard
            key={log.id}
            log={log}
          />
        ))}
      </div>

      {/* DESKTOP AUDIT TABLE (>= lg) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-5">Timestamp & Log ID</th>
              <th className="py-3.5 px-4">Operator & Role</th>
              <th className="py-3.5 px-4">Event Classification</th>
              <th className="py-3.5 px-4">Change Summary</th>
              <th className="py-3.5 px-5 text-right">
                Terminal / Network IP
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {filteredAuditLogs.map((log) => (
              <AuditTableRow
                key={log.id}
                log={log}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
