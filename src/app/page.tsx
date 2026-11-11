"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Zap,
  Search,
  ShoppingBag,
  Heart,
  SlidersHorizontal,
  Star,
  ShieldCheck,
  Truck,
  Wrench,
  X,
  Plus,
  Minus,
  Trash2,
  ChevronRight,
  Check,
  ArrowRight,
  Eye,
  BatteryCharging,
} from "lucide-react";

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================
type CategoryType =
  | "All"
  | "Climate Control"
  | "Refrigeration"
  | "Smart Cleaning"
  | "Kitchen Tech"
  | "Air Quality";

type WattageTier = "All" | "Low (<500W)" | "Medium (500W-1500W)" | "High (>1500W)";
type SortOption = "featured" | "price-asc" | "price-desc" | "rating-desc";

interface ApplianceProduct {
  id: string;
  name: string;
  modelCode: string;
  category: Exclude<CategoryType, "All">;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  wattage: number;
  inverter: boolean;
  energyStar: boolean;
  smartWifi: boolean;
  ultraQuiet: boolean;
  noiseLevelDb: number;
  cordLengthM: number;
  circuitBreaker: string;
  dimensions: string;
  warrantyYears: number;
  primarySpec: string;
  secondarySpec: string;
  badges: {
    discount?: string;
    tech: string;
    service: string;
  };
  image: string;
  inStock: boolean;
  description: string;
}

interface CartItem {
  product: ApplianceProduct;
  quantity: number;
  addOnInstallation: boolean;
  addOnHaulAway: boolean;
}

