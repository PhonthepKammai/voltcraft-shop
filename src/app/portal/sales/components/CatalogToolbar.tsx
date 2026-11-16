import { Tag, Search, Plus, X } from "lucide-react";
import { CATEGORIES } from "../mockData";
import type { ApplianceCategory, CatalogAppliance } from "../types";

interface CatalogToolbarProps {
  catalog: CatalogAppliance[];
  catalogCategory: ApplianceCategory;
  setCatalogCategory: (category: ApplianceCategory) => void;
  catalogSearchQuery: string;
  setCatalogSearchQuery: (query: string) => void;
  onlyPromoItems: boolean;
  setOnlyPromoItems: (updater: (prev: boolean) => boolean) => void;
  onNewAppliance: () => void;
}

export default function CatalogToolbar({
  catalog,
  catalogCategory,
  setCatalogCategory,
  catalogSearchQuery,
  setCatalogSearchQuery,
  onlyPromoItems,
  setOnlyPromoItems,
  onNewAppliance,
}: CatalogToolbarProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={catalogSearchQuery}
            onChange={(e) => setCatalogSearchQuery(e.target.value)}
            placeholder="Search catalog by Model Name, SKU (e.g. VC-AC-12K), or Category..."
            className="w-full h-11 pl-10 pr-9 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
          />
          {catalogSearchQuery && (
            <button
              type="button"
              onClick={() => setCatalogSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlyPromoItems((prev) => !prev)}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all duration-150 ${
              onlyPromoItems
                ? "bg-rose-50 text-rose-600 border-rose-200"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Active Promo Only</span>
          </button>

          <button
            type="button"
            onClick={onNewAppliance}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition-all duration-150 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add SKU</span>
          </button>
        </div>
      </div>

      {/* Category Quick-Filter Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {CATEGORIES.map((category) => {
          const isSelected = catalogCategory === category;
          const count =
            category === "All"
              ? catalog.length
              : catalog.filter((c) => c.category === category).length;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setCatalogCategory(category)}
              className={`shrink-0 min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 active:scale-95 transition-all duration-150 ${
                isSelected
                  ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>{category}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[11px] font-extrabold ${
                  isSelected
                    ? "bg-slate-950/15 text-slate-950"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>

  );
}
