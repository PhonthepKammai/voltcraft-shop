import { Zap, Clock } from "lucide-react";
import type { OrderCounts } from "../types";

interface TopBarProps {
  orderCounts: OrderCounts;
  onViewPending: () => void;
}

export default function TopBar({ orderCounts, onViewPending }: TopBarProps) {
  return (
    <header className="bg-slate-900 text-slate-100 px-4 py-3 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo + SALES OPS Role Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-sm shadow-amber-500/30 shrink-0">
            <Zap className="w-6 h-6 fill-slate-950 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                Volt<span className="text-amber-500">Craft</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-extrabold uppercase tracking-wider">
                SALES OPS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block leading-none mt-0.5">
              Catalog CRUD, Promo Pricing &amp; Order Dispatch Verification
            </p>
          </div>
        </div>

        {/* Right Controls: Showroom Shift Pill + Pending Orders Alert */}
        <div className="flex items-center gap-2">
          <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Showroom Shift Active</span>
            <span className="text-slate-400">•</span>
            <span className="text-amber-400 font-mono">Rep #04</span>
          </div>

          {/* Mobile Shift Pill */}
          <div className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Shift Live</span>
          </div>

          {/* Pending Verification Alert Trigger */}
          <button
            type="button"
            onClick={onViewPending}
            aria-label="View Pending Orders"
            className="relative min-w-[44px] min-h-[44px] px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-1.5 active:scale-95 transition-transform duration-150"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-extrabold text-white">
              {orderCounts.pending}
            </span>
            <span className="hidden sm:inline text-xs text-slate-300 font-medium">
              Awaiting Verify
            </span>
            {orderCounts.pending > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 ring-2 ring-slate-900" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
