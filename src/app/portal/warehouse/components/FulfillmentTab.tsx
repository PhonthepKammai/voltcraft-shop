import type { Dispatch, SetStateAction } from "react";
import { Package, Barcode, Truck, CheckCircle2, Search, Filter, X } from "lucide-react";
import type { FulfillmentFilter, FulfillmentLineItem, FulfillmentOrder, ScanningTarget, FulfillmentMetrics } from "../types";
import OrderCard from "./OrderCard";

interface FulfillmentTabProps {
  fulfillmentFilter: FulfillmentFilter;
  setFulfillmentFilter: Dispatch<SetStateAction<FulfillmentFilter>>;
  orderSearchQuery: string;
  setOrderSearchQuery: Dispatch<SetStateAction<string>>;
  scanningTarget: ScanningTarget | null;
  setPickSlipModalOrder: Dispatch<SetStateAction<FulfillmentOrder | null>>;
  fulfillmentMetrics: FulfillmentMetrics;
  filteredOrders: FulfillmentOrder[];
  handleManualSerialChange: (orderId: string, itemId: string, serialIdx: number, value: string) => void;
  handleSimulateBarcodeScan: (orderId: string, item: FulfillmentLineItem, serialIdx: number) => void;
  handleMarkOrderPacked: (order: FulfillmentOrder) => void;
  handleDispatchOrder: (order: FulfillmentOrder) => void;
}

export default function FulfillmentTab({
  fulfillmentFilter,
  setFulfillmentFilter,
  orderSearchQuery,
  setOrderSearchQuery,
  scanningTarget,
  setPickSlipModalOrder,
  fulfillmentMetrics,
  filteredOrders,
  handleManualSerialChange,
  handleSimulateBarcodeScan,
  handleMarkOrderPacked,
  handleDispatchOrder,
}: FulfillmentTabProps) {
  return (
    <section aria-label="Order Fulfillment Queue" className="space-y-4">
      {/* Search & Status Filter Bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 shadow-md space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={orderSearchQuery}
            onChange={(e) => setOrderSearchQuery(e.target.value)}
            placeholder="Scan or search Order #VC-ORD-9098, Customer, Zone, SKU, or S/N..."
            className="w-full h-12 pl-10 pr-10 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          {orderSearchQuery && (
            <button
              type="button"
              onClick={() => setOrderSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills (Min 48px height for gloved use) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <button
            type="button"
            onClick={() => setFulfillmentFilter("All")}
            className={`shrink-0 min-h-[48px] px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 active:scale-95 transition-all duration-150 ${
              fulfillmentFilter === "All"
                ? "bg-amber-500 text-slate-950 border-amber-500"
                : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>All Queue ({fulfillmentMetrics.all})</span>
          </button>

          <button
            type="button"
            onClick={() => setFulfillmentFilter("Ready to Pick")}
            className={`shrink-0 min-h-[48px] px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 active:scale-95 transition-all duration-150 ${
              fulfillmentFilter === "Ready to Pick"
                ? "bg-amber-500 text-slate-950 border-amber-500"
                : "bg-amber-500/20 text-amber-300 border-amber-500/40"
            }`}
          >
            <Barcode className="w-3.5 h-3.5" />
            <span>Ready to Pick ({fulfillmentMetrics.readyToPick})</span>
          </button>

          <button
            type="button"
            onClick={() => setFulfillmentFilter("Packed & S/N Bound")}
            className={`shrink-0 min-h-[48px] px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 active:scale-95 transition-all duration-150 ${
              fulfillmentFilter === "Packed & S/N Bound"
                ? "bg-amber-500 text-slate-950 border-amber-500"
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Packed &amp; S/N Bound ({fulfillmentMetrics.packed})</span>
          </button>

          <button
            type="button"
            onClick={() => setFulfillmentFilter("Dispatched")}
            className={`shrink-0 min-h-[48px] px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 active:scale-95 transition-all duration-150 ${
              fulfillmentFilter === "Dispatched"
                ? "bg-amber-500 text-slate-950 border-amber-500"
                : "bg-blue-500/20 text-blue-300 border-blue-500/40"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Dispatched ({fulfillmentMetrics.dispatched})</span>
          </button>
        </div>
      </div>

      {/* Fulfillment Order Cards Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-10 text-center shadow-md">
          <Package className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">
            No Fulfillment Orders Match Filter
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Switch status filter pills or clear the scanner search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              scanningTarget={scanningTarget}
              setPickSlipModalOrder={setPickSlipModalOrder}
              handleManualSerialChange={handleManualSerialChange}
              handleSimulateBarcodeScan={handleSimulateBarcodeScan}
              handleMarkOrderPacked={handleMarkOrderPacked}
              handleDispatchOrder={handleDispatchOrder}
            />
          ))}
        </div>
      )}
    </section>
  );
}
