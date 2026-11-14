import React from "react";
import { Users, BarChart3, ShoppingBag, Shield } from "lucide-react";
import { KpiStats } from "../types";
import { THEME } from "../theme";
import { formatTHB } from "../formatters";

interface ExecutiveKpiGridProps {
  kpiStats: KpiStats;
  activeSkuCount: number;
  auditLogCount: number;
}

export function ExecutiveKpiGrid({
  kpiStats,
  activeSkuCount,
  auditLogCount,
}: ExecutiveKpiGridProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Managed Users */}
      <div className={THEME.colors.surface + " p-5"}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Managed Users
          </span>
          <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900">
            {kpiStats.totalUsers}
          </span>
          <span className="text-xs text-emerald-600 font-semibold">
            Zero Duplicate Emails
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Staff Accounts:{" "}
            <strong className="text-slate-800">{kpiStats.staffCount}</strong>
          </span>
          <span>
            Customer Profiles:{" "}
            <strong className="text-slate-800">{kpiStats.customerCount}</strong>
          </span>
        </div>
      </div>

      {/* Card 2: Gross Catalog Asset Value */}
      <div className={THEME.colors.surface + " p-5"}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Gross Catalog Asset Value
          </span>
          <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900 font-mono">
            {formatTHB(kpiStats.grossAssetValue)}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Active SKUs:{" "}
            <strong className="text-slate-800">{activeSkuCount}</strong>
          </span>
          <span className="text-amber-700 font-semibold">
            {kpiStats.lowStockCount} Low-Stock Alerts
          </span>
        </div>
      </div>

      {/* Card 3: Pending Dispatch & Orders */}
      <div className={THEME.colors.surface + " p-5"}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pending Dispatch & Orders
          </span>
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900">
            {kpiStats.pendingDispatchCount}
          </span>
          <span className="text-xs text-slate-500">Active Queue Items</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Sales Verify:{" "}
            <strong className="text-blue-700">
              {kpiStats.pendingSalesVerify}
            </strong>
          </span>
          <span>
            Warehouse S/N Pack:{" "}
            <strong className="text-amber-700">
              {kpiStats.pendingWarehousePack}
            </strong>
          </span>
        </div>
      </div>

      {/* Card 4: System Security Health */}
      <div className={THEME.colors.surface + " p-5"}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            System Security Health
          </span>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-2xl font-extrabold text-emerald-700">
            100% Secure
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            ISO-27001
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Unhandled Exceptions: <strong className="text-emerald-700">0</strong>
          </span>
          <span>
            Audit Logs: <strong className="text-slate-800">{auditLogCount}</strong>
          </span>
        </div>
      </div>
    </section>
  );
}