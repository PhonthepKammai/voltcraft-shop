import type { Dispatch, SetStateAction } from "react";
import { Printer, X } from "lucide-react";
import type { FulfillmentOrder, ToastTone } from "../types";

interface PickSlipModalProps {
  pickSlipModalOrder: FulfillmentOrder;
  setPickSlipModalOrder: Dispatch<SetStateAction<FulfillmentOrder | null>>;
  triggerToast: (title: string, detail?: string, tone?: ToastTone) => void;
}

export default function PickSlipModal({
  pickSlipModalOrder,
  setPickSlipModalOrder,
  triggerToast,
}: PickSlipModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setPickSlipModalOrder(null)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-slate-900 w-full max-w-lg rounded-2xl border border-slate-300 p-6 space-y-4 shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-mono text-xs font-bold">
              VOLTCRAFT PICK &amp; PACK SLIP
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1 font-mono">
              {pickSlipModalOrder.orderRef}
            </h3>
            <p className="text-xs text-slate-500">
              {pickSlipModalOrder.destinationZone} • Tracking:{" "}
              {pickSlipModalOrder.trackingTag}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPickSlipModalOrder(null)}
            className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
          <p className="font-bold text-slate-900">
            Ship To: {pickSlipModalOrder.customerName} (
            {pickSlipModalOrder.customerPhone})
          </p>
          <p className="text-slate-600">{pickSlipModalOrder.deliveryAddress}</p>
          <p className="text-amber-800 font-semibold pt-1">
            Handling: {pickSlipModalOrder.deliveryInstructions}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Warehouse Aisle / Rack Pick Locations:
          </p>
          {pickSlipModalOrder.items.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-mono font-extrabold text-slate-900">
                  {item.sku} (Qty: {item.quantity})
                </span>
                <p className="text-slate-600">{item.name}</p>
                <p className="font-mono text-[11px] text-emerald-700 font-bold mt-0.5">
                  Bound S/N: {item.boundSerials.filter(Boolean).join(", ") || "UNBOUND"}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 font-extrabold shrink-0">
                {item.storageLocation}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPickSlipModalOrder(null)}
            className="min-h-[48px] px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              triggerToast(
                `Pick Slip Sent to Thermal Printer (${pickSlipModalOrder.orderRef})`,
                "Printed at Bay 4 Zebra Label Station.",
                "amber"
              );
              setPickSlipModalOrder(null);
            }}
            className="flex-1 min-h-[48px] py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print on Bay 4 Thermal Printer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
