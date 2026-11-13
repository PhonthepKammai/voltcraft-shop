"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  User,
  MapPin,
  Package,
  ShieldCheck,
  KeyRound,
  LogOut,
  Edit3,
  Plus,
  Trash2,
  ChevronRight,
  CheckCircle2,
  Clock,
  Wrench,
  ArrowUpRight,
} from "lucide-react";

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================
type ProfileTabId =
  | "personal"
  | "addresses"
  | "orders"
  | "warranties"
  | "security";

type RoleCode = "customer" | "sales" | "warehouse" | "admin";

type AddressLabelType = "Home" | "Condo" | "Office / Studio";

type OrderLifecycleStatus =
  | "Delivered & Installed"
  | "Out for Delivery"
  | "Packed"
  | "Processing";

interface UserProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  memberId: string;
  joinedDate: string;
  preferredInstallationWindow: string;
  lineNotificationEnabled: boolean;
  smsDispatchAlerts: boolean;
  roles: RoleCode[];
  activeStaffDepartment: string;
}

interface ApplianceDeliveryAddress {
  id: string;
  label: AddressLabelType;
  recipientName: string;
  recipientPhone: string;
  streetAddress: string;
  districtAndCity: string;
  postalCode: string;
  floorNumber: string;
  freightElevatorAvailable: boolean;
  doorframeWidthCm: number;
  gateAccessNotes: string;
  isDefault: boolean;
}

interface OrderLineSummary {
  sku: string;
  name: string;
  qty: number;
  priceTHB: number;
  serialNumber?: string;
  includesProInstall: boolean;
}

interface CustomerApplianceOrder {
  id: string;
  orderRef: string;
  purchaseDate: string;
  deliverySlot: string;
  status: OrderLifecycleStatus;
  totalAmountTHB: number;
  paymentMethod: string;
  shippingAddressSummary: string;
  technicianTeam?: string;
  items: OrderLineSummary[];
}

interface DigitalApplianceWarranty {
  id: string;
  applianceName: string;
  modelSku: string;
  serialNumber: string;
  category: string;
  installedDate: string;
  expiryDate: string;
  countdownLabel: string;
  coveragePercentRemaining: number;
  compressorWarrantyYears: number;
  installingTechnician: string;
  breakerSpec: string;
  imageUrl: string;
  lastServiceStatus: string;
}

// ==========================================
// 2. REALISTIC MOCK DATASETS
// ==========================================
const INITIAL_USER_PROFILE: UserProfileData = {
  id: "usr-vc-7741",
  fullName: "Alex Vance",
  email: "alex.vance@voltcraft.com",
  phone: "089-452-8810",
  memberId: "VC-PRO-88412",
  joinedDate: "March 2025",
  preferredInstallationWindow: "Morning Slot (09:00 - 12:00)",
  lineNotificationEnabled: true,
  smsDispatchAlerts: true,
  roles: ["customer", "sales", "warehouse"],
  activeStaffDepartment: "Senior Showroom & Sales Operations",
};

const INITIAL_ADDRESSES: ApplianceDeliveryAddress[] = [
  {
    id: "addr-1",
    label: "Condo",
    recipientName: "Alex Vance",
    recipientPhone: "089-452-8810",
    streetAddress: "The Line Vibe Sukhumvit, Bldg A, Unit 1804, Phahonyothin Rd",
    districtAndCity: "Chatuchak, Bangkok",
    postalCode: "10900",
    floorNumber: "18th Floor",
    freightElevatorAvailable: true,
    doorframeWidthCm: 92,
    gateAccessNotes:
      "Juristic office freight lift pass pre-approved (09:00-17:00). Loading bay B2 height clearance 3.2m.",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Home",
    recipientName: "Alex Vance (Family Residence)",
    recipientPhone: "081-904-3321",
    streetAddress: "142/19 Centro Chaiyaphruek, Soi 4 (Detached 2-Storey House)",
    districtAndCity: "Pakkret, Nonthaburi",
    postalCode: "11120",
    floorNumber: "1st Floor (Ground Level Kitchen & Living)",
    freightElevatorAvailable: false,
    doorframeWidthCm: 115,
    gateAccessNotes:
      "Present VoltCraft delivery QR at security guardhouse #2. Wide driveway for 4-wheel air-ride box truck.",
    isDefault: false,
  },
];

const INITIAL_ORDERS: CustomerApplianceOrder[] = [
  {
    id: "ord-vc-01",
    orderRef: "#VC-ORD-8841",
    purchaseDate: "04 Nov 2026",
    deliverySlot: "Completed • 06 Nov 2026 (10:15)",
    status: "Delivered & Installed",
    totalAmountTHB: 52600,
    paymentMethod: "PromptPay QR Verified • Tax Invoice #INV-2026-8841",
    shippingAddressSummary: "The Line Vibe Sukhumvit (18th Fl • Freight Lift)",
    technicianTeam: "VoltCraft White-Glove Team #04 (Lead: Prasert J.)",
    items: [
      {
        sku: "VC-AC-12K",
        name: "VoltCraft AeroChill Pro 12,000 BTU Dual-Inverter AC",
        qty: 1,
        priceTHB: 18900,
        serialNumber: "SN-AC-992184",
        includesProInstall: true,
      },
      {
        sku: "VC-RF-19D",
        name: "VoltCraft ArcticLinear 4-Door Refrigerator 19.8 cu.ft.",
        qty: 1,
        priceTHB: 32500,
        serialNumber: "SN-RF-440912",
        includesProInstall: true,
      },
      {
        sku: "VC-SRV-MNT",
        name: "Certified Wall Mounting & Vacuum Line Purge",
        qty: 1,
        priceTHB: 1200,
        includesProInstall: true,
      },
    ],
  },
  {
    id: "ord-vc-02",
    orderRef: "#VC-ORD-9145",
    purchaseDate: "13 Nov 2026",
    deliverySlot: "Today • Estimated Arrival 14:30 - 16:30",
    status: "Out for Delivery",
    totalAmountTHB: 25800,
    paymentMethod: "Visa Platinum 3DS Auth • Tax Invoice #INV-2026-9145",
    shippingAddressSummary: "142/19 Centro Chaiyaphruek, Pakkret, Nonthaburi",
    technicianTeam: "Fleet Truck #02 (Driver: Chaiwat S. • 089-442-9910)",
    items: [
      {
        sku: "VC-RV-600",
        name: "VoltCraft CleanSense LiDAR Robot Vacuum & Wash Dock",
        qty: 1,
        priceTHB: 16900,
        serialNumber: "SN-RV-883019",
        includesProInstall: false,
      },
      {
        sku: "VC-AP-520",
        name: "VoltCraft PureBreathe Pro H13 HEPA Air Purifier",
        qty: 1,
        priceTHB: 8900,
        serialNumber: "SN-AP-774102",
        includesProInstall: false,
      },
    ],
  },
];

