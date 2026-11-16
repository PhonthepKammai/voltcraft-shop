import { useState } from "react";
import { Search, Plus } from "lucide-react";
import type { ActivePortalTab, OrderCounts } from "../types";
import { formatTHB } from "../utils";

interface BottomBarProps {
  activeTab: ActivePortalTab;
  orderCounts: OrderCounts;
  orderSearchQuery: string;
  setOrderSearchQuery: (query: string) => void;
  catalogSearchQuery: string;
  setCatalogSearchQuery: (query: string) => void;
  onNewAppliance: () => void;
}

export default function BottomBar({
  activeTab,
  orderCounts,
  orderSearchQuery,
  setOrderSearchQuery,
  catalogSearchQuery,
  setCatalogSearchQuery,
  onNewAppliance,
}: BottomBarProps) {
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-slate-900 text-slate-100 border-t border-slate-800 px-4 py-2.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Quick Search Trigger & Live Shift Metrics */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setQuickSearchOpen((prev) => !prev)}
            aria-label="Quick search toggle"
            className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 active:scale-95 transition-transform"
          >
            <Search className="w-5 h-5 text-amber-400" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Approved Today:</span>
              <span className="font-extrabold text-emerald-400">
                {orderCounts.approved} Orders
              </span>
            </div>
            <p className="text-xs sm:text-sm font-extrabold text-white truncate">
              Verified: {formatTHB(orderCounts.approvedRevenueTHB)}
            </p>
          </div>
        </div>

        {/* Floating + New Appliance CTA Button */}
        <button
          type="button"
          onClick={onNewAppliance}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-150 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ New Appliance</span>
        </button>
      </div>

      {/* Quick Search Bar Drawer from Bottom Bar */}
      {quickSearchOpen && (
        <div className="max-w-7xl mx-auto pt-2.5 mt-2.5 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={activeTab === "orders" ? orderSearchQuery : catalogSearchQuery}
            onChange={(e) =>
              activeTab === "orders"
                ? setOrderSearchQuery(e.target.value)
                : setCatalogSearchQuery(e.target.value)
            }
            placeholder={
              activeTab === "orders"
                ? "Quick filter orders by #VC ref, customer, or phone..."
                : "Quick filter catalog by SKU, model, or category..."
            }
            autoFocus
            className="flex-1 h-11 px-3.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="button"
            onClick={() => setQuickSearchOpen(false)}
            className="min-h-[44px] px-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
