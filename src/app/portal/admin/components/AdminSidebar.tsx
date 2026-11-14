import React from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  History,
  ChevronRight,
  LogOut,
  Zap,
} from "lucide-react";
import { NavTab } from "../types";
import { THEME } from "../theme";

interface AdminSidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userCount: number;
  lowStockCount: number;
  auditLogCount: number;
  onSignOut: () => void;
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  userCount,
  lowStockCount,
  auditLogCount,
  onSignOut,
}: AdminSidebarProps) {
  return (
    <aside className="w-72 bg-slate-950 text-slate-100 flex flex-col justify-between shrink-0 border-r border-slate-800 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/90 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white">
                VOLT<span className="text-amber-500">CRAFT</span>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                CORE
              </span>
            </div>
            <p className="text-[11px] font-mono tracking-widest text-slate-400 uppercase mt-0.5">
              {THEME.subtitle}
            </p>
          </div>
        </div>

        {/* 4-Role Architecture Status Pill */}
        <div className="px-5 py-3.5 border-b border-slate-900 bg-slate-900/50">
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
            type="button"
            onClick={() => onSelectTab("overview")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15 font-bold"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview & Operational KPIs</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("users")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "users"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15 font-bold"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>User & RBAC Management</span>
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === "users"
                  ? "bg-slate-950 text-amber-400 font-bold"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {userCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("catalog")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "catalog"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15 font-bold"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Master Catalog & Inventory</span>
            </span>
            {lowStockCount > 0 && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeTab === "catalog"
                    ? "bg-slate-950 text-amber-400 font-bold"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {lowStockCount} Alert
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("audit")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "audit"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15 font-bold"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <History className="w-4 h-4" />
              <span>System Security Audit Logs</span>
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === "audit"
                  ? "bg-slate-950 text-amber-400 font-bold"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {auditLogCount}
            </span>
          </button>

          {/* Role Architecture Reference Box */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 px-2 space-y-2.5">
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
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-extrabold flex items-center justify-center text-sm">
                PK
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 absolute -bottom-0.5 -right-0.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                Phonthep Kammai
              </p>
              <span className="inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 mt-0.5">
                Full Governance
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            title="Sign Out"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}