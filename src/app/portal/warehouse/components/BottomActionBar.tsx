import type { Dispatch, SetStateAction } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import type { WarehouseTab, InventoryFilter, WarehouseInventoryItem, InventoryMetrics } from "../types";

interface BottomActionBarProps {
  setActiveTab: Dispatch<SetStateAction<WarehouseTab>>;
  setInventoryFilter: Dispatch<SetStateAction<InventoryFilter>>;
  inventoryMetrics: InventoryMetrics;
  openRestockIntakeModal: (item?: WarehouseInventoryItem) => void;
}

export default function BottomActionBar({
  setActiveTab,
  setInventoryFilter,
  inventoryMetrics,
  openRestockIntakeModal,
}: BottomActionBarProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-4 py-2.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Live Inventory Health Summary Chip */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("inventory");
            setInventoryFilter("Low Stock (< 5)");
          }}
          className="min-h-[48px] px-3.5 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-2 text-xs font-extrabold active:scale-95 transition-transform"
        >
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <div className="text-left">
            <span className="block leading-tight">
              {inventoryMetrics.lowStockCount} items low stock (&lt; 5 units)
            </span>
            <span className="text-[10px] text-rose-200/80 font-normal">
              Tap to filter critical SKUs
            </span>
          </div>
        </button>

        {/* Floating + Restock Intake CTA */}
        <button
          type="button"
          onClick={() => openRestockIntakeModal()}
          className="min-h-[48px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-150 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Restock Intake</span>
        </button>
      </div>
    </div>
  );
}
