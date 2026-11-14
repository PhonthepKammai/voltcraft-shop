import { Zap, Search, ShoppingBag, Heart, X } from "lucide-react";
import type { ProductFiltersApi } from "../types";

interface HeaderProps {
  filters: ProductFiltersApi;
  wishlistCount: number;
  totalCartItems: number;
  onOpenCart: () => void;
}

export default function Header({ filters, wishlistCount, totalCartItems, onOpenCart }: HeaderProps) {
  const {
    searchQuery,
    setSearchQuery,
    mobileSearchOpen,
    setMobileSearchOpen,
    onlyWishlist,
    setOnlyWishlist,
    resetAllFilters,
  } = filters;

  return (
    <header className="bg-slate-950 text-white px-4 py-3 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <button
          onClick={resetAllFilters}
          className="flex items-center gap-2.5 text-left group focus:outline-none min-h-[44px]"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-active:scale-95 transition-transform duration-150">
            <Zap className="w-6 h-6 fill-slate-950 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white">
                Volt<span className="text-amber-500">Craft</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                LABS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block leading-none mt-0.5">
              Precision Home Electrical &amp; Inverter Systems
            </p>
          </div>
        </button>

        {/* Desktop / Tablet Persistent Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search BTU, Inverter, HEPA, Model code (e.g. VC-ACP12K)..."
              className="w-full h-11 pl-10 pr-9 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile & Desktop Quick Action Icons (44x44px min touch targets) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile Search Trigger */}
          <button
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            aria-label="Toggle search bar"
            className={`md:hidden min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center active:scale-95 transition-all duration-150 ${
              mobileSearchOpen || searchQuery
                ? "bg-amber-500/20 border-amber-500 text-amber-400"
                : "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Filter Toggle */}
          <button
            onClick={() => setOnlyWishlist((prev) => !prev)}
            aria-label="Toggle Saved Appliances"
            className={`relative min-w-[44px] min-h-[44px] px-3 rounded-xl border flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-150 ${
              onlyWishlist
                ? "bg-amber-500 text-slate-950 border-amber-500 font-semibold"
                : "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                onlyWishlist
                  ? "fill-slate-950 text-slate-950"
                  : wishlistCount > 0
                  ? "fill-rose-500 text-rose-500"
                  : ""
              }`}
            />
            <span className="text-xs font-bold">{wishlistCount}</span>
          </button>

          {/* Slide-Over Cart Trigger */}
          <button
            onClick={onOpenCart}
            aria-label="Open appliance cart"
            className="relative min-w-[44px] min-h-[44px] px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition-all duration-150"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            <span className="hidden sm:inline text-sm font-bold">Cart</span>
            <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-slate-950 text-amber-400 text-xs font-extrabold">
              {totalCartItems}
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Mobile Search Bar */}
      {(mobileSearchOpen || searchQuery) && (
        <div className="md:hidden pt-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by BTU, Wattage, Inverter, or Model..."
              autoFocus
              className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
