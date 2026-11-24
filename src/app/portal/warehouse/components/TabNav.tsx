import type { Dispatch, SetStateAction } from "react";
import { Barcode, Truck, Plus, Layers } from "lucide-react";
import type { WarehouseTab, WarehouseInventoryItem, FulfillmentMetrics, InventoryMetrics } from "../types";
import { DELIVERY_ROUTES } from "../mockData";

interface TabNavProps {
  activeTab: WarehouseTab;
  setActiveTab: Dispatch<SetStateAction<WarehouseTab>>;
  fulfillmentMetrics: FulfillmentMetrics;
  inventoryMetrics: InventoryMetrics;
  openRestockIntakeModal: (item?: WarehouseInventoryItem) => void;
}

export default function TabNav({
  activeTab,
  setActiveTab,
  fulfillmentMetrics,
  inventoryMetrics,
  openRestockIntakeModal,
}: TabNavProps) {
  return (
    <nav
      aria-label="Warehouse Operations Navigation"
      className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5">
        <div className="grid grid-cols-3 bg-slate-900 p-1 rounded-2xl border border-slate-800 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("fulfillment")}
            className={`min-h-[48px] px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 transition-all duration-150 ${
              activeTab === "fulfillment"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Barcode className="w-4 h-4 shrink-0 stroke-[2.2]" />
            <span className="truncate">Fulfillment Orders</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold shrink-0 ${
                activeTab === "fulfillment"
                  ? "bg-slate-950 text-amber-400"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}
            >
              {fulfillmentMetrics.readyToPick}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inventory")}
            className={`min-h-[48px] px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 transition-all duration-150 ${
              activeTab === "inventory"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Layers className="w-4 h-4 shrink-0 stroke-[2.2]" />
            <span className="truncate">Physical Stock</span>
            {inventoryMetrics.lowStockCount > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold shrink-0 ${
                  activeTab === "inventory"
                    ? "bg-slate-950 text-rose-400"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                }`}
              >
                {inventoryMetrics.lowStockCount} Low
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("dispatch")}
            className={`min-h-[48px] px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 transition-all duration-150 ${
              activeTab === "dispatch"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Truck className="w-4 h-4 shrink-0 stroke-[2.2]" />
            <span className="truncate">Dispatch &amp; Drivers</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold shrink-0 ${
                activeTab === "dispatch"
                  ? "bg-slate-950 text-amber-400"
                  : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
              }`}
            >
              {DELIVERY_ROUTES.length}
            </span>
          </button>
        </div>

        {/* Desktop Quick Stats Strip */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <span className="text-slate-400">
              Total Floor Units:{" "}
              <strong className="text-white font-extrabold">
                {inventoryMetrics.totalPhysicalUnits}
              </strong>
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">
              S/N Packed:{" "}
              <strong className="text-emerald-400 font-extrabold">
                {fulfillmentMetrics.packed}
              </strong>
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">
              Dispatched:{" "}
              <strong className="text-blue-400 font-extrabold">
                {fulfillmentMetrics.dispatched}
              </strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => openRestockIntakeModal()}
            className="min-h-[48px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all duration-150"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Restock Intake</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
