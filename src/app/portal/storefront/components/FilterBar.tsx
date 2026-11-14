import { Zap, SlidersHorizontal, ShieldCheck } from "lucide-react";
import { VOLTCRAFT_PRODUCTS } from "../mockData";
import type { ProductFiltersApi, SortOption } from "../types";
import ActiveFilterChips from "./ActiveFilterChips";

interface FilterBarProps {
  filters: ProductFiltersApi;
}

export default function FilterBar({ filters }: FilterBarProps) {
  const {
    setIsFilterDrawerOpen,
    activeFilterCount,
    onlyInverter,
    setOnlyInverter,
    onlyEnergyStar,
    setOnlyEnergyStar,
    filteredProducts,
    sortBy,
    setSortBy,
  } = filters;

  return (
    <section className="px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2.5 shadow-sm">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Bottom-Sheet Filter Drawer Trigger */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 active:scale-95 transition-all duration-150"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Filters &amp; Specs</span>
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Quick Spec Toggle Pills on Desktop/Tablet */}
            <button
              onClick={() => setOnlyInverter((prev) => !prev)}
              className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all duration-150 ${
                onlyInverter
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              Inverter Only
            </button>

            <button
              onClick={() => setOnlyEnergyStar((prev) => !prev)}
              className={`hidden sm:inline-flex min-h-[44px] px-3 py-2 rounded-xl border text-xs font-semibold items-center gap-1.5 active:scale-95 transition-all duration-150 ${
                onlyEnergyStar
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Energy No.5 Certified
            </button>
          </div>

          {/* Right Side: Result Count + Sort Selector */}
          <div className="flex items-center gap-2.5 ml-auto">
            <span className="text-xs font-medium text-slate-500 hidden md:inline">
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of{" "}
              {VOLTCRAFT_PRODUCTS.length} units
            </span>

            <div className="flex items-center gap-1.5">
              <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 sr-only">
                Sort By
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="featured">Sort: Featured Specs</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Lab Rated</option>
              </select>
            </div>
          </div>
        </div>

        <ActiveFilterChips filters={filters} />
      </div>
    </section>
  );
}
