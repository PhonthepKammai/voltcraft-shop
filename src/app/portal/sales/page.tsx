"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Zap,
  Package,
  ShoppingCart,
  Tag,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Phone,
  Eye,
  ArrowRight,
  Check,
  X,
  SlidersHorizontal,
  Image,
  DollarSign,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================
type ActivePortalTab = "orders" | "catalog";

type OrderStatus = "Pending Verification" | "Approved" | "Payment Issue";

type OrderFilterType = "All" | OrderStatus;

type ApplianceCategory =
  | "All"
  | "ACs"
  | "Refrigeration"
  | "Cleaning"
  | "Kitchen"
  | "Air Purifiers";

type EnergyStarRating =
  | "No. 5 ★★★"
  | "No. 5 ★★"
  | "No. 5 ★"
  | "Standard Certified";

interface OrderLineItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unitPriceTHB: number;
  thumbnail: string;
  isServiceAddOn?: boolean;
}

interface SalesOrder {
  id: string;
  orderRef: string;
  timestamp: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryNotes: string[];
  items: OrderLineItem[];
  totalAmountTHB: number;
  paymentMethod: "Bank Wire Transfer Slip" | "PromptPay QR Slip" | "Instant Card Auth";
  paymentReference: string;
  slipBankName: string;
  slipTransferredTime: string;
  slipImageUrl: string;
  status: OrderStatus;
  warehouseQueueTag?: string;
  salesIssueNote?: string;
  verifiedBy?: string;
}

interface CatalogAppliance {
  id: string;
  sku: string;
  name: string;
  category: Exclude<ApplianceCategory, "All">;
  description: string;
  priceTHB: number;
  originalPriceTHB: number;
  wattage: number;
  inverter: boolean;
  energyRating: EnergyStarRating;
  dimensionsCm: string;
  warehouseStock: number; // Strictly Read-Only for Sales Role
  published: boolean;
  imageUrl: string;
  updatedAt: string;
}

interface ApplianceFormState {
  id?: string;
  name: string;
  sku: string;
  category: Exclude<ApplianceCategory, "All">;
  description: string;
  wattage: number;
  inverter: boolean;
  energyRating: EnergyStarRating;
  dimensionsCm: string;
  priceTHB: number;
  originalPriceTHB: number;
  published: boolean;
  imageUrl: string;
  warehouseStock: number; // Preserved read-only display
}

// ==========================================
// 2. REALISTIC MOCK DATASETS
// ==========================================
const INITIAL_ORDERS: SalesOrder[] = [
  {
    id: "ord-1",
    orderRef: "#VC-9102",
    timestamp: "12 mins ago • Today, 14:22",
    customerName: "Thanaporn S.",
    customerPhone: "089-123-4567",
    deliveryAddress: "The Line Vibe Sukhumvit, Bldg A, 8th Fl, Chatuchak, Bangkok",
    deliveryNotes: [
      "Elevator Available: Yes (8th floor Freight)",
      "Installation Required",
      "Haul-away Old Unit",
    ],
    items: [
      {
        id: "li-101",
        sku: "VC-AC-12K",
        name: "AeroChill Pro 12,000 BTU Dual-Inverter AC",
        quantity: 1,
        unitPriceTHB: 18900,
        thumbnail:
          "https://images.unsplash.com/photo-1631545806609-35d4ae490431?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "li-102",
        sku: "VC-SRV-MNT",
        name: "Wall Mounting & Copper Line Commissioning Service",
        quantity: 1,
        unitPriceTHB: 1200,
        thumbnail:
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
        isServiceAddOn: true,
      },
    ],
    totalAmountTHB: 20100,
    paymentMethod: "PromptPay QR Slip",
    paymentReference: "KBank-PP-2026994812",
    slipBankName: "KASIKORNBANK (K-PLUS)",
    slipTransferredTime: "Today, 14:19:45",
    slipImageUrl:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=700&q=80",
    status: "Pending Verification",
  },
  {
    id: "ord-2",
    orderRef: "#VC-9103",
    timestamp: "28 mins ago • Today, 14:06",
    customerName: "Nattawut K.",
    customerPhone: "081-987-6543",
    deliveryAddress: "98/42 Centro Chaiyaphruek, Detached House, Pakkret, Nonthaburi",
    deliveryNotes: [
      "Ground Floor Kitchen Access",
      "Doorframe Clearance Verified (90cm)",
      "Voltage Stabilizer Check Requested",
    ],
    items: [
      {
        id: "li-201",
        sku: "VC-RF-19D",
        name: "ArcticLinear 4-Door Refrigerator 19.8 cu.ft.",
        quantity: 1,
        unitPriceTHB: 32500,
        thumbnail:
          "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=600&q=80",
      },
    ],
    totalAmountTHB: 32500,
    paymentMethod: "Bank Wire Transfer Slip",
    paymentReference: "SCB-EASY-8837104",
    slipBankName: "SCB Siam Commercial Bank",
    slipTransferredTime: "Today, 14:04:11",
    slipImageUrl:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=700&q=80",
    status: "Pending Verification",
  },
  {
    id: "ord-3",
    orderRef: "#VC-9104",
    timestamp: "45 mins ago • Today, 13:49",
    customerName: "Pimchanok V.",
    customerPhone: "086-441-8890",
    deliveryAddress: "Noble Around Ari, 22nd Fl, Phaya Thai, Bangkok",
    deliveryNotes: [
      "Elevator Available: Yes (22nd floor)",
      "Deliver After 16:00 Only",
    ],
    items: [
      {
        id: "li-301",
        sku: "VC-AP-520",
        name: "PureBreathe Pro H13 HEPA Air Purifier",
        quantity: 2,
        unitPriceTHB: 8900,
        thumbnail:
          "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80",
      },
    ],
    totalAmountTHB: 17800,
    paymentMethod: "Instant Card Auth",
    paymentReference: "AUTH-VISA-4491",
    slipBankName: "2C2P Visa Platinum 3DS Verified",
    slipTransferredTime: "Today, 13:48:52",
    slipImageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=700&q=80",
    status: "Pending Verification",
  },
  {
    id: "ord-4",
    orderRef: "#VC-9098",
    timestamp: "1 hr ago • Today, 13:10",
    customerName: "David Miller",
    customerPhone: "092-555-0192",
    deliveryAddress: "Nichada Thani Premier, Soi Samakee 29, Pakkret, Nonthaburi",
    deliveryNotes: [
      "English-Speaking Technician Preferred",
      "Gate Pass Pre-Registered",
    ],
    items: [
      {
        id: "li-401",
        sku: "VC-RV-600",
        name: "CleanSense LiDAR Robot Vacuum & Wash Dock",
        quantity: 1,
        unitPriceTHB: 16900,
        thumbnail:
          "https://images.unsplash.com/photo-1589894404892-7310b92ea7a2?auto=format&fit=crop&w=600&q=80",
      },
    ],
    totalAmountTHB: 16900,
    paymentMethod: "Instant Card Auth",
    paymentReference: "AUTH-MC-9012",
    slipBankName: "Mastercard World Elite 3DS",
    slipTransferredTime: "Today, 13:09:10",
    slipImageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=700&q=80",
    status: "Approved",
    warehouseQueueTag: "Ready to Pick • Bay #W-03",
    verifiedBy: "Sales Rep #04 (13:18)",
  },
  {
    id: "ord-5",
    orderRef: "#VC-9095",
    timestamp: "2 hrs ago • Today, 12:15",
    customerName: "Siriporn M.",
    customerPhone: "084-332-1100",
    deliveryAddress: "412 Srinakarin Rd, Mueang, Samut Prakan",
    deliveryNotes: [
      "Countertop Cutout Required",
      "20A Dedicated Breaker Check",
    ],
    items: [
      {
        id: "li-501",
        sku: "VC-IC-32D",
        name: "DualZone Induction Cooktop 3200W",
        quantity: 1,
        unitPriceTHB: 6990,
        thumbnail:
          "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80",
      },
    ],
    totalAmountTHB: 6990,
    paymentMethod: "Bank Wire Transfer Slip",
    paymentReference: "BBL-SLIP-77120",
    slipBankName: "Bangkok Bank (Bualuang mBanking)",
    slipTransferredTime: "Today, 12:12:04",
    slipImageUrl:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=700&q=80",
    status: "Payment Issue",
    salesIssueNote:
      "Slip image cropped at bottom — missing ฿990 partial balance & bank reference ID. Called customer to re-upload.",
  },
];