const INITIAL_WARRANTIES: DigitalApplianceWarranty[] = [
  {
    id: "war-1",
    applianceName: "VoltCraft AeroChill Pro 12,000 BTU Dual-Inverter AC",
    modelSku: "VC-AC-12K",
    serialNumber: "SN-AC-992184",
    category: "Climate Control",
    installedDate: "06 Nov 2026",
    expiryDate: "06 Nov 2031",
    countdownLabel: "4 Years 11 Months Remaining",
    coveragePercentRemaining: 98,
    compressorWarrantyYears: 5,
    installingTechnician: "Prasert Jongrak (Cert #HVAC-809)",
    breakerSpec: "15A Dedicated Circuit (220-240V)",
    imageUrl:
      "https://images.unsplash.com/photo-1631545806609-35d4ae490431?auto=format&fit=crop&w=800&q=85",
    lastServiceStatus: "Factory Vacuum & Pressure Test Passed (19dB Spec)",
  },
  {
    id: "war-2",
    applianceName: "VoltCraft ArcticLinear 4-Door Refrigerator 19.8 cu.ft.",
    modelSku: "VC-RF-19D",
    serialNumber: "SN-RF-440912",
    category: "Refrigeration",
    installedDate: "06 Nov 2026",
    expiryDate: "06 Nov 2031",
    countdownLabel: "4 Years 11 Months Remaining",
    coveragePercentRemaining: 98,
    compressorWarrantyYears: 5,
    installingTechnician: "Prasert Jongrak (Cert #HVAC-809)",
    breakerSpec: "15A Grounded Outlet (Surge Protected)",
    imageUrl:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=85",
    lastServiceStatus: "Linear Inverter Core & Bio-Zone Calibration Verified",
  },
];

function formatTHB(amount: number): string {
  return `฿${Math.round(amount).toLocaleString()}`;
}

function formatUSD(amountTHB: number): string {
  return `$${Math.round(amountTHB / 34.5).toLocaleString()}`;
}

