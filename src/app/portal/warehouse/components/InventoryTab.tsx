import type { Dispatch, SetStateAction } from "react";
import { AlertTriangle, Search, Plus, X } from "lucide-react";
import type { InventoryFilter, WarehouseInventoryItem } from "../types";
import InventoryCard from "./InventoryCard";

interface InventoryTabProps {
  inventoryFilter: InventoryFilter;
  setInventoryFilter: Dispatch<SetStateAction<InventoryFilter>>;
  inventorySearchQuery: string;
  setInventorySearchQuery: Dispatch<SetStateAction<string>>;
  filteredInventory: WarehouseInventoryItem[];
  openRestockIntakeModal: (item?: WarehouseInventoryItem) => void;
}

export default function InventoryTab({
  inventoryFilter,
  setInventoryFilter,
  inventorySearchQuery,
  setInventorySearchQuery,
  filteredInventory,
  openRestockIntakeModal,
}: InventoryTabProps) {
  return (
    <section aria-label="Physical Inventory Management" className="space-y-4">
      {/* Search & Stock Health Filter Bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={inventorySearchQuery}
              onChange={(e) => setInventorySearchQuery(e.target.value)}
              placeholder="Search physical inventory by SKU (e.g. VC-AC-12K), Appliance Name, or Aisle/Rack..."
              className="w-full h-12 pl-10 pr-10 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {inventorySearchQuery && (
              <button
                type="button"
                onClick={() => setInventorySearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => openRestockIntakeModal()}
            className="min-h-[48px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Receive Pallet Intake</span>
          </button>
        </div>

        {/* Stock Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {(
            ["All", "Healthy Stock", "Low Stock (< 5)"] as InventoryFilter[]
          ).map((filterLabel) => {
            const isSelected = inventoryFilter === filterLabel;
            return (
              <button
                key={filterLabel}
                type="button"
                onClick={() => setInventoryFilter(filterLabel)}
                className={`shrink-0 min-h-[48px] px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 active:scale-95 transition-all duration-150 ${
                  isSelected
                    ? "bg-amber-500 text-slate-950 border-amber-500"
                    : filterLabel === "Low Stock (< 5)"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : "bg-slate-900 text-slate-300 border-slate-800"
                }`}
              >
                {filterLabel === "Low Stock (< 5)" && (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                <span>{filterLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map((item) => (
          <InventoryCard
            key={item.id}
            item={item}
            openRestockIntakeModal={openRestockIntakeModal}
          />
        ))}
      </div>
    </section>
  );
}
