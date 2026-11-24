"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Zap,
  Package,
  Barcode,
  Truck,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Minus,
  ArrowRight,
  Printer,
  ShieldCheck,
  X,
  Check,
  Eye,
  RefreshCw,
  Layers,
} from "lucide-react";

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================
type WarehouseTab = "fulfillment" | "inventory" | "dispatch";

type FulfillmentStatus = "Ready to Pick" | "Packed & S/N Bound" | "Dispatched";

type FulfillmentFilter = "All" | FulfillmentStatus;

type InventoryFilter = "All" | "Healthy Stock" | "Low Stock (< 5)";

interface FulfillmentLineItem {
  id: string;
  sku: string;
  name: string;
  storageLocation: string;
  quantity: number;
  serialPrefix: string;
  boundSerials: string[];
  thumbnail: string;
}

interface FulfillmentOrder {
  id: string;
  orderRef: string;
  transferredAt: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  destinationZone: string;
  deliveryInstructions: string;
  assignedRouteId: string;
  status: FulfillmentStatus;
  items: FulfillmentLineItem[];
  trackingTag: string;
  packedBy?: string;
  dispatchedAt?: string;
}

interface WarehouseInventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  storageLocation: string;
  zone: string;
  stockCount: number;
  minAlertThreshold: number;
  serialPrefix: string;
  lastIntakeDate: string;
  lastIntakeBatch: string;
  thumbnail: string;
  // Read-only catalog metadata (Controlled by Sales Dept)
  wattageSpec: string;
  salesPriceLockNote: string;
}

interface DeliveryRouteManifest {
  id: string;
  routeCode: string;
  truckName: string;
  driverName: string;
  driverPhone: string;
  vehiclePlate: string;
  departureBay: string;
  zoneCoverage: string;
}

