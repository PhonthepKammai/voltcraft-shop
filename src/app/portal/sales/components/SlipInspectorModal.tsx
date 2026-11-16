import { CheckCircle2, Phone, X } from "lucide-react";
import type { SalesOrder } from "../types";
import { formatTHB } from "../utils";

interface SlipInspectorModalProps {
  inspectingSlipOrder: SalesOrder;
  onClose: () => void;
  onApprove: (order: SalesOrder) => void;
}

export default function SlipInspectorModal({ inspectingSlipOrder, onClose, onApprove }: SlipInspectorModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-slate-200 overflow-hidden shadow-2xl"
      >
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold">
              {inspectingSlipOrder.orderRef} • PAYMENT PROOF
            </span>
            <h3 className="text-sm font-bold">
              {inspectingSlipOrder.paymentMethod}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onClose()}
            className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 relative">
            <img
              src={inspectingSlipOrder.slipImageUrl}
              alt="Customer payment slip"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 inset-x-3 bg-slate-950/85 backdrop-blur-sm text-white p-3 rounded-xl border border-slate-700 text-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-amber-400">
                  {inspectingSlipOrder.slipBankName}
                </p>
                <p className="text-[11px] text-slate-300 font-mono">
                  Ref: {inspectingSlipOrder.paymentReference} •{" "}
                  {inspectingSlipOrder.slipTransferredTime}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">
                  Slip Amount
                </span>
                <span className="text-sm font-extrabold text-emerald-400">
                  {formatTHB(inspectingSlipOrder.totalAmountTHB)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block">Customer</span>
              <strong className="text-slate-900 font-bold">
                {inspectingSlipOrder.customerName} ({inspectingSlipOrder.customerPhone})
              </strong>
            </div>
            <a
              href={`tel:${inspectingSlipOrder.customerPhone.replace(/[^0-9+]/g, "")}`}
              className="min-h-[40px] px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900 flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              Call Customer
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onApprove(inspectingSlipOrder)}
              className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
              <span>Verify Slip &amp; Route to Warehouse</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
