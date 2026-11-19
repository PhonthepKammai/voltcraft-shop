import { useMemo, useState } from "react";
import { INITIAL_AUDIT_LOGS } from "../mockData";
import type { AuditEventType, AuditLogEntry, RoleType } from "../types";

export function useAuditLog(globalSearch: string) {
  const [auditLogs, setAuditLogs] =
    useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const [auditEventFilter, setAuditEventFilter] = useState<
    "ALL" | AuditEventType
  >("ALL");

  const appendAuditLog = (
    eventType: AuditEventType,
    summary: string,
    operatorName = "Phonthep Kammai",
    operatorRole: RoleType = "Admin"
  ) => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const newEntry: AuditLogEntry = {
      id: `LOG-${9082 + auditLogs.length}`,
      timestamp,
      operatorName,
      operatorRole,
      eventType,
      summary,
      terminalIp: "10.24.01.01 (ADMIN-CORE-01)",
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const filteredAuditLogs = useMemo(() => {
    const query = globalSearch.trim().toLowerCase();
    return auditLogs.filter((entry) => {
      if (auditEventFilter !== "ALL" && entry.eventType !== auditEventFilter) {
        return false;
      }
      if (query) {
        return (
          entry.summary.toLowerCase().includes(query) ||
          entry.operatorName.toLowerCase().includes(query) ||
          entry.eventType.toLowerCase().includes(query) ||
          entry.id.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [auditLogs, auditEventFilter, globalSearch]);

  return {
    auditLogs,
    auditEventFilter,
    setAuditEventFilter,
    appendAuditLog,
    filteredAuditLogs,
  };
}

export type AppendAuditLog = ReturnType<typeof useAuditLog>["appendAuditLog"];
