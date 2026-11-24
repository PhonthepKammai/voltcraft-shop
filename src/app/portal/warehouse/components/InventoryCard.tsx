import { AlertTriangle, Plus } from "lucide-react";
import type { WarehouseInventoryItem } from "../types";

interface InventoryCardProps {
  item: WarehouseInventoryItem;
  openRestockIntakeModal: (item?: WarehouseInventoryItem) => void;
}

export default function InventoryCard({ item, openRestockIntakeModal }: InventoryCardProps) {
  const isLowStock = item.stockCount < 5;
  const isOutOfStock = item.stockCount === 0;

  return (
    <article
      className={`bg-slate-950 rounded-2xl p-4 sm:p-5 shadow-md border flex flex-col justify-between gap-4 ${
        isOutOfStock
          ? "border-rose-500/60"
          : isLowStock
          ? "border-amber-500/50"
          : "border-slate-800"
      }`}
    >
      <div className="space-y-3.5">
        {/* Top Row: Location Badge + Stock Alert Status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-extrabold">
            📍 {item.storageLocation}
          </span>

          {isLowStock ? (
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-extrabold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {isOutOfStock ? "OUT OF STOCK (0)" : "LOW STOCK (< 5)"}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
              ● Healthy Stock
            </span>
          )}
        </div>

        {/* Appliance Thumbnail & Read-Only Catalog Info */}
        <div className="flex items-start gap-3.5">
          <img
            src={item.thumbnail}
            alt={item.name}
            className="w-20 h-20 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {item.sku}
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                {item.zone}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mt-1 line-clamp-2 leading-snug">
              {item.name}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {item.wattageSpec} • S/N Prefix:{" "}
              <span className="font-mono text-slate-300">
                {item.serialPrefix}
              </span>
            </p>
          </div>
        </div>

        {/* Live Physical Stock Counter Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Physical Units on Floor
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span
                className={`text-3xl font-extrabold font-mono ${
                  isLowStock ? "text-rose-400" : "text-white"
                }`}
              >
                {item.stockCount}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                units (Min Alert: {item.minAlertThreshold})
              </span>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-400">
            <span className="block">Last Intake: {item.lastIntakeDate}</span>
            <span className="font-mono text-slate-300 font-semibold">
              {item.lastIntakeBatch}
            </span>
          </div>
        </div>

        {/* Role Access Note */}
        <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
          <span>🔒 {item.salesPriceLockNote}</span>
        </div>
      </div>

      {/* Restock Intake Action Button (Min 48px height) */}
      <button
        type="button"
        onClick={() => openRestockIntakeModal(item)}
        className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all duration-150"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Add Stock Intake (+ Receive Units)</span>
      </button>
    </article>
  );
}
