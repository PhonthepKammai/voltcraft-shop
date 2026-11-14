import { ChevronRight } from "lucide-react";
import type { CartCalculations } from "../types";

interface MobileCartBarProps {
  totalCartItems: number;
  cartCalculations: CartCalculations;
  onOpenCart: () => void;
}

export default function MobileCartBar({ totalCartItems, cartCalculations, onOpenCart }: MobileCartBarProps) {
  return (
    <div className="fixed bottom-3 inset-x-4 sm:hidden z-30">
      <button
        onClick={onOpenCart}
        className="w-full min-h-[52px] px-4 py-3 rounded-2xl bg-slate-950 text-white border border-amber-500/40 shadow-xl flex items-center justify-between active:scale-95 transition-transform"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center">
            {totalCartItems}
          </span>
          <div className="text-left">
            <p className="text-xs font-bold leading-none">View Direct Dispatch Cart</p>
            <p className="text-[10px] text-amber-400 mt-0.5">
              Includes 5-Yr Warranty &amp; Install Options
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 font-extrabold text-sm text-amber-400">
          <span>${cartCalculations.finalTotalUSD.toLocaleString()}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
}
