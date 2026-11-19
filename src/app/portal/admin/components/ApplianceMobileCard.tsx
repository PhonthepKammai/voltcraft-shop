import type { Dispatch, SetStateAction } from "react";
import { Edit, Zap, RefreshCw } from "lucide-react";
import { THEME } from "../theme";
import type { ApplianceItem } from "../types";
import { formatTHB } from "../utils";

interface ApplianceMobileCardProps {
  item: ApplianceItem;
  editingThresholdId: string | null;
  setEditingThresholdId: Dispatch<SetStateAction<string | null>>;
  tempThresholdValue: number;
  setTempThresholdValue: Dispatch<SetStateAction<number>>;
  handleTogglePublishAppliance: (item: ApplianceItem) => void;
  handleSaveSafetyThreshold: (item: ApplianceItem) => void;
  handleQuickEmergencyRestock: (item: ApplianceItem) => void;
}

export default function ApplianceMobileCard({
  item,
  editingThresholdId,
  setEditingThresholdId,
  tempThresholdValue,
  setTempThresholdValue,
  handleTogglePublishAppliance,
  handleSaveSafetyThreshold,
  handleQuickEmergencyRestock,
}: ApplianceMobileCardProps) {
  const isOut = item.stockUnits === 0;
  const isLow =
    !isOut && item.stockUnits <= item.lowStockThreshold;

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.thumbnailBg} text-white flex flex-col items-center justify-center shrink-0 shadow-xs`}
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span className="text-[9px] font-mono font-bold mt-0.5">
            {item.sku.split("-")[1]}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-slate-900 text-sm leading-snug">
            {item.name}
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">
            {item.sku} • {item.category}
          </div>
        </div>
      </div>

      {/* Specs & Energy Badges */}
      <div className="flex flex-wrap gap-1.5">
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-mono text-[11px] font-semibold">
          {item.wattageOrInverter}
        </span>
        <span
          className={`px-2 py-0.5 rounded-md text-[11px] border ${THEME.colors.hardwareStatus.energyStar}`}
        >
          {item.energyStarRating}
        </span>
      </div>

      {/* Price & Stock Strip */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div>
          <span className="text-[10px] uppercase text-slate-500 font-semibold block">
            Selling Price
          </span>
          <span className="font-mono font-extrabold text-sm text-slate-900">
            {formatTHB(item.priceTHB)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase text-slate-500 font-semibold block mb-0.5">
            Warehouse Stock
          </span>
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${
              isOut
                ? THEME.colors.hardwareStatus.critical
                : isLow
                ? THEME.colors.hardwareStatus.warning
                : THEME.colors.hardwareStatus.normal
            }`}
          >
            {isOut
              ? "0 Out-of-Stock"
              : `${item.stockUnits} Units`}
          </span>
        </div>
      </div>

      {/* Safety Threshold + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div>
          {editingThresholdId === item.id ? (
            <div className="inline-flex items-center gap-1.5">
              <input
                type="number"
                min={1}
                value={tempThresholdValue}
                onChange={(e) =>
                  setTempThresholdValue(Number(e.target.value))
                }
                className="w-16 px-2 py-1.5 border border-amber-400 rounded-lg text-xs font-mono"
              />
              <button
                onClick={() => handleSaveSafetyThreshold(item)}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditingThresholdId(item.id);
                setTempThresholdValue(item.lowStockThreshold);
              }}
              className="inline-flex items-center gap-1 text-slate-700 font-mono text-xs py-1 cursor-pointer"
            >
              <span>Min {item.lowStockThreshold} units</span>
              <Edit className="w-3.5 h-3.5 text-amber-600" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuickEmergencyRestock(item)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white active:bg-amber-50 text-slate-700 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
            <span>+15 Sync</span>
          </button>
          <button
            onClick={() => handleTogglePublishAppliance(item)}
            className={`px-3 py-2 rounded-lg text-xs font-bold border cursor-pointer ${
              item.published
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-100 text-slate-600 border-slate-300"
            }`}
          >
            {item.published ? "Published" : "Hidden"}
          </button>
        </div>
      </div>
    </div>
  );
}
