import { DEFAULT_MAX_PRICE } from "../constants";
import type { ProductFiltersApi } from "../types";
import FilterChip from "./ui/FilterChip";

interface ActiveFilterChipsProps {
  filters: ProductFiltersApi;
}

export default function ActiveFilterChips({ filters }: ActiveFilterChipsProps) {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    wattageTier,
    setWattageTier,
    onlyInverter,
    setOnlyInverter,
    onlyEnergyStar,
    setOnlyEnergyStar,
    onlySmartWifi,
    setOnlySmartWifi,
    onlyUltraQuiet,
    setOnlyUltraQuiet,
    onlyWishlist,
    setOnlyWishlist,
    resetAllFilters,
    activeFilterCount,
  } = filters;

  if (!(activeFilterCount > 0 || selectedCategory !== "All" || searchQuery)) return null;

  return (
    <div className="mt-3 flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-slate-500">Active Specs:</span>

      {selectedCategory !== "All" && (
        <FilterChip onRemove={() => setSelectedCategory("All")}>
          Category: {selectedCategory}
        </FilterChip>
      )}

      {searchQuery && (
        <FilterChip onRemove={() => setSearchQuery("")}>
          Search: &ldquo;{searchQuery}&rdquo;
        </FilterChip>
      )}

      {(minPrice > 0 || maxPrice < DEFAULT_MAX_PRICE) && (
        <FilterChip
          onRemove={() => {
            setMinPrice(0);
            setMaxPrice(DEFAULT_MAX_PRICE);
          }}
        >
          ${minPrice} - ${maxPrice}
        </FilterChip>
      )}

      {wattageTier !== "All" && (
        <FilterChip onRemove={() => setWattageTier("All")}>Power: {wattageTier}</FilterChip>
      )}

      {onlyInverter && (
        <FilterChip tone="emerald" onRemove={() => setOnlyInverter(false)}>
          Inverter Driven
        </FilterChip>
      )}

      {onlyEnergyStar && (
        <FilterChip tone="emerald" onRemove={() => setOnlyEnergyStar(false)}>
          5-Star Energy Label
        </FilterChip>
      )}

      {onlySmartWifi && (
        <FilterChip tone="blue" onRemove={() => setOnlySmartWifi(false)}>
          VoltCraft Smart App
        </FilterChip>
      )}

      {onlyUltraQuiet && (
        <FilterChip tone="blue" onRemove={() => setOnlyUltraQuiet(false)}>
          Ultra-Quiet (&lt;50dB)
        </FilterChip>
      )}

      {onlyWishlist && (
        <FilterChip tone="rose" onRemove={() => setOnlyWishlist(false)}>
          Saved Wishlist Only
        </FilterChip>
      )}

      <button
        onClick={resetAllFilters}
        className="text-xs font-bold text-amber-600 hover:text-amber-700 underline ml-1 py-1"
      >
        Reset All
      </button>
    </div>
  );
}
