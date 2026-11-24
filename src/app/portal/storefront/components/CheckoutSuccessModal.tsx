import { ShieldCheck } from "lucide-react";
import type { CartCalculations } from "../types";

interface CheckoutSuccessModalProps {
  cartCalculations: CartCalculations;
  onClose: () => void;
  onComplete: () => void;
}

export default function CheckoutSuccessModal({ cartCalculations, onClose, onComplete }: CheckoutSuccessModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-md w-full rounded-2xl border border-slate-200 p-6 text-center shadow-2xl"
      >
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold">
          VOLTCRAFT DIRECT DISPATCH LOCKED
        </span>
        <h3 className="text-xl font-extrabold text-slate-900 mt-2">
          Appliance Serial &amp; Technician Slot Reserved
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Your order total of{" "}
          <strong className="text-slate-900">
            ${cartCalculations.finalTotalUSD.toLocaleString()} (
          </strong>{" "}
          is ready for dispatch with digital warranty registration and white-glove fleet
          scheduling.
        </p>
        <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-3 text-left text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Dispatch Warehouse:</span>
            <span className="font-bold text-slate-900">VoltCraft Central Lab #04</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Pro Installation Units:</span>
            <span className="font-bold text-emerald-700">
              {cartCalculations.installCount} Scheduled
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Compressor/Motor Coverage:</span>
            <span className="font-bold text-blue-700">5-Year Direct Replacement</span>
          </div>
        </div>
        <button
          onClick={onComplete}
          className="mt-5 w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm active:scale-95 transition-all"
        >
          Complete Order &amp; Return to Storefront
        </button>
      </div>
    </div>
  );
}
