import { ShieldCheck, ChevronRight } from "lucide-react";
import type { CartCalculations } from "../types";

interface CartSummaryProps {
  totalCartItems: number;
  cartCalculations: CartCalculations;
  onCheckout: () => void;
}

export default function CartSummary({ totalCartItems, cartCalculations, onCheckout }: CartSummaryProps) {
  return (
    <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-3">
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Appliances Subtotal ({totalCartItems} units)</span>
          <span className="font-semibold text-slate-900">
            ${cartCalculations.subtotalUSD.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>
            Certified On-Site Setup ({cartCalculations.installCount}x)
          </span>
          <span className="font-semibold text-slate-900">
            {cartCalculations.addOnsUSD > 0
              ? `+$${cartCalculations.addOnsUSD.toLocaleString()}`
              : "$0"}
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>White-Glove Fleet Delivery</span>
          <span className="font-bold text-emerald-700">
            {cartCalculations.shippingUSD === 0
              ? "FREE"
              : `$${cartCalculations.shippingUSD}`}
          </span>
        </div>

        {cartCalculations.totalSavingsUSD > 0 && (
          <div className="flex justify-between text-rose-600 font-semibold">
            <span>Direct Factory Batch Savings</span>
            <span>-${cartCalculations.totalSavingsUSD.toLocaleString()}</span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
          <span className="text-sm font-extrabold text-slate-900">
            Final Total
          </span>
          <div className="text-right">
            <span className="text-lg font-extrabold text-slate-900">
              ${cartCalculations.finalTotalUSD.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
      >
        <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
        <span>Proceed to Secure Checkout</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
        Official VoltCraft Serial Warranty Lock &amp; 30-Day Home Trial
      </p>
    </div>
  );
}
