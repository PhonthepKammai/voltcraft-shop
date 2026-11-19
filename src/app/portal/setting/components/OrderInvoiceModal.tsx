import type { Dispatch, SetStateAction } from "react";
import type { UserProfileData, CustomerApplianceOrder, TriggerToast } from "../types";
import { formatTHB } from "../utils";

interface OrderInvoiceModalProps {
  profile: UserProfileData;
  selectedOrderModal: CustomerApplianceOrder;
  setSelectedOrderModal: Dispatch<SetStateAction<CustomerApplianceOrder | null>>;
  triggerToast: TriggerToast;
}

export default function OrderInvoiceModal({
  profile,
  selectedOrderModal,
  setSelectedOrderModal,
  triggerToast,
}: OrderInvoiceModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setSelectedOrderModal(null)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-lg w-full rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-mono text-xs font-bold">
              OFFICIAL E-TAX INVOICE &amp; SERIAL RECEIPT
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 font-mono mt-1">
              {selectedOrderModal.orderRef}
            </h3>
            <p className="text-xs text-slate-500">
              {selectedOrderModal.paymentMethod}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedOrderModal(null)}
            className="min-w-[36px] min-h-[36px] rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
          >
            ✕
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Customer:</span>
            <strong className="text-slate-900">
              {profile.fullName} ({profile.phone})
            </strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Dispatch Site:</span>
            <strong className="text-slate-900">
              {selectedOrderModal.shippingAddressSummary}
            </strong>
          </div>
          {selectedOrderModal.technicianTeam && (
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned Crew:</span>
              <strong className="text-emerald-700">
                {selectedOrderModal.technicianTeam}
              </strong>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {selectedOrderModal.items.map((it, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-xs p-2.5 rounded-xl border border-slate-200"
            >
              <div>
                <p className="font-bold text-slate-900">
                  {it.qty}x {it.name}
                </p>
                {it.serialNumber && (
                  <p className="font-mono text-[11px] text-emerald-700 font-bold">
                    S/N: {it.serialNumber}
                  </p>
                )}
              </div>
              <span className="font-extrabold text-slate-900">
                {formatTHB(it.priceTHB * it.qty)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm font-extrabold text-slate-900">
            Total Amount (VAT 7% Included)
          </span>
          <span className="text-lg font-extrabold text-slate-900">
            {formatTHB(selectedOrderModal.totalAmountTHB)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerToast(
              `Tax Invoice Downloaded (${selectedOrderModal.orderRef})`,
              "Saved certified PDF receipt with bound Serial Numbers.",
              "emerald"
            );
            setSelectedOrderModal(null);
          }}
          className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm active:scale-95 transition-transform"
        >
          Download Certified Tax Invoice (PDF)
        </button>
      </div>
    </div>
  );
}