// ==========================================
// 2. REALISTIC MOCK DATASETS
// ==========================================
const INITIAL_FULFILLMENT_ORDERS: FulfillmentOrder[] = [
  {
    id: "wh-ord-1",
    orderRef: "#VC-ORD-9098",
    transferredAt: "14 mins ago • Sales Verified",
    customerName: "David Miller",
    customerPhone: "092-555-0192",
    deliveryAddress: "Nichada Thani Premier, Soi Samakee 29, Pakkret, Nonthaburi",
    destinationZone: "Zone B - Nonthaburi / North",
    deliveryInstructions:
      "Detached House • Gate pass pre-registered • Keep AC outdoor condenser upright",
    assignedRouteId: "route-north-02",
    status: "Ready to Pick",
    trackingTag: "VC-TRK-8849201",
    items: [
      {
        id: "f-item-101",
        sku: "VC-AC-12K",
        name: "VoltCraft AeroChill Pro 12,000 BTU AC",
        storageLocation: "Aisle 1, Rack A-02",
        quantity: 1,
        serialPrefix: "SN-AC",
        boundSerials: [""],
        thumbnail:
          "https://images.unsplash.com/photo-1631545806609-35d4ae490431?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    id: "wh-ord-2",
    orderRef: "#VC-ORD-9099",
    transferredAt: "29 mins ago • Sales Verified",
    customerName: "Somchai T.",
    customerPhone: "081-774-3390",
    deliveryAddress: "The Issara Ladprao, Bldg B, 4th Fl, Chatuchak, Bangkok",
    destinationZone: "Zone A - Bangkok Metro",
    deliveryInstructions:
      "Condo 4th floor, freight elevator required • Call 30 mins before arrival",
    assignedRouteId: "route-bkk-01",
    status: "Ready to Pick",
    trackingTag: "VC-TRK-8849202",
    items: [
      {
        id: "f-item-201",
        sku: "VC-RV-600",
        name: "CleanSense LiDAR Robot Vacuum & Wash Dock",
        storageLocation: "Aisle 2, Rack C-11",
        quantity: 1,
        serialPrefix: "SN-RV",
        boundSerials: [""],
        thumbnail:
          "https://images.unsplash.com/photo-1589894404892-7310b92ea7a2?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "f-item-202",
        sku: "VC-AP-520",
        name: "VoltCraft PureBreathe Pro H13 HEPA Air Purifier",
        storageLocation: "Aisle 1, Rack B-04",
        quantity: 1,
        serialPrefix: "SN-AP",
        boundSerials: ["SN-AP-774102"],
        thumbnail:
          "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    id: "wh-ord-3",
    orderRef: "#VC-ORD-9095",
    transferredAt: "1 hr ago • Packed at Bay 4",
    customerName: "Siriporn M.",
    customerPhone: "084-332-1100",
    deliveryAddress: "412 Srinakarin Rd, Mueang, Samut Prakan",
    destinationZone: "Zone C - East & Samut Prakan",
    deliveryInstructions:
      "Fragile Schott Ceran glass top • Includes 20A breaker installation kit",
    assignedRouteId: "route-bkk-01",
    status: "Packed & S/N Bound",
    trackingTag: "VC-TRK-8849195",
    packedBy: "Picker #09 (Kittisak)",
    items: [
      {
        id: "f-item-301",
        sku: "VC-IC-32D",
        name: "DualZone Induction Cooktop 3200W",
        storageLocation: "Aisle 2, Rack D-01",
        quantity: 1,
        serialPrefix: "SN-IC",
        boundSerials: ["SN-IC-558291"],
        thumbnail:
          "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    id: "wh-ord-4",
    orderRef: "#VC-ORD-9090",
    transferredAt: "3 hrs ago • En Route",
    customerName: "Kanya P.",
    customerPhone: "089-665-1122",
    deliveryAddress: "88/12 Ratchaphruek Rd, Bang Kruai, Nonthaburi",
    destinationZone: "Zone B - Nonthaburi / North",
    deliveryInstructions:
      "2-Man Tailgate Lift Required • Unbox & haul away old refrigerator",
    assignedRouteId: "route-north-02",
    status: "Dispatched",
    trackingTag: "VC-TRK-8849180",
    packedBy: "Picker #04 (Noppadol)",
    dispatchedAt: "Today, 11:40",
    items: [
      {
        id: "f-item-401",
        sku: "VC-RF-19D",
        name: "ArcticLinear 4-Door Refrigerator 19.8 cu.ft.",
        storageLocation: "Aisle 3, Bulk Bay-04",
        quantity: 1,
        serialPrefix: "SN-RF",
        boundSerials: ["SN-RF-903418"],
        thumbnail:
          "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
];

const INITIAL_INVENTORY: WarehouseInventoryItem[] = [
  {
    id: "inv-1",
    sku: "VC-AC-12K",
    name: "VoltCraft AeroChill Pro 12,000 BTU Dual-Inverter AC",
    category: "Climate Control",
    storageLocation: "Aisle 1, Rack A-02",
    zone: "Zone A - Heavy HVAC",
    stockCount: 18,
    minAlertThreshold: 5,
    serialPrefix: "SN-AC",
    lastIntakeDate: "2 days ago",
    lastIntakeBatch: "LOT-2026-08A (+20)",
    wattageSpec: "950W • Dual Inverter",
    salesPriceLockNote: "Catalog Spec & Price Locked by Sales Ops",
    thumbnail:
      "https://images.unsplash.com/photo-1631545806609-35d4ae490431?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "inv-2",
    sku: "VC-RF-19D",
    name: "VoltCraft ArcticLinear 4-Door Refrigerator 19.8 cu.ft.",
    category: "Refrigeration",
    storageLocation: "Aisle 3, Bulk Bay-04",
    zone: "Zone C - Upright Bulk",
    stockCount: 6,
    minAlertThreshold: 3,
    serialPrefix: "SN-RF",
    lastIntakeDate: "5 days ago",
    lastIntakeBatch: "LOT-2026-07R (+8)",
    wattageSpec: "220W • Linear Inverter",
    salesPriceLockNote: "Catalog Spec & Price Locked by Sales Ops",
    thumbnail:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "inv-3",
    sku: "VC-RV-600",
    name: "VoltCraft CleanSense LiDAR Robot Vacuum & Wash Dock",
    category: "Smart Cleaning",
    storageLocation: "Aisle 2, Rack C-11",
    zone: "Zone B - Smart Robotics",
    stockCount: 22,
    minAlertThreshold: 8,
    serialPrefix: "SN-RV",
    lastIntakeDate: "Yesterday",
    lastIntakeBatch: "LOT-2026-09C (+15)",
    wattageSpec: "65W • 6,000Pa LiDAR",
    salesPriceLockNote: "Catalog Spec & Price Locked by Sales Ops",
    thumbnail:
      "https://images.unsplash.com/photo-1589894404892-7310b92ea7a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "inv-4",
    sku: "VC-AF-72L",
    name: "VoltCraft VortexFryer Touch XXL 7.2L",
    category: "Kitchen Tech",
    storageLocation: "Aisle 2, Rack C-05",
    zone: "Zone B - Small Appliances",
    stockCount: 3,
    minAlertThreshold: 5,
    serialPrefix: "SN-AF",
    lastIntakeDate: "12 days ago",
    lastIntakeBatch: "LOT-2026-05K (+12)",
    wattageSpec: "2000W • Cyclonic PID",
    salesPriceLockNote: "Catalog Spec & Price Locked by Sales Ops",
    thumbnail:
      "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "inv-5",
    sku: "VC-AP-520",
    name: "VoltCraft PureBreathe Pro H13 HEPA Air Purifier",
    category: "Air Quality",
    storageLocation: "Aisle 1, Rack B-04",
    zone: "Zone A - Clean Air",
    stockCount: 15,
    minAlertThreshold: 4,
    serialPrefix: "SN-AP",
    lastIntakeDate: "4 days ago",
    lastIntakeBatch: "LOT-2026-08P (+10)",
    wattageSpec: "48W • H13 True HEPA",
    salesPriceLockNote: "Catalog Spec & Price Locked by Sales Ops",
    thumbnail:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "inv-6",
    sku: "VC-IC-32D",
    name: "VoltCraft DualZone Induction Cooktop 3200W",
    category: "Kitchen Tech",
    storageLocation: "Aisle 2, Rack D-01",
    zone: "Zone B - Glass Hobs",
    stockCount: 0,
    minAlertThreshold: 3,
    serialPrefix: "SN-IC",
    lastIntakeDate: "19 days ago",
    lastIntakeBatch: "LOT-2026-03H (+6)",
    wattageSpec: "3200W • Dual Inverter Coil",
    salesPriceLockNote: "Catalog Spec & Price Locked by Sales Ops",
    thumbnail:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80",
  },
];

const DELIVERY_ROUTES: DeliveryRouteManifest[] = [
  {
    id: "route-bkk-01",
    routeCode: "MANIFEST-BKK-01",
    truckName: "Truck #01 - Central & East Bangkok Fleet",
    driverName: "Chaiwat Srisuk (White-Glove Lead)",
    driverPhone: "089-442-9910",
    vehiclePlate: "3ฒข-4821 BKK (Air-Ride Box Truck)",
    departureBay: "Loading Dock Bay #04",
    zoneCoverage: "Zone A & Zone C (Chatuchak, Lat Phrao, Samut Prakan)",
  },
  {
    id: "route-north-02",
    routeCode: "MANIFEST-NTH-02",
    truckName: "Truck #02 - North Bangkok & Nonthaburi Route",
    driverName: "Prasert Jongrak (HVAC Install Cert.)",
    driverPhone: "081-309-7752",
    vehiclePlate: "2ฒก-9104 BKK (Tailgate Hydraulic Lift)",
    departureBay: "Loading Dock Bay #02",
    zoneCoverage: "Zone B (Pakkret, Nonthaburi, Ratchaphruek)",
  },
];

// ==========================================
// 3. MAIN WAREHOUSE PORTAL COMPONENT
// ==========================================
export default function VoltCraftWarehousePortalPage() {
  // Navigation & Primary View State
  const [activeTab, setActiveTab] = useState<WarehouseTab>("fulfillment");

  // Tab 1: Fulfillment & S/N Binding States
  const [orders, setOrders] = useState<FulfillmentOrder[]>(
    INITIAL_FULFILLMENT_ORDERS
  );
  const [fulfillmentFilter, setFulfillmentFilter] =
    useState<FulfillmentFilter>("All");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [scanningTarget, setScanningTarget] = useState<{
    orderId: string;
    itemId: string;
    serialIndex: number;
  } | null>(null);
  const [pickSlipModalOrder, setPickSlipModalOrder] =
    useState<FulfillmentOrder | null>(null);

  // Tab 2: Physical Inventory & Restock States
  const [inventory, setInventory] =
    useState<WarehouseInventoryItem[]>(INITIAL_INVENTORY);
  const [inventoryFilter, setInventoryFilter] =
    useState<InventoryFilter>("All");
  const [inventorySearchQuery, setInventorySearchQuery] = useState("");
  const [restockModalItem, setRestockModalItem] =
    useState<WarehouseInventoryItem | null>(null);
  const [restockSelectedSku, setRestockSelectedSku] =
    useState<string>("VC-IC-32D");
  const [restockQty, setRestockQty] = useState<number>(10);
  const [restockBatchCode, setRestockBatchCode] = useState<string>(
    "LOT-2026-11W"
  );
  const [restockSupplierNote, setRestockSupplierNote] = useState<string>(
    "Factory QC Passed • Direct Pallet Intake Bay 4"
  );

  // Tab 3: Dispatch & Driver Manifest States
  const [selectedRouteFilter, setSelectedRouteFilter] =
    useState<string>("All");
  const [printableManifestOrder, setPrintableManifestOrder] =
    useState<FulfillmentOrder | null>(null);
  const [printableRouteSheet, setPrintableRouteSheet] =
    useState<DeliveryRouteManifest | null>(null);

  // Toast Notification State
  const [toast, setToast] = useState<{
    title: string;
    detail?: string;
    tone: "amber" | "emerald" | "blue" | "rose";
  } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  const triggerToast = (
    title: string,
    detail?: string,
    tone: "amber" | "emerald" | "blue" | "rose" = "emerald"
  ) => {
    setToast({ title, detail, tone });
  };

  // ==========================================
  // 4. DERIVED METRICS & FILTERED LISTS
  // ==========================================
  const fulfillmentMetrics = useMemo(() => {
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

  const inventoryMetrics = useMemo(() => {
    const lowStockItems = inventory.filter((i) => i.stockCount < 5);
    const outOfStockItems = inventory.filter((i) => i.stockCount === 0);
    const totalPhysicalUnits = inventory.reduce((sum, i) => sum + i.stockCount, 0);
    return {
      totalSkus: inventory.length,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
      totalPhysicalUnits,
    };
  }, [inventory]);

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

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      if (inventoryFilter === "Healthy Stock" && item.stockCount < 5) {
        return false;
      }
      if (inventoryFilter === "Low Stock (< 5)" && item.stockCount >= 5) {
        return false;
      }
      if (inventorySearchQuery.trim() !== "") {
        const q = inventorySearchQuery.toLowerCase();
        const matchSku = item.sku.toLowerCase().includes(q);
        const matchName = item.name.toLowerCase().includes(q);
        const matchLoc = item.storageLocation.toLowerCase().includes(q);
        if (!matchSku && !matchName && !matchLoc) return false;
      }
      return true;
    });
  }, [inventory, inventoryFilter, inventorySearchQuery]);

  // Helper to check S/N binding completion per order
  const getOrderSerialProgress = (order: FulfillmentOrder) => {
    let totalRequired = 0;
    let totalBound = 0;
    order.items.forEach((item) => {
      totalRequired += item.quantity;
      item.boundSerials.forEach((sn) => {
        if (sn && sn.trim().length >= 6) {
          totalBound += 1;
        }
      });
    });
    return {
      totalRequired,
      totalBound,
      isComplete: totalRequired > 0 && totalBound === totalRequired,
    };
  };

  // ==========================================
  // 5. OPERATIONAL HANDLERS
  // ==========================================

  // Manual S/N Input Handler
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

  // Interactive Simulate Hardware Laser Barcode Scan
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

  // Mark Order as Packed & Ready for Dispatch
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

  // Open Restock Modal (From specific card or bottom bar)
  const openRestockIntakeModal = (item?: WarehouseInventoryItem) => {
    if (item) {
      setRestockModalItem(item);
      setRestockSelectedSku(item.sku);
    } else {
      const defaultLowItem =
        inventory.find((i) => i.stockCount === 0) ||
        inventory.find((i) => i.stockCount < 5) ||
        inventory[0];
      setRestockModalItem(defaultLowItem);
      setRestockSelectedSku(defaultLowItem.sku);
    }
    setRestockQty(10);
    setRestockBatchCode(
      `LOT-2026-${Math.floor(10 + Math.random() * 89)}W`
    );
  };

  // Confirm Physical Stock Intake
  const handleConfirmRestockIntake = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSku = restockModalItem?.sku || restockSelectedSku;
    const addedUnits = Math.max(1, Number(restockQty) || 1);

    let updatedItemName = "";
    let updatedTotal = 0;

    setInventory((prev) =>
      prev.map((item) => {
        if (item.sku !== targetSku) return item;
        updatedItemName = item.name;
        updatedTotal = item.stockCount + addedUnits;
        return {
          ...item,
          stockCount: updatedTotal,
          lastIntakeDate: "Just now",
          lastIntakeBatch: `${restockBatchCode} (+${addedUnits})`,
        };
      })
    );

    triggerToast(
      `Restock Intake +${addedUnits} Units Added (${targetSku})`,
      `${updatedItemName} physical count updated to ${updatedTotal} units • Batch ${restockBatchCode} logged.`,
      "amber"
    );

    setRestockModalItem(null);
  };

  // Mark Single Order Out for Delivery
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

  // Dispatch Entire Route Truck
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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 pb-28">
      {/* =========================================================
          A. MOBILE HEADER & OPERATIONAL HUB (STICKY DARK FRAME)
      ========================================================= */}
      <div className="sticky top-0 z-40 shadow-xl">
        <header className="bg-slate-950/95 backdrop-blur-md text-slate-100 px-4 py-3 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            {/* Brand Logo + WAREHOUSE OPS Badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 shrink-0">
                <Zap className="w-6 h-6 fill-slate-950 stroke-[2.3]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                    Volt<span className="text-amber-500">Craft</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold uppercase tracking-wider">
                    WAREHOUSE OPS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block leading-none mt-0.5">
                  Physical Inventory, S/N Warranty Binding &amp; Fleet Dispatch Hub
                </p>
              </div>
            </div>

            {/* Right Status Pill & Sales Transfer Notification Counter */}
            <div className="flex items-center gap-2">
              <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Bay 4 - Active Dispatch</span>
                <span className="text-slate-600">|</span>
                <span className="font-mono text-amber-400">Scanner #HT-04</span>
              </div>

              {/* Mobile Compact Bay Pill */}
              <div className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Bay 4</span>
              </div>

              {/* Notification Bell / Ready to Pick Trigger (Min 48x48px) */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("fulfillment");
                  setFulfillmentFilter("Ready to Pick");
                }}
                aria-label="New Orders from Sales Queue"
                className="relative min-w-[48px] min-h-[48px] px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center gap-2 active:scale-95 transition-transform duration-150"
              >
                <ClipboardList className="w-5 h-5 text-amber-400" />
                <div className="text-left">
                  <span className="text-xs font-extrabold text-white block leading-none">
                    {fulfillmentMetrics.readyToPick}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    To Pick
                  </span>
                </div>
                {fulfillmentMetrics.readyToPick > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 ring-2 ring-slate-950" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Sticky Sub-Nav: Primary 3-Tab Segmented Control Pills */}
        <nav
          aria-label="Warehouse Operations Navigation"
          className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5"
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5">
            <div className="grid grid-cols-3 bg-slate-900 p-1 rounded-2xl border border-slate-800 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("fulfillment")}
                className={`min-h-[48px] px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 transition-all duration-150 ${
                  activeTab === "fulfillment"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Barcode className="w-4 h-4 shrink-0 stroke-[2.2]" />
                <span className="truncate">Fulfillment Orders</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold shrink-0 ${
                    activeTab === "fulfillment"
                      ? "bg-slate-950 text-amber-400"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  {fulfillmentMetrics.readyToPick}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("inventory")}
                className={`min-h-[48px] px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 transition-all duration-150 ${
                  activeTab === "inventory"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Layers className="w-4 h-4 shrink-0 stroke-[2.2]" />
                <span className="truncate">Physical Stock</span>
                {inventoryMetrics.lowStockCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold shrink-0 ${
                      activeTab === "inventory"
                        ? "bg-slate-950 text-rose-400"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    }`}
                  >
                    {inventoryMetrics.lowStockCount} Low
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("dispatch")}
                className={`min-h-[48px] px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 transition-all duration-150 ${
                  activeTab === "dispatch"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Truck className="w-4 h-4 shrink-0 stroke-[2.2]" />
                <span className="truncate">Dispatch &amp; Drivers</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold shrink-0 ${
                    activeTab === "dispatch"
                      ? "bg-slate-950 text-amber-400"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                  }`}
                >
                  {DELIVERY_ROUTES.length}
                </span>
              </button>
            </div>

            {/* Desktop Quick Stats Strip */}
            <div className="hidden lg:flex items-center gap-3 text-xs">
              <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <span className="text-slate-400">
                  Total Floor Units:{" "}
                  <strong className="text-white font-extrabold">
                    {inventoryMetrics.totalPhysicalUnits}
                  </strong>
                </span>
                <span className="text-slate-700">|</span>
                <span className="text-slate-400">
                  S/N Packed:{" "}
                  <strong className="text-emerald-400 font-extrabold">
                    {fulfillmentMetrics.packed}
                  </strong>
                </span>
                <span className="text-slate-700">|</span>
                <span className="text-slate-400">
                  Dispatched:{" "}
                  <strong className="text-blue-400 font-extrabold">
                    {fulfillmentMetrics.dispatched}
                  </strong>
                </span>
              </div>

              <button
                type="button"
                onClick={() => openRestockIntakeModal()}
                className="min-h-[48px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all duration-150"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Restock Intake</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* =========================================================
          MAIN OPERATIONAL WORKSPACE
      ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 pt-4">
        {/* Role Scope Compliance Banner */}
        <div className="mb-4 bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-extrabold shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              Role Scope: Warehouse &amp; Logistics Authority
            </span>
            <p className="text-slate-300">
              Authorized for physical stock intake, S/N barcode warranty binding &amp; fleet
              dispatch.{" "}
              <span className="text-slate-400">
                (Catalog product names, specs, and selling prices are locked by Sales Ops).
              </span>
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 shrink-0">
            ● Handheld Scanner Ready
          </span>
        </div>

        {/* =========================================================
            TAB 1: ORDER FULFILLMENT & S/N BARCODE BINDING
        ========================================================= */}
        {activeTab === "fulfillment" && (
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
                {filteredOrders.map((order) => {
                  const progress = getOrderSerialProgress(order);
                  const isReadyToPick = order.status === "Ready to Pick";
                  const isPacked = order.status === "Packed & S/N Bound";
                  const isDispatched = order.status === "Dispatched";

                  return (
                    <article
                      key={order.id}
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
                })}
              </div>
            )}
          </section>
        )}

        {/* =========================================================
            TAB 2: PHYSICAL INVENTORY & RESTOCK MANAGEMENT
        ========================================================= */}
        {activeTab === "inventory" && (
          <section aria-label="Physical Inventory Management" className="space-y-4">
            {/* Search & Stock Health Filter Bar */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 shadow-md space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={inventorySearchQuery}
                    onChange={(e) => setInventorySearchQuery(e.target.value)}
                    placeholder="Search physical inventory by SKU (e.g. VC-AC-12K), Appliance Name, or Aisle/Rack..."
                    className="w-full h-12 pl-10 pr-10 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {inventorySearchQuery && (
                    <button
                      type="button"
                      onClick={() => setInventorySearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => openRestockIntakeModal()}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Receive Pallet Intake</span>
                </button>
              </div>

              {/* Stock Status Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
                {(
                  ["All", "Healthy Stock", "Low Stock (< 5)"] as InventoryFilter[]
                ).map((filterLabel) => {
                  const isSelected = inventoryFilter === filterLabel;
                  return (
                    <button
                      key={filterLabel}
                      type="button"
                      onClick={() => setInventoryFilter(filterLabel)}
                      className={`shrink-0 min-h-[48px] px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 active:scale-95 transition-all duration-150 ${
                        isSelected
                          ? "bg-amber-500 text-slate-950 border-amber-500"
                          : filterLabel === "Low Stock (< 5)"
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                          : "bg-slate-900 text-slate-300 border-slate-800"
                      }`}
                    >
                      {filterLabel === "Low Stock (< 5)" && (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      <span>{filterLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInventory.map((item) => {
                const isLowStock = item.stockCount < 5;
                const isOutOfStock = item.stockCount === 0;

                return (
                  <article
                    key={item.id}
                    className={`bg-slate-950 rounded-2xl p-4 sm:p-5 shadow-md border flex flex-col justify-between gap-4 ${
                      isOutOfStock
                        ? "border-rose-500/60"
                        : isLowStock
                        ? "border-amber-500/50"
                        : "border-slate-800"
                    }`}
                  >
                    <div className="space-y-3.5">
                      {/* Top Row: Location Badge + Stock Alert Status */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-extrabold">
                          📍 {item.storageLocation}
                        </span>

                        {isLowStock ? (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-extrabold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {isOutOfStock ? "OUT OF STOCK (0)" : "LOW STOCK (< 5)"}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                            ● Healthy Stock
                          </span>
                        )}
                      </div>

                      {/* Appliance Thumbnail & Read-Only Catalog Info */}
                      <div className="flex items-start gap-3.5">
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-20 h-20 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-extrabold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              {item.sku}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate">
                              {item.zone}
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-white mt-1 line-clamp-2 leading-snug">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {item.wattageSpec} • S/N Prefix:{" "}
                            <span className="font-mono text-slate-300">
                              {item.serialPrefix}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Live Physical Stock Counter Panel */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Physical Units on Floor
                          </span>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span
                              className={`text-3xl font-extrabold font-mono ${
                                isLowStock ? "text-rose-400" : "text-white"
                              }`}
                            >
                              {item.stockCount}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">
                              units (Min Alert: {item.minAlertThreshold})
                            </span>
                          </div>
                        </div>

                        <div className="text-right text-[11px] text-slate-400">
                          <span className="block">Last Intake: {item.lastIntakeDate}</span>
                          <span className="font-mono text-slate-300 font-semibold">
                            {item.lastIntakeBatch}
                          </span>
                        </div>
                      </div>

                      {/* Role Access Note */}
                      <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
                        <span>🔒 {item.salesPriceLockNote}</span>
                      </div>
                    </div>

                    {/* Restock Intake Action Button (Min 48px height) */}
                    <button
                      type="button"
                      onClick={() => openRestockIntakeModal(item)}
                      className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all duration-150"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Add Stock Intake (+ Receive Units)</span>
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* =========================================================
            TAB 3: DISPATCH & LOGISTICS MANIFESTS
        ========================================================= */}
        {activeTab === "dispatch" && (
          <section aria-label="Dispatch and Driver Manifests" className="space-y-5">
            {/* Route Selector Pills */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedRouteFilter("All")}
                  className={`min-h-[48px] px-4 py-2 rounded-xl text-xs font-bold border active:scale-95 transition-all ${
                    selectedRouteFilter === "All"
                      ? "bg-amber-500 text-slate-950 border-amber-500"
                      : "bg-slate-900 text-slate-300 border-slate-800"
                  }`}
                >
                  All Fleet Trucks ({DELIVERY_ROUTES.length})
                </button>
                {DELIVERY_ROUTES.map((rt) => (
                  <button
                    key={rt.id}
                    type="button"
                    onClick={() => setSelectedRouteFilter(rt.id)}
                    className={`min-h-[48px] px-4 py-2 rounded-xl text-xs font-bold border active:scale-95 transition-all ${
                      selectedRouteFilter === rt.id
                        ? "bg-amber-500 text-slate-950 border-amber-500"
                        : "bg-slate-900 text-slate-300 border-slate-800"
                    }`}
                  >
                    {rt.truckName.split(" - ")[0]} ({rt.routeCode})
                  </button>
                ))}
              </div>
            </div>

            {/* Route Delivery Sheets */}
            <div className="space-y-6">
              {DELIVERY_ROUTES.filter(
                (r) =>
                  selectedRouteFilter === "All" || r.id === selectedRouteFilter
              ).map((route) => {
                const assignedOrders = orders.filter(
                  (o) => o.assignedRouteId === route.id
                );
                const packedReadyCount = assignedOrders.filter(
                  (o) => o.status === "Packed & S/N Bound"
                ).length;

                return (
                  <div
                    key={route.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-md"
                  >
                    {/* Route Truck Header */}
                    <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-mono text-xs font-extrabold">
                            {route.routeCode}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 text-xs font-bold">
                            {route.departureBay}
                          </span>
                          <span className="text-xs text-slate-400">
                            {route.zoneCoverage}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-extrabold text-white pt-1">
                          {route.truckName}
                        </h3>
                        <p className="text-xs text-slate-300">
                          Driver:{" "}
                          <strong className="text-white">{route.driverName}</strong> (
                          {route.driverPhone}) • Plate:{" "}
                          <span className="font-mono text-amber-400 font-bold">
                            {route.vehiclePlate}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setPrintableRouteSheet(route)}
                          className="min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 active:scale-95 transition-all"
                        >
                          <Printer className="w-4 h-4 text-amber-400" />
                          <span>Print Route Manifest Sheet</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDispatchEntireRoute(route)}
                          className="min-h-[48px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-2 active:scale-95 transition-all shadow-md"
                        >
                          <Truck className="w-4 h-4 stroke-[2.3]" />
                          <span>
                            Dispatch Ready Drops ({packedReadyCount})
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Multi-Drop Order Stops Table / Cards */}
                    <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {assignedOrders.map((ord, dropIdx) => {
                        const progress = getOrderSerialProgress(ord);
                        return (
                          <div
                            key={ord.id}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3"
                          >
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs flex items-center justify-center">
                                    #{dropIdx + 1}
                                  </span>
                                  <span className="font-mono text-sm font-extrabold text-white">
                                    {ord.orderRef}
                                  </span>
                                </div>

                                <span
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                                    ord.status === "Dispatched"
                                      ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                                      : ord.status === "Packed & S/N Bound"
                                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                  }`}
                                >
                                  {ord.status}
                                </span>
                              </div>

                              <div>
                                <p className="text-xs font-bold text-white">
                                  {ord.customerName} ({ord.customerPhone})
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {ord.deliveryAddress}
                                </p>
                              </div>

                              {/* Items & Bound S/Ns summary */}
                              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 space-y-1">
                                {ord.items.map((it) => (
                                  <div
                                    key={it.id}
                                    className="flex items-center justify-between text-xs"
                                  >
                                    <span className="text-slate-300 truncate">
                                      {it.quantity}x {it.sku}
                                    </span>
                                    <span className="font-mono text-[11px] text-emerald-400 font-bold">
                                      S/N:{" "}
                                      {it.boundSerials.filter(Boolean).join(", ") ||
                                        "Pending Scan"}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setPrintableManifestOrder(ord)}
                                className="flex-1 min-h-[48px] px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                              >
                                <Printer className="w-3.5 h-3.5 text-amber-400" />
                                <span>Print Shipping Label</span>
                              </button>

                              {ord.status !== "Dispatched" ? (
                                <button
                                  type="button"
                                  onClick={() => handleDispatchOrder(ord)}
                                  className={`flex-1 min-h-[48px] px-3 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
                                    progress.isComplete
                                      ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                                      : "bg-slate-800 text-slate-500 border border-slate-700"
                                  }`}
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>Mark Out for Delivery</span>
                                </button>
                              ) : (
                                <span className="flex-1 min-h-[48px] px-3 py-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center justify-center gap-1.5">
                                  <Check className="w-4 h-4" />
                                  In Transit
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* =========================================================
          B. MOBILE BOTTOM ACTION BAR (FIXED INDUSTRIAL UTILITY BAR)
      ========================================================= */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-4 py-2.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Live Inventory Health Summary Chip */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("inventory");
              setInventoryFilter("Low Stock (< 5)");
            }}
            className="min-h-[48px] px-3.5 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-2 text-xs font-extrabold active:scale-95 transition-transform"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="text-left">
              <span className="block leading-tight">
                {inventoryMetrics.lowStockCount} items low stock (&lt; 5 units)
              </span>
              <span className="text-[10px] text-rose-200/80 font-normal">
                Tap to filter critical SKUs
              </span>
            </div>
          </button>

          {/* Floating + Restock Intake CTA */}
          <button
            type="button"
            onClick={() => openRestockIntakeModal()}
            className="min-h-[48px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-150 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Restock Intake</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          MODAL 1: ADD STOCK INTAKE (PHYSICAL RESTOCK RECEIVING)
      ========================================================= */}
      {restockModalItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setRestockModalItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-950 w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-slate-800 overflow-hidden shadow-2xl"
          >
            <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Add Physical Stock Intake
                  </h3>
                  <p className="text-xs text-slate-400">
                    Log factory pallet receiving &amp; update warehouse floor count
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRestockModalItem(null)}
                className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRestockIntake} className="p-5 space-y-4">
              {/* Target SKU Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Select Target Appliance SKU
                </label>
                <select
                  value={restockModalItem.sku}
                  onChange={(e) => {
                    const found = inventory.find((i) => i.sku === e.target.value);
                    if (found) setRestockModalItem(found);
                  }}
                  className="w-full h-12 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {inventory.map((inv) => (
                    <option key={inv.id} value={inv.sku}>
                      {inv.sku} — {inv.name} (Current: {inv.stockCount} units)
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Location & Live Preview */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Storage Bin Location</span>
                  <strong className="text-amber-400 font-bold">
                    {restockModalItem.storageLocation}
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">New Stock Projection</span>
                  <strong className="text-sm font-extrabold text-emerald-400 font-mono">
                    {restockModalItem.stockCount} →{" "}
                    {restockModalItem.stockCount + Math.max(1, restockQty)} units
                  </strong>
                </div>
              </div>

              {/* Quick Stepper & Quantity Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Received Intake Quantity (Units)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRestockQty((q) => Math.max(1, q - 5))}
                    className="min-w-[48px] min-h-[48px] rounded-xl bg-slate-900 border border-slate-700 text-white flex items-center justify-center active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={restockQty}
                    onChange={(e) =>
                      setRestockQty(Math.max(1, Number(e.target.value) || 1))
                    }
                    className="flex-1 h-12 px-4 rounded-xl bg-slate-900 border border-slate-700 text-center text-lg font-extrabold font-mono text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setRestockQty((q) => q + 5)}
                    className="min-w-[48px] min-h-[48px] rounded-xl bg-slate-900 border border-slate-700 text-white flex items-center justify-center active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Preset Intake Buttons */}
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[5, 10, 20, 50].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRestockQty(preset)}
                      className={`py-2 rounded-lg text-xs font-bold border ${
                        restockQty === preset
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                          : "bg-slate-900 text-slate-400 border-slate-800"
                      }`}
                    >
                      +{preset} Units
                    </button>
                  ))}
                </div>
              </div>

              {/* Factory Batch Lot Code & Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    Factory Lot / Batch ID
                  </label>
                  <input
                    type="text"
                    value={restockBatchCode}
                    onChange={(e) => setRestockBatchCode(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    Receiving Dock Note
                  </label>
                  <input
                    type="text"
                    value={restockSupplierNote}
                    onChange={(e) => setRestockSupplierNote(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRestockModalItem(null)}
                  className="min-h-[48px] px-5 py-2.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[48px] py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Confirm +{restockQty} Units Intake</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: PRINTABLE PICK & PACK SLIP VIEW
      ========================================================= */}
      {pickSlipModalOrder && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPickSlipModalOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-slate-900 w-full max-w-lg rounded-2xl border border-slate-300 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-mono text-xs font-bold">
                  VOLTCRAFT PICK &amp; PACK SLIP
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1 font-mono">
                  {pickSlipModalOrder.orderRef}
                </h3>
                <p className="text-xs text-slate-500">
                  {pickSlipModalOrder.destinationZone} • Tracking:{" "}
                  {pickSlipModalOrder.trackingTag}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPickSlipModalOrder(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
              <p className="font-bold text-slate-900">
                Ship To: {pickSlipModalOrder.customerName} (
                {pickSlipModalOrder.customerPhone})
              </p>
              <p className="text-slate-600">{pickSlipModalOrder.deliveryAddress}</p>
              <p className="text-amber-800 font-semibold pt-1">
                Handling: {pickSlipModalOrder.deliveryInstructions}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Warehouse Aisle / Rack Pick Locations:
              </p>
              {pickSlipModalOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-extrabold text-slate-900">
                      {item.sku} (Qty: {item.quantity})
                    </span>
                    <p className="text-slate-600">{item.name}</p>
                    <p className="font-mono text-[11px] text-emerald-700 font-bold mt-0.5">
                      Bound S/N: {item.boundSerials.filter(Boolean).join(", ") || "UNBOUND"}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 font-extrabold shrink-0">
                    {item.storageLocation}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPickSlipModalOrder(null)}
                className="min-h-[48px] px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerToast(
                    `Pick Slip Sent to Thermal Printer (${pickSlipModalOrder.orderRef})`,
                    "Printed at Bay 4 Zebra Label Station.",
                    "amber"
                  );
                  setPickSlipModalOrder(null);
                }}
                className="flex-1 min-h-[48px] py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print on Bay 4 Thermal Printer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: PRINTABLE SHIPPING LABEL / ROUTE MANIFEST
      ========================================================= */}
      {(printableManifestOrder || printableRouteSheet) && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setPrintableManifestOrder(null);
            setPrintableRouteSheet(null);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-slate-900 w-full max-w-lg rounded-2xl border border-slate-300 p-6 space-y-4 shadow-2xl"
          >
            {printableManifestOrder ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-mono text-xs font-bold">
                      VOLTCRAFT DIRECT SHIPPING LABEL
                    </span>
                    <h3 className="text-lg font-extrabold font-mono mt-1">
                      {printableManifestOrder.trackingTag}
                    </h3>
                  </div>
                  <Barcode className="w-10 h-10 text-slate-900" />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Order Ref:</span>
                    <strong className="font-mono">
                      {printableManifestOrder.orderRef}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Recipient:</span>
                    <strong>
                      {printableManifestOrder.customerName} (
                      {printableManifestOrder.customerPhone})
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Delivery Address:</span>
                    <strong className="text-slate-900">
                      {printableManifestOrder.deliveryAddress}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    triggerToast(
                      `Shipping Label ${printableManifestOrder.trackingTag} Printed`,
                      "Ready to attach to outer appliance carton.",
                      "blue"
                    );
                    setPrintableManifestOrder(null);
                  }}
                  className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Confirm Print Shipping Label</span>
                </button>
              </>
            ) : (
              printableRouteSheet && (
                <>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-mono text-xs font-bold">
                        DRIVER MULTI-DROP MANIFEST
                      </span>
                      <h3 className="text-lg font-extrabold mt-1">
                        {printableRouteSheet.truckName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Driver: {printableRouteSheet.driverName} • Plate:{" "}
                        {printableRouteSheet.vehiclePlate}
                      </p>
                    </div>
                    <Truck className="w-8 h-8 text-slate-900" />
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {orders
                      .filter((o) => o.assignedRouteId === printableRouteSheet.id)
                      .map((o, i) => (
                        <div
                          key={o.id}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                        >
                          <div>
                            <strong className="font-mono">
                              Stop #{i + 1}: {o.orderRef}
                            </strong>{" "}
                            — {o.customerName}
                            <p className="text-slate-500 truncate max-w-xs">
                              {o.deliveryAddress}
                            </p>
                          </div>
                          <span className="font-mono text-[11px] font-bold text-slate-700">
                            {o.status}
                          </span>
                        </div>
                      ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      triggerToast(
                        `Driver Manifest ${printableRouteSheet.routeCode} Printed`,
                        `Handed over to ${printableRouteSheet.driverName}.`,
                        "blue"
                      );
                      setPrintableRouteSheet(null);
                    }}
                    className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Driver Route Sheet</span>
                  </button>
                </>
              )
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          6. SELF-CONTAINED TOAST NOTIFICATION OVERLAY
      ========================================================= */}
      {toast && (
        <div className="fixed bottom-24 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-24 z-50 max-w-md mx-auto sm:mx-0">
          <div
            className={`p-3.5 rounded-2xl border shadow-2xl flex items-start gap-3 backdrop-blur-md bg-slate-950/95 text-white ${
              toast.tone === "emerald"
                ? "border-emerald-500/60"
                : toast.tone === "amber"
                ? "border-amber-500/60"
                : toast.tone === "blue"
                ? "border-blue-500/60"
                : "border-rose-500/60"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                toast.tone === "emerald"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : toast.tone === "amber"
                  ? "bg-amber-500/20 text-amber-300"
                  : toast.tone === "blue"
                  ? "bg-blue-500/20 text-blue-300"
                  : "bg-rose-500/20 text-rose-300"
              }`}
            >
              {toast.tone === "emerald" && <CheckCircle2 className="w-5 h-5" />}
              {toast.tone === "amber" && <Zap className="w-5 h-5" />}
              {toast.tone === "blue" && <Truck className="w-5 h-5" />}
              {toast.tone === "rose" && <AlertTriangle className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-white">{toast.title}</p>
              {toast.detail && (
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  {toast.detail}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}