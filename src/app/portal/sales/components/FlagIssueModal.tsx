import { Phone, X, AlertTriangle } from "lucide-react";
import type { SalesOrder } from "../types";

interface FlagIssueModalProps {
  flaggingOrder: SalesOrder;
  flagIssueReason: string;
  setFlagIssueReason: (reason: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function FlagIssueModal({
  flaggingOrder,
  flagIssueReason,
  setFlagIssueReason,
  onClose,
  onConfirm,
}: FlagIssueModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Flag Order {flaggingOrder.orderRef}
              </h3>
              <p className="text-xs text-slate-500">
                Log payment discrepancy or installation contact hold
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onClose()}
            className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Sales Verification Hold Note:
          </label>
          <textarea
            rows={3}
            value={flagIssueReason}
            onChange={(e) => setFlagIssueReason(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={`tel:${flaggingOrder.customerPhone.replace(/[^0-9+]/g, "")}`}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <Phone className="w-4 h-4 text-amber-600" />
            <span>Call {flaggingOrder.customerPhone}</span>
          </a>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all"
          >
            Save Hold Status
          </button>
        </div>
      </div>
    </div>
  );
}
