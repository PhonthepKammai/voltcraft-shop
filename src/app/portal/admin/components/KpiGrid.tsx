import { Users, Shield, ShoppingBag, BarChart3 } from "lucide-react";
import { THEME } from "../theme";
import type { ApplianceItem, AuditLogEntry, KpiStats } from "../types";
import { formatTHB } from "../utils";

interface KpiGridProps {
  appliances: ApplianceItem[];
  auditLogs: AuditLogEntry[];
  kpiStats: KpiStats;
}

export default function KpiGrid({ appliances, auditLogs, kpiStats }: KpiGridProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {/* Card 1: Total Managed Users */}
      <div className={`${THEME.colors.surface} p-4 sm:p-5`}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Managed Users
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {kpiStats.totalUsers}
          </span>
          <span className="text-[11px] sm:text-xs text-emerald-600 font-semibold">
            Zero Duplicate Emails
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
          <span>
            Staff:{" "}
            <strong className="text-slate-800">
              {kpiStats.staffCount}
            </strong>
          </span>
          <span>
            Customers:{" "}
            <strong className="text-slate-800">
              {kpiStats.customerCount}
            </strong>
          </span>
        </div>
      </div>

      {/* Card 2: Gross Catalog Asset Value */}
      <div className={`${THEME.colors.surface} p-4 sm:p-5`}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Gross Catalog Value
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
            {formatTHB(kpiStats.grossAssetValue)}
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
          <span>
            SKUs:{" "}
            <strong className="text-slate-800">{appliances.length}</strong>
          </span>
          <span className="text-amber-700 font-semibold">
            {kpiStats.lowStockCount} Low-Stock Alerts
          </span>
        </div>
      </div>

      {/* Card 3: Pending Dispatch & Orders */}
      <div className={`${THEME.colors.surface} p-4 sm:p-5`}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Pending Dispatch
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {kpiStats.pendingDispatchCount}
          </span>
          <span className="text-[11px] sm:text-xs text-slate-500">
            Active Queue Items
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
          <span>
            Sales Verify:{" "}
            <strong className="text-blue-700">
              {kpiStats.pendingSalesVerify}
            </strong>
          </span>
          <span>
            S/N Pack:{" "}
            <strong className="text-amber-700">
              {kpiStats.pendingWarehousePack}
            </strong>
          </span>
        </div>
      </div>

      {/* Card 4: System Security Health */}
      <div className={`${THEME.colors.surface} p-4 sm:p-5`}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Security Health
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-700">
            100% Secure
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            ISO-27001
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
          <span>
            Exceptions: <strong className="text-emerald-700">0</strong>
          </span>
          <span>
            Audit Logs:{" "}
            <strong className="text-slate-800">{auditLogs.length}</strong>
          </span>
        </div>
      </div>
    </section>
  );
}
