import type { Dispatch, SetStateAction } from "react";
import { Shield, Plus, Search, Bell, Menu, X } from "lucide-react";
import type { KpiStats, PageMeta } from "../types";

interface TopBarProps {
  setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  globalSearch: string;
  setGlobalSearch: Dispatch<SetStateAction<string>>;
  isNotificationOpen: boolean;
  setIsNotificationOpen: Dispatch<SetStateAction<boolean>>;
  setIsAddUserModalOpen: Dispatch<SetStateAction<boolean>>;
  kpiStats: KpiStats;
  pageMeta: PageMeta;
}

export default function TopBar({
  setIsMobileMenuOpen,
  globalSearch,
  setGlobalSearch,
  isNotificationOpen,
  setIsNotificationOpen,
  setIsAddUserModalOpen,
  kpiStats,
  pageMeta,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 lg:px-6 lg:py-3.5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Row 1 on Mobile: Menu + Title | Bell + New Staff CTA */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2 -ml-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 active:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand + Active Tab Label */}
            <div className="flex flex-col lg:hidden min-w-0">
              <span className="text-xs font-extrabold tracking-tight text-slate-900 leading-none">
                VOLT<span className="text-amber-600">CRAFT</span>{" "}
                <span className="text-slate-400 font-mono font-normal">
                  / {pageMeta.short}
                </span>
              </span>
              <span className="text-[10px] text-emerald-600 font-mono font-semibold mt-0.5">
                ● 4-ROLE SYNC ONLINE
              </span>
            </div>

            {/* Desktop Breadcrumb */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500">
              <Shield className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">{pageMeta.breadcrumb}</span>
            </div>
          </div>

          {/* Mobile Quick Actions (Bell + Compact Add Staff) */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsNotificationOpen((prev) => !prev)}
              aria-label="Toggle alerts"
              className="relative p-2.5 rounded-xl border border-slate-200 bg-white active:bg-slate-50 text-slate-700 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
            </button>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-3 py-2.5 rounded-xl bg-amber-500 active:bg-amber-600 text-slate-950 font-bold text-xs inline-flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Staff</span>
            </button>
          </div>
        </div>

        {/* Row 2 on Mobile (Inline Right on Desktop): Global Search + Desktop Actions */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Instant Global Search */}
          <div className="relative flex-1 lg:flex-none lg:w-72 xl:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Global filter SKU, user, IP, log..."
              className="w-full pl-9 pr-3 sm:pr-16 py-2.5 lg:py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 transition-all"
            />
            <span className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              Ctrl + K
            </span>
          </div>

          {/* Desktop Notification Bell */}
          <div className="hidden lg:block relative">
            <button
              onClick={() => setIsNotificationOpen((prev) => !prev)}
              aria-label="Toggle alerts"
              className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
            </button>
          </div>

          {/* Desktop Contextual CTA */}
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="hidden lg:inline-flex px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Staff Account</span>
          </button>
        </div>
      </div>

      {/* Responsive Notification Dropdown (Full-width inset on mobile, anchored right on desktop) */}
      {isNotificationOpen && (
        <div className="fixed inset-x-4 top-16 sm:inset-x-auto sm:right-6 lg:top-16 sm:w-80 bg-white rounded-xl border border-slate-200 shadow-2xl p-4 z-40 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900">
              System Telemetry Alerts
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                {kpiStats.lowStockCount + 1} Unread
              </span>
              <button
                onClick={() => setIsNotificationOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
              <p className="font-bold">Depleted Stock Alert: VC-IND-2600-TB</p>
              <p className="text-[11px] mt-0.5">
                Precision Induction Cooktop 2600W has 0 warehouse units remaining.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
              <p className="font-bold">Low Stock Warning: 2 Appliances</p>
              <p className="text-[11px] mt-0.5">
                Multi-Door Refrigerator (8 units) & LiDAR Robot Vacuum (5 units) below safety threshold.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
              <p className="font-bold">New Sales Terminal Session</p>
              <p className="text-[11px] mt-0.5">
                Nattapong Srisuwan logged in from SALES-TERM-02.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
