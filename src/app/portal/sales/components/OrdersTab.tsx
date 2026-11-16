import { CheckCircle2 } from "lucide-react";
import type { OrdersApi } from "../hooks/useOrders";
import OrderCard from "./OrderCard";
import OrdersToolbar from "./OrdersToolbar";

interface OrdersTabProps {
  ordersApi: OrdersApi;
}

export default function OrdersTab({ ordersApi }: OrdersTabProps) {
  const {
    orderFilter,
    setOrderFilter,
    orderSearchQuery,
    setOrderSearchQuery,
    orderCounts,
    filteredOrders,
    setInspectingSlipOrder,
    handleApproveOrderToWarehouse,
    openFlagModal,
  } = ordersApi;

  return (
    <section aria-label="Orders Verification Queue" className="space-y-4">
      <OrdersToolbar
        orderFilter={orderFilter}
        setOrderFilter={setOrderFilter}
        orderSearchQuery={orderSearchQuery}
        setOrderSearchQuery={setOrderSearchQuery}
        orderCounts={orderCounts}
      />

      {/* Order Cards List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No Orders Found in This Queue
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            All matching customer appliance orders have been processed or filtered out.
          </p>
          <button
            type="button"
            onClick={() => {
          setOrderFilter("All");
          setOrderSearchQuery("");
        }}
            className="mt-4 min-h-[44px] px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-semibold text-xs active:scale-95 transition-transform"
          >
            Show All Orders
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onInspectSlip={setInspectingSlipOrder}
              onApprove={handleApproveOrderToWarehouse}
              onFlag={openFlagModal}
            />
          ))}
        </div>
      )}
    </section>
  );
}
