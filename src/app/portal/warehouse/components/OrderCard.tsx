import type { Dispatch, SetStateAction } from "react";
import { Barcode, Truck, CheckCircle2, AlertTriangle, ArrowRight, Printer, Check, RefreshCw } from "lucide-react";
import type { FulfillmentLineItem, FulfillmentOrder, ScanningTarget } from "../types";
import { getOrderSerialProgress } from "../utils";

interface OrderCardProps {
  order: FulfillmentOrder;
  scanningTarget: ScanningTarget | null;
  setPickSlipModalOrder: Dispatch<SetStateAction<FulfillmentOrder | null>>;
  handleManualSerialChange: (orderId: string, itemId: string, serialIdx: number, value: string) => void;
  handleSimulateBarcodeScan: (orderId: string, item: FulfillmentLineItem, serialIdx: number) => void;
  handleMarkOrderPacked: (order: FulfillmentOrder) => void;
  handleDispatchOrder: (order: FulfillmentOrder) => void;
}

export default function OrderCard({
  order,
  scanningTarget,
  setPickSlipModalOrder,
  handleManualSerialChange,
  handleSimulateBarcodeScan,
  handleMarkOrderPacked,
  handleDispatchOrder,
}: OrderCardProps) {
  const progress = getOrderSerialProgress(order);
  const isReadyToPick = order.status === "Ready to Pick";
  const isPacked = order.status === "Packed & S/N Bound";
  const isDispatched = order.status === "Dispatched";

  return (
    <article
      className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md flex flex-col justify-between gap-4"
    >
      <div className="space-y-4">
        {/* Card Header: Order Reference + Zone + Status Pill */}
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-extrabold text-white font-mono">
                {order.orderRef}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-extrabold">
                {order.destinationZone}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {order.transferredAt} • Tracking:{" "}
              <span className="font-mono text-slate-300">
                {order.trackingTag}
              </span>
            </p>
          </div>

          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border shrink-0 inline-flex items-center gap-1.5 ${
              isReadyToPick
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : isPacked
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-blue-500/20 text-blue-300 border-blue-500/40"
            }`}
          >
            {isReadyToPick && <Barcode className="w-3.5 h-3.5" />}
            {isPacked && <CheckCircle2 className="w-3.5 h-3.5" />}
            {isDispatched && <Truck className="w-3.5 h-3.5" />}
            {order.status}
          </span>
        </div>

        {/* Customer Destination & Special Handling Notes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">
              {order.customerName}
            </span>
            <span className="text-xs font-mono text-amber-400 font-semibold">
              {order.customerPhone}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-snug">
            {order.deliveryAddress}
          </p>
          <div className="pt-1.5 mt-1.5 border-t border-slate-800/80 flex items-start gap-1.5 text-xs text-amber-300 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>{order.deliveryInstructions}</span>
          </div>
        </div>

        {/* S/N Barcode Progress Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Barcode className="w-4 h-4 text-amber-400" />
            Pick List &amp; Serial Number (S/N) Binding
          </span>
          <span
            className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${
              progress.isComplete
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-amber-500/20 text-amber-300 border-amber-500/40"
            }`}
          >
            {progress.totalBound}/{progress.totalRequired} Serial Numbers
            Bound
          </span>
        </div>

        {/* Items & S/N Barcode Inputs */}
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-3"
            >
              <div className="flex items-start gap-3">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono text-xs font-extrabold border border-slate-700">
                      {item.sku}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-extrabold">
                      📍 {item.storageLocation}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mt-1 leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Required Pick Qty:{" "}
                    <strong className="text-white font-extrabold">
                      {item.quantity} unit(s)
                    </strong>
                  </p>
                </div>
              </div>

              {/* Serial Number Slots per Unit */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                {item.boundSerials.map((serialVal, sIdx) => {
                  const isBound =
                    serialVal && serialVal.trim().length >= 6;
                  const isScanningThis =
                    scanningTarget?.orderId === order.id &&
                    scanningTarget?.itemId === item.id &&
                    scanningTarget?.serialIndex === sIdx;

                  return (
                    <div
                      key={sIdx}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                    >
                      <div className="relative flex-1">
                        <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          disabled={isDispatched}
                          value={serialVal}
                          onChange={(e) =>
                            handleManualSerialChange(
                              order.id,
                              item.id,
                              sIdx,
                              e.target.value
                            )
                          }
                          placeholder={`Enter or Scan Unit #${
                            sIdx + 1
                          } S/N (e.g. ${item.serialPrefix}-992184)`}
                          className={`w-full h-12 pl-9 pr-9 rounded-xl font-mono text-xs sm:text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                            isBound
                              ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-300"
                              : "bg-slate-950 border-slate-700 text-white placeholder-slate-500"
                          }`}
                        />
                        {isBound && (
                          <Check className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2" />
                        )}
                      </div>

                      {!isDispatched && (
                        <button
                          type="button"
                          onClick={() =>
                            handleSimulateBarcodeScan(
                              order.id,
                              item,
                              sIdx
                            )
                          }
                          className="min-h-[48px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-all duration-150 shadow-sm"
                        >
                          {isScanningThis ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Scanning...</span>
                            </>
                          ) : (
                            <>
                              <Barcode className="w-4 h-4 stroke-[2.2]" />
                              <span>Simulate Barcode Scan</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fulfillment Card Footer Actions */}
      <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <button
          type="button"
          onClick={() => setPickSlipModalOrder(order)}
          className="min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all duration-150"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>Print Pick &amp; Pack Slip</span>
        </button>

        {order.status === "Ready to Pick" && (
          <button
            type="button"
            onClick={() => handleMarkOrderPacked(order)}
            className={`flex-1 min-h-[48px] px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all duration-150 ${
              progress.isComplete
                ? "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.3]" />
            <span>
              {progress.isComplete
                ? "Mark as Packed & Ready for Dispatch"
                : `Bind ${
                    progress.totalRequired - progress.totalBound
                  } More S/N to Unlock Pack`}
            </span>
          </button>
        )}

        {order.status === "Packed & S/N Bound" && (
          <button
            type="button"
            onClick={() => handleDispatchOrder(order)}
            className="flex-1 min-h-[48px] px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all duration-150"
          >
            <Truck className="w-4 h-4 stroke-[2.3]" />
            <span>Mark Out for Delivery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {order.status === "Dispatched" && (
          <div className="flex-1 min-h-[48px] px-4 py-2.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center justify-center gap-2">
            <Truck className="w-4 h-4" />
            <span>Dispatched ({order.dispatchedAt || "In Transit"})</span>
          </div>
        )}
      </div>
    </article>
  );
}
