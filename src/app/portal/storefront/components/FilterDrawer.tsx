import { SlidersHorizontal, X, Check, ArrowRight } from "lucide-react";
import { formatTHB } from "../utils";
import type { ProductFiltersApi, WattageTier } from "../types";

interface FilterDrawerProps {
  filters: ProductFiltersApi;
}

export default function FilterDrawer({ filters }: FilterDrawerProps) {
  const {
    setIsFilterDrawerOpen,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    wattageTier,
    setWattageTier,
    onlyEnergyStar,
    setOnlyEnergyStar,
    onlyInverter,
    setOnlyInverter,
    onlySmartWifi,
    setOnlySmartWifi,
    onlyUltraQuiet,
    setOnlyUltraQuiet,
    resetAllFilters,
    filteredProducts,
  } = filters;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => setIsFilterDrawerOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-slate-200 max-h-[88vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold">Technical Specs &amp; Filter Lab</h3>
              <p className="text-[11px] text-slate-400">
                Refine by power draw, inverter architecture, and price
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFilterDrawerOpen(false)}
            className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* 1. Price Range Dual Inputs & Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Price Range (USD / THB Equivalent)
              </label>
              <span className="text-xs font-extrabold text-amber-600">
                ${minPrice} – ${maxPrice} ({formatTHB(maxPrice)})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Min Price ($)</span>
                <input
                  type="number"
                  min={0}
                  max={maxPrice}
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(Math.min(Number(e.target.value) || 0, maxPrice))
                  }
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Max Price ($)</span>
                <input
                  type="number"
                  min={minPrice}
                  max={2000}
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(Math.max(Number(e.target.value) || 0, minPrice))
                  }
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <input
              type="range"
              min={150}
              max={1500}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* 2. Wattage / Power Consumption Tiers */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Wattage / Power Consumption Tier
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  "All",
                  "Low (<500W)",
                  "Medium (500W-1500W)",
                  "High (>1500W)",
                ] as WattageTier[]
              ).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setWattageTier(tier)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-bold text-left flex items-center justify-between active:scale-95 transition-all ${
                    wattageTier === tier
                      ? "bg-amber-50 text-amber-900 border-amber-500 ring-1 ring-amber-500"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{tier}</span>
                  {wattageTier === tier && <Check className="w-4 h-4 text-amber-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Energy Saving & Engineering Features Checkboxes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Certifications &amp; Hardware Features
            </label>
            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-amber-400">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    5-Star Energy Saving Certified (Label No.5)
                  </p>
                  <p className="text-xs text-slate-500">
                    Maximum kWh efficiency certified for continuous duty
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={onlyEnergyStar}
                  onChange={(e) => setOnlyEnergyStar(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-amber-400">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Inverter-Driven Compressor / Motor
                  </p>
                  <p className="text-xs text-slate-500">
                    Variable frequency drive with 5-year direct warranty
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={onlyInverter}
                  onChange={(e) => setOnlyInverter(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-amber-400">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Smart Wi-Fi VoltCraft App Telemetry
                  </p>
                  <p className="text-xs text-slate-500">
                    Remote scheduling, kWh power meter, and diagnostics
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={onlySmartWifi}
                  onChange={(e) => setOnlySmartWifi(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-amber-400">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Ultra-Quiet Acoustic Mode (&lt;50dB)
                  </p>
                  <p className="text-xs text-slate-500">
                    Whisper-quiet acoustic dampening for bedrooms &amp; studies
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={onlyUltraQuiet}
                  onChange={(e) => setOnlyUltraQuiet(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Drawer Footer CTAs */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
          <button
            type="button"
            onClick={resetAllFilters}
            className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-100 active:scale-95 transition-all"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(false)}
            className="flex-1 min-h-[44px] py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
          >
            <span>Apply Filters ({filteredProducts.length} Units)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
