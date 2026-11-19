import type { Dispatch, SetStateAction } from "react";
import { ChevronRight, CheckCircle2, Clock } from "lucide-react";
import type { CustomerApplianceOrder } from "../types";
import { formatTHB, formatUSD } from "../utils";

interface OrderCardProps {
  order: CustomerApplianceOrder;
  setSelectedOrderModal: Dispatch<SetStateAction<CustomerApplianceOrder | null>>;
}

export default function OrderCard({ order, setSelectedOrderModal }: OrderCardProps) {
  const isInstalled =
    order.status === "Delivered & Installed";
  const isOutForDelivery =
    order.status === "Out for Delivery";

  return (
    <article
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4"
    >
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-extrabold font-mono text-slate-900">
              {order.orderRef}
            </span>
            <span className="text-xs text-slate-500">
              • Ordered {order.purchaseDate}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-0.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {order.deliverySlot}
          </p>
        </div>

        <span
          className={`self-start sm:self-center px-3 py-1.5 rounded-xl text-xs font-extrabold border inline-flex items-center gap-1.5 ${
            isInstalled
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : isOutForDelivery
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-amber-50 text-amber-800 border-amber-200"
          }`}
        >
          {isInstalled ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <Clock className="w-3.5 h-3.5" />
          )}
          {order.status}
        </span>
      </div>

      {/* Lifecycle Stepper Visual */}
      <div className="grid grid-cols-4 gap-1.5 text-center text-[11px] font-bold">
        <div className="py-1.5 px-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
          1. Verified
        </div>
        <div className="py-1.5 px-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
          2. S/N Packed
        </div>
        <div
          className={`py-1.5 px-2 rounded-lg border ${
            isOutForDelivery || isInstalled
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-slate-100 text-slate-400 border-slate-200"
          }`}
        >
          3. Dispatched
        </div>
        <div
          className={`py-1.5 px-2 rounded-lg border ${
            isInstalled
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-100 text-slate-400 border-slate-200"
          }`}
        >
          4. Installed
        </div>
      </div>

      {/* Items Table */}
      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                  {item.sku}
                </span>
                <span className="font-bold text-slate-900">
                  {item.name}
                </span>
              </div>
              {item.serialNumber && (
                <p className="font-mono text-[11px] text-emerald-700 font-bold">
                  Bound Warranty S/N: {item.serialNumber}
                </p>
              )}
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0">
              <span className="font-extrabold text-slate-900 text-sm">
                {formatTHB(item.priceTHB * item.qty)}
              </span>
              <span className="text-[11px] text-slate-500">
                Qty: {item.qty}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Total & Actions */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs text-slate-500 block">
            Total Paid ({order.paymentMethod.split(" • ")[0]})
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-slate-900">
              {formatTHB(order.totalAmountTHB)}
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              ({formatUSD(order.totalAmountTHB)})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedOrderModal(order)}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <span>View Order &amp; Tax Invoice</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </article>
  );
}
