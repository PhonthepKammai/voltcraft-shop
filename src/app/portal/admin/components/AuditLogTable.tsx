import React from "react";
import { AuditLogEntry, AuditEventType } from "../types";
import { THEME } from "../theme";
import { RoleBadge } from "./ui/RoleBadge";

interface AuditLogTableProps {
  logs: AuditLogEntry[];
  totalLogsCount: number;
  auditEventFilter: "ALL" | AuditEventType;
  onAuditEventFilterChange: (val: "ALL" | AuditEventType) => void;
}

export function AuditLogTable({
  logs,
  totalLogsCount,
  auditEventFilter,
  onAuditEventFilterChange,
}: AuditLogTableProps) {
  return (
    <section className={`${THEME.colors.surface} overflow-hidden`}>
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900">
              System Security & Operational Audit Trail
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-slate-100 text-slate-800 border border-slate-300">
              Immutable Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronological compliance logs recording Sales pricing changes, Warehouse S/N scans, and Super Admin RBAC modifications.
          </p>
        </div>

        {/* Event Type Filter */}
        <div className="flex items-center gap-2">
          <select
            value={auditEventFilter}
            onChange={(e) =>
              onAuditEventFilterChange(
                e.target.value as "ALL" | AuditEventType
              )
            }
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Event Types ({totalLogsCount})</option>
            <option value="PRICE_OVERRIDE">PRICE_OVERRIDE</option>
            <option value="PROMOTION_APPLIED">PROMOTION_APPLIED</option>
            <option value="RESTOCK_INTAKE">RESTOCK_INTAKE</option>
            <option value="ROLE_MODIFIED">ROLE_MODIFIED</option>
            <option value="ORDER_DISPATCHED">ORDER_DISPATCHED</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-5">Timestamp & Log ID</th>
              <th className="py-3.5 px-4">Operator & Role</th>
              <th className="py-3.5 px-4">Event Classification</th>
              <th className="py-3.5 px-4">Change Summary</th>
              <th className="py-3.5 px-5 text-right">Terminal / Network IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="py-4 px-5 font-mono">
                  <div className="font-bold text-slate-900">
                    {log.timestamp}
                  </div>
                  <div className="text-[11px] text-slate-400">{log.id}</div>
                </td>

                <td className="py-4 px-4">
                  <div className="font-bold text-slate-900 mb-1">
                    {log.operatorName}
                  </div>
                  <RoleBadge
                    role={log.operatorRole}
                    showBrackets={false}
                    size="xs"
                  />
                </td>

                <td className="py-4 px-4">
                  <span className="px-2.5 py-1 rounded-md font-mono text-[11px] font-bold bg-slate-900 text-amber-400">
                    {log.eventType}
                  </span>
                </td>

                <td className="py-4 px-4 text-slate-700 max-w-xl leading-relaxed">
                  {log.summary}
                </td>

                <td className="py-4 px-5 text-right font-mono text-[11px] text-slate-500">
                  {log.terminalIp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}