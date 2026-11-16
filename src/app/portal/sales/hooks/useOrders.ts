import { useMemo, useState } from "react";
import { INITIAL_ORDERS } from "../mockData";
import type { OrderCounts, OrderFilterType, SalesOrder, ShowToast } from "../types";
import { formatTHB } from "../utils";

export function useOrders(showToast: ShowToast) {
  const [orders, setOrders] = useState<SalesOrder[]>(INITIAL_ORDERS);
  const [orderFilter, setOrderFilter] = useState<OrderFilterType>("All");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [inspectingSlipOrder, setInspectingSlipOrder] = useState<SalesOrder | null>(
    null
  );
  const [flaggingOrder, setFlaggingOrder] = useState<SalesOrder | null>(null);
  const [flagIssueReason, setFlagIssueReason] = useState(
    "Slip transfer amount mismatch or unreadable bank reference ID. Contacted customer via phone."
  );

  const orderCounts = useMemo<OrderCounts>(() => {
    const pending = orders.filter((o) => o.status === "Pending Verification").length;
    const approved = orders.filter((o) => o.status === "Approved").length;
    const issue = orders.filter((o) => o.status === "Payment Issue").length;
    const approvedRevenueTHB = orders
      .filter((o) => o.status === "Approved")
      .reduce((acc, o) => acc + o.totalAmountTHB, 0);

    return {
      all: orders.length,
      pending,
      approved,
      issue,
      approvedRevenueTHB,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (orderFilter !== "All" && order.status !== orderFilter) {
        return false;
      }
      if (orderSearchQuery.trim() !== "") {
        const q = orderSearchQuery.toLowerCase();
        const matchRef = order.orderRef.toLowerCase().includes(q);
        const matchCustomer = order.customerName.toLowerCase().includes(q);
        const matchPhone = order.customerPhone.toLowerCase().includes(q);
        const matchAddress = order.deliveryAddress.toLowerCase().includes(q);
        const matchItems = order.items.some(
          (i) =>
            i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q)
        );
        if (
          !matchRef &&
          !matchCustomer &&
          !matchPhone &&
          !matchAddress &&
          !matchItems
        ) {
          return false;
        }
      }
      return true;
    });
  }, [orders, orderFilter, orderSearchQuery]);

  const handleApproveOrderToWarehouse = (order: SalesOrder) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: "Approved",
              warehouseQueueTag: "Ready to Pick • Bay #W-01",
              verifiedBy: "Sales Desk #01 (Just now)",
              salesIssueNote: undefined,
            }
          : o
      )
    );
    showToast(
      `Order ${order.orderRef} Approved & Routed to Warehouse`,
      `Status set to "Ready to Pick" • Total ${formatTHB(order.totalAmountTHB)} verified.`,
      "success"
    );
    if (inspectingSlipOrder?.id === order.id) {
      setInspectingSlipOrder(null);
    }
  };

  const openFlagModal = (order: SalesOrder) => {
    setFlaggingOrder(order);
    setFlagIssueReason(
      order.salesIssueNote ||
        "Transfer slip verification issue — requested customer confirmation via phone."
    );
  };

  const handleConfirmFlagPaymentIssue = () => {
    if (!flaggingOrder) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === flaggingOrder.id
          ? {
              ...o,
              status: "Payment Issue",
              salesIssueNote:
                flagIssueReason.trim() ||
                "Payment verification hold — awaiting customer confirmation.",
              warehouseQueueTag: undefined,
            }
          : o
      )
    );
    showToast(
      `Order ${flaggingOrder.orderRef} Flagged for Payment/Contact Issue`,
      `Hold note logged for ${flaggingOrder.customerName} (${flaggingOrder.customerPhone}).`,
      "warning"
    );
    setFlaggingOrder(null);
  };

  return {
    orders,
    orderFilter,
    setOrderFilter,
    orderSearchQuery,
    setOrderSearchQuery,
    inspectingSlipOrder,
    setInspectingSlipOrder,
    flaggingOrder,
    setFlaggingOrder,
    flagIssueReason,
    setFlagIssueReason,
    orderCounts,
    filteredOrders,
    handleApproveOrderToWarehouse,
    openFlagModal,
    handleConfirmFlagPaymentIssue,
  };
}

export type OrdersApi = ReturnType<typeof useOrders>;
