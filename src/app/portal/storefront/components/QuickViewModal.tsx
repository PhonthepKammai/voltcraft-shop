import { ShoppingBag, Star, Wrench, X } from "lucide-react";
import { INSTALLATION_FEE_THB, INSTALLATION_FEE_USD } from "../constants";
import type { ApplianceProduct } from "../types";

interface QuickViewModalProps {
  product: ApplianceProduct;
  onClose: () => void;
  onOpenCart: () => void;
  onAddToCart: (
    product: ApplianceProduct,
    withInstall?: boolean,
    withHaulAway?: boolean
  ) => void;
}

export default function QuickViewModal({ product, onClose, onOpenCart, onAddToCart }: QuickViewModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:max-w-3xl rounded-t-3xl sm:rounded-2xl border border-slate-200 max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-200"
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-slate-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-mono text-xs font-extrabold">
              {product.modelCode}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Engineering Spec Sheet &amp; Installation Requirements
            </span>
          </div>
          <button
            onClick={() => onClose()}
            aria-label="Close modal"
            className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Image & Badges */}
          <div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {product.badges.discount && (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-extrabold">
                    {product.badges.discount}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  {product.badges.tech}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Certification Pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {product.energyStar && (
                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  ✓ Energy Star No.5 Certified
                </span>
              )}
              <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                ✓ {product.warrantyYears}-Year Direct Factory Warranty
              </span>
              {product.smartWifi && (
                <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                  ✓ VoltCraft App Wi-Fi Control
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Full Technical Specs Table & Purchase Controls */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                {product.category}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                {product.name}
              </h2>

              {/* Rating & Price */}
              <div className="mt-3 flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 line-through">
                    MSRP ${product.originalPrice}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-bold text-slate-900">
                    {product.rating}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({product.reviewsCount} reviews)
                  </span>
                </div>
              </div>

              {/* Full Hardware Telemetry Table */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Hardware &amp; Electrical Specifications
                </h4>
                <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-200 text-xs">
                  <div className="py-2 px-3 flex justify-between">
                    <span className="text-slate-500">Dimensions (W x H x D)</span>
                    <span className="font-bold text-slate-900">
                      {product.dimensions}
                    </span>
                  </div>
                  <div className="py-2 px-3 flex justify-between">
                    <span className="text-slate-500">Rated Power Consumption</span>
                    <span className="font-bold text-slate-900">
                      {product.wattage}W ({product.primarySpec})
                    </span>
                  </div>
                  <div className="py-2 px-3 flex justify-between">
                    <span className="text-slate-500">Circuit Breaker Requirement</span>
                    <span className="font-bold text-slate-900">
                      {product.circuitBreaker}
                    </span>
                  </div>
                  <div className="py-2 px-3 flex justify-between">
                    <span className="text-slate-500">Operating Acoustic Noise</span>
                    <span className="font-bold text-emerald-700">
                      {product.noiseLevelDb} dB(A) Whisper Spec
                    </span>
                  </div>
                  <div className="py-2 px-3 flex justify-between">
                    <span className="text-slate-500">Shielded Power Cord Length</span>
                    <span className="font-bold text-slate-900">
                      {product.cordLengthM.toFixed(1)} Meters
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  onAddToCart(product, true, true);
                  onClose();
                  onOpenCart();
                }}
                className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
              >
                <Wrench className="w-4 h-4 stroke-[2.2]" />
                <span>
                  Add with Pro Installation (+${INSTALLATION_FEE_USD} / ฿
                  {INSTALLATION_FEE_THB})
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onAddToCart(product, false, false);
                  onClose();
                }}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Appliance Only (${product.price})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
