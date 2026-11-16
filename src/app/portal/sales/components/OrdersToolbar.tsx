import { CheckCircle2, Clock, XCircle, Search, Filter, X } from "lucide-react";
import type { OrderCounts, OrderFilterType } from "../types";

interface OrdersToolbarProps {
  orderFilter: OrderFilterType;
  setOrderFilter: (filter: OrderFilterType) => void;
  orderSearchQuery: string;
  setOrderSearchQuery: (query: string) => void;
  orderCounts: OrderCounts;
}

export default function OrdersToolbar({
  orderFilter,
  setOrderFilter,
  orderSearchQuery,
  setOrderSearchQuery,
  orderCounts,
}: OrdersToolbarProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={orderSearchQuery}
            onChange={(e) => setOrderSearchQuery(e.target.value)}
            placeholder="Search Order #VC-9102, customer name, phone, or appliance SKU..."
            className="w-full h-11 pl-10 pr-9 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
          />
          {orderSearchQuery && (
            <button
              type="button"
              onClick={() => setOrderSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Scrollable Order Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        <button
          type="button"
          onClick={() => setOrderFilter("All")}
          className={`shrink-0 min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 active:scale-95 transition-all duration-150 ${
            orderFilter === "All"
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
          }`}
        >
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>All Orders</span>
          <span className="px-1.5 py-0.5 rounded-md bg-slate-700/20 text-[11px]">
            {orderCounts.all}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOrderFilter("Pending Verification")}
          className={`shrink-0 min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 active:scale-95 transition-all duration-150 ${
            orderFilter === "Pending Verification"
              ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm"
              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Verification</span>
          <span className="px-1.5 py-0.5 rounded-md bg-slate-950/10 text-[11px] font-extrabold">
            {orderCounts.pending}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOrderFilter("Approved")}
          className={`shrink-0 min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 active:scale-95 transition-all duration-150 ${
            orderFilter === "Approved"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
              : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Approved (To Warehouse)</span>
          <span className="px-1.5 py-0.5 rounded-md bg-black/10 text-[11px] font-extrabold">
            {orderCounts.approved}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOrderFilter("Payment Issue")}
          className={`shrink-0 min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 active:scale-95 transition-all duration-150 ${
            orderFilter === "Payment Issue"
              ? "bg-rose-600 text-white border-rose-600 shadow-sm"
              : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70"
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Payment Issue</span>
          <span className="px-1.5 py-0.5 rounded-md bg-black/10 text-[11px] font-extrabold">
            {orderCounts.issue}
          </span>
        </button>
      </div>
    </div>

  );
}