const INITIAL_CATALOG: CatalogAppliance[] = [
  {
    id: "cat-1",
    sku: "VC-AC-12K",
    name: "VoltCraft AeroChill Pro 12,000 BTU Dual-Inverter AC",
    category: "ACs",
    description:
      "Gen-3 Twin-Rotary Dual Inverter compressor with rapid 45-second turbo cooling, 19dB whisper acoustic profile, and built-in Wi-Fi energy telemetry.",
    priceTHB: 18900,
    originalPriceTHB: 21900,
    wattage: 950,
    inverter: true,
    energyRating: "No. 5 ★★★",
    dimensionsCm: "83.7 x 30.8 x 18.9 cm",
    warehouseStock: 18,
    published: true,
    imageUrl:
      "https://images.unsplash.com/photo-1631545806609-35d4ae490431?auto=format&fit=crop&w=800&q=85",
    updatedAt: "10 mins ago",
  },
  {
    id: "cat-2",
    sku: "VC-RF-19D",
    name: "VoltCraft ArcticLinear 4-Door Refrigerator 19.8 cu.ft.",
    category: "Refrigeration",
    description:
      "Multi-airflow linear inverter refrigeration with zero-clearance matte slate doors, convertible soft-freeze bio zone, and UV-C hygiene filter.",
    priceTHB: 32500,
    originalPriceTHB: 36900,
    wattage: 220,
    inverter: true,
    energyRating: "No. 5 ★★★",
    dimensionsCm: "83.5 x 178.5 x 73.0 cm",
    warehouseStock: 6,
    published: true,
    imageUrl:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=85",
    updatedAt: "1 hr ago",
  },
  {
    id: "cat-3",
    sku: "VC-RV-600",
    name: "VoltCraft CleanSense LiDAR Robot Vacuum & Wash Dock",
    category: "Cleaning",
    description:
      "6,000Pa suction power with DToF 3D LiDAR mapping, dual pressurized rotary mops, and 60°C hot-water auto-washing thermal base station.",
    priceTHB: 16900,
    originalPriceTHB: 19900,
    wattage: 65,
    inverter: false,
    energyRating: "No. 5 ★★",
    dimensionsCm: "35.0 x 9.7 x 35.0 cm",
    warehouseStock: 22,
    published: true,
    imageUrl:
      "https://images.unsplash.com/photo-1589894404892-7310b92ea7a2?auto=format&fit=crop&w=800&q=85",
    updatedAt: "2 hrs ago",
  },
  {
    id: "cat-4",
    sku: "VC-AF-72L",
    name: "VoltCraft VortexFryer Touch XXL 7.2L",
    category: "Kitchen",
    description:
      "360° high-velocity thermo-cyclonic air fryer with double-glazed viewing window, 12 digital PID presets, and ceramic non-stick basket.",
    priceTHB: 4290,
    originalPriceTHB: 5290,
    wattage: 2000,
    inverter: false,
    energyRating: "No. 5 ★",
    dimensionsCm: "32.5 x 31.0 x 39.2 cm",
    warehouseStock: 3,
    published: true,
    imageUrl:
      "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=85",
    updatedAt: "Yesterday",
  },
  {
    id: "cat-5",
    sku: "VC-AP-520",
    name: "VoltCraft PureBreathe Pro H13 HEPA Air Purifier",
    category: "Air Purifiers",
    description:
      "Medical-grade H13 True HEPA 360° drum filter with CADR 520 m³/h coverage, dual PM2.5/VOC laser sensors, and brushless inverter fan.",
    priceTHB: 8900,
    originalPriceTHB: 10500,
    wattage: 48,
    inverter: true,
    energyRating: "No. 5 ★★★",
    dimensionsCm: "29.0 x 58.5 x 29.0 cm",
    warehouseStock: 15,
    published: true,
    imageUrl:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=85",
    updatedAt: "Yesterday",
  },
  {
    id: "cat-6",
    sku: "VC-IC-32D",
    name: "VoltCraft DualZone Induction Cooktop 3200W",
    category: "Kitchen",
    description:
      "Continuous low-wattage inverter induction coils with genuine German Schott Ceran® ceramic glass and dual independent boost zones.",
    priceTHB: 6990,
    originalPriceTHB: 8490,
    wattage: 3200,
    inverter: true,
    energyRating: "No. 5 ★★",
    dimensionsCm: "73.0 x 6.2 x 43.0 cm",
    warehouseStock: 0,
    published: true,
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=85",
    updatedAt: "3 days ago",
  },
];