// ==========================================
// 2. REALISTIC APPLIANCE DATASET (8 MODELS)
// ==========================================
const VOLTCRAFT_PRODUCTS: ApplianceProduct[] = [
  {
    id: "vc-ac-01",
    name: "VoltCraft AeroChill Pro 12,000 BTU Dual-Inverter Air Conditioner",
    modelCode: "VC-ACP12K-G3",
    category: "Climate Control",
    price: 499,
    originalPrice: 599,
    rating: 4.9,
    reviewsCount: 342,
    wattage: 850,
    inverter: true,
    energyStar: true,
    smartWifi: true,
    ultraQuiet: true,
    noiseLevelDb: 19,
    cordLengthM: 2.5,
    circuitBreaker: "15A Dedicated (220-240V)",
    dimensions: "83.7 x 30.8 x 18.9 cm",
    warrantyYears: 5,
    primarySpec: "12,000 BTU",
    secondarySpec: "SEER 22.5",
    badges: {
      discount: "-17% OFF",
      tech: "Inverter Gen-3",
      service: "Free Install",
    },
    image:
      "https://images.unsplash.com/photo-1631545806609-35d4ae490431?auto=format&fit=crop&w=900&q=85",
    inStock: true,
    description:
      "Engineered with variable-tonnage twin-rotary inverter rotors that reach rapid thermal equilibrium in 45 seconds while maintaining an ultra-low 19dB acoustic profile and 5-Star energy efficiency.",
  },
  {
    id: "vc-rf-02",
    name: "VoltCraft ArcticLinear 4-Door Refrigerator 19.8 cu.ft.",
    modelCode: "VC-AL4D-560",
    category: "Refrigeration",
    price: 1299,
    originalPrice: 1499,
    rating: 4.8,
    reviewsCount: 215,
    wattage: 180,
    inverter: true,
    energyStar: true,
    smartWifi: true,
    ultraQuiet: true,
    noiseLevelDb: 34,
    cordLengthM: 2.0,
    circuitBreaker: "15A Standard Grounded",
    dimensions: "83.5 x 178.5 x 73.0 cm",
    warrantyYears: 5,
    primarySpec: "19.8 cu.ft.",
    secondarySpec: "Door-in-Door",
    badges: {
      discount: "-13% OFF",
      tech: "Linear Inverter",
      service: "Free Install",
    },
    image:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=900&q=85",
    inStock: true,
    description:
      "Precision multi-airflow cooling architecture with brushed slate steel doors, zero-clearance hinges, independent convertible bio-fresh zone (-3°C to +5°C), and UV-C antibacterial deodorizer.",
  },
  {
    id: "vc-sc-03",
    name: "VoltCraft CleanSense LiDAR Robot Vacuum & Wash Dock",
    modelCode: "VC-CS6000-PRO",
    category: "Smart Cleaning",
    price: 649,
    originalPrice: 799,
    rating: 4.9,
    reviewsCount: 518,
    wattage: 75,
    inverter: true,
    energyStar: true,
    smartWifi: true,
    ultraQuiet: true,
    noiseLevelDb: 52,
    cordLengthM: 1.8,
    circuitBreaker: "10A Standard Outlet",
    dimensions: "35.0 x 9.7 x 35.0 cm (Dock: 42 x 48 x 38 cm)",
    warrantyYears: 3,
    primarySpec: "6,000Pa Suction",
    secondarySpec: "60°C Hot Mop Wash",
    badges: {
      discount: "-19% OFF",
      tech: "3D DToF LiDAR",
      service: "2-Yr Care Pack",
    },
    image:
      "https://images.unsplash.com/photo-1589894404892-7310b92ea7a2?auto=format&fit=crop&w=900&q=85",
    inStock: true,
    description:
      "Autonomous home floor care with dual-rotary pressurized scrubbing mops, 6,000Pa brushless inverter suction motor, auto-lifting ultrasonic carpet detection, and self-emptying thermal drying base.",
  },
  {
    id: "vc-kt-04",
    name: "VoltCraft VortexFryer Touch XXL 7.2L",
    modelCode: "VC-VFT72-XXL",
    category: "Kitchen Tech",
    price: 179,
    originalPrice: 229,
    rating: 4.7,
    reviewsCount: 612,
    wattage: 2000,
    inverter: false,
    energyStar: true,
    smartWifi: true,
    ultraQuiet: false,
    noiseLevelDb: 48,
    cordLengthM: 1.5,
    circuitBreaker: "15A Standard Outlet",
    dimensions: "32.5 x 31.0 x 39.2 cm",
    warrantyYears: 3,
    primarySpec: "7.2L Capacity",
    secondarySpec: "360° Cyclonic",
    badges: {
      discount: "-22% OFF",
      tech: "Thermo-Cyclonic",
      service: "Direct Warranty",
    },
    image:
      "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=85",
    inStock: true,
    description:
      "High-velocity 2000W carbon-steel heating element paired with a double-glazed viewing window, 12 precision PID temperature presets, and PFOA-free ceramic anodized basket.",
  },
  {
    id: "vc-aq-05",
    name: "VoltCraft PureBreathe Pro H13 HEPA Air Purifier",
    modelCode: "VC-PBP-520",
    category: "Air Quality",
    price: 289,
    originalPrice: 349,
    rating: 4.8,
    reviewsCount: 289,
    wattage: 45,
    inverter: true,
    energyStar: true,
    smartWifi: true,
    ultraQuiet: true,
    noiseLevelDb: 21,
    cordLengthM: 2.2,
    circuitBreaker: "10A Standard Outlet",
    dimensions: "29.0 x 58.5 x 29.0 cm",
    warrantyYears: 3,
    primarySpec: "CADR 520 m³/h",
    secondarySpec: "Dual PM2.5 Laser",
    badges: {
      discount: "-17% OFF",
      tech: "Inverter Brushless",
      service: "HEPA Included",
    },
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=900&q=85",
    inStock: true,
    description:
      "Medical-grade H13 True HEPA 4-stage filtration captures 99.97% of 0.1-micron ultrafine particulates, VOCs, and allergens for spaces up to 65m² with real-time AQI OLED telemetry.",
  },
  {
    id: "vc-kt-06",
    name: "VoltCraft DualZone Induction Cooktop 3200W",
    modelCode: "VC-DZI-3200",
    category: "Kitchen Tech",
    price: 399,
    originalPrice: 469,
    rating: 4.9,
    reviewsCount: 174,
    wattage: 3200,
    inverter: true,
    energyStar: true,
    smartWifi: false,
    ultraQuiet: true,
    noiseLevelDb: 38,
    cordLengthM: 1.8,
    circuitBreaker: "20A Dedicated Circuit",
    dimensions: "73.0 x 6.2 x 43.0 cm",
    warrantyYears: 5,
    primarySpec: "3,200W Dual",
    secondarySpec: "Schott Ceran®",
    badges: {
      discount: "-15% OFF",
      tech: "Inverter Coil",
      service: "Free Install",
    },
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=85",
    inStock: true,
    description:
      "Continuous low-power inverter modulation prevents pulse-boiling while dual copper electromagnetic coils and genuine German Schott Ceran® glass deliver instant thermal response.",
  },
  {
    id: "vc-sc-07",
    name: "VoltCraft HydroWash Front-Load Washer & Dryer 11/7kg",
    modelCode: "VC-HW117-DD",
    category: "Smart Cleaning",
    price: 899,
    originalPrice: 1099,
    rating: 4.8,
    reviewsCount: 263,
    wattage: 1850,
    inverter: true,
    energyStar: true,
    smartWifi: true,
    ultraQuiet: true,
    noiseLevelDb: 46,
    cordLengthM: 2.0,
    circuitBreaker: "15A Grounded (GFCI)",
    dimensions: "60.0 x 85.0 x 61.5 cm",
    warrantyYears: 5,
    primarySpec: "11kg Wash / 7kg Dry",
    secondarySpec: "Direct Drive 1400RPM",
    badges: {
      discount: "-18% OFF",
      tech: "Inverter DirectDrive",
      service: "Free Install",
    },
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=85",
    inStock: true,
    description:
      "Beltless magnetic Direct Drive motor bolted directly to the stainless drum eliminates friction and vibration. Includes 99.9% Steam Allergen Sanitize and Auto-Dose detergent reservoirs.",
  },
  {
    id: "vc-kt-08",
    name: "VoltCraft ThermoWave Inverter Convection Microwave 34L",
    modelCode: "VC-TWM34-INV",
    category: "Kitchen Tech",
    price: 319,
    originalPrice: 379,
    rating: 4.7,
    reviewsCount: 198,
    wattage: 1200,
    inverter: true,
    energyStar: false,
    smartWifi: false,
    ultraQuiet: true,
    noiseLevelDb: 44,
    cordLengthM: 1.4,
    circuitBreaker: "15A Dedicated Outlet",
    dimensions: "52.5 x 31.0 x 44.5 cm",
    warrantyYears: 3,
    primarySpec: "34L Convection",
    secondarySpec: "Quartz Grill + Sensor",
    badges: {
      discount: "-16% OFF",
      tech: "Inverter LinearWave",
      service: "Direct Warranty",
    },
    image:
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=900&q=85",
    inStock: true,
    description:
      "True continuous inverter power delivery defrosts and simmers without cooked edges, combined with a 230°C convection fan and infrared quartz grill for crispy roasting.",
  },
];

const CATEGORIES: { label: CategoryType; count: number }[] = [
  { label: "All", count: VOLTCRAFT_PRODUCTS.length },
  {
    label: "Climate Control",
    count: VOLTCRAFT_PRODUCTS.filter((p) => p.category === "Climate Control").length,
  },
  {
    label: "Refrigeration",
    count: VOLTCRAFT_PRODUCTS.filter((p) => p.category === "Refrigeration").length,
  },
  {
    label: "Smart Cleaning",
    count: VOLTCRAFT_PRODUCTS.filter((p) => p.category === "Smart Cleaning").length,
  },
  {
    label: "Kitchen Tech",
    count: VOLTCRAFT_PRODUCTS.filter((p) => p.category === "Kitchen Tech").length,
  },
  {
    label: "Air Quality",
    count: VOLTCRAFT_PRODUCTS.filter((p) => p.category === "Air Quality").length,
  },
];

