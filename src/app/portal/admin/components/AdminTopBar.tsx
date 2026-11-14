import React from "react";
import { Shield, Search, Bell, Plus } from "lucide-react";

interface AdminTopBarProps {
  breadcrumb: string;
  globalSearch: string;
  onGlobalSearchChange: (val: string) => void;
  isNotificationOpen: boolean;
  onToggleNotifications: () => void;
  lowStockCount: number;
  onOpenAddUserModal: () => void;
}

export function AdminTopBar({
  breadcrumb,
  globalSearch,
  onGlobalSearchChange,
  isNotificationOpen,
  onToggleNotifications,
  lowStockCount,
  onOpenAddUserModal,
}: AdminTopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3.5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Active Section Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Shield className="w-4 h-4 text-amber-600" />
          <span>{breadcrumb}</span>
        </div>

        {/* Global Search, Notification Bell & Contextual CTA */}
        <div className="flex items-center gap-3">
          {/* Instant Filter / Global Search */}
          <div className="relative w-64 sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => onGlobalSearchChange(e.target.value)}
              placeholder="Global filter SKU, user, IP, log..."
              className="w-full pl-9 pr-16 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 transition-all"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              Ctrl + K
            </span>
          </div>

          {/* System Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={onToggleNotifications}
              className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl p-4 z-40 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900">
                    System Telemetry Alerts
                  </span>
                  <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                    {lowStockCount + 1} Unread
                  </span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
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
          </div>

          {/* Contextual Action Button */}
          <button
            type="button"
            onClick={onOpenAddUserModal}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs inline-flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Staff Account</span>
          </button>
        </div>
      </div>
    </header>
  );
}