const CATEGORIES: ApplianceCategory[] = [
  "All",
  "ACs",
  "Refrigeration",
  "Cleaning",
  "Kitchen",
  "Air Purifiers",
];

function formatTHB(amount: number): string {
  return `฿${Math.round(amount).toLocaleString()}`;
}

function formatUSD(amountTHB: number): string {
  return `$${Math.round(amountTHB / 34.5).toLocaleString()}`;
}

function calculateDiscountPercent(selling: number, original: number): number {
  if (!original || original <= selling) return 0;
  return Math.round(((original - selling) / original) * 100);
}

// ==========================================
// 3. MAIN SALES OPERATIONS PORTAL COMPONENT
// ==========================================
export default function VoltCraftSalesPortalPage() {
  // Primary Navigation & View States
  const [activeTab, setActiveTab] = useState<ActivePortalTab>("orders");
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);

  // Orders Management States
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

  // Catalog CRUD & Pricing States
  const [catalog, setCatalog] = useState<CatalogAppliance[]>(INITIAL_CATALOG);
  const [catalogCategory, setCatalogCategory] = useState<ApplianceCategory>("All");
  const [catalogSearchQuery, setCatalogSearchQuery] = useState("");
  const [onlyPromoItems, setOnlyPromoItems] = useState(false);

  // Slide-Up Bottom Sheet Form States (Add / Edit Appliance)
  const [isApplianceSheetOpen, setIsApplianceSheetOpen] = useState(false);
  const [editingApplianceId, setEditingApplianceId] = useState<string | null>(null);
  const [formState, setFormState] = useState<ApplianceFormState>({
    name: "",
    sku: "",
    category: "ACs",
    description: "",
    wattage: 1200,
    inverter: true,
    energyRating: "No. 5 ★★★",
    dimensionsCm: "60.0 x 85.0 x 55.0 cm",
    priceTHB: 12900,
    originalPriceTHB: 14900,
    published: true,
    imageUrl:
      "https://images.unsplash.com/photo-1631545806609-35d4ae490431?auto=format&fit=crop&w=800&q=85",
    warehouseStock: 10,
  });

  // Quick 1-Tap Promo Campaign Modal State
  const [promoTargetAppliance, setPromoTargetAppliance] =
    useState<CatalogAppliance | null>(null);
  const [customPromoPercent, setCustomPromoPercent] = useState<number>(15);

  // Delete Confirmation Modal State
  const [deletingAppliance, setDeletingAppliance] =
    useState<CatalogAppliance | null>(null);

  // Audit Log & Toast Notification System
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    detail?: string;
    tone: "success" | "warning" | "danger";
  } | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (
    title: string,
    detail?: string,
    tone: "success" | "warning" | "danger" = "success"
  ) => {
    setToastMessage({ title, detail, tone });
  };

  // ==========================================
  // 4. DERIVED METRICS & FILTERED LISTS
  // ==========================================
  const orderCounts = useMemo(() => {
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

  const filteredCatalog = useMemo(() => {
    return catalog.filter((item) => {
      if (catalogCategory !== "All" && item.category !== catalogCategory) {
        return false;
      }
      if (onlyPromoItems && item.originalPriceTHB <= item.priceTHB) {
        return false;
      }
      if (catalogSearchQuery.trim() !== "") {
        const q = catalogSearchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchSku = item.sku.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchCat) return false;
      }
      return true;
    });
  }, [catalog, catalogCategory, onlyPromoItems, catalogSearchQuery]);

  // ==========================================
  // 5. ACTION HANDLERS (ORDERS & CATALOG CRUD)
  // ==========================================
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

  const openNewApplianceSheet = () => {
    setEditingApplianceId(null);
    setFormState({
      name: "",
      sku: `VC-NEW-${Math.floor(100 + Math.random() * 899)}`,
      category: "ACs",
      description:
        "High-efficiency VoltCraft precision appliance engineered with industrial thermal protection and direct 5-year warranty.",
      wattage: 1100,
      inverter: true,
      energyRating: "No. 5 ★★★",
      dimensionsCm: "75.0 x 32.0 x 21.0 cm",
      priceTHB: 14900,
      originalPriceTHB: 17900,
      published: true,
      imageUrl:
        "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=85",
      warehouseStock: 0, // Initialized at 0; Warehouse staff manages physical receiving
    });
    setIsApplianceSheetOpen(true);
  };

  const openEditApplianceSheet = (appliance: CatalogAppliance) => {
    setEditingApplianceId(appliance.id);
    setFormState({
      id: appliance.id,
      name: appliance.name,
      sku: appliance.sku,
      category: appliance.category,
      description: appliance.description,
      wattage: appliance.wattage,
      inverter: appliance.inverter,
      energyRating: appliance.energyRating,
      dimensionsCm: appliance.dimensionsCm,
      priceTHB: appliance.priceTHB,
      originalPriceTHB: appliance.originalPriceTHB,
      published: appliance.published,
      imageUrl: appliance.imageUrl,
      warehouseStock: appliance.warehouseStock,
    });
    setIsApplianceSheetOpen(true);
  };

  const handleSaveApplianceForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.sku.trim()) {
      showToast(
        "Validation Required",
        "Please enter both Appliance Model Name and SKU code.",
        "warning"
      );
      return;
    }

    const sanitizedSellingPrice = Math.max(100, Number(formState.priceTHB) || 0);
    const sanitizedOriginalPrice = Math.max(
      sanitizedSellingPrice,
      Number(formState.originalPriceTHB) || sanitizedSellingPrice
    );

    if (editingApplianceId) {
      setCatalog((prev) =>
        prev.map((item) =>
          item.id === editingApplianceId
            ? {
                ...item,
                name: formState.name.trim(),
                sku: formState.sku.trim().toUpperCase(),
                category: formState.category,
                description: formState.description.trim(),
                wattage: Number(formState.wattage) || 0,
                inverter: formState.inverter,
                energyRating: formState.energyRating,
                dimensionsCm: formState.dimensionsCm.trim(),
                priceTHB: sanitizedSellingPrice,
                originalPriceTHB: sanitizedOriginalPrice,
                published: formState.published,
                imageUrl: formState.imageUrl.trim(),
                updatedAt: "Just now",
              }
            : item
        )
      );
      showToast(
        `Appliance ${formState.sku.toUpperCase()} Updated`,
        `Selling price set to ${formatTHB(sanitizedSellingPrice)} • Specs synced live.`,
        "success"
      );
    } else {
      const newAppliance: CatalogAppliance = {
        id: `cat-${Date.now()}`,
        sku: formState.sku.trim().toUpperCase(),
        name: formState.name.trim(),
        category: formState.category,
        description: formState.description.trim(),
        wattage: Number(formState.wattage) || 0,
        inverter: formState.inverter,
        energyRating: formState.energyRating,
        dimensionsCm: formState.dimensionsCm.trim() || "50 x 50 x 50 cm",
        priceTHB: sanitizedSellingPrice,
        originalPriceTHB: sanitizedOriginalPrice,
        warehouseStock: 0, // Strict Role Rule: Warehouse team receives physical stock
        published: formState.published,
        imageUrl:
          formState.imageUrl.trim() ||
          "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=85",
        updatedAt: "Added just now",
      };
      setCatalog((prev) => [newAppliance, ...prev]);
      setActiveTab("catalog");
      showToast(
        `New Appliance ${newAppliance.sku} Added to Catalog`,
        `Published at ${formatTHB(newAppliance.priceTHB)} (Awaiting Warehouse Stock Intake).`,
        "success"
      );
    }

    setIsApplianceSheetOpen(false);
  };

  const handleApplyPromoDiscount = (percentOff: number) => {
    if (!promoTargetAppliance) return;
    const baseComparePrice =
      promoTargetAppliance.originalPriceTHB > promoTargetAppliance.priceTHB
        ? promoTargetAppliance.originalPriceTHB
        : Math.round(promoTargetAppliance.priceTHB * 1.15);

    const newSellingPrice =
      percentOff === 0
        ? baseComparePrice
        : Math.round((baseComparePrice * (100 - percentOff)) / 10) * 10;

    setCatalog((prev) =>
      prev.map((item) =>
        item.id === promoTargetAppliance.id
          ? {
              ...item,
              priceTHB: newSellingPrice,
              originalPriceTHB: baseComparePrice,
              updatedAt: "Promo updated just now",
            }
          : item
      )
    );

    if (percentOff === 0) {
      showToast(
        `Promo Cleared on ${promoTargetAppliance.sku}`,
        `Restored standard MSRP price of ${formatTHB(baseComparePrice)}.`,
        "warning"
      );
    } else {
      showToast(
        `Campaign -${percentOff}% Live on ${promoTargetAppliance.sku}`,
        `Promo price updated to ${formatTHB(newSellingPrice)} (Was ${formatTHB(baseComparePrice)}).`,
        "success"
      );
    }

    setPromoTargetAppliance(null);
  };

  const handleConfirmDeleteAppliance = () => {
    if (!deletingAppliance) return;
    const deletedSku = deletingAppliance.sku;
    const deletedName = deletingAppliance.name;
    setCatalog((prev) => prev.filter((item) => item.id !== deletingAppliance.id));
    setDeletingAppliance(null);
    showToast(
      `Appliance ${deletedSku} Removed from Catalog`,
      `${deletedName} has been archived from the customer storefront.`,
      "danger"
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950 pb-28">
      {/* =========================================================
          A. MOBILE HEADER & ROLE SWITCHER (STICKY TOP APP BAR)
      ========================================================= */}
      <div className="sticky top-0 z-40 shadow-md">
        <header className="bg-slate-900 text-slate-100 px-4 py-3 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            {/* Brand Logo + SALES OPS Role Badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-sm shadow-amber-500/30 shrink-0">
                <Zap className="w-6 h-6 fill-slate-950 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                    Volt<span className="text-amber-500">Craft</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-extrabold uppercase tracking-wider">
                    SALES OPS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block leading-none mt-0.5">
                  Catalog CRUD, Promo Pricing &amp; Order Dispatch Verification
                </p>
              </div>
            </div>

            {/* Right Controls: Showroom Shift Pill + Pending Orders Alert */}
            <div className="flex items-center gap-2">
              <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Showroom Shift Active</span>
                <span className="text-slate-400">•</span>
                <span className="text-amber-400 font-mono">Rep #04</span>
              </div>

              {/* Mobile Shift Pill */}
              <div className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Shift Live</span>
              </div>

              {/* Pending Verification Alert Trigger */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("orders");
                  setOrderFilter("Pending Verification");
                }}
                aria-label="View Pending Orders"
                className="relative min-w-[44px] min-h-[44px] px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-1.5 active:scale-95 transition-transform duration-150"
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-extrabold text-white">
                  {orderCounts.pending}
                </span>
                <span className="hidden sm:inline text-xs text-slate-300 font-medium">
                  Awaiting Verify
                </span>
                {orderCounts.pending > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 ring-2 ring-slate-900" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Sticky Sub-Nav: Dual Primary View Toggle + Quick Desktop Action */}
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            {/* Segmented Pill Switcher */}
            <div className="grid grid-cols-2 sm:inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all duration-150 ${
                  activeTab === "orders"
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShoppingCart className="w-4 h-4 stroke-[2.2]" />
                <span>Orders Queue</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                    activeTab === "orders"
                      ? "bg-slate-950 text-amber-400"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {orderCounts.pending} Pending
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("catalog")}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all duration-150 ${
                  activeTab === "catalog"
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Package className="w-4 h-4 stroke-[2.2]" />
                <span>Product Catalog</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                    activeTab === "catalog"
                      ? "bg-slate-950 text-amber-400"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {catalog.length} SKUs
                </span>
              </button>
            </div>

            {/* Desktop Summary Strip & Add Appliance Button */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-3">
                <div>
                  <span className="text-slate-500">Approved Today: </span>
                  <strong className="text-emerald-700 font-bold">
                    {orderCounts.approved} Orders
                  </strong>
                </div>
                <span className="text-slate-300">|</span>
                <div>
                  <span className="text-slate-500">Verified Revenue: </span>
                  <strong className="text-slate-900 font-extrabold">
                    {formatTHB(orderCounts.approvedRevenueTHB)}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                onClick={openNewApplianceSheet}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition-all duration-150"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>New Appliance</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          MAIN CONTENT CONTAINER
      ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 pt-4">
        {/* Role Compliance Banner */}
        <div className="mb-4 bg-white border border-slate-200 rounded-2xl p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-bold shrink-0">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              Role Scope: Sales &amp; Catalog Authority
            </span>
            <p className="text-slate-600">
              Full CRUD pricing, promo campaigns &amp; payment verification enabled.{" "}
              <span className="text-slate-500 font-medium">
                (Physical stock counts are read-only and controlled by Warehouse Ops).
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-slate-500">
               Warehouse Sync: Live
            </span>
          </div>
        </div>

        {/* =========================================================
            TAB 1: ORDERS VERIFICATION & CUSTOMER DISPATCH ROUTING
        ========================================================= */}
        {activeTab === "orders" && (
          <section aria-label="Orders Verification Queue" className="space-y-4">
            {/* Search & Status Filter Pills */}
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
                {filteredOrders.map((order) => {
                  const isPending = order.status === "Pending Verification";
                  const isApproved = order.status === "Approved";
                  const isIssue = order.status === "Payment Issue";

                  return (
                    <article
                      key={order.id}
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
                              onClick={() => setInspectingSlipOrder(order)}
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
                                onClick={() => setInspectingSlipOrder(order)}
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
                              onClick={() => handleApproveOrderToWarehouse(order)}
                              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all duration-150"
                            >
                              <Check className="w-4 h-4 stroke-[2.5]" />
                              <span>Approve &amp; Route to Warehouse</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setFlaggingOrder(order);
                                setFlagIssueReason(
                                  order.salesIssueNote ||
                                    "Transfer slip verification issue — requested customer confirmation via phone."
                                );
                              }}
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
                })}
              </div>
            )}
          </section>
        )}

        {/* =========================================================
            TAB 2: PRODUCT CATALOG & PRICING MANAGEMENT (CRUD)
        ========================================================= */}
        {activeTab === "catalog" && (
          <section aria-label="Product Catalog Management" className="space-y-4">
            {/* Catalog Search, Category Carousel & Quick Promo Filter */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={catalogSearchQuery}
                    onChange={(e) => setCatalogSearchQuery(e.target.value)}
                    placeholder="Search catalog by Model Name, SKU (e.g. VC-AC-12K), or Category..."
                    className="w-full h-11 pl-10 pr-9 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                  {catalogSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setCatalogSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOnlyPromoItems((prev) => !prev)}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all duration-150 ${
                      onlyPromoItems
                        ? "bg-rose-50 text-rose-600 border-rose-200"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Active Promo Only</span>
                  </button>

                  <button
                    type="button"
                    onClick={openNewApplianceSheet}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition-all duration-150 shrink-0"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add SKU</span>
                  </button>
                </div>
              </div>

              {/* Category Quick-Filter Carousel */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
                {CATEGORIES.map((category) => {
                  const isSelected = catalogCategory === category;
                  const count =
                    category === "All"
                      ? catalog.length
                      : catalog.filter((c) => c.category === category).length;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setCatalogCategory(category)}
                      className={`shrink-0 min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 active:scale-95 transition-all duration-150 ${
                        isSelected
                          ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span>{category}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[11px] font-extrabold ${
                          isSelected
                            ? "bg-slate-950/15 text-slate-950"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Appliance Catalog Grid */}
            {filteredCatalog.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  No Appliances Match Your Filter
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try clearing your SKU search query or switching category tabs.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCatalog.map((appliance) => {
                  const discountPct = calculateDiscountPercent(
                    appliance.priceTHB,
                    appliance.originalPriceTHB
                  );
                  const isOutOfStock = appliance.warehouseStock === 0;
                  const isLowStock =
                    appliance.warehouseStock > 0 && appliance.warehouseStock <= 5;

                  return (
                    <article
                      key={appliance.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        {/* Thumbnail with Overlay Badges for Energy Rating & Inverter Tag */}
                        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden border-b border-slate-100">
                          <img
                            src={appliance.imageUrl}
                            alt={appliance.name}
                            className="w-full h-full object-cover"
                          />

                          {/* Top-Left: Energy Star Rating & Inverter Badge */}
                          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 text-[11px] font-semibold shadow-sm">
                              ⚡ Energy {appliance.energyRating}
                            </span>
                            {appliance.inverter && (
                              <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-amber-400 border border-slate-700 text-[11px] font-bold shadow-sm">
                                Eco Inverter
                              </span>
                            )}
                          </div>

                          {/* Top-Right: Active Promo Discount Badge */}
                          {discountPct > 0 && (
                            <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-extrabold shadow-sm">
                              -{discountPct}% PROMO
                            </span>
                          )}

                          {/* Bottom-Left: Read-Only Warehouse Stock Count Indicator */}
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                            <span
                              title="Warehouse Stock Count (Read-Only for Sales Role)"
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border shadow-sm backdrop-blur-sm ${
                                isOutOfStock
                                  ? "bg-rose-50/95 text-rose-700 border-rose-200"
                                  : isLowStock
                                  ? "bg-amber-50/95 text-amber-800 border-amber-300"
                                  : "bg-emerald-50/95 text-emerald-700 border-emerald-200"
                              }`}
                            >
                              {isOutOfStock
                                ? "0 units - Out of Stock (Warehouse)"
                                : isLowStock
                                ? `${appliance.warehouseStock} units - Low stock`
                                : `${appliance.warehouseStock} units in stock`}
                            </span>

                            <span className="px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono">
                              {appliance.wattage}W
                            </span>
                          </div>
                        </div>

                        {/* Card Body: SKU, Title, Specs & Pricing */}
                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              SKU: {appliance.sku}
                            </span>
                            <span>{appliance.category}</span>
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2">
                            {appliance.name}
                          </h3>

                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {appliance.description}
                          </p>

                          {/* Technical Specs Pill Row */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 pt-1">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold">
                              Power: {appliance.wattage}W
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold">
                              {appliance.inverter ? "Inverter Drive" : "Standard Drive"}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold">
                              {appliance.dimensionsCm}
                            </span>
                          </div>

                          {/* Pricing Row: Selling Price + Compare-at Strikethrough */}
                          <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                Storefront Selling Price
                              </span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                                  {formatTHB(appliance.priceTHB)}
                                </span>
                                {appliance.originalPriceTHB > appliance.priceTHB && (
                                  <span className="text-xs text-slate-400 line-through font-medium">
                                    {formatTHB(appliance.originalPriceTHB)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block">
                                Updated {appliance.updatedAt}
                              </span>
                              <span
                                className={`text-[11px] font-bold ${
                                  appliance.published
                                    ? "text-emerald-700"
                                    : "text-slate-500"
                                }`}
                              >
                                ● {appliance.published ? "Published Live" : "Draft Mode"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Quick Actions (Edit, 1-Tap Promo, Delete) */}
                      <div className="p-3 bg-slate-50 border-t border-slate-200/80 grid grid-cols-7 gap-2">
                        <button
                          type="button"
                          onClick={() => openEditApplianceSheet(appliance)}
                          className="col-span-3 min-h-[44px] px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all duration-150"
                        >
                          <Edit3 className="w-3.5 h-3.5 stroke-[2.2]" />
                          <span>Edit / Price</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPromoTargetAppliance(appliance);
                            setCustomPromoPercent(discountPct > 0 ? discountPct : 15);
                          }}
                          className="col-span-3 min-h-[44px] px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-medium text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-150"
                        >
                          <Tag className="w-3.5 h-3.5" />
                          <span>Promo %</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingAppliance(appliance)}
                          aria-label={`Delete ${appliance.name}`}
                          className="col-span-1 min-h-[44px] rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 flex items-center justify-center active:scale-95 transition-all duration-150"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      {/* =========================================================
          B. MOBILE BOTTOM ACTION BAR (FIXED ON MOBILE / TABLET)
      ========================================================= */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-slate-900 text-slate-100 border-t border-slate-800 px-4 py-2.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Quick Search Trigger & Live Shift Metrics */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setQuickSearchOpen((prev) => !prev)}
              aria-label="Quick search toggle"
              className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 active:scale-95 transition-transform"
            >
              <Search className="w-5 h-5 text-amber-400" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Approved Today:</span>
                <span className="font-extrabold text-emerald-400">
                  {orderCounts.approved} Orders
                </span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-white truncate">
                Verified: {formatTHB(orderCounts.approvedRevenueTHB)}
              </p>
            </div>
          </div>

          {/* Floating + New Appliance CTA Button */}
          <button
            type="button"
            onClick={openNewApplianceSheet}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-150 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ New Appliance</span>
          </button>
        </div>

        {/* Quick Search Bar Drawer from Bottom Bar */}
        {quickSearchOpen && (
          <div className="max-w-7xl mx-auto pt-2.5 mt-2.5 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={activeTab === "orders" ? orderSearchQuery : catalogSearchQuery}
              onChange={(e) =>
                activeTab === "orders"
                  ? setOrderSearchQuery(e.target.value)
                  : setCatalogSearchQuery(e.target.value)
              }
              placeholder={
                activeTab === "orders"
                  ? "Quick filter orders by #VC ref, customer, or phone..."
                  : "Quick filter catalog by SKU, model, or category..."
              }
              autoFocus
              className="flex-1 h-11 px-3.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={() => setQuickSearchOpen(false)}
              className="min-h-[44px] px-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* =========================================================
          TAB 3 / OVERLAY: "ADD / EDIT APPLIANCE" SLIDE-UP BOTTOM SHEET
      ========================================================= */}
      {isApplianceSheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setIsApplianceSheetOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Sheet Header */}
            <div className="px-5 py-4 bg-slate-900 text-slate-100 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <SlidersHorizontal className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white">
                    {editingApplianceId
                      ? `Edit Appliance SKU (${formState.sku})`
                      : "Add New VoltCraft Appliance"}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Configure technical specifications, energy certification &amp; storefront pricing
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsApplianceSheetOpen(false)}
                className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form
              onSubmit={handleSaveApplianceForm}
              className="p-5 overflow-y-auto space-y-6 flex-1"
            >
              {/* 1. General Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-amber-600" />
                  1. General Appliance Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Appliance Model Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      placeholder="e.g., VoltCraft AeroChill Pro 18,000 BTU Inverter AC"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Model SKU *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.sku}
                      onChange={(e) =>
                        setFormState({ ...formState, sku: e.target.value })
                      }
                      placeholder="VC-AC-18K"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Appliance Category
                    </label>
                    <select
                      value={formState.category}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          category: e.target.value as Exclude<
                            ApplianceCategory,
                            "All"
                          >,
                        })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="ACs">ACs (Climate Control)</option>
                      <option value="Refrigeration">Refrigeration</option>
                      <option value="Cleaning">Cleaning Robotics</option>
                      <option value="Kitchen">Kitchen Tech</option>
                      <option value="Air Purifiers">Air Purifiers</option>
                    </select>
                  </div>

                  {/* Read-Only Warehouse Stock Display inside Editor */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      Warehouse Physical Stock (Read-Only)
                    </label>
                    <div className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-600 flex items-center justify-between">
                      <span>{formState.warehouseStock} units in Warehouse</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        Managed by Warehouse Ops
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Engineering &amp; Feature Description
                  </label>
                  <textarea
                    rows={2}
                    value={formState.description}
                    onChange={(e) =>
                      setFormState({ ...formState, description: e.target.value })
                    }
                    placeholder="Highlight compressor generation, acoustic dB level, and warranty terms..."
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* 2. Technical Specifications */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  2. Technical Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Rated Power (Wattage W)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={10000}
                      value={formState.wattage}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          wattage: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Energy Saving Rating
                    </label>
                    <select
                      value={formState.energyRating}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          energyRating: e.target.value as EnergyStarRating,
                        })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-amber-50/60 text-sm font-bold text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="No. 5 ★★★">No. 5 ★★★ (Max Efficiency)</option>
                      <option value="No. 5 ★★">No. 5 ★★ (High Efficiency)</option>
                      <option value="No. 5 ★">No. 5 ★ (Certified)</option>
                      <option value="Standard Certified">Standard TISI Certified</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Dimensions (WxHxD cm)
                    </label>
                    <input
                      type="text"
                      value={formState.dimensionsCm}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          dimensionsCm: e.target.value,
                        })
                      }
                      placeholder="83.7 x 30.8 x 18.9 cm"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-amber-400">
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                      Eco Inverter Compressor / Brushless Motor Technology
                    </span>
                    <span className="text-xs text-slate-500">
                      Displays the official Eco Inverter badge on customer storefront cards
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formState.inverter}
                    onChange={(e) =>
                      setFormState({ ...formState, inverter: e.target.checked })
                    }
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* 3. Pricing & Storefront Promotions */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                  3. Pricing &amp; Promotional Discount
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Selling Price (THB ฿) *
                    </label>
                    <input
                      type="number"
                      min={100}
                      step={10}
                      required
                      value={formState.priceTHB}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          priceTHB: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Compare-at Original Price (฿)
                    </label>
                    <input
                      type="number"
                      min={100}
                      step={10}
                      value={formState.originalPriceTHB}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          originalPriceTHB: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Storefront Status
                    </label>
                    <select
                      value={formState.published ? "live" : "draft"}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          published: e.target.value === "live",
                        })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="live">Publish Live on Storefront</option>
                      <option value="draft">Save as Internal Draft</option>
                    </select>
                  </div>
                </div>

                {/* Auto-calculated promo preview pill */}
                {formState.originalPriceTHB > formState.priceTHB && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
                    <span className="font-bold">
                      Active Promotional Discount Preview:
                    </span>
                    <span className="font-extrabold">
                      -{calculateDiscountPercent(formState.priceTHB, formState.originalPriceTHB)}% OFF (Customer Saves{" "}
                      {formatTHB(formState.originalPriceTHB - formState.priceTHB)})
                    </span>
                  </div>
                )}
              </div>

              {/* 4. Product Image URL & Live Preview */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-amber-600" />
                  4. Product Image URL &amp; Preview
                </h3>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <input
                    type="url"
                    value={formState.imageUrl}
                    onChange={(e) =>
                      setFormState({ ...formState, imageUrl: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full flex-1 h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {formState.imageUrl ? (
                      <img
                        src={formState.imageUrl}
                        alt="Live preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">
                        No Image
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsApplianceSheetOpen(false)}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-100 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Appliance Details</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: 1-TAP PROMO DISCOUNT CAMPAIGN LAUNCHER
      ========================================================= */}
      {promoTargetAppliance && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setPromoTargetAppliance(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold">
                  1-TAP CAMPAIGN PRICING
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  Launch Promo on {promoTargetAppliance.sku}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {promoTargetAppliance.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPromoTargetAppliance(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block">Current Selling Price</span>
                <strong className="text-sm font-extrabold text-slate-900">
                  {formatTHB(promoTargetAppliance.priceTHB)}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Compare-at MSRP</span>
                <strong className="text-sm font-bold text-slate-600">
                  {formatTHB(promoTargetAppliance.originalPriceTHB)}
                </strong>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Select Instant Campaign Discount Tier:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleApplyPromoDiscount(pct)}
                    className="min-h-[44px] py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs flex flex-col items-center justify-center active:scale-95 transition-all"
                  >
                    <span>-{pct}% OFF</span>
                    <span className="text-[10px] font-medium text-rose-600">
                      {formatTHB(
                        Math.round(
                          (promoTargetAppliance.originalPriceTHB * (100 - pct)) / 10
                        ) * 10
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Promo Percentage Input */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Custom Discount (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={customPromoPercent}
                  onChange={(e) =>
                    setCustomPromoPercent(
                      Math.min(60, Math.max(1, Number(e.target.value) || 5))
                    )
                  }
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900"
                />
              </div>
              <button
                type="button"
                onClick={() => handleApplyPromoDiscount(customPromoPercent)}
                className="mt-5 min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs active:scale-95 transition-all"
              >
                Apply -{customPromoPercent}%
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleApplyPromoDiscount(0)}
              className="w-full min-h-[44px] py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold"
            >
              Clear Promo &amp; Restore Standard MSRP
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: PAYMENT SLIP INSPECTOR & ONE-TAP APPROVAL
      ========================================================= */}
      {inspectingSlipOrder && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setInspectingSlipOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-slate-200 overflow-hidden shadow-2xl"
          >
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {inspectingSlipOrder.orderRef} • PAYMENT PROOF
                </span>
                <h3 className="text-sm font-bold">
                  {inspectingSlipOrder.paymentMethod}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingSlipOrder(null)}
                className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 relative">
                <img
                  src={inspectingSlipOrder.slipImageUrl}
                  alt="Customer payment slip"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 inset-x-3 bg-slate-950/85 backdrop-blur-sm text-white p-3 rounded-xl border border-slate-700 text-xs flex items-center justify-between">
                  <div>
                    <p className="font-bold text-amber-400">
                      {inspectingSlipOrder.slipBankName}
                    </p>
                    <p className="text-[11px] text-slate-300 font-mono">
                      Ref: {inspectingSlipOrder.paymentReference} •{" "}
                      {inspectingSlipOrder.slipTransferredTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">
                      Slip Amount
                    </span>
                    <span className="text-sm font-extrabold text-emerald-400">
                      {formatTHB(inspectingSlipOrder.totalAmountTHB)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Customer</span>
                  <strong className="text-slate-900 font-bold">
                    {inspectingSlipOrder.customerName} ({inspectingSlipOrder.customerPhone})
                  </strong>
                </div>
                <a
                  href={`tel:${inspectingSlipOrder.customerPhone.replace(/[^0-9+]/g, "")}`}
                  className="min-h-[40px] px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900 flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  Call Customer
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleApproveOrderToWarehouse(inspectingSlipOrder)}
                  className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                  <span>Verify Slip &amp; Route to Warehouse</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: FLAG ORDER PAYMENT / CONTACT ISSUE
      ========================================================= */}
      {flaggingOrder && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setFlaggingOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Flag Order {flaggingOrder.orderRef}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Log payment discrepancy or installation contact hold
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFlaggingOrder(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Sales Verification Hold Note:
              </label>
              <textarea
                rows={3}
                value={flagIssueReason}
                onChange={(e) => setFlagIssueReason(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href={`tel:${flaggingOrder.customerPhone.replace(/[^0-9+]/g, "")}`}
                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4 text-amber-600" />
                <span>Call {flaggingOrder.customerPhone}</span>
              </a>

              <button
                type="button"
                onClick={handleConfirmFlagPaymentIssue}
                className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all"
              >
                Save Hold Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: SAFE DELETE / ARCHIVE APPLIANCE CONFIRMATION
      ========================================================= */}
      {deletingAppliance && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeletingAppliance(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-md w-full rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Remove Appliance SKU from Catalog?
                </h3>
                <p className="text-xs text-slate-500">
                  SKU: <span className="font-mono font-bold">{deletingAppliance.sku}</span>
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              You are about to remove{" "}
              <strong className="text-slate-900">{deletingAppliance.name}</strong> from the
              VoltCraft storefront catalog. Existing warehouse audit logs will remain intact.
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingAppliance(null)}
                className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAppliance}
                className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          6. SELF-CONTAINED TOAST NOTIFICATION OVERLAY
      ========================================================= */}
      {toastMessage && (
        <div className="fixed bottom-20 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-20 z-50 max-w-md mx-auto sm:mx-0">
          <div
            className={`p-3.5 rounded-2xl border shadow-2xl flex items-start gap-3 backdrop-blur-md ${
              toastMessage.tone === "success"
                ? "bg-slate-900/95 text-white border-emerald-500/50"
                : toastMessage.tone === "warning"
                ? "bg-slate-900/95 text-white border-amber-500/60"
                : "bg-slate-900/95 text-white border-rose-500/60"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                toastMessage.tone === "success"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : toastMessage.tone === "warning"
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {toastMessage.tone === "success" && <CheckCircle2 className="w-4 h-4" />}
              {toastMessage.tone === "warning" && <Clock className="w-4 h-4" />}
              {toastMessage.tone === "danger" && <Trash2 className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-white">
                {toastMessage.title}
              </p>
              {toastMessage.detail && (
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  {toastMessage.detail}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
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