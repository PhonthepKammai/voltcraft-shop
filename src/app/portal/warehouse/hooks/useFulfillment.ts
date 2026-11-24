import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { INITIAL_FULFILLMENT_ORDERS } from "../mockData";
import type {
  DeliveryRouteManifest,
  FulfillmentFilter,
  FulfillmentLineItem,
  FulfillmentMetrics,
  FulfillmentOrder,
  ScanningTarget,
  ToastTone,
  WarehouseInventoryItem,
} from "../types";
import { getOrderSerialProgress } from "../utils";

export function useFulfillment(
  setInventory: Dispatch<SetStateAction<WarehouseInventoryItem[]>>,
  triggerToast: (title: string, detail?: string, tone?: ToastTone) => void
) {
  const [orders, setOrders] = useState<FulfillmentOrder[]>(
    INITIAL_FULFILLMENT_ORDERS
  );
  const [fulfillmentFilter, setFulfillmentFilter] =
    useState<FulfillmentFilter>("All");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [scanningTarget, setScanningTarget] = useState<ScanningTarget | null>(null);
  const [pickSlipModalOrder, setPickSlipModalOrder] =
    useState<FulfillmentOrder | null>(null);

  const [selectedRouteFilter, setSelectedRouteFilter] =
    useState<string>("All");
  const [printableManifestOrder, setPrintableManifestOrder] =
    useState<FulfillmentOrder | null>(null);
  const [printableRouteSheet, setPrintableRouteSheet] =
    useState<DeliveryRouteManifest | null>(null);

  const fulfillmentMetrics = useMemo<FulfillmentMetrics>(() => {
    const readyToPick = orders.filter((o) => o.status === "Ready to Pick").length;
    const packed = orders.filter((o) => o.status === "Packed & S/N Bound").length;
    const dispatched = orders.filter((o) => o.status === "Dispatched").length;
    return {
      all: orders.length,
      readyToPick,
      packed,
      dispatched,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (fulfillmentFilter !== "All" && ord.status !== fulfillmentFilter) {
        return false;
      }
      if (orderSearchQuery.trim() !== "") {
        const q = orderSearchQuery.toLowerCase();
        const matchRef = ord.orderRef.toLowerCase().includes(q);
        const matchCustomer = ord.customerName.toLowerCase().includes(q);
        const matchZone = ord.destinationZone.toLowerCase().includes(q);
        const matchSku = ord.items.some(
          (item) =>
            item.sku.toLowerCase().includes(q) ||
            item.name.toLowerCase().includes(q) ||
            item.boundSerials.some((sn) => sn.toLowerCase().includes(q))
        );
        if (!matchRef && !matchCustomer && !matchZone && !matchSku) return false;
      }
      return true;
    });
  }, [orders, fulfillmentFilter, orderSearchQuery]);

  const handleManualSerialChange = (
    orderId: string,
    itemId: string,
    serialIdx: number,
    value: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          items: ord.items.map((item) => {
            if (item.id !== itemId) return item;
            const updatedSerials = [...item.boundSerials];
            updatedSerials[serialIdx] = value.toUpperCase();
            return { ...item, boundSerials: updatedSerials };
          }),
        };
      })
    );
  };

  const handleSimulateBarcodeScan = (
    orderId: string,
    item: FulfillmentLineItem,
    serialIdx: number
  ) => {
    setScanningTarget({ orderId, itemId: item.id, serialIndex: serialIdx });

    setTimeout(() => {
      const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
      const generatedSerial = `${item.serialPrefix}-${randomSixDigits}`;

      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.id !== orderId) return ord;
          return {
            ...ord,
            items: ord.items.map((it) => {
              if (it.id !== item.id) return it;
              const nextSerials = [...it.boundSerials];
              nextSerials[serialIdx] = generatedSerial;
              return { ...it, boundSerials: nextSerials };
            }),
          };
        })
      );

      setScanningTarget(null);
      triggerToast(
        `Serial Number ${generatedSerial} Bound`,
        `Laser scan verified for ${item.sku} • Digital 5-Yr Warranty Linked.`,
        "emerald"
      );
    }, 320);
  };

  const handleMarkOrderPacked = (order: FulfillmentOrder) => {
    const progress = getOrderSerialProgress(order);
    if (!progress.isComplete) {
      triggerToast(
        "Serial Binding Incomplete",
        `Please bind all ${progress.totalRequired} appliance Serial Numbers before sealing carton.`,
        "rose"
      );
      return;
    }

    // Deduct physical stock from warehouse inventory when packed
    setInventory((prevInv) =>
      prevInv.map((invItem) => {
        const orderLine = order.items.find((li) => li.sku === invItem.sku);
        if (!orderLine) return invItem;
        return {
          ...invItem,
          stockCount: Math.max(0, invItem.stockCount - orderLine.quantity),
        };
      })
    );

    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === order.id
          ? {
              ...ord,
              status: "Packed & S/N Bound",
              packedBy: "Terminal #04 (Bay 4 Supervisor)",
            }
          : ord
      )
    );

    triggerToast(
      `Order ${order.orderRef} Packed & S/N Bound`,
      `Moved to Loading Dock Queue (${order.destinationZone}). Physical stock updated.`,
      "emerald"
    );
  };

  const handleDispatchOrder = (order: FulfillmentOrder) => {
    const progress = getOrderSerialProgress(order);
    if (!progress.isComplete) {
      triggerToast(
        "Cannot Dispatch Unbound Unit",
        `Bind S/N barcode on ${order.orderRef} before loading onto fleet truck.`,
        "rose"
      );
      return;
    }

    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === order.id
          ? {
              ...ord,
              status: "Dispatched",
              dispatchedAt: "Just now • Bay 4 Gate Out",
            }
          : ord
      )
    );

    triggerToast(
      `${order.orderRef} Marked Out for Delivery`,
      `Loaded onto assigned fleet truck • Tracking ${order.trackingTag} active.`,
      "blue"
    );
  };

  const handleDispatchEntireRoute = (route: DeliveryRouteManifest) => {
    const routeOrders = orders.filter(
      (o) =>
        o.assignedRouteId === route.id && o.status === "Packed & S/N Bound"
    );

    if (routeOrders.length === 0) {
      triggerToast(
        "No Packed Orders Ready on Route",
        "Pack and bind S/N barcodes in Tab 1 before dispatching this fleet manifest.",
        "amber"
      );
      return;
    }

    setOrders((prev) =>
      prev.map((ord) =>
        ord.assignedRouteId === route.id && ord.status === "Packed & S/N Bound"
          ? {
              ...ord,
              status: "Dispatched",
              dispatchedAt: "Just now • Fleet Manifest Gate Out",
            }
          : ord
      )
    );

    triggerToast(
      `${route.truckName} Dispatched (${routeOrders.length} Orders)`,
      `Driver ${route.driverName} departed ${route.departureBay}.`,
      "blue"
    );
  };

  return {
    orders,
    fulfillmentFilter,
    setFulfillmentFilter,
    orderSearchQuery,
    setOrderSearchQuery,
    scanningTarget,
    pickSlipModalOrder,
    setPickSlipModalOrder,
    selectedRouteFilter,
    setSelectedRouteFilter,
    printableManifestOrder,
    setPrintableManifestOrder,
    printableRouteSheet,
    setPrintableRouteSheet,
    fulfillmentMetrics,
    filteredOrders,
    handleManualSerialChange,
    handleSimulateBarcodeScan,
    handleMarkOrderPacked,
    handleDispatchOrder,
    handleDispatchEntireRoute,
  };
}
