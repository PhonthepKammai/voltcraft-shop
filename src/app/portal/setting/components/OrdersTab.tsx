import type { Dispatch, SetStateAction } from "react";
import type { CustomerApplianceOrder } from "../types";
import OrderCard from "./OrderCard";

interface OrdersTabProps {
  orders: CustomerApplianceOrder[];
  setSelectedOrderModal: Dispatch<SetStateAction<CustomerApplianceOrder | null>>;
}

export default function OrdersTab({ orders, setSelectedOrderModal }: OrdersTabProps) {
  return (
    <section aria-label="Order History" className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
          Appliance Order History &amp; Live Fleet Tracking
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Track white-glove delivery progress, bound serial numbers,
          and download official tax invoices.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            setSelectedOrderModal={setSelectedOrderModal}
          />
        ))}
      </div>
    </section>
  );
}
