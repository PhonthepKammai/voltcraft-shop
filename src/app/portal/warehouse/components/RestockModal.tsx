import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import { Package, Plus, Minus, X, Check } from "lucide-react";
import type { WarehouseInventoryItem } from "../types";

interface RestockModalProps {
  inventory: WarehouseInventoryItem[];
  restockModalItem: WarehouseInventoryItem;
  setRestockModalItem: Dispatch<SetStateAction<WarehouseInventoryItem | null>>;
  restockQty: number;
  setRestockQty: Dispatch<SetStateAction<number>>;
  restockBatchCode: string;
  setRestockBatchCode: Dispatch<SetStateAction<string>>;
  restockSupplierNote: string;
  setRestockSupplierNote: Dispatch<SetStateAction<string>>;
  handleConfirmRestockIntake: (e: React.FormEvent) => void;
}

export default function RestockModal({
  inventory,
  restockModalItem,
  setRestockModalItem,
  restockQty,
  setRestockQty,
  restockBatchCode,
  setRestockBatchCode,
  restockSupplierNote,
  setRestockSupplierNote,
  handleConfirmRestockIntake,
}: RestockModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => setRestockModalItem(null)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-950 w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-slate-800 overflow-hidden shadow-2xl"
      >
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Package className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Add Physical Stock Intake
              </h3>
              <p className="text-xs text-slate-400">
                Log factory pallet receiving &amp; update warehouse floor count
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setRestockModalItem(null)}
            className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConfirmRestockIntake} className="p-5 space-y-4">
          {/* Target SKU Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Select Target Appliance SKU
            </label>
            <select
              value={restockModalItem.sku}
              onChange={(e) => {
                const found = inventory.find((i) => i.sku === e.target.value);
                if (found) setRestockModalItem(found);
              }}
              className="w-full h-12 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {inventory.map((inv) => (
                <option key={inv.id} value={inv.sku}>
                  {inv.sku} — {inv.name} (Current: {inv.stockCount} units)
                </option>
              ))}
            </select>
          </div>

          {/* Current Location & Live Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block">Storage Bin Location</span>
              <strong className="text-amber-400 font-bold">
                {restockModalItem.storageLocation}
              </strong>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">New Stock Projection</span>
              <strong className="text-sm font-extrabold text-emerald-400 font-mono">
                {restockModalItem.stockCount} →{" "}
                {restockModalItem.stockCount + Math.max(1, restockQty)} units
              </strong>
            </div>
          </div>

          {/* Quick Stepper & Quantity Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Received Intake Quantity (Units)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRestockQty((q) => Math.max(1, q - 5))}
                className="min-w-[48px] min-h-[48px] rounded-xl bg-slate-900 border border-slate-700 text-white flex items-center justify-center active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min={1}
                max={500}
                value={restockQty}
                onChange={(e) =>
                  setRestockQty(Math.max(1, Number(e.target.value) || 1))
                }
                className="flex-1 h-12 px-4 rounded-xl bg-slate-900 border border-slate-700 text-center text-lg font-extrabold font-mono text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setRestockQty((q) => q + 5)}
                className="min-w-[48px] min-h-[48px] rounded-xl bg-slate-900 border border-slate-700 text-white flex items-center justify-center active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Preset Intake Buttons */}
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[5, 10, 20, 50].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setRestockQty(preset)}
                  className={`py-2 rounded-lg text-xs font-bold border ${
                    restockQty === preset
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                      : "bg-slate-900 text-slate-400 border-slate-800"
                  }`}
                >
                  +{preset} Units
                </button>
              ))}
            </div>
          </div>

          {/* Factory Batch Lot Code & Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">
                Factory Lot / Batch ID
              </label>
              <input
                type="text"
                value={restockBatchCode}
                onChange={(e) => setRestockBatchCode(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">
                Receiving Dock Note
              </label>
              <input
                type="text"
                value={restockSupplierNote}
                onChange={(e) => setRestockSupplierNote(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRestockModalItem(null)}
              className="min-h-[48px] px-5 py-2.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-700 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[48px] py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Confirm +{restockQty} Units Intake</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
