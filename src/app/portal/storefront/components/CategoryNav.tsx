import { Zap } from "lucide-react";
import { CATEGORIES } from "../mockData";
import type { ProductFiltersApi } from "../types";

interface CategoryNavProps {
  filters: ProductFiltersApi;
}

export default function CategoryNav({ filters }: CategoryNavProps) {
  const { selectedCategory, setSelectedCategory } = filters;

  return (
    <nav
      aria-label="Appliance Categories"
      className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`snap-start shrink-0 min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-2 active:scale-95 transition-all duration-150 ${
                isActive
                  ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-500/60 hover:bg-amber-50/40"
              }`}
            >
              <Zap
                className={`w-3.5 h-3.5 ${
                  isActive ? "fill-slate-950 text-slate-950" : "text-amber-600"
                }`}
              />
              <span>{cat.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-md font-bold ${
                  isActive
                    ? "bg-slate-950/15 text-slate-950"
                    : "bg-slate-200/80 text-slate-600"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
