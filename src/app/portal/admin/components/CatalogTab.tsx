import type { Dispatch, SetStateAction } from "react";
import { Search } from "lucide-react";
import { THEME } from "../theme";
import type { ApplianceItem } from "../types";
import ApplianceMobileCard from "./ApplianceMobileCard";
import ApplianceTableRow from "./ApplianceTableRow";

interface CatalogTabProps {
  catalogSearch: string;
  setCatalogSearch: Dispatch<SetStateAction<string>>;
  categoryFilter: string;
  setCategoryFilter: Dispatch<SetStateAction<string>>;
  filteredAppliances: ApplianceItem[];
  editingThresholdId: string | null;
  setEditingThresholdId: Dispatch<SetStateAction<string | null>>;
  tempThresholdValue: number;
  setTempThresholdValue: Dispatch<SetStateAction<number>>;
  handleTogglePublishAppliance: (item: ApplianceItem) => void;
  handleSaveSafetyThreshold: (item: ApplianceItem) => void;
  handleQuickEmergencyRestock: (item: ApplianceItem) => void;
}

export default function CatalogTab({
  catalogSearch,
  setCatalogSearch,
  categoryFilter,
  setCategoryFilter,
  filteredAppliances,
  editingThresholdId,
  setEditingThresholdId,
  tempThresholdValue,
  setTempThresholdValue,
  handleTogglePublishAppliance,
  handleSaveSafetyThreshold,
  handleQuickEmergencyRestock,
}: CatalogTabProps) {
  return (
    <section className={`${THEME.colors.surface} overflow-hidden`}>
      {/* Catalog Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Master Appliance Catalog & Stock Oversight
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-300">
              {filteredAppliances.length} SKUs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Audit Sales pricing & Warehouse unit counts. Override low-stock thresholds or publication status.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Filter SKU, BTU, Wattage..."
              className="w-full pl-8 pr-3 py-2.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 sm:py-2 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="All">All Appliance Categories</option>
            <option value="Climate Control">Climate Control</option>
            <option value="Refrigeration">Refrigeration</option>
            <option value="Laundry Systems">Laundry Systems</option>
            <option value="Smart Home & Robotics">
              Smart Home & Robotics
            </option>
            <option value="Air Purification">Air Purification</option>
            <option value="Kitchen Power">Kitchen Power</option>
          </select>
        </div>
      </div>

      {/* MOBILE CATALOG CARDS (< lg) */}
      <div className="divide-y divide-slate-200 lg:hidden">
        {filteredAppliances.map((item) => (
          <ApplianceMobileCard
            key={item.id}
            item={item}
            editingThresholdId={editingThresholdId}
            setEditingThresholdId={setEditingThresholdId}
            tempThresholdValue={tempThresholdValue}
            setTempThresholdValue={setTempThresholdValue}
            handleTogglePublishAppliance={handleTogglePublishAppliance}
            handleSaveSafetyThreshold={handleSaveSafetyThreshold}
            handleQuickEmergencyRestock={handleQuickEmergencyRestock}
          />
        ))}
      </div>

      {/* DESKTOP MASTER CATALOG TABLE (>= lg) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-5">Appliance & Model SKU</th>
              <th className="py-3.5 px-4">Wattage / Inverter Spec</th>
              <th className="py-3.5 px-4">Energy Star Status</th>
              <th className="py-3.5 px-4">Selling Price (THB)</th>
              <th className="py-3.5 px-4">Warehouse Units</th>
              <th className="py-3.5 px-4">Safety Threshold</th>
              <th className="py-3.5 px-5 text-right">
                Admin Oversight
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {filteredAppliances.map((item) => (
              <ApplianceTableRow
                key={item.id}
                item={item}
                editingThresholdId={editingThresholdId}
                setEditingThresholdId={setEditingThresholdId}
                tempThresholdValue={tempThresholdValue}
                setTempThresholdValue={setTempThresholdValue}
                handleTogglePublishAppliance={handleTogglePublishAppliance}
                handleSaveSafetyThreshold={handleSaveSafetyThreshold}
                handleQuickEmergencyRestock={handleQuickEmergencyRestock}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
