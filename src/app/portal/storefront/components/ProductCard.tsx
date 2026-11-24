import { Zap, ShoppingBag, Heart, Star, Wrench, Check, Eye } from "lucide-react";
import type React from "react";
import type { ApplianceProduct } from "../types";

interface ProductCardProps {
  product: ApplianceProduct;
  isWishlisted: boolean;
  isAdding: boolean;
  isAdded: boolean;
  onQuickView: (product: ApplianceProduct) => void;
  onToggleWishlist: (productId: string, e?: React.MouseEvent) => void;
  onAddToCart: (
    product: ApplianceProduct,
    withInstall?: boolean,
    withHaulAway?: boolean,
    e?: React.MouseEvent
  ) => void;
}

export default function ProductCard({
  product,
  isWishlisted,
  isAdding,
  isAdded,
  onQuickView,
  onToggleWishlist,
  onAddToCart,
}: ProductCardProps) {
  return (
    <article
      onClick={() => onQuickView(product)}
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-amber-500/60 transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Fixed Aspect Ratio Image Container with Badge Overlays */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top-Right Instant Favorite Heart Button (44x44px touch target) */}
        <button
          type="button"
          onClick={(e) => onToggleWishlist(product.id, e)}
          aria-label={`Save ${product.name} to wishlist`}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-slate-700 hover:text-rose-600 active:scale-95 transition-all shadow-sm"
        >
          <Heart
            className={`w-5 h-5 ${
              isWishlisted ? "fill-rose-500 text-rose-500" : ""
            }`}
          />
        </button>

        {/* Bottom-Left Service Assurance Pill + Quick-View Indicator */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-end">

          <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm text-white text-[11px] font-medium flex items-center gap-1">
            <Eye className="w-3 h-3 text-amber-400" />
            Specs
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Model Code */}
          <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-500 mb-1">
            <span>{product.categoryName}</span>
            <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
              {product.sku}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Technical Specs Micro-Bar */}
          <div className="mt-3 grid grid-cols-3 gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl p-2 text-center">
            <div className="px-1">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">
                Output
              </p>
              <p className="text-[11px] font-bold text-slate-900 truncate">
                {product.name}
              </p>
            </div>
            <div className="px-1 border-x border-slate-200">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">
                Drive
              </p>
              <p className="text-[11px] font-bold text-emerald-700 truncate">
                {"PID Thermal"}
              </p>
            </div>
            <div className="px-1">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">
                Power
              </p>
              <p className="text-[11px] font-bold text-slate-900 truncate">
                {product.wattage}W Max
              </p>
            </div>
          </div>

          {/* Star Ratings & Energy Star Badge */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span className="text-xs font-bold text-slate-900">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">
                ({product.reviewsCount})
              </span>
            </div>

            {product.energyStar && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                ★ Energy No.5
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Touch-Friendly Add to Cart CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                  ฿{product.price.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="line-through">
                  ฿{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-rose-600 font-semibold">
                  Save ฿{product.originalPrice - product.price}
                </span>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              In Stock
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => onAddToCart(product, false, false, e)}
            disabled={isAdding}
            className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all duration-150 shadow-sm ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950"
            }`}
          >
            {isAdding ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Allocating Unit...
              </span>
            ) : isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Added to Direct Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
