import { X } from "lucide-react";
import type { CatalogAppliance } from "../types";
import { formatTHB } from "../utils";

interface PromoModalProps {
  promoTargetAppliance: CatalogAppliance;
  customPromoPercent: number;
  setCustomPromoPercent: (percent: number) => void;
  onClose: () => void;
  onApply: (percentOff: number) => void;
}

export default function PromoModal({
  promoTargetAppliance,
  customPromoPercent,
  setCustomPromoPercent,
  onClose,
  onApply,
}: PromoModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold">
              1-TAP CAMPAIGN PRICING
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-1">
              Launch Promo on {promoTargetAppliance.sku}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1">
              {promoTargetAppliance.name}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onClose()}
            className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block">Current Selling Price</span>
            <strong className="text-sm font-extrabold text-slate-900">
              {formatTHB(promoTargetAppliance.priceTHB)}
            </strong>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">Compare-at MSRP</span>
            <strong className="text-sm font-bold text-slate-600">
              {formatTHB(promoTargetAppliance.originalPriceTHB)}
            </strong>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select Instant Campaign Discount Tier:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[10, 15, 20].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => onApply(pct)}
                className="min-h-[44px] py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs flex flex-col items-center justify-center active:scale-95 transition-all"
              >
                <span>-{pct}% OFF</span>
                <span className="text-[10px] font-medium text-rose-600">
                  {formatTHB(
                    Math.round(
                      (promoTargetAppliance.originalPriceTHB * (100 - pct)) / 10
                    ) * 10
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Promo Percentage Input */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Custom Discount (%)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={customPromoPercent}
              onChange={(e) =>
                setCustomPromoPercent(
                  Math.min(60, Math.max(1, Number(e.target.value) || 5))
                )
              }
              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900"
            />
          </div>
          <button
            type="button"
            onClick={() => onApply(customPromoPercent)}
            className="mt-5 min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs active:scale-95 transition-all"
          >
            Apply -{customPromoPercent}%
          </button>
        </div>

        <button
          type="button"
          onClick={() => onApply(0)}
          className="w-full min-h-[44px] py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold"
        >
          Clear Promo &amp; Restore Standard MSRP
        </button>
      </div>
    </div>
  );
}
