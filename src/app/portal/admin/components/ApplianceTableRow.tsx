import type { Dispatch, SetStateAction } from "react";
import { Edit, Zap, RefreshCw } from "lucide-react";
import { THEME } from "../theme";
import type { ApplianceItem } from "../types";
import { formatTHB } from "../utils";

interface ApplianceTableRowProps {
  item: ApplianceItem;
  editingThresholdId: string | null;
  setEditingThresholdId: Dispatch<SetStateAction<string | null>>;
  tempThresholdValue: number;
  setTempThresholdValue: Dispatch<SetStateAction<number>>;
  handleTogglePublishAppliance: (item: ApplianceItem) => void;
  handleSaveSafetyThreshold: (item: ApplianceItem) => void;
  handleQuickEmergencyRestock: (item: ApplianceItem) => void;
}

export default function ApplianceTableRow({
  item,
  editingThresholdId,
  setEditingThresholdId,
  tempThresholdValue,
  setTempThresholdValue,
  handleTogglePublishAppliance,
  handleSaveSafetyThreshold,
  handleQuickEmergencyRestock,
}: ApplianceTableRowProps) {
  const isOut = item.stockUnits === 0;
  const isLow =
    !isOut && item.stockUnits <= item.lowStockThreshold;

  return (
    <tr
      className="hover:bg-slate-50/80 transition-colors"
    >
      <td className="py-4 px-5">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.thumbnailBg} text-white flex flex-col items-center justify-center shrink-0 shadow-xs`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span className="text-[9px] font-mono font-bold mt-0.5">
              {item.sku.split("-")[1]}
            </span>
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">
              {item.name}
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-0.5">
              SKU:{" "}
              <strong className="text-slate-700">
                {item.sku}
              </strong>{" "}
              • {item.category} • S/N Prefix:{" "}
              {item.serialPrefix}
            </div>
          </div>
        </div>
      </td>

      <td className="py-4 px-4">
        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-mono text-[11px] font-semibold">
          {item.wattageOrInverter}
        </span>
      </td>

      <td className="py-4 px-4">
        <span
          className={`px-2.5 py-1 rounded-md text-[11px] border ${THEME.colors.hardwareStatus.energyStar}`}
        >
          {item.energyStarRating}
        </span>
      </td>

      <td className="py-4 px-4 font-mono font-extrabold text-sm text-slate-900">
        {formatTHB(item.priceTHB)}
      </td>

      <td className="py-4 px-4">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
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
      </td>

      <td className="py-4 px-4">
        {editingThresholdId === item.id ? (
          <div className="inline-flex items-center gap-1.5">
            <input
              type="number"
              min={1}
              value={tempThresholdValue}
              onChange={(e) =>
                setTempThresholdValue(
                  Number(e.target.value)
                )
              }
              className="w-16 px-2 py-1 border border-amber-400 rounded-lg text-xs font-mono"
            />
            <button
              onClick={() =>
                handleSaveSafetyThreshold(item)
              }
              className="px-2 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] cursor-pointer"
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
            className="inline-flex items-center gap-1.5 text-slate-700 hover:text-amber-600 font-mono text-xs cursor-pointer"
          >
            <span>Min {item.lowStockThreshold} units</span>
            <Edit className="w-3 h-3 opacity-70" />
          </button>
        )}
      </td>

      <td className="py-4 px-5 text-right">
        <div className="inline-flex items-center gap-2">
          <button
            onClick={() =>
              handleQuickEmergencyRestock(item)
            }
            title="Emergency +15 Unit Warehouse Sync"
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 text-slate-700 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-amber-600" />
            <span>+15 Sync</span>
          </button>

          <button
            onClick={() =>
              handleTogglePublishAppliance(item)
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-colors ${
              item.published
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
            }`}
          >
            {item.published ? "Published" : "Hidden"}
          </button>
        </div>
      </td>
    </tr>
  );
}