// ==========================================
// 3. MAIN PROFILE & ACCOUNT SETTINGS COMPONENT
// ==========================================
export default function VoltCraftProfileSettingsPage() {
  // Primary Tab Navigation State
  const [activeTab, setActiveTab] = useState<ProfileTabId>("personal");

  // User Profile & Multi-Role State
  const [profile, setProfile] = useState<UserProfileData>(INITIAL_USER_PROFILE);
  const [SimulateCustomerOnlyMode, setSimulateCustomerOnlyMode] =
    useState<boolean>(false);

  // Personal Info Form State
  const [nameInput, setNameInput] = useState(INITIAL_USER_PROFILE.fullName);
  const [phoneInput, setPhoneInput] = useState(INITIAL_USER_PROFILE.phone);
  const [windowInput, setWindowInput] = useState(
    INITIAL_USER_PROFILE.preferredInstallationWindow
  );
  const [lineAlertsInput, setLineAlertsInput] = useState(
    INITIAL_USER_PROFILE.lineNotificationEnabled
  );
  const [smsAlertsInput, setSmsAlertsInput] = useState(
    INITIAL_USER_PROFILE.smsDispatchAlerts
  );

  // Delivery Addresses State & Modal
  const [addresses, setAddresses] =
    useState<ApplianceDeliveryAddress[]>(INITIAL_ADDRESSES);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState<
    Omit<ApplianceDeliveryAddress, "id">
  >({
    label: "Condo",
    recipientName: "Alex Vance",
    recipientPhone: "089-452-8810",
    streetAddress: "",
    districtAndCity: "Bangkok",
    postalCode: "10900",
    floorNumber: "8th Floor",
    freightElevatorAvailable: true,
    doorframeWidthCm: 90,
    gateAccessNotes: "",
    isDefault: false,
  });

  // Orders & Invoice Modal State
  const [orders] = useState<CustomerApplianceOrder[]>(INITIAL_ORDERS);
  const [selectedOrderModal, setSelectedOrderModal] =
    useState<CustomerApplianceOrder | null>(null);

  // Digital Warranties & Service Request Modal State
  const [warranties, setWarranties] =
    useState<DigitalApplianceWarranty[]>(INITIAL_WARRANTIES);
  const [serviceTargetWarranty, setServiceTargetWarranty] =
    useState<DigitalApplianceWarranty | null>(null);
  const [serviceIssueNote, setServiceIssueNote] = useState(
    "Schedule annual inverter coil cleaning, filter sanitization, and amp-draw telemetry check."
  );
  const [servicePreferredDate, setServicePreferredDate] =
    useState("2026-11-20");

  // Register New S/N Modal State
  const [isBindSerialModalOpen, setIsBindSerialModalOpen] = useState(false);
  const [newSerialCode, setNewSerialCode] = useState("SN-IC-558291");
  const [newSerialModel, setNewSerialModel] = useState(
    "VC-IC-32D — VoltCraft DualZone Induction Cooktop 3200W"
  );

  // Security & Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Role Switcher Gateway Modal State
  const [isPortalSwitcherOpen, setIsPortalSwitcherOpen] = useState(false);
  const [activePortalSimulation, setActivePortalSimulation] = useState<
    string | null
  >(null);

  // Toast Notification State
  const [toast, setToast] = useState<{
    title: string;
    detail?: string;
    tone: "emerald" | "amber" | "blue" | "rose";
  } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  const triggerToast = (
    title: string,
    detail?: string,
    tone: "emerald" | "amber" | "blue" | "rose" = "emerald"
  ) => {
    setToast({ title, detail, tone });
  };

  // Check if user has staff roles
  const hasStaffRoles =
    !SimulateCustomerOnlyMode &&
    profile.roles.some((r) => r === "sales" || r === "warehouse" || r === "admin");

  // ==========================================
  // 4. ACTION HANDLERS
  // ==========================================

  // Save Personal Info
  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !phoneInput.trim()) {
      triggerToast(
        "Required Fields Missing",
        "Please provide both your Full Name and Contact Phone Number.",
        "rose"
      );
      return;
    }

    setProfile((prev) => ({
      ...prev,
      fullName: nameInput.trim(),
      phone: phoneInput.trim(),
      preferredInstallationWindow: windowInput,
      lineNotificationEnabled: lineAlertsInput,
      smsDispatchAlerts: smsAlertsInput,
    }));

    triggerToast(
      "Profile updated",
      `Saved changes for ${nameInput.trim()} • Installation window synced.`,
      "emerald"
    );
  };

  // Open Address Modal (New or Edit)
  const openAddAddressModal = () => {
    setEditingAddressId(null);
    setAddrForm({
      label: "Condo",
      recipientName: profile.fullName,
      recipientPhone: profile.phone,
      streetAddress: "",
      districtAndCity: "",
      postalCode: "",
      floorNumber: "12th Floor",
      freightElevatorAvailable: true,
      doorframeWidthCm: 90,
      gateAccessNotes: "",
      isDefault: addresses.length === 0,
    });
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (addr: ApplianceDeliveryAddress) => {
    setEditingAddressId(addr.id);
    setAddrForm({
      label: addr.label,
      recipientName: addr.recipientName,
      recipientPhone: addr.recipientPhone,
      streetAddress: addr.streetAddress,
      districtAndCity: addr.districtAndCity,
      postalCode: addr.postalCode,
      floorNumber: addr.floorNumber,
      freightElevatorAvailable: addr.freightElevatorAvailable,
      doorframeWidthCm: addr.doorframeWidthCm,
      gateAccessNotes: addr.gateAccessNotes,
      isDefault: addr.isDefault,
    });
    setIsAddressModalOpen(true);
  };

  // Save Address
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrForm.streetAddress.trim() || !addrForm.districtAndCity.trim()) {
      triggerToast(
        "Incomplete Address",
        "Please enter the street/building address and district/city.",
        "rose"
      );
      return;
    }

    if (editingAddressId) {
      setAddresses((prev) =>
        prev.map((item) => {
          if (item.id === editingAddressId) {
            return { ...addrForm, id: editingAddressId };
          }
          return addrForm.isDefault ? { ...item, isDefault: false } : item;
        })
      );
      triggerToast(
        "Delivery address updated",
        `Updated logistics parameters for ${addrForm.label} (${addrForm.floorNumber}).`,
        "emerald"
      );
    } else {
      const newAddress: ApplianceDeliveryAddress = {
        ...addrForm,
        id: `addr-${Date.now()}`,
      };
      setAddresses((prev) => {
        const updated = newAddress.isDefault
          ? prev.map((a) => ({ ...a, isDefault: false }))
          : prev;
        return [newAddress, ...updated];
      });
      triggerToast(
        "Address added successfully",
        `Saved ${newAddress.label} with heavy-appliance elevator & floor metadata.`,
        "emerald"
      );
    }

    setIsAddressModalOpen(false);
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    triggerToast(
      "Default Dispatch Address Updated",
      "White-glove appliance fleet routing updated.",
      "amber"
    );
  };

  const handleDeleteAddress = (addr: ApplianceDeliveryAddress) => {
    if (addresses.length <= 1) {
      triggerToast(
        "Cannot Remove Last Address",
        "At least one primary appliance delivery address is required.",
        "rose"
      );
      return;
    }
    setAddresses((prev) => prev.filter((a) => a.id !== addr.id));
    triggerToast(
      "Address Removed",
      `Deleted ${addr.label} (${addr.districtAndCity}) from address book.`,
      "amber"
    );
  };

  // Submit Technician Service Ticket
  const handleSubmitTechnicianService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTargetWarranty) return;

    setWarranties((prev) =>
      prev.map((w) =>
        w.id === serviceTargetWarranty.id
          ? {
              ...w,
              lastServiceStatus: `On-Site Technician Booked for ${servicePreferredDate}`,
            }
          : w
      )
    );

    triggerToast(
      `Technician Dispatched for ${serviceTargetWarranty.serialNumber}`,
      `Warranty ticket logged for ${servicePreferredDate} • Zero-cost direct coverage.`,
      "blue"
    );
    setServiceTargetWarranty(null);
  };

  // Bind New Appliance Serial Number
  const handleBindNewSerial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSerialCode.trim()) return;

    const [skuPart, namePart] = newSerialModel.split(" — ");
    const createdWarranty: DigitalApplianceWarranty = {
      id: `war-${Date.now()}`,
      applianceName: namePart || "VoltCraft Precision Smart Appliance",
      modelSku: skuPart || "VC-IC-32D",
      serialNumber: newSerialCode.trim().toUpperCase(),
      category: "Kitchen Tech",
      installedDate: "13 Nov 2026",
      expiryDate: "13 Nov 2031",
      countdownLabel: "5 Years 0 Months Remaining",
      coveragePercentRemaining: 100,
      compressorWarrantyYears: 5,
      installingTechnician: "Self-Registered / Direct Factory Bind",
      breakerSpec: "20A Dedicated Circuit",
      imageUrl:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=85",
      lastServiceStatus: "Digital Warranty Activated • 100% Coverage",
    };

    setWarranties((prev) => [createdWarranty, ...prev]);
    setIsBindSerialModalOpen(false);
    triggerToast(
      `Serial Number ${createdWarranty.serialNumber} Registered`,
      `5-Year Direct Factory Warranty bound to ${profile.email}.`,
      "emerald"
    );
  };

  // Update Security Password
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      triggerToast(
        "Password Fields Required",
        "Please complete your current password and new password fields.",
        "rose"
      );
      return;
    }
    if (newPassword.length < 6) {
      triggerToast(
        "Weak Password",
        "New password must contain at least 6 characters.",
        "rose"
      );
      return;
    }
    if (newPassword !== confirmNewPassword) {
      triggerToast(
        "Password Mismatch",
        "New password and confirmation do not match.",
        "rose"
      );
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    triggerToast(
      "Password changed",
      "Your unified single-account security credentials have been rotated.",
      "emerald"
    );
  };

  const NAVIGATION_TABS: {
    id: ProfileTabId;
    label: string;
    badge?: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "personal",
      label: "Personal Info",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "addresses",
      label: "Delivery Addresses",
      badge: `${addresses.length}`,
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: "orders",
      label: "Order History",
      badge: `${orders.length}`,
      icon: <Package className="w-4 h-4" />,
    },
    {
      id: "warranties",
      label: "Digital Warranties",
      badge: `${warranties.length} S/N`,
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: "security",
      label: "Security & Password",
      icon: <KeyRound className="w-4 h-4" />,
    },
  ];

  // Extract Initials for Avatar
  const userInitials = profile.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950 pb-20">
      {/* =========================================================
          STICKY TOP BRAND BAR
      ========================================================= */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* VoltCraft Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-sm shadow-amber-500/20 shrink-0">
              <Zap className="w-6 h-6 fill-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  Volt<span className="text-amber-500">Craft</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 text-[10px] font-extrabold uppercase tracking-wider">
                  ACCOUNT HUB
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block leading-none mt-0.5">
                Unified Member Profile, Appliance Logistics &amp; Digital S/N Vault
              </p>
            </div>
          </div>

          {/* Right Demo Role Toggle & Sign Out */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setSimulateCustomerOnlyMode((prev) => !prev)
              }
              className="hidden md:inline-flex min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 items-center gap-1.5 active:scale-95 transition-transform duration-150"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Demo Mode:{" "}
                <strong className="text-amber-400">
                  {SimulateCustomerOnlyMode
                    ? "Customer Only"
                    : "Multi-Role Staff + Customer"}
                </strong>
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                triggerToast(
                  "Session Signed Out",
                  "Redirecting to VoltCraft Authentication Gateway (/login)...",
                  "amber"
                )
              }
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-transform duration-150"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          A. MOBILE PROFILE HEADER & ROLE SWITCHER BANNER
      ========================================================= */}
      <section className="bg-slate-900 text-white border-b border-slate-800 px-4 py-5 sm:py-6">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* User Identity Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* Avatar with Initials */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xl sm:text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 border-2 border-amber-300">
                {userInitials}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-2xl font-extrabold text-white truncate">
                    {profile.fullName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Member
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-medium truncate mt-0.5">
                  {profile.email} •{" "}
                  <span className="font-mono text-amber-400">
                    {profile.memberId}
                  </span>
                </p>

                {/* Assigned Multi-Role Chips */}
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                    Customer Storefront
                  </span>
                  {hasStaffRoles && (
                    <>
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-extrabold uppercase">
                        Sales Ops Staff
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase">
                        Warehouse Access
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Account Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-950/90 border border-slate-800 rounded-2xl p-3 text-center shrink-0">
              <div className="px-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Orders
                </span>
                <span className="text-sm sm:text-base font-extrabold text-white">
                  {orders.length}
                </span>
              </div>
              <div className="px-2 border-x border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Active S/N
                </span>
                <span className="text-sm sm:text-base font-extrabold text-amber-400">
                  {warranties.length} Units
                </span>
              </div>
              <div className="px-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Addresses
                </span>
                <span className="text-sm sm:text-base font-extrabold text-emerald-400">
                  {addresses.length} Saved
                </span>
              </div>
            </div>
          </div>

          {/* Conditional Staff Portal Gateway Banner */}
          {hasStaffRoles && (
            <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-slate-950 border border-amber-500/40 rounded-2xl p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                  <Zap className="w-5 h-5 fill-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-extrabold text-amber-300">
                      Active Staff Access: Switch to Operations Portal
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 text-[10px] font-mono font-bold">
                      {profile.activeStaffDepartment}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Your single VoltCraft account holds staff privileges. Jump
                    directly to Sales Catalog CRUD or Warehouse S/N Scanner.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPortalSwitcherOpen(true)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 shadow-sm active:scale-95 transition-transform duration-150"
              >
                <span>Role Switcher / Gateway</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}

          {/* Active Portal Jump Feedback Banner if triggered */}
          {activePortalSimulation && (
            <div className="bg-slate-950 border border-emerald-500/50 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Session Route Ready:{" "}
                  <strong className="text-white font-mono">
                    {activePortalSimulation}
                  </strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActivePortalSimulation(null)}
                className="text-slate-400 hover:text-white underline font-semibold"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          MAIN DASHBOARD LAYOUT (MOBILE HORIZONTAL TABS / DESKTOP SIDEBAR)
      ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 pt-4 sm:pt-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Navigation Tabs (Mobile Horizontal Scroll / Desktop Vertical Sidebar) */}
          <aside className="w-full lg:w-72 shrink-0 sticky top-[68px] z-30 bg-slate-50/95 backdrop-blur-md lg:bg-transparent py-1 lg:py-0">
            <nav
              aria-label="Account Settings Sections"
              className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar"
            >
              {NAVIGATION_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between gap-2.5 active:scale-95 transition-all duration-150 ${
                      isActive
                        ? "bg-amber-500 text-slate-950 shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={
                          isActive ? "text-slate-950" : "text-amber-600"
                        }
                      >
                        {tab.icon}
                      </span>
                      <span className="whitespace-nowrap">{tab.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {tab.badge && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                            isActive
                              ? "bg-slate-950 text-amber-400"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-4 h-4 hidden lg:inline ${
                          isActive ? "text-slate-950" : "text-slate-400"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Desktop Support Assurance Card */}
            <div className="hidden lg:block mt-4 bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
                <Wrench className="w-4 h-4" />
                Direct Engineering Care
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Need on-site compressor diagnostics or voltage load verification?
                Our licensed technicians respond within 24 hours.
              </p>
              <div className="pt-1 text-xs font-mono text-amber-400 font-bold">
                Hotline: 1490-VOLT (24/7)
              </div>
            </div>
          </aside>

          {/* Right Dynamic Tab Content Panel */}
          <div className="flex-1 w-full min-w-0">
            {/* =========================================================
                B. TAB 1: PERSONAL INFO
            ========================================================= */}
            {activeTab === "personal" && (
              <section
                aria-label="Personal Information"
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      Personal Information &amp; Dispatch Preferences
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Manage your primary contact details for white-glove
                      delivery and digital warranty ownership.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-mono text-xs font-bold self-start sm:self-center">
                    Joined {profile.joinedDate}
                  </span>
                </div>

                <form onSubmit={handleSavePersonalInfo} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="profile-fullname"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                      >
                        Full Name *
                      </label>
                      <input
                        id="profile-fullname"
                        type="text"
                        required
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label
                        htmlFor="profile-phone"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                      >
                        Primary Phone Number (Technician Contact) *
                      </label>
                      <input
                        id="profile-phone"
                        type="tel"
                        required
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Read-Only Verified Email Address */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="profile-email"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                      >
                        Email Address (Unified Single-Account ID)
                      </label>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified &amp; Bound to S/N Vault
                      </span>
                    </div>
                    <input
                      id="profile-email"
                      type="email"
                      readOnly
                      value={profile.email}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-sm font-medium text-slate-500 cursor-not-allowed"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      This email unifies your Customer Storefront, Digital
                      Warranties, and Staff Portal permissions without account
                      duplication.
                    </p>
                  </div>

                  {/* Preferred Installation Time Window */}
                  <div className="pt-2 border-t border-slate-100">
                    <label
                      htmlFor="install-window"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                    >
                      Preferred White-Glove Installation Window
                    </label>
                    <select
                      id="install-window"
                      value={windowInput}
                      onChange={(e) => setWindowInput(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Morning Slot (09:00 - 12:00)">
                        Morning Slot (09:00 - 12:00)
                      </option>
                      <option value="Afternoon Slot (13:00 - 17:00)">
                        Afternoon Slot (13:00 - 17:00)
                      </option>
                      <option value="Evening Condo Slot (17:30 - 20:00)">
                        Evening Condo Slot (17:30 - 20:00)
                      </option>
                      <option value="Weekend Priority Only (Sat - Sun)">
                        Weekend Priority Only (Sat - Sun)
                      </option>
                    </select>
                  </div>

                  {/* Notification Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-amber-400">
                      <input
                        type="checkbox"
                        checked={lineAlertsInput}
                        onChange={(e) => setLineAlertsInput(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">
                          LINE Official Truck &amp; Technician Alerts
                        </span>
                        <span className="text-slate-500">
                          Receive live GPS arrival notifications 30 mins before
                          installation.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-amber-400">
                      <input
                        type="checkbox"
                        checked={smsAlertsInput}
                        onChange={(e) => setSmsAlertsInput(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">
                          SMS Warranty &amp; Filter Maintenance Reminders
                        </span>
                        <span className="text-slate-500">
                          6-month HEPA &amp; inverter coil checkup alerts.
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Save Button */}
                  <div className="pt-3 border-t border-slate-200 flex justify-end">
                    <button
                      type="submit"
                      className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform duration-150"
                    >
                      <CheckCircle2 className="w-4 h-4 stroke-[2.3]" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* =========================================================
                C. TAB 2: DELIVERY ADDRESSES (LARGE APPLIANCE SPECIALIZED)
            ========================================================= */}
            {activeTab === "addresses" && (
              <section aria-label="Delivery Addresses" className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      Heavy Appliance Delivery Addresses
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Pre-configured with floor level, freight elevator
                      availability, and gate clearance for 2-man installation
                      teams.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openAddAddressModal}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 shadow-sm active:scale-95 transition-transform duration-150"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>+ Add New Address</span>
                  </button>
                </div>

                {/* Address Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <article
                      key={addr.id}
                      className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col justify-between gap-4 ${
                        addr.isDefault
                          ? "border-amber-500 ring-1 ring-amber-500/40"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-extrabold">
                              {addr.label}
                            </span>
                            {addr.isDefault && (
                              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 text-xs font-extrabold">
                                ★ Default Dispatch
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openEditAddressModal(addr)}
                              aria-label={`Edit ${addr.label} address`}
                              className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center active:scale-95 transition-transform"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(addr)}
                              aria-label={`Delete ${addr.label} address`}
                              className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 flex items-center justify-center active:scale-95 transition-transform"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Recipient & Street */}
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {addr.recipientName}{" "}
                            <span className="font-mono text-xs text-slate-500 ml-1">
                              ({addr.recipientPhone})
                            </span>
                          </p>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-snug">
                            {addr.streetAddress}
                          </p>
                          <p className="text-xs font-semibold text-slate-800 mt-0.5">
                            {addr.districtAndCity} {addr.postalCode}
                          </p>
                        </div>

                        {/* Special Appliance Logistics Metadata Box */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">
                              Installation Floor:
                            </span>
                            <span className="font-bold text-slate-900">
                              {addr.floorNumber}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">
                              Freight Elevator:
                            </span>
                            <span
                              className={`font-bold px-2 py-0.5 rounded ${
                                addr.freightElevatorAvailable
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-800 border border-amber-200"
                              }`}
                            >
                              {addr.freightElevatorAvailable
                                ? "✓ Elevator Available"
                                : "Stair Carry / Ground Floor"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">
                              Doorframe Clearance:
                            </span>
                            <span className="font-mono font-bold text-slate-900">
                              {addr.doorframeWidthCm} cm
                            </span>
                          </div>
                          {addr.gateAccessNotes && (
                            <div className="pt-1.5 border-t border-slate-200 text-[11px] text-slate-600">
                              <strong className="text-slate-800">
                                Access / Gate Note:
                              </strong>{" "}
                              {addr.gateAccessNotes}
                            </div>
                          )}
                        </div>
                      </div>

                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="w-full min-h-[44px] py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-xs font-bold text-slate-800 active:scale-95 transition-all"
                        >
                          Set as Default Delivery Address
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* =========================================================
                D. TAB 3: ORDER HISTORY & REAL-TIME TRACKING
            ========================================================= */}
            {activeTab === "orders" && (
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
                  {orders.map((order) => {
                    const isInstalled =
                      order.status === "Delivered & Installed";
                    const isOutForDelivery =
                      order.status === "Out for Delivery";

                    return (
                      <article
                        key={order.id}
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-base sm:text-lg font-extrabold font-mono text-slate-900">
                                {order.orderRef}
                              </span>
                              <span className="text-xs text-slate-500">
                                • Ordered {order.purchaseDate}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium mt-0.5 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              {order.deliverySlot}
                            </p>
                          </div>

                          <span
                            className={`self-start sm:self-center px-3 py-1.5 rounded-xl text-xs font-extrabold border inline-flex items-center gap-1.5 ${
                              isInstalled
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isOutForDelivery
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            {isInstalled ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                            {order.status}
                          </span>
                        </div>

                        {/* Lifecycle Stepper Visual */}
                        <div className="grid grid-cols-4 gap-1.5 text-center text-[11px] font-bold">
                          <div className="py-1.5 px-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                            1. Verified
                          </div>
                          <div className="py-1.5 px-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                            2. S/N Packed
                          </div>
                          <div
                            className={`py-1.5 px-2 rounded-lg border ${
                              isOutForDelivery || isInstalled
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-slate-100 text-slate-400 border-slate-200"
                            }`}
                          >
                            3. Dispatched
                          </div>
                          <div
                            className={`py-1.5 px-2 rounded-lg border ${
                              isInstalled
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-400 border-slate-200"
                            }`}
                          >
                            4. Installed
                          </div>
                        </div>

                        {/* Items Table */}
                        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                                    {item.sku}
                                  </span>
                                  <span className="font-bold text-slate-900">
                                    {item.name}
                                  </span>
                                </div>
                                {item.serialNumber && (
                                  <p className="font-mono text-[11px] text-emerald-700 font-bold">
                                    Bound Warranty S/N: {item.serialNumber}
                                  </p>
                                )}
                              </div>

                              <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0">
                                <span className="font-extrabold text-slate-900 text-sm">
                                  {formatTHB(item.priceTHB * item.qty)}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  Qty: {item.qty}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Footer Total & Actions */}
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-xs text-slate-500 block">
                              Total Paid ({order.paymentMethod.split(" • ")[0]})
                            </span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-extrabold text-slate-900">
                                {formatTHB(order.totalAmountTHB)}
                              </span>
                              <span className="text-xs text-slate-500 font-semibold">
                                ({formatUSD(order.totalAmountTHB)})
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedOrderModal(order)}
                              className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition-transform"
                            >
                              <span>View Order &amp; Tax Invoice</span>
                              <ChevronRight className="w-4 h-4 text-amber-400" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* =========================================================
                E. TAB 4: DIGITAL WARRANTIES & SERIAL NUMBERS (S/N)
            ========================================================= */}
            {activeTab === "warranties" && (
              <section
                aria-label="Digital Warranties and Serial Numbers"
                className="space-y-4"
              >
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      Digital Warranties &amp; Registered Serial Numbers (S/N)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Paperless factory warranty vault. Your appliance Serial
                      Numbers are automatically bound at warehouse dispatch.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsBindSerialModalOpen(true)}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 shadow-sm active:scale-95 transition-transform duration-150"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>+ Register Retail S/N</span>
                  </button>
                </div>

                {/* Warranty Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {warranties.map((war) => (
                    <article
                      key={war.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        {/* Header Banner with Image & S/N Pill */}
                        <div className="relative h-40 bg-slate-900 overflow-hidden">
                          <img
                            src={war.imageUrl}
                            alt={war.applianceName}
                            className="w-full h-full object-cover opacity-85"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[11px] font-extrabold flex items-center gap-1 shadow-sm">
                              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                              ACTIVE {war.compressorWarrantyYears}-YR WARRANTY
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 text-amber-400 border border-amber-500/40 font-mono text-xs font-extrabold">
                              {war.serialNumber}
                            </span>
                          </div>

                          <div className="absolute bottom-3 left-3 right-3">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">
                              SKU: {war.modelSku} • {war.category}
                            </span>
                            <h3 className="text-sm sm:text-base font-extrabold text-white line-clamp-1">
                              {war.applianceName}
                            </h3>
                          </div>
                        </div>

                        {/* Warranty Countdown & Technical Telemetry */}
                        <div className="p-4 space-y-3.5">
                          {/* Countdown Progress Bar */}
                          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                {war.countdownLabel}
                              </span>
                              <span className="font-mono text-[11px] font-bold text-amber-800">
                                Exp: {war.expiryDate}
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-amber-200/70 overflow-hidden">
                              <div
                                className="h-full bg-amber-500 rounded-full"
                                style={{
                                  width: `${war.coveragePercentRemaining}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Spec Metadata Rows */}
                          <div className="text-xs space-y-1.5 bg-slate-50 border border-slate-200 rounded-xl p-3">
                            <div className="flex justify-between">
                              <span className="text-slate-500">
                                Serial Number (S/N):
                              </span>
                              <span className="font-mono font-extrabold text-slate-900">
                                {war.serialNumber}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">
                                Commissioning Date:
                              </span>
                              <span className="font-semibold text-slate-900">
                                {war.installedDate}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">
                                Certified Installer:
                              </span>
                              <span className="font-semibold text-slate-800">
                                {war.installingTechnician}
                              </span>
                            </div>
                            <div className="pt-1.5 border-t border-slate-200 flex justify-between items-center">
                              <span className="text-slate-500">
                                Diagnostic Log:
                              </span>
                              <span className="text-[11px] font-bold text-emerald-700">
                                {war.lastServiceStatus}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Warranty Action Buttons */}
                      <div className="p-4 pt-0 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setServiceTargetWarranty(war)}
                          className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform duration-150"
                        >
                          <Wrench className="w-3.5 h-3.5 stroke-[2.2]" />
                          <span>Request Technician Service</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            triggerToast(
                              `Engineering Manual Opened (${war.modelSku})`,
                              `Downloaded PDF wiring & inverter care guide for ${war.serialNumber}.`,
                              "blue"
                            )
                          }
                          className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform duration-150"
                        >
                          <span>Manual</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* =========================================================
                F. TAB 5: SECURITY & PASSWORD
            ========================================================= */}
            {activeTab === "security" && (
              <section
                aria-label="Security and Password Settings"
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6"
              >
                <div className="pb-4 border-b border-slate-200">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Security &amp; Single-Account Password
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Update your master password. Changes apply across your
                    Customer Storefront and assigned Staff Operations Portals.
                  </p>
                </div>

                <form
                  onSubmit={handleUpdatePassword}
                  className="max-w-xl space-y-4"
                >
                  <div>
                    <label
                      htmlFor="sec-current-pass"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                    >
                      Current Password *
                    </label>
                    <input
                      id="sec-current-pass"
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="sec-new-pass"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                      >
                        New Password *
                      </label>
                      <input
                        id="sec-new-pass"
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="sec-confirm-pass"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                      >
                        Confirm New Password *
                      </label>
                      <input
                        id="sec-confirm-pass"
                        type="password"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Repeat new password"
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Active Multi-Role Session Protection
                    </p>
                    <p>
                      Rotating your password will keep your current terminal
                      signed in while revoking older browser tokens on showroom
                      or warehouse handheld scanners.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform duration-150"
                  >
                    <KeyRound className="w-4 h-4 stroke-[2.2]" />
                    <span>Update Password</span>
                  </button>
                </form>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* =========================================================
          MODAL 1: ADD / EDIT HEAVY APPLIANCE DELIVERY ADDRESS
      ========================================================= */}
      {isAddressModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setIsAddressModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-slate-200 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="px-5 py-4 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-extrabold">
                    {editingAddressId
                      ? "Edit Appliance Delivery Address"
                      : "Add Heavy Appliance Delivery Address"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Include floor &amp; elevator details for white-glove
                    dispatch
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="min-w-[40px] min-h-[40px] rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="p-5 space-y-4">
              {/* Address Tag Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Property Type / Label
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Condo", "Home", "Office / Studio"] as AddressLabelType[]).map(
                    (type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setAddrForm({ ...addrForm, label: type })
                        }
                        className={`min-h-[44px] py-2 px-3 rounded-xl text-xs font-bold border active:scale-95 transition-all ${
                          addrForm.label === type
                            ? "bg-amber-500 text-slate-950 border-amber-500"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {type}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addrForm.recipientName}
                    onChange={(e) =>
                      setAddrForm({ ...addrForm, recipientName: e.target.value })
                    }
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={addrForm.recipientPhone}
                    onChange={(e) =>
                      setAddrForm({
                        ...addrForm,
                        recipientPhone: e.target.value,
                      })
                    }
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Building, Unit &amp; Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={addrForm.streetAddress}
                  onChange={(e) =>
                    setAddrForm({ ...addrForm, streetAddress: e.target.value })
                  }
                  placeholder="e.g., Noble Around Ari, Bldg X, Unit 1208"
                  className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District &amp; Province *
                  </label>
                  <input
                    type="text"
                    required
                    value={addrForm.districtAndCity}
                    onChange={(e) =>
                      setAddrForm({
                        ...addrForm,
                        districtAndCity: e.target.value,
                      })
                    }
                    placeholder="Phaya Thai, Bangkok"
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={addrForm.postalCode}
                    onChange={(e) =>
                      setAddrForm({ ...addrForm, postalCode: e.target.value })
                    }
                    placeholder="10400"
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Specialized Appliance Site Attributes */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 block">
                  Heavy Appliance Logistics Parameters
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Floor Number
                    </label>
                    <input
                      type="text"
                      value={addrForm.floorNumber}
                      onChange={(e) =>
                        setAddrForm({
                          ...addrForm,
                          floorNumber: e.target.value,
                        })
                      }
                      placeholder="e.g. 8th Floor"
                      className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Doorframe Width (cm)
                    </label>
                    <input
                      type="number"
                      min={60}
                      max={300}
                      value={addrForm.doorframeWidthCm}
                      onChange={(e) =>
                        setAddrForm({
                          ...addrForm,
                          doorframeWidthCm: Number(e.target.value) || 85,
                        })
                      }
                      className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-white text-sm font-mono text-slate-900"
                    />
                  </div>
                </div>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer">
                  <span className="text-xs font-bold text-slate-900">
                    Freight / Service Elevator Available
                  </span>
                  <input
                    type="checkbox"
                    checked={addrForm.freightElevatorAvailable}
                    onChange={(e) =>
                      setAddrForm({
                        ...addrForm,
                        freightElevatorAvailable: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gate Code / Juristic Lift Hours / Delivery Notes
                  </label>
                  <textarea
                    rows={2}
                    value={addrForm.gateAccessNotes}
                    onChange={(e) =>
                      setAddrForm({
                        ...addrForm,
                        gateAccessNotes: e.target.value,
                      })
                    }
                    placeholder="e.g., Freight elevator requires booking before 16:00..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addrForm.isDefault}
                  onChange={(e) =>
                    setAddrForm({ ...addrForm, isDefault: e.target.checked })
                  }
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <span>Set as default appliance delivery address</span>
              </label>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm active:scale-95 transition-transform"
                >
                  Save Delivery Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: STAFF ROLE SWITCHER GATEWAY OVERLAY
      ========================================================= */}
      {isPortalSwitcherOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setIsPortalSwitcherOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 text-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold uppercase">
                  SINGLE-ACCOUNT MULTI-ROLE GATEWAY
                </span>
                <h3 className="text-lg font-extrabold text-white mt-1">
                  Switch Operational Session Context
                </h3>
                <p className="text-xs text-slate-400">
                  Logged in as {profile.fullName} ({profile.email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPortalSwitcherOpen(false)}
                className="min-w-[40px] min-h-[40px] rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setActivePortalSimulation(
                    "/portal/sales (Sales & Catalog Operations)"
                  );
                  setIsPortalSwitcherOpen(false);
                  triggerToast(
                    "Switched to Sales Operations Portal",
                    "Routing to /portal/sales • Catalog CRUD & Order Verification active.",
                    "blue"
                  );
                }}
                className="w-full p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/60 flex items-center justify-between text-left active:scale-95 transition-all"
              >
                <div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase">
                    SALES OPS PORTAL
                  </span>
                  <p className="text-sm font-bold text-white mt-1">
                    Sales &amp; Catalog Management (/portal/sales)
                  </p>
                  <p className="text-xs text-slate-400">
                    Verify payment slips, adjust pricing &amp; launch promos
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-amber-400 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePortalSimulation(
                    "/portal/warehouse (Warehouse & S/N Logistics)"
                  );
                  setIsPortalSwitcherOpen(false);
                  triggerToast(
                    "Switched to Warehouse Logistics Portal",
                    "Routing to /portal/warehouse • Barcode S/N Scanner active.",
                    "amber"
                  );
                }}
                className="w-full p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/60 flex items-center justify-between text-left active:scale-95 transition-all"
              >
                <div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase">
                    WAREHOUSE OPS
                  </span>
                  <p className="text-sm font-bold text-white mt-1">
                    Warehouse &amp; S/N Scanner (/portal/warehouse)
                  </p>
                  <p className="text-xs text-slate-400">
                    Bind appliance serial numbers, restock intake &amp; fleet
                    manifests
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-amber-400 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePortalSimulation("/ (Customer Direct Storefront)");
                  setIsPortalSwitcherOpen(false);
                  triggerToast(
                    "Returned to Customer Storefront",
                    "Browsing VoltCraft Direct Storefront (/) as verified member.",
                    "emerald"
                  );
                }}
                className="w-full p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/60 flex items-center justify-between text-left active:scale-95 transition-all"
              >
                <div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase">
                    CUSTOMER VIEW
                  </span>
                  <p className="text-sm font-bold text-white mt-1">
                    VoltCraft Direct Storefront (/)
                  </p>
                  <p className="text-xs text-slate-400">
                    Shop inverter appliances with employee/member warranty lock
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-amber-400 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: ORDER DETAILS & DIGITAL TAX INVOICE
      ========================================================= */}
      {selectedOrderModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedOrderModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-lg w-full rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-mono text-xs font-bold">
                  OFFICIAL E-TAX INVOICE &amp; SERIAL RECEIPT
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 font-mono mt-1">
                  {selectedOrderModal.orderRef}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedOrderModal.paymentMethod}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderModal(null)}
                className="min-w-[36px] min-h-[36px] rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <strong className="text-slate-900">
                  {profile.fullName} ({profile.phone})
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dispatch Site:</span>
                <strong className="text-slate-900">
                  {selectedOrderModal.shippingAddressSummary}
                </strong>
              </div>
              {selectedOrderModal.technicianTeam && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Crew:</span>
                  <strong className="text-emerald-700">
                    {selectedOrderModal.technicianTeam}
                  </strong>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {selectedOrderModal.items.map((it, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs p-2.5 rounded-xl border border-slate-200"
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {it.qty}x {it.name}
                    </p>
                    {it.serialNumber && (
                      <p className="font-mono text-[11px] text-emerald-700 font-bold">
                        S/N: {it.serialNumber}
                      </p>
                    )}
                  </div>
                  <span className="font-extrabold text-slate-900">
                    {formatTHB(it.priceTHB * it.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-900">
                Total Amount (VAT 7% Included)
              </span>
              <span className="text-lg font-extrabold text-slate-900">
                {formatTHB(selectedOrderModal.totalAmountTHB)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerToast(
                  `Tax Invoice Downloaded (${selectedOrderModal.orderRef})`,
                  "Saved certified PDF receipt with bound Serial Numbers.",
                  "emerald"
                );
                setSelectedOrderModal(null);
              }}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm active:scale-95 transition-transform"
            >
              Download Certified Tax Invoice (PDF)
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 4: REQUEST ON-SITE TECHNICIAN SERVICE (WARRANTY CLAIM)
      ========================================================= */}
      {serviceTargetWarranty && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setServiceTargetWarranty(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-md w-full rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold">
                  ZERO-COST DIRECT WARRANTY SERVICE
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  Book On-Site VoltCraft Technician
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  S/N: {serviceTargetWarranty.serialNumber} •{" "}
                  {serviceTargetWarranty.modelSku}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setServiceTargetWarranty(null)}
                className="min-w-[36px] min-h-[36px] rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmitTechnicianService}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Technician Visit Date
                </label>
                <input
                  type="date"
                  required
                  value={servicePreferredDate}
                  onChange={(e) => setServicePreferredDate(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Symptom / Maintenance Request Note
                </label>
                <textarea
                  rows={3}
                  required
                  value={serviceIssueNote}
                  onChange={(e) => setServiceIssueNote(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm active:scale-95 transition-transform"
              >
                Confirm On-Site Service Dispatch
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 5: REGISTER NEW APPLIANCE SERIAL NUMBER
      ========================================================= */}
      {isBindSerialModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsBindSerialModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-md w-full rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Bind Showroom Appliance Serial Number
                </h3>
                <p className="text-xs text-slate-500">
                  Link a showroom purchase directly to your digital warranty
                  vault
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBindSerialModalOpen(false)}
                className="min-w-[36px] min-h-[36px] rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBindNewSerial} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Appliance Model
                </label>
                <select
                  value={newSerialModel}
                  onChange={(e) => setNewSerialModel(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900"
                >
                  <option value="VC-IC-32D — VoltCraft DualZone Induction Cooktop 3200W">
                    VC-IC-32D — VoltCraft DualZone Induction Cooktop 3200W
                  </option>
                  <option value="VC-AF-72L — VoltCraft VortexFryer Touch XXL 7.2L">
                    VC-AF-72L — VoltCraft VortexFryer Touch XXL 7.2L
                  </option>
                  <option value="VC-AP-520 — VoltCraft PureBreathe Pro H13 HEPA Air Purifier">
                    VC-AP-520 — VoltCraft PureBreathe Pro H13 HEPA Air Purifier
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Unique Serial Number (S/N Barcode on Chassis) *
                </label>
                <input
                  type="text"
                  required
                  value={newSerialCode}
                  onChange={(e) =>
                    setNewSerialCode(e.target.value.toUpperCase())
                  }
                  placeholder="SN-IC-558291"
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono font-bold text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm active:scale-95 transition-transform"
              >
                Activate 5-Year Digital Warranty
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          4. SELF-CONTAINED TOAST NOTIFICATION OVERLAY
      ========================================================= */}
      {toast && (
        <div className="fixed bottom-5 inset-x-4 sm:inset-x-auto sm:right-6 z-50 max-w-md mx-auto sm:mx-0">
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
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-white">{toast.title}</p>
              {toast.detail && (
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  {toast.detail}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}