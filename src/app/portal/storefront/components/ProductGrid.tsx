import { SlidersHorizontal } from "lucide-react";
import type React from "react";
import type { ApplianceProduct } from "../types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: ApplianceProduct[];
  wishlistIds: string[];
  addingProductId: string | null;
  addedSuccessId: string | null;
  onResetFilters: () => void;
  onQuickView: (product: ApplianceProduct) => void;
  onToggleWishlist: (productId: string, e?: React.MouseEvent) => void;
  onAddToCart: (
    product: ApplianceProduct,
    withInstall?: boolean,
    withHaulAway?: boolean,
    e?: React.MouseEvent
  ) => void;
}

export default function ProductGrid({
  products,
  wishlistIds,
  addingProductId,
  addedSuccessId,
  onResetFilters,
  onQuickView,
  onToggleWishlist,
  onAddToCart,
}: ProductGridProps) {
  return (
    <main className="px-4 py-3">
      <div className="max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center my-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              No VoltCraft Appliances Match Your Exact Spec Filter
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
              Try broadening your wattage tier, adjusting the price range, or clearing active
              technical filters.
            </p>
            <button
              onClick={onResetFilters}
              className="mt-5 min-h-[44px] px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm active:scale-95 transition-all"
            >
              Reset Technical Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                isAdding={addingProductId === product.id}
                isAdded={addedSuccessId === product.id}
                onQuickView={onQuickView}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
