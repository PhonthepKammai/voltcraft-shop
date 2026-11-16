import { Package, ShoppingCart, Plus } from "lucide-react";
import type { ActivePortalTab, OrderCounts } from "../types";
import { formatTHB } from "../utils";

interface TabSwitcherProps {
  activeTab: ActivePortalTab;
  setActiveTab: (tab: ActivePortalTab) => void;
  orderCounts: OrderCounts;
  catalogCount: number;
  onNewAppliance: () => void;
}

export default function TabSwitcher({ activeTab, setActiveTab, orderCounts, catalogCount, onNewAppliance }: TabSwitcherProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        {/* Segmented Pill Switcher */}
        <div className="grid grid-cols-2 sm:inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all duration-150 ${
              activeTab === "orders"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShoppingCart className="w-4 h-4 stroke-[2.2]" />
            <span>Orders Queue</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                activeTab === "orders"
                  ? "bg-slate-950 text-amber-400"
                  : "bg-amber-100 text-amber-900"
              }`}
            >
              {orderCounts.pending} Pending
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("catalog")}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all duration-150 ${
              activeTab === "catalog"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Package className="w-4 h-4 stroke-[2.2]" />
            <span>Product Catalog</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                activeTab === "catalog"
                  ? "bg-slate-950 text-amber-400"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {catalogCount} SKUs
            </span>
          </button>
        </div>

        {/* Desktop Summary Strip & Add Appliance Button */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-3">
            <div>
              <span className="text-slate-500">Approved Today: </span>
              <strong className="text-emerald-700 font-bold">
                {orderCounts.approved} Orders
              </strong>
            </div>
            <span className="text-slate-300">|</span>
            <div>
              <span className="text-slate-500">Verified Revenue: </span>
              <strong className="text-slate-900 font-extrabold">
                {formatTHB(orderCounts.approvedRevenueTHB)}
              </strong>
            </div>
          </div>

          <button
            type="button"
            onClick={onNewAppliance}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition-all duration-150"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Appliance</span>
          </button>
        </div>
      </div>
    </div>
  );
}
