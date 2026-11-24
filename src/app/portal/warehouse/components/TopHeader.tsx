import type { Dispatch, SetStateAction } from "react";
import { Zap, ClipboardList } from "lucide-react";
import type { WarehouseTab, FulfillmentFilter, FulfillmentMetrics } from "../types";

interface TopHeaderProps {
  setActiveTab: Dispatch<SetStateAction<WarehouseTab>>;
  setFulfillmentFilter: Dispatch<SetStateAction<FulfillmentFilter>>;
  fulfillmentMetrics: FulfillmentMetrics;
}

export default function TopHeader({
  setActiveTab,
  setFulfillmentFilter,
  fulfillmentMetrics,
}: TopHeaderProps) {
  return (
    <header className="bg-slate-950/95 backdrop-blur-md text-slate-100 px-4 py-3 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo + WAREHOUSE OPS Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 shrink-0">
            <Zap className="w-6 h-6 fill-slate-950 stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                Volt<span className="text-amber-500">Craft</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold uppercase tracking-wider">
                WAREHOUSE OPS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block leading-none mt-0.5">
              Physical Inventory, S/N Warranty Binding &amp; Fleet Dispatch Hub
            </p>
          </div>
        </div>

        {/* Right Status Pill & Sales Transfer Notification Counter */}
        <div className="flex items-center gap-2">
          <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Bay 4 - Active Dispatch</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-amber-400">Scanner #HT-04</span>
          </div>

          {/* Mobile Compact Bay Pill */}
          <div className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Bay 4</span>
          </div>

          {/* Notification Bell / Ready to Pick Trigger (Min 48x48px) */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("fulfillment");
              setFulfillmentFilter("Ready to Pick");
            }}
            aria-label="New Orders from Sales Queue"
            className="relative min-w-[48px] min-h-[48px] px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center gap-2 active:scale-95 transition-transform duration-150"
          >
            <ClipboardList className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <span className="text-xs font-extrabold text-white block leading-none">
                {fulfillmentMetrics.readyToPick}
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                To Pick
              </span>
            </div>
            {fulfillmentMetrics.readyToPick > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 ring-2 ring-slate-950" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
