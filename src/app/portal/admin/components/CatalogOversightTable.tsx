import React, { useState } from "react";
import { Search, Zap, Edit, RefreshCw } from "lucide-react";
import { ApplianceItem } from "../types";
import { THEME } from "../theme";
import { formatTHB } from "../formatters";

interface CatalogOversightTableProps {
  appliances: ApplianceItem[];
  catalogSearch: string;
  onCatalogSearchChange: (val: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (val: string) => void;
  onSaveSafetyThreshold: (item: ApplianceItem, newThreshold: number) => void;
  onQuickEmergencyRestock: (item: ApplianceItem) => void;
  onTogglePublishAppliance: (item: ApplianceItem) => void;
}

export function CatalogOversightTable({
  appliances,
  catalogSearch,
  onCatalogSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  onSaveSafetyThreshold,
  onQuickEmergencyRestock,
  onTogglePublishAppliance,
}: CatalogOversightTableProps) {
  const [editingThresholdId, setEditingThresholdId] = useState<string | null>(
    null
  );
  const [tempThresholdValue, setTempThresholdValue] = useState<number>(10);

  const handleConfirmThreshold = (item: ApplianceItem) => {
    onSaveSafetyThreshold(item, tempThresholdValue);
    setEditingThresholdId(null);
  };

  return (
    <section className={`${THEME.colors.surface} overflow-hidden`}>
      {/* Catalog Header */}
      <div className="p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900">
              Master Appliance Catalog & Safety Stock Oversight
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-300">
              {appliances.length} SKUs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit Sales pricing & Warehouse unit counts. Override low-stock thresholds or storefront publication status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => onCatalogSearchChange(e.target.value)}
              placeholder="Filter SKU, BTU, Wattage..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="All">All Appliance Categories</option>
            <option value="Climate Control">Climate Control</option>
            <option value="Refrigeration">Refrigeration</option>
            <option value="Laundry Systems">Laundry Systems</option>
            <option value="Smart Home & Robotics">Smart Home & Robotics</option>
            <option value="Air Purification">Air Purification</option>
            <option value="Kitchen Power">Kitchen Power</option>
          </select>
        </div>
      </div>

      {/* Master Catalog Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-5">Appliance & Model SKU</th>
              <th className="py-3.5 px-4">Wattage / Inverter Spec</th>
              <th className="py-3.5 px-4">Energy Star Status</th>
              <th className="py-3.5 px-4">Selling Price (THB)</th>
              <th className="py-3.5 px-4">Warehouse Units</th>
              <th className="py-3.5 px-4">Safety Threshold</th>
              <th className="py-3.5 px-5 text-right">Admin Oversight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {appliances.map((item) => {
              const isOut = item.stockUnits === 0;
              const isLow =
                !isOut && item.stockUnits <= item.lowStockThreshold;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* Product Thumbnail & Name */}
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
                          <strong className="text-slate-700">{item.sku}</strong>{" "}
                          • {item.category} • S/N Prefix: {item.serialPrefix}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Wattage / Inverter */}
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-mono text-[11px] font-semibold">
                      {item.wattageOrInverter}
                    </span>
                  </td>

                  {/* Energy Star Status */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] border ${THEME.colors.hardwareStatus.energyStar}`}
                    >
                      {item.energyStarRating}
                    </span>
                  </td>

                  {/* Selling Price THB */}
                  <td className="py-4 px-4 font-mono font-extrabold text-sm text-slate-900">
                    {formatTHB(item.priceTHB)}
                  </td>

                  {/* Current Warehouse Units */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                          isOut
                            ? THEME.colors.hardwareStatus.critical
                            : isLow
                            ? THEME.colors.hardwareStatus.warning
                            : THEME.colors.hardwareStatus.normal
                        }`}
                      >
                        {isOut ? "0 Out-of-Stock" : `${item.stockUnits} Units`}
                      </span>
                    </div>
                  </td>

                  {/* Safety Threshold Override */}
                  <td className="py-4 px-4">
                    {editingThresholdId === item.id ? (
                      <div className="inline-flex items-center gap-1.5">
                        <input
                          type="number"
                          min={1}
                          value={tempThresholdValue}
                          onChange={(e) =>
                            setTempThresholdValue(Number(e.target.value))
                          }
                          className="w-16 px-2 py-1 border border-amber-400 rounded-lg text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleConfirmThreshold(item)}
                          className="px-2 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
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

                  {/* Storefront Publication & Emergency Restock */}
                  <td className="py-4 px-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onQuickEmergencyRestock(item)}
                        title="Emergency +15 Unit Warehouse Sync"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 text-slate-700 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3 text-amber-600" />
                        <span>+15 Sync</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onTogglePublishAppliance(item)}
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
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}