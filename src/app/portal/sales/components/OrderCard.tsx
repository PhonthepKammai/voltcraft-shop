import { CheckCircle2, Clock, Phone, Eye, ArrowRight, Check, AlertTriangle } from "lucide-react";
import type { SalesOrder } from "../types";
import { formatTHB, formatUSD } from "../utils";

interface OrderCardProps {
  order: SalesOrder;
  onInspectSlip: (order: SalesOrder) => void;
  onApprove: (order: SalesOrder) => void;
  onFlag: (order: SalesOrder) => void;
}

export default function OrderCard({ order, onInspectSlip, onApprove, onFlag }: OrderCardProps) {
  const isPending = order.status === "Pending Verification";
  const isApproved = order.status === "Approved";
  const isIssue = order.status === "Payment Issue";

  return (
    <article
      className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between gap-4"
    >
      <div className="space-y-3.5">
        {/* Top Row: Order Reference + Timestamp + Status Pill */}
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-extrabold text-slate-900 font-mono">
                {order.orderRef}
              </span>
              {order.warehouseQueueTag && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                  {order.warehouseQueueTag}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {order.timestamp}
            </p>
          </div>

          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 shrink-0 ${
              isPending
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : isApproved
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {isPending && <Clock className="w-3.5 h-3.5" />}
            {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
            {isIssue && <AlertTriangle className="w-3.5 h-3.5" />}
            {order.status}
          </span>
        </div>

        {/* Customer Contact & Click-to-Call Ergonomic Row */}
        <div className="flex items-start justify-between gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-900">
                {order.customerName}
              </span>
              <span className="text-xs font-mono font-semibold text-slate-600">
                {order.customerPhone}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-snug">
              {order.deliveryAddress}
            </p>
          </div>

          <a
            href={`tel:${order.customerPhone.replace(/[^0-9+]/g, "")}`}
            aria-label={`Call ${order.customerName}`}
            className="shrink-0 min-w-[44px] min-h-[44px] px-3 rounded-xl bg-white hover:bg-amber-50 text-slate-900 border border-slate-200 hover:border-amber-400 flex items-center justify-center gap-1.5 text-xs font-bold shadow-sm active:scale-95 transition-all duration-150"
          >
            <Phone className="w-4 h-4 text-amber-600" />
            <span>Call</span>
          </a>
        </div>

        {/* Delivery & Installation Notes Badges */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Site &amp; Installation Notes:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {order.deliveryNotes.map((note, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold"
              >
                • {note}
              </span>
            ))}
          </div>
        </div>

        {/* Ordered Appliances List */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Ordered Appliances ({order.items.length}):
          </p>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="p-2.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.sku}
                      </span>
                      {item.isServiceAddOn && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          INSTALL SERVICE
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                      {item.name}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-extrabold text-slate-900">
                    {formatTHB(item.unitPriceTHB * item.quantity)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Proof & Total Amount Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => onInspectSlip(order)}
              className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-300 bg-slate-900 shrink-0 group active:scale-95 transition-transform"
            >
              <img
                src={order.slipImageUrl}
                alt="Payment proof slip"
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-slate-950/40 text-white">
                <Eye className="w-4 h-4" />
              </span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {order.paymentMethod}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {order.slipBankName} • Ref: {order.paymentReference}
              </p>
              <button
                type="button"
                onClick={() => onInspectSlip(order)}
                className="text-[11px] font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 mt-0.5"
              >
                <Eye className="w-3 h-3" />
                Inspect Transfer Slip
              </button>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Order Total
            </span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900">
              {formatTHB(order.totalAmountTHB)}
            </span>
            <span className="block text-[11px] text-slate-500 font-medium">
              ({formatUSD(order.totalAmountTHB)})
            </span>
          </div>
        </div>

        {/* Payment Issue Alert Note if Flagged */}
        {order.salesIssueNote && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">
                Verification Hold Note:
              </span>
              <span>{order.salesIssueNote}</span>
            </div>
          </div>
        )}
      </div>

      {/* Order Action Buttons */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {order.status !== "Approved" ? (
          <>
            <button
              type="button"
              onClick={() => onApprove(order)}
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all duration-150"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Approve &amp; Route to Warehouse</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onFlag(order)}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-150"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Flag Issue</span>
            </button>
          </>
        ) : (
          <div className="w-full flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs text-emerald-800">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Transferred to Warehouse Queue (Ready to Pick)
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              {order.verifiedBy || "Verified"}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