const USD_TO_THB = 34.5;
const INSTALLATION_FEE_USD = 35;
const INSTALLATION_FEE_THB = 1200;
const FREE_SHIPPING_THRESHOLD_USD = 250;

function formatTHB(usd: number): string {
  const thb = Math.round((usd * USD_TO_THB) / 100) * 100 - 10;
  return `฿${thb.toLocaleString()}`;
}

// ==========================================
// 3. MAIN STOREFRONT COMPONENT
// ==========================================
export default function VoltCraftStorefrontPage() {
  // Search & Navigation States
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  // Advanced Filter States (Drawer + Quick Chips)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [wattageTier, setWattageTier] = useState<WattageTier>("All");
  const [onlyEnergyStar, setOnlyEnergyStar] = useState<boolean>(false);
  const [onlyInverter, setOnlyInverter] = useState<boolean>(false);
  const [onlySmartWifi, setOnlySmartWifi] = useState<boolean>(false);
  const [onlyUltraQuiet, setOnlyUltraQuiet] = useState<boolean>(false);
  const [onlyWishlist, setOnlyWishlist] = useState<boolean>(false);

  // Interactive User States (Wishlist, Cart, QuickView, Feedback)
  const [wishlistIds, setWishlistIds] = useState<string[]>(["vc-ac-01", "vc-sc-03"]);
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: VOLTCRAFT_PRODUCTS[0],
      quantity: 1,
      addOnInstallation: true,
      addOnHaulAway: true,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ApplianceProduct | null>(null);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);
  const [checkoutSuccessModal, setCheckoutSuccessModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Wishlist Toggle
  const toggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const item = VOLTCRAFT_PRODUCTS.find((p) => p.id === productId);
      if (exists) {
        triggerToast(`Removed ${item?.modelCode || "appliance"} from Saved Specs`);
        return prev.filter((id) => id !== productId);
      } else {
        triggerToast(`Saved ${item?.modelCode || "appliance"} to Wishlist`);
        return [...prev, productId];
      }
    });
  };

  // Add to Cart with Tactile Loading State
  const handleAddToCart = (
    product: ApplianceProduct,
    withInstall = false,
    withHaulAway = false,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    setAddingProductId(product.id);

    setTimeout(() => {
      setCart((prev) => {
        const existingIndex = prev.findIndex((item) => item.product.id === product.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + 1,
            addOnInstallation: updated[existingIndex].addOnInstallation || withInstall,
            addOnHaulAway: updated[existingIndex].addOnHaulAway || withHaulAway,
          };
          return updated;
        }
        return [
          ...prev,
          {
            product,
            quantity: 1,
            addOnInstallation: withInstall,
            addOnHaulAway: withHaulAway,
          },
        ];
      });

      setAddingProductId(null);
      setAddedSuccessId(product.id);
      triggerToast(`Added ${product.modelCode} to Direct Dispatch Cart`);

      setTimeout(() => {
        setAddedSuccessId((curr) => (curr === product.id ? null : curr));
      }, 1400);
    }, 280);
  };

  // Cart Operations
  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const toggleCartAddOn = (
    productId: string,
    field: "addOnInstallation" | "addOnHaulAway"
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, [field]: !item[field] } : item
      )
    );
  };

  // Reset All Filters
  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setMinPrice(0);
    setMaxPrice(1500);
    setWattageTier("All");
    setOnlyEnergyStar(false);
    setOnlyInverter(false);
    setOnlySmartWifi(false);
    setOnlyUltraQuiet(false);
    setOnlyWishlist(false);
    setSortBy("featured");
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return VOLTCRAFT_PRODUCTS.filter((p) => {
      // Search Filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCode = p.modelCode.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        const matchSpec =
          p.primarySpec.toLowerCase().includes(q) ||
          p.secondarySpec.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchCategory && !matchSpec) return false;
      }

      // Category Filter
      if (selectedCategory !== "All" && p.category !== selectedCategory) {
        return false;
      }

      // Wishlist Filter
      if (onlyWishlist && !wishlistIds.includes(p.id)) {
        return false;
      }

      // Price Filter
      if (p.price < minPrice || p.price > maxPrice) {
        return false;
      }

      // Wattage Tier Filter
      if (wattageTier === "Low (<500W)" && p.wattage >= 500) return false;
      if (
        wattageTier === "Medium (500W-1500W)" &&
        (p.wattage < 500 || p.wattage > 1500)
      )
        return false;
      if (wattageTier === "High (>1500W)" && p.wattage <= 1500) return false;

      // Spec Booleans
      if (onlyEnergyStar && !p.energyStar) return false;
      if (onlyInverter && !p.inverter) return false;
      if (onlySmartWifi && !p.smartWifi) return false;
      if (onlyUltraQuiet && !p.ultraQuiet) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating-desc") return b.rating - a.rating;
      return 0; // featured order
    });
  }, [
    searchQuery,
    selectedCategory,
    onlyWishlist,
    wishlistIds,
    minPrice,
    maxPrice,
    wattageTier,
    onlyEnergyStar,
    onlyInverter,
    onlySmartWifi,
    onlyUltraQuiet,
    sortBy,
  ]);

  // Active Filter Chips computation
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (minPrice > 0 || maxPrice < 1500) count++;
    if (wattageTier !== "All") count++;
    if (onlyEnergyStar) count++;
    if (onlyInverter) count++;
    if (onlySmartWifi) count++;
    if (onlyUltraQuiet) count++;
    if (onlyWishlist) count++;
    return count;
  }, [
    minPrice,
    maxPrice,
    wattageTier,
    onlyEnergyStar,
    onlyInverter,
    onlySmartWifi,
    onlyUltraQuiet,
    onlyWishlist,
  ]);

  // Cart Calculations
  const totalCartItems = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const cartCalculations = useMemo(() => {
    const subtotalUSD = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const originalSubtotalUSD = cart.reduce(
      (sum, item) => sum + item.product.originalPrice * item.quantity,
      0
    );
    const installCount = cart.reduce(
      (sum, item) => sum + (item.addOnInstallation ? item.quantity : 0),
      0
    );
    const addOnsUSD = installCount * INSTALLATION_FEE_USD;
    const shippingUSD =
      subtotalUSD === 0 || subtotalUSD >= FREE_SHIPPING_THRESHOLD_USD ? 0 : 25;
    const finalTotalUSD = subtotalUSD + addOnsUSD + shippingUSD;
    const totalSavingsUSD = originalSubtotalUSD - subtotalUSD;

    return {
      subtotalUSD,
      installCount,
      addOnsUSD,
      shippingUSD,
      finalTotalUSD,
      totalSavingsUSD,
      freeShippingProgress: Math.min(
        100,
        Math.round((subtotalUSD / FREE_SHIPPING_THRESHOLD_USD) * 100)
      ),
    };
  }, [cart]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950 pb-20">
      {/* =========================================================
          A. MOBILE STICKY NAVIGATION & HEADER
      ========================================================= */}
      <div className="sticky top-0 z-40 shadow-sm">
        {/* Top Promo Banner */}
        <div className="bg-slate-950 text-amber-400 border-b border-slate-800 px-3 py-2 text-xs font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold shrink-0">
                <Zap className="w-3 h-3 fill-amber-400" /> DIRECT FACTORY
              </span>
              <p className="truncate text-slate-200">
                Free White-Glove Installation &amp; 5-Year Compressor Warranty on Inverter Series
              </p>
            </div>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-400 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              ISO-9001 Certified Lab Dispatch
            </span>
          </div>
        </div>

        {/* Main Header */}
        <header className="bg-slate-950 text-white px-4 py-3 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Brand Logo */}
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-2.5 text-left group focus:outline-none min-h-[44px]"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-active:scale-95 transition-transform duration-150">
                <Zap className="w-6 h-6 fill-slate-950 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-white">
                    Volt<span className="text-amber-500">Craft</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                    LABS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block leading-none mt-0.5">
                  Precision Home Electrical &amp; Inverter Systems
                </p>
              </div>
            </button>

            {/* Desktop / Tablet Persistent Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search BTU, Inverter, HEPA, Model code (e.g. VC-ACP12K)..."
                  className="w-full h-11 pl-10 pr-9 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile & Desktop Quick Action Icons (44x44px min touch targets) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Mobile Search Trigger */}
              <button
                onClick={() => setMobileSearchOpen((prev) => !prev)}
                aria-label="Toggle search bar"
                className={`md:hidden min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center active:scale-95 transition-all duration-150 ${
                  mobileSearchOpen || searchQuery
                    ? "bg-amber-500/20 border-amber-500 text-amber-400"
                    : "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800"
                }`}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Filter Toggle */}
              <button
                onClick={() => setOnlyWishlist((prev) => !prev)}
                aria-label="Toggle Saved Appliances"
                className={`relative min-w-[44px] min-h-[44px] px-3 rounded-xl border flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-150 ${
                  onlyWishlist
                    ? "bg-amber-500 text-slate-950 border-amber-500 font-semibold"
                    : "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    onlyWishlist
                      ? "fill-slate-950 text-slate-950"
                      : wishlistIds.length > 0
                      ? "fill-rose-500 text-rose-500"
                      : ""
                  }`}
                />
                <span className="text-xs font-bold">{wishlistIds.length}</span>
              </button>

              {/* Slide-Over Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Open appliance cart"
                className="relative min-w-[44px] min-h-[44px] px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition-all duration-150"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                <span className="hidden sm:inline text-sm font-bold">Cart</span>
                <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-slate-950 text-amber-400 text-xs font-extrabold">
                  {totalCartItems}
                </span>
              </button>
            </div>
          </div>

          {/* Expandable Mobile Search Bar */}
          {(mobileSearchOpen || searchQuery) && (
            <div className="md:hidden pt-3">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by BTU, Wattage, Inverter, or Model..."
                  autoFocus
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Horizontal Scroll Category Pills (Mobile Optimized Snap-Scroll) */}
        <nav
          aria-label="Appliance Categories"
          className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5"
        >
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`snap-start shrink-0 min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-2 active:scale-95 transition-all duration-150 ${
                    isActive
                      ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-500/60 hover:bg-amber-50/40"
                  }`}
                >
                  <Zap
                    className={`w-3.5 h-3.5 ${
                      isActive ? "fill-slate-950 text-slate-950" : "text-amber-600"
                    }`}
                  />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-md font-bold ${
                      isActive
                        ? "bg-slate-950/15 text-slate-950"
                        : "bg-slate-200/80 text-slate-600"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* =========================================================
          B. HERO VALUE PROPOSITION (MOBILE FRIENDLY BANNER)
      ========================================================= */}
      <section className="px-4 pt-5 pb-3">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-5 sm:p-8 text-white shadow-lg relative overflow-hidden">
          {/* Decorative Industrial Grid Accent */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <BatteryCharging className="w-3.5 h-3.5" />
              Direct-To-Consumer Precision Engineering
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Crafted Electrical Power for{" "}
              <span className="text-amber-400">Modern Living</span>
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              High-efficiency Gen-3 inverter compressors, medical-grade H13 air filtration, and
              commercial thermal systems shipped directly from VoltCraft engineering labs with
              certified in-home installation.
            </p>

            {/* Quick Assurance Trust Badges (3-Column Micro Grid) */}
            <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-slate-800/90">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                    100% Inverter Efficiency
                  </p>
                  <p className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
                    No.5 Energy Star Certified
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                    Pro Installation Included
                  </p>
                  <p className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
                    Certified VoltCraft Technicians
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                    3-5 Year Direct Warranty
                  </p>
                  <p className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
                    On-site rapid swap guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          C. INTERACTIVE CATALOG & FILTER CONTROLS
      ========================================================= */}
      <section className="px-4 py-3">
        <div className="max-w-7xl mx-auto">
          {/* Control Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2.5 shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Bottom-Sheet Filter Drawer Trigger */}
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 active:scale-95 transition-all duration-150"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>Filters &amp; Specs</span>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Quick Spec Toggle Pills on Desktop/Tablet */}
              <button
                onClick={() => setOnlyInverter((prev) => !prev)}
                className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all duration-150 ${
                  onlyInverter
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                Inverter Only
              </button>

              <button
                onClick={() => setOnlyEnergyStar((prev) => !prev)}
                className={`hidden sm:inline-flex min-h-[44px] px-3 py-2 rounded-xl border text-xs font-semibold items-center gap-1.5 active:scale-95 transition-all duration-150 ${
                  onlyEnergyStar
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Energy No.5 Certified
              </button>
            </div>

            {/* Right Side: Result Count + Sort Selector */}
            <div className="flex items-center gap-2.5 ml-auto">
              <span className="text-xs font-medium text-slate-500 hidden md:inline">
                Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of{" "}
                {VOLTCRAFT_PRODUCTS.length} units
              </span>

              <div className="flex items-center gap-1.5">
                <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 sr-only">
                  Sort By
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="featured">Sort: Featured Specs</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Lab Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips with One-Tap Removal */}
          {(activeFilterCount > 0 || selectedCategory !== "All" || searchQuery) && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500">Active Specs:</span>

              {selectedCategory !== "All" && (
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold active:scale-95 transition-transform"
                >
                  Category: {selectedCategory}
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold active:scale-95 transition-transform"
                >
                  Search: &ldquo;{searchQuery}&rdquo;
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {(minPrice > 0 || maxPrice < 1500) && (
                <button
                  onClick={() => {
                    setMinPrice(0);
                    setMaxPrice(1500);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold active:scale-95 transition-transform"
                >
                  ${minPrice} - ${maxPrice}
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {wattageTier !== "All" && (
                <button
                  onClick={() => setWattageTier("All")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold active:scale-95 transition-transform"
                >
                  Power: {wattageTier}
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {onlyInverter && (
                <button
                  onClick={() => setOnlyInverter(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold active:scale-95 transition-transform"
                >
                  Inverter Driven
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {onlyEnergyStar && (
                <button
                  onClick={() => setOnlyEnergyStar(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold active:scale-95 transition-transform"
                >
                  5-Star Energy Label
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {onlySmartWifi && (
                <button
                  onClick={() => setOnlySmartWifi(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold active:scale-95 transition-transform"
                >
                  VoltCraft Smart App
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {onlyUltraQuiet && (
                <button
                  onClick={() => setOnlyUltraQuiet(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold active:scale-95 transition-transform"
                >
                  Ultra-Quiet (&lt;50dB)
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {onlyWishlist && (
                <button
                  onClick={() => setOnlyWishlist(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold active:scale-95 transition-transform"
                >
                  Saved Wishlist Only
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 underline ml-1 py-1"
              >
                Reset All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          D. APPLIANCE PRODUCT CATALOG GRID (MOBILE-FIRST)
      ========================================================= */}
      <main className="px-4 py-3">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center my-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                No VoltCraft Appliances Match Your Exact Spec Filter
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
                Try broadening your wattage tier, adjusting the price range, or clearing active
                technical filters.
              </p>
              <button
                onClick={resetAllFilters}
                className="mt-5 min-h-[44px] px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm active:scale-95 transition-all"
              >
                Reset Technical Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlistIds.includes(product.id);
                const isAdding = addingProductId === product.id;
                const isAdded = addedSuccessId === product.id;

                return (
                  <article
                    key={product.id}
                    onClick={() => setQuickViewProduct(product)}
                    className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-amber-500/60 transition-all duration-200 flex flex-col cursor-pointer"
                  >
                    {/* Fixed Aspect Ratio Image Container with Badge Overlays */}
                    <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Top-Left Certification & Promo Badges */}
                      <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
                        {product.badges.discount && (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-extrabold tracking-tight shadow-sm">
                            {product.badges.discount}
                          </span>
                        )}
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 shadow-sm">
                          <Zap className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                          {product.badges.tech}
                        </span>
                      </div>

                      {/* Top-Right Instant Favorite Heart Button (44x44px touch target) */}
                      <button
                        type="button"
                        onClick={(e) => toggleWishlist(product.id, e)}
                        aria-label={`Save ${product.name} to wishlist`}
                        className="absolute top-2.5 right-2.5 w-11 h-11 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-slate-700 hover:text-rose-600 active:scale-95 transition-all shadow-sm"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            isWishlisted ? "fill-rose-500 text-rose-500" : ""
                          }`}
                        />
                      </button>

                      {/* Bottom-Left Service Assurance Pill + Quick-View Indicator */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50/95 backdrop-blur-sm text-blue-700 border border-blue-200 text-[11px] font-bold flex items-center gap-1 shadow-sm">
                          <Wrench className="w-3 h-3" />
                          {product.badges.service}
                        </span>

                        <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm text-white text-[11px] font-medium flex items-center gap-1">
                          <Eye className="w-3 h-3 text-amber-400" />
                          Specs
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Category & Model Code */}
                        <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-500 mb-1">
                          <span>{product.category}</span>
                          <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                            {product.modelCode}
                          </span>
                        </div>

                        {/* Product Name */}
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
                          {product.name}
                        </h3>

                        {/* Technical Specs Micro-Bar */}
                        <div className="mt-3 grid grid-cols-3 gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl p-2 text-center">
                          <div className="px-1">
                            <p className="text-[10px] text-slate-500 uppercase font-semibold">
                              Output
                            </p>
                            <p className="text-[11px] font-bold text-slate-900 truncate">
                              {product.primarySpec}
                            </p>
                          </div>
                          <div className="px-1 border-x border-slate-200">
                            <p className="text-[10px] text-slate-500 uppercase font-semibold">
                              Drive
                            </p>
                            <p className="text-[11px] font-bold text-emerald-700 truncate">
                              {product.inverter ? "Inverter" : "PID Thermal"}
                            </p>
                          </div>
                          <div className="px-1">
                            <p className="text-[10px] text-slate-500 uppercase font-semibold">
                              Power
                            </p>
                            <p className="text-[11px] font-bold text-slate-900 truncate">
                              {product.wattage}W Max
                            </p>
                          </div>
                        </div>

                        {/* Star Ratings & Energy Star Badge */}
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                            <span className="text-xs font-bold text-slate-900">
                              {product.rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-slate-500">
                              ({product.reviewsCount})
                            </span>
                          </div>

                          {product.energyStar && (
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              ★ Energy No.5
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing & Touch-Friendly Add to Cart CTA */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                                ${product.price.toLocaleString()}
                              </span>
                              <span className="text-xs font-semibold text-slate-500">
                                ({formatTHB(product.price)})
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <span className="line-through">
                                ${product.originalPrice.toLocaleString()}
                              </span>
                              <span className="text-rose-600 font-semibold">
                                Save ${product.originalPrice - product.price}
                              </span>
                            </div>
                          </div>

                          <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            In Stock
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(product, false, false, e)}
                          disabled={isAdding}
                          className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all duration-150 shadow-sm ${
                            isAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950"
                          }`}
                        >
                          {isAdding ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                              Allocating Unit...
                            </span>
                          ) : isAdded ? (
                            <>
                              <Check className="w-4 h-4 stroke-[2.5]" />
                              <span>Added to Direct Cart</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* =========================================================
          DIRECT-BRAND ENGINEERING ASSURANCE FOOTER SECTION
      ========================================================= */}
      <footer className="mt-12 px-4">
        <div className="max-w-7xl mx-auto bg-slate-950 text-slate-300 rounded-2xl border border-slate-800 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Scheduled White-Glove Fleet Delivery
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Every heavy appliance is transported upright via air-ride VoltCraft trucks with
                  2-man stair carry and packaging haul-away.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Licensed Electrical &amp; HVAC Setup
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Add factory wall-mounting, vacuum line purging, or water-line plumbing directly in
                  your cart for turnkey commissioning.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Direct Serial Registration &amp; 5-Yr Warranty
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  No third-party dealers or paper receipts required. Your appliance serial number is
                  bound to your VoltCraft warranty ID at dispatch.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-bold text-white">VoltCraft Appliances Global Direct</span>
              <span>• WCAG AAA High-Contrast Interface</span>
            </div>
            <p>© {new Date().getFullYear()} VoltCraft Precision Electrical Systems. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* =========================================================
          C2. BOTTOM-SHEET FILTER DRAWER (MOBILE & DESKTOP)
      ========================================================= */}
      {isFilterDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setIsFilterDrawerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-slate-200 max-h-[88vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
          >
            {/* Drawer Header */}
            <div className="px-5 py-4 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold">Technical Specs &amp; Filter Lab</h3>
                  <p className="text-[11px] text-slate-400">
                    Refine by power draw, inverter architecture, and price
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1">
              {/* 1. Price Range Dual Inputs & Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Price Range (USD / THB Equivalent)
                  </label>
                  <span className="text-xs font-extrabold text-amber-600">
                    ${minPrice} – ${maxPrice} ({formatTHB(maxPrice)})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium">Min Price ($)</span>
                    <input
                      type="number"
                      min={0}
                      max={maxPrice}
                      value={minPrice}
                      onChange={(e) =>
                        setMinPrice(Math.min(Number(e.target.value) || 0, maxPrice))
                      }
                      className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium">Max Price ($)</span>
                    <input
                      type="number"
                      min={minPrice}
                      max={2000}
                      value={maxPrice}
                      onChange={(e) =>
                        setMaxPrice(Math.max(Number(e.target.value) || 0, minPrice))
                      }
                      className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <input
                  type="range"
                  min={150}
                  max={1500}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* 2. Wattage / Power Consumption Tiers */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Wattage / Power Consumption Tier
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      "All",
                      "Low (<500W)",
                      "Medium (500W-1500W)",
                      "High (>1500W)",
                    ] as WattageTier[]
                  ).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setWattageTier(tier)}
                      className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-bold text-left flex items-center justify-between active:scale-95 transition-all ${
                        wattageTier === tier
                          ? "bg-amber-50 text-amber-900 border-amber-500 ring-1 ring-amber-500"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span>{tier}</span>
                      {wattageTier === tier && <Check className="w-4 h-4 text-amber-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Energy Saving & Engineering Features Checkboxes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Certifications &amp; Hardware Features
                </label>
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-amber-400">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        5-Star Energy Saving Certified (Label No.5)
                      </p>
                      <p className="text-xs text-slate-500">
                        Maximum kWh efficiency certified for continuous duty
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={onlyEnergyStar}
                      onChange={(e) => setOnlyEnergyStar(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-amber-400">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Inverter-Driven Compressor / Motor
                      </p>
                      <p className="text-xs text-slate-500">
                        Variable frequency drive with 5-year direct warranty
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={onlyInverter}
                      onChange={(e) => setOnlyInverter(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-amber-400">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Smart Wi-Fi VoltCraft App Telemetry
                      </p>
                      <p className="text-xs text-slate-500">
                        Remote scheduling, kWh power meter, and diagnostics
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={onlySmartWifi}
                      onChange={(e) => setOnlySmartWifi(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-amber-400">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Ultra-Quiet Acoustic Mode (&lt;50dB)
                      </p>
                      <p className="text-xs text-slate-500">
                        Whisper-quiet acoustic dampening for bedrooms &amp; studies
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={onlyUltraQuiet}
                      onChange={(e) => setOnlyUltraQuiet(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Drawer Footer CTAs */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
              <button
                type="button"
                onClick={resetAllFilters}
                className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-100 active:scale-95 transition-all"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 min-h-[44px] py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
              >
                <span>Apply Filters ({filteredProducts.length} Units)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          E. SLIDE-OVER CART DRAWER WITH SPECIALIZED APPLIANCE ADD-ONS
      ========================================================= */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-200"
          >
            {/* Cart Header */}
            <div className="p-4 sm:p-5 bg-slate-950 text-white border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold">
                      Direct Factory Dispatch Cart
                    </h2>
                    <p className="text-xs text-slate-400">
                      {totalCartItems} {totalCartItems === 1 ? "Appliance" : "Appliances"} • Serial
                      Warranty Included
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Close cart"
                  className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free White-Glove Shipping Progress Bar */}
              <div className="mt-3.5 bg-slate-900 border border-slate-800 rounded-xl p-2.5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  {cartCalculations.shippingUSD === 0 && cart.length > 0 ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      Unlocked: FREE White-Glove Fleet Delivery!
                    </span>
                  ) : (
                    <span className="text-slate-300">
                      Add{" "}
                      <strong className="text-amber-400">
                        ${Math.max(0, FREE_SHIPPING_THRESHOLD_USD - cartCalculations.subtotalUSD)}
                      </strong>{" "}
                      for Free White-Glove Delivery
                    </span>
                  )}
                  <span className="font-mono text-[11px] text-amber-400 font-bold">
                    {cartCalculations.freeShippingProgress}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${cartCalculations.freeShippingProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Cart Item List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {cart.length === 0 ? (
                <div className="text-center py-14 px-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-200/70 text-slate-500 flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Your Direct Dispatch Cart is Empty
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Explore VoltCraft inverter air conditioners, refrigerators, and smart cleaning
                    systems with factory installation.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-5 min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider"
                  >
                    Browse Appliances
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {item.product.modelCode}
                          </span>
                          <button
                            onClick={() => removeCartItem(item.product.id)}
                            aria-label="Remove item"
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 mt-0.5">
                          {item.product.name}
                        </h4>

                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {item.product.primarySpec} • {item.product.wattage}W •{" "}
                          {item.product.warrantyYears}-Yr Warranty
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            <span className="text-sm font-extrabold text-slate-900">
                              ${(item.product.price * item.quantity).toLocaleString()}
                            </span>
                            <span className="text-[11px] text-slate-500 ml-1">
                              ({formatTHB(item.product.price * item.quantity)})
                            </span>
                          </div>

                          {/* Quantity Stepper */}
                          <div className="inline-flex items-center border border-slate-200 rounded-xl bg-slate-50">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, -1)}
                              aria-label="Decrease quantity"
                              className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-200 rounded-l-xl active:scale-95"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, 1)}
                              aria-label="Increase quantity"
                              className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-200 rounded-r-xl active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Direct-to-Consumer Specialty Appliance Upsell Checkboxes */}
                    <div className="pt-2.5 border-t border-slate-100 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Direct Technician Services (Per Unit):
                      </p>

                      <label className="flex items-start gap-2.5 p-2 rounded-xl bg-amber-50/70 border border-amber-200/80 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.addOnInstallation}
                          onChange={() =>
                            toggleCartAddOn(item.product.id, "addOnInstallation")
                          }
                          className="mt-0.5 w-4 h-4 accent-amber-500 rounded cursor-pointer"
                        />
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between font-bold text-amber-950">
                            <span className="flex items-center gap-1">
                              <Wrench className="w-3.5 h-3.5 text-amber-600" />
                              On-Site Pro Wall Mounting &amp; Setup
                            </span>
                            <span>
                              +${INSTALLATION_FEE_USD} / ฿{INSTALLATION_FEE_THB.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-800/80">
                            Includes brackets, circuit load test &amp; commissioning
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.addOnHaulAway}
                          onChange={() => toggleCartAddOn(item.product.id, "addOnHaulAway")}
                          className="mt-0.5 w-4 h-4 accent-amber-500 rounded cursor-pointer"
                        />
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between font-semibold text-slate-800">
                            <span>Old Appliance Disposal &amp; Eco Haul-Away</span>
                            <span className="text-emerald-700 font-bold">FREE</span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer Summary & Checkout CTA */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Appliances Subtotal ({totalCartItems} units)</span>
                    <span className="font-semibold text-slate-900">
                      ${cartCalculations.subtotalUSD.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>
                      Certified On-Site Setup ({cartCalculations.installCount}x)
                    </span>
                    <span className="font-semibold text-slate-900">
                      {cartCalculations.addOnsUSD > 0
                        ? `+$${cartCalculations.addOnsUSD.toLocaleString()}`
                        : "$0"}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>White-Glove Fleet Delivery</span>
                    <span className="font-bold text-emerald-700">
                      {cartCalculations.shippingUSD === 0
                        ? "FREE"
                        : `$${cartCalculations.shippingUSD}`}
                    </span>
                  </div>

                  {cartCalculations.totalSavingsUSD > 0 && (
                    <div className="flex justify-between text-rose-600 font-semibold">
                      <span>Direct Factory Batch Savings</span>
                      <span>-${cartCalculations.totalSavingsUSD.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                    <span className="text-sm font-extrabold text-slate-900">
                      Final Total
                    </span>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-slate-900">
                        ${cartCalculations.finalTotalUSD.toLocaleString()}
                      </span>
                      <span className="block text-[11px] font-semibold text-slate-500">
                        Approx. {formatTHB(cartCalculations.finalTotalUSD)} (VAT Incl.)
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutSuccessModal(true);
                  }}
                  className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                  <span>Proceed to Secure Checkout</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Official VoltCraft Serial Warranty Lock &amp; 30-Day Home Trial
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          F. QUICK-VIEW / PRODUCT DETAIL MODAL (SINGLE-PAGE SPEC SHEET)
      ========================================================= */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:max-w-3xl rounded-t-3xl sm:rounded-2xl border border-slate-200 max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-200"
          >
            {/* Top Bar */}
            <div className="sticky top-0 z-10 bg-slate-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-mono text-xs font-extrabold">
                  {quickViewProduct.modelCode}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  Engineering Spec Sheet &amp; Installation Requirements
                </span>
              </div>
              <button
                onClick={() => setQuickViewProduct(null)}
                aria-label="Close modal"
                className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Image & Badges */}
              <div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {quickViewProduct.badges.discount && (
                      <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-extrabold">
                        {quickViewProduct.badges.discount}
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      {quickViewProduct.badges.tech}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {quickViewProduct.description}
                </p>

                {/* Certification Pills */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {quickViewProduct.energyStar && (
                    <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      ✓ Energy Star No.5 Certified
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                    ✓ {quickViewProduct.warrantyYears}-Year Direct Factory Warranty
                  </span>
                  {quickViewProduct.smartWifi && (
                    <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                      ✓ VoltCraft App Wi-Fi Control
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Full Technical Specs Table & Purchase Controls */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    {quickViewProduct.category}
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                    {quickViewProduct.name}
                  </h2>

                  {/* Rating & Price */}
                  <div className="mt-3 flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-slate-900">
                          ${quickViewProduct.price.toLocaleString()}
                        </span>
                        <span className="text-sm font-semibold text-slate-500">
                          ({formatTHB(quickViewProduct.price)})
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 line-through">
                        MSRP ${quickViewProduct.originalPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="text-xs font-bold text-slate-900">
                        {quickViewProduct.rating}
                      </span>
                      <span className="text-xs text-slate-500">
                        ({quickViewProduct.reviewsCount} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Full Hardware Telemetry Table */}
                  <div className="mt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Hardware &amp; Electrical Specifications
                    </h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-200 text-xs">
                      <div className="py-2 px-3 flex justify-between">
                        <span className="text-slate-500">Dimensions (W x H x D)</span>
                        <span className="font-bold text-slate-900">
                          {quickViewProduct.dimensions}
                        </span>
                      </div>
                      <div className="py-2 px-3 flex justify-between">
                        <span className="text-slate-500">Rated Power Consumption</span>
                        <span className="font-bold text-slate-900">
                          {quickViewProduct.wattage}W ({quickViewProduct.primarySpec})
                        </span>
                      </div>
                      <div className="py-2 px-3 flex justify-between">
                        <span className="text-slate-500">Circuit Breaker Requirement</span>
                        <span className="font-bold text-slate-900">
                          {quickViewProduct.circuitBreaker}
                        </span>
                      </div>
                      <div className="py-2 px-3 flex justify-between">
                        <span className="text-slate-500">Operating Acoustic Noise</span>
                        <span className="font-bold text-emerald-700">
                          {quickViewProduct.noiseLevelDb} dB(A) Whisper Spec
                        </span>
                      </div>
                      <div className="py-2 px-3 flex justify-between">
                        <span className="text-slate-500">Shielded Power Cord Length</span>
                        <span className="font-bold text-slate-900">
                          {quickViewProduct.cordLengthM.toFixed(1)} Meters
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="mt-6 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(quickViewProduct, true, true);
                      setQuickViewProduct(null);
                      setIsCartOpen(true);
                    }}
                    className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                  >
                    <Wrench className="w-4 h-4 stroke-[2.2]" />
                    <span>
                      Add with Pro Installation (+${INSTALLATION_FEE_USD} / ฿
                      {INSTALLATION_FEE_THB})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(quickViewProduct, false, false);
                      setQuickViewProduct(null);
                    }}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Appliance Only (${quickViewProduct.price})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          CHECKOUT CONFIRMATION MODAL
      ========================================================= */}
      {checkoutSuccessModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setCheckoutSuccessModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-md w-full rounded-2xl border border-slate-200 p-6 text-center shadow-2xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold">
              VOLTCRAFT DIRECT DISPATCH LOCKED
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-2">
              Appliance Serial &amp; Technician Slot Reserved
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Your order total of{" "}
              <strong className="text-slate-900">
                ${cartCalculations.finalTotalUSD.toLocaleString()} (
                {formatTHB(cartCalculations.finalTotalUSD)})
              </strong>{" "}
              is ready for dispatch with digital warranty registration and white-glove fleet
              scheduling.
            </p>
            <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-3 text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Dispatch Warehouse:</span>
                <span className="font-bold text-slate-900">VoltCraft Central Lab #04</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pro Installation Units:</span>
                <span className="font-bold text-emerald-700">
                  {cartCalculations.installCount} Scheduled
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Compressor/Motor Coverage:</span>
                <span className="font-bold text-blue-700">5-Year Direct Replacement</span>
              </div>
            </div>
            <button
              onClick={() => {
                setCheckoutSuccessModal(false);
                setCart([]);
              }}
              className="mt-5 w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm active:scale-95 transition-all"
            >
              Complete Order &amp; Return to Storefront
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          FLOATING MOBILE SUMMARY BAR & TOAST NOTIFICATION
      ========================================================= */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-950 text-white border border-amber-500/40 shadow-xl flex items-center gap-2 text-xs font-semibold whitespace-nowrap">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {totalCartItems > 0 && !isCartOpen && (
        <div className="fixed bottom-3 inset-x-4 sm:hidden z-30">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full min-h-[52px] px-4 py-3 rounded-2xl bg-slate-950 text-white border border-amber-500/40 shadow-xl flex items-center justify-between active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center">
                {totalCartItems}
              </span>
              <div className="text-left">
                <p className="text-xs font-bold leading-none">View Direct Dispatch Cart</p>
                <p className="text-[10px] text-amber-400 mt-0.5">
                  Includes 5-Yr Warranty &amp; Install Options
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-extrabold text-sm text-amber-400">
              <span>${cartCalculations.finalTotalUSD.toLocaleString()}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}