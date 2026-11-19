import type { Dispatch, SetStateAction } from "react";
import { LayoutDashboard, Users, Package, History, ChevronRight, LogOut, Zap, X } from "lucide-react";
import { THEME } from "../theme";
import type { NavTab, UserAccount, AuditLogEntry, ToastType, KpiStats } from "../types";

interface SidebarContentProps {
  activeTab: NavTab;
  handleSelectTab: (tab: NavTab) => void;
  setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  kpiStats: KpiStats;
  triggerToast: (message: string, type?: ToastType) => void;
  users: UserAccount[];
  auditLogs: AuditLogEntry[];
}

export default function SidebarContent({
  activeTab,
  handleSelectTab,
  setIsMobileMenuOpen,
  kpiStats,
  triggerToast,
  users,
  auditLogs,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 lg:p-6 border-b border-slate-800/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0">
              <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base lg:text-lg font-extrabold tracking-tight text-white">
                  VOLT<span className="text-amber-500">CRAFT</span>
                </span>
                <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  CORE
                </span>
              </div>
              <p className="text-[10px] lg:text-[11px] font-mono tracking-widest text-slate-400 uppercase mt-0.5">
                {THEME.subtitle}
              </p>
            </div>
          </div>

          {/* Mobile Close Drawer Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu"
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Role Architecture Status Pill */}
        <div className="px-5 py-3 border-b border-slate-900 bg-slate-900/50">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>4-ROLE ECOSYSTEM SYNC</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Central Governance
          </div>

          <button
            onClick={() => handleSelectTab("overview")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15 font-bold"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Overview & Operational KPIs</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
          </button>

          <button
            onClick={() => handleSelectTab("users")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "users"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15 font-bold"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <Users className="w-4 h-4 shrink-0" />
              <span>User & RBAC Management</span>
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === "users"
                  ? "bg-slate-950 text-amber-400 font-bold"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {users.length}
            </span>
          </button>

          <button
            onClick={() => handleSelectTab("catalog")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "catalog"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15 font-bold"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <Package className="w-4 h-4 shrink-0" />
              <span>Master Catalog & Inventory</span>
            </span>
            {kpiStats.lowStockCount > 0 && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeTab === "catalog"
                    ? "bg-slate-950 text-amber-400 font-bold"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {kpiStats.lowStockCount} Alert
              </span>
            )}
          </button>

          <button
            onClick={() => handleSelectTab("audit")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "audit"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15 font-bold"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <History className="w-4 h-4 shrink-0" />
              <span>System Security Audit Logs</span>
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === "audit"
                  ? "bg-slate-950 text-amber-400 font-bold"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {auditLogs.length}
            </span>
          </button>

          {/* Role Architecture Reference Box */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 px-1 space-y-2.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold px-1">
              Active Role Ecosystem
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-semibold">● Super Admin</span>
                <span className="text-slate-400 font-mono">RBAC & Audit</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-semibold">● Sales Staff</span>
                <span className="text-slate-400 font-mono">CRUD & Promo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-semibold">● Warehouse Ops</span>
                <span className="text-slate-400 font-mono">S/N & Dispatch</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-semibold">● Customer</span>
                <span className="text-slate-400 font-mono">Store & Warranty</span>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Footer Super Admin Profile Widget */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-extrabold flex items-center justify-center text-sm">
                PK
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 absolute -bottom-0.5 -right-0.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                Phonthep Kammai
              </p>
              <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 mt-0.5">
                Full Governance
              </span>
            </div>
          </div>
          <button
            onClick={() =>
              triggerToast(
                "Session locked. Re-authentication required for production sign-out.",
                "info"
              )
            }
            title="Sign Out"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
