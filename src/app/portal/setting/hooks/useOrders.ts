import { useState } from "react";
import { INITIAL_ORDERS } from "../mockData";
import type { CustomerApplianceOrder } from "../types";

export function useOrders() {
  const [orders] = useState<CustomerApplianceOrder[]>(INITIAL_ORDERS);
  const [selectedOrderModal, setSelectedOrderModal] =
    useState<CustomerApplianceOrder | null>(null);

  return { orders, selectedOrderModal, setSelectedOrderModal };
}
