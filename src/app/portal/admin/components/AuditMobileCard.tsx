import { THEME } from "../theme";
import type { AuditLogEntry } from "../types";

interface AuditMobileCardProps {
  log: AuditLogEntry;
}

export default function AuditMobileCard({ log }: AuditMobileCardProps) {
  return (
    <div className="p-4 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-900 text-amber-400">
          {log.eventType}
        </span>
        <span className="font-mono text-[11px] text-slate-500">
          {log.timestamp}
        </span>
      </div>

      <p className="text-xs text-slate-800 leading-relaxed">
        {log.summary}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-900">
            {log.operatorName}
          </span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
              THEME.colors.roleBadges[log.operatorRole]
            }`}
          >
            {log.operatorRole}
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">
          {log.id} • {log.terminalIp}
        </span>
      </div>
    </div>
  );
}
