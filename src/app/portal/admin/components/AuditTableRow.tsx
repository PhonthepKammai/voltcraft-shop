import { THEME } from "../theme";
import type { AuditLogEntry } from "../types";

interface AuditTableRowProps {
  log: AuditLogEntry;
}

export default function AuditTableRow({ log }: AuditTableRowProps) {
  return (
    <tr
      className="hover:bg-slate-50/80 transition-colors"
    >
      <td className="py-4 px-5 font-mono">
        <div className="font-bold text-slate-900">
          {log.timestamp}
        </div>
        <div className="text-[11px] text-slate-400">
          {log.id}
        </div>
      </td>

      <td className="py-4 px-4">
        <div className="font-bold text-slate-900">
          {log.operatorName}
        </div>
        <span
          className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
            THEME.colors.roleBadges[log.operatorRole]
          }`}
        >
          {log.operatorRole}
        </span>
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
  );
}
