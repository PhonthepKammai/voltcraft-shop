"use client";

import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Users,
  Shield,
  Package,
  ShoppingBag,
  History,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Key,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  BarChart3,
  Lock,
  LogOut,
  ArrowUpDown,
  Bell,
  Zap,
  SlidersHorizontal,
  RefreshCw,
  Menu,
  X,
} from "lucide-react";

// ==========================================
// 1. DEDICATED THEME & DESIGN SYSTEM TOKENS
// ==========================================
export const THEME = {
  brandName: "VoltCraft",
  subtitle: "ADMIN PORTAL",
  tagline: "Smart Living, Crafted Power",
  colors: {
    pageBg: "bg-slate-50",
    surface: "bg-white border border-slate-200 rounded-xl shadow-sm",
    sidebarBg: "bg-slate-900",
    primaryBtn:
      "bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-colors",
    heading: "text-slate-900",
    muted: "text-slate-500",
    roleBadges: {
      Admin: "bg-purple-50 text-purple-700 border-purple-200",
      Sales: "bg-blue-50 text-blue-700 border-blue-200",
      Warehouse: "bg-amber-50 text-amber-700 border-amber-200",
      Customer: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    hardwareStatus: {
      normal: "bg-emerald-50 text-emerald-700 border-emerald-200",
      warning: "bg-amber-50 text-amber-700 border-amber-200",
      critical: "bg-rose-50 text-rose-700 border-rose-200",
      energyStar: "bg-amber-50 text-amber-800 border-amber-300 font-semibold",
    },
  },
} as const;

// ==========================================
// 2. TYPESCRIPT INTERFACES
// ==========================================
export type RoleType = "Admin" | "Sales" | "Warehouse" | "Customer";
export type DepartmentType = "Admin" | "Sales" | "Warehouse" | "Customer";
export type AccountStatus = "Active" | "Suspended";
export type NavTab = "overview" | "users" | "catalog" | "audit";

export type AuditEventType =
  | "PRICE_OVERRIDE"
  | "PROMOTION_APPLIED"
  | "RESTOCK_INTAKE"
  | "ROLE_MODIFIED"
  | "ORDER_DISPATCHED";

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  accountType: "Corporate" | "Personal";
  department: DepartmentType;
  roles: RoleType[];
  status: AccountStatus;
  lastSession: string;
  createdAt: string;
}

export interface ApplianceItem {
  id: string;
  sku: string;
  name: string;
  category:
    | "Climate Control"
    | "Refrigeration"
    | "Laundry Systems"
    | "Smart Home & Robotics"
    | "Air Purification"
    | "Kitchen Power";
  wattageOrInverter: string;
  energyStarRating: string;
  priceTHB: number;
  stockUnits: number;
  lowStockThreshold: number;
  published: boolean;
  thumbnailBg: string;
  serialPrefix: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  operatorName: string;
  operatorRole: RoleType;
  eventType: AuditEventType;
  summary: string;
  terminalIp: string;
}

// ==========================================
// 3. REALISTIC MOCK DATASETS
// ==========================================
const INITIAL_USERS: UserAccount[] = [
  {
    id: "USR-1001",
    fullName: "Phonthep Kammai",
    email: "phonthep.k@voltcraft.co.th",
    accountType: "Corporate",
    department: "Admin",
    roles: ["Admin", "Sales", "Warehouse", "Customer"],
    status: "Active",
    lastSession: "2026-11-11 19:58 (Online)",
    createdAt: "2025-01-10",
  },
  {
    id: "USR-1002",
    fullName: "Nattapong Srisuwan",
    email: "nattapong.s@voltcraft.co.th",
    accountType: "Corporate",
    department: "Sales",
    roles: ["Sales", "Customer"],
    status: "Active",
    lastSession: "2026-11-11 18:42",
    createdAt: "2025-03-14",
  },
  {
    id: "USR-1003",
    fullName: "Kornkanok Charoen",
    email: "kornkanok.c@voltcraft.co.th",
    accountType: "Corporate",
    department: "Sales",
    roles: ["Sales"],
    status: "Active",
    lastSession: "2026-11-11 17:15",
    createdAt: "2025-06-22",
  },
  {
    id: "USR-1004",
    fullName: "Surasak Boonmee",
    email: "surasak.b@voltcraft.co.th",
    accountType: "Corporate",
    department: "Warehouse",
    roles: ["Warehouse", "Customer"],
    status: "Active",
    lastSession: "2026-11-11 19:30",
    createdAt: "2025-02-19",
  },
  {
    id: "USR-1005",
    fullName: "Chaiwat Rattanaporn",
    email: "chaiwat.r@voltcraft.co.th",
    accountType: "Corporate",
    department: "Warehouse",
    roles: ["Warehouse"],
    status: "Suspended",
    lastSession: "2026-10-28 11:04",
    createdAt: "2025-07-01",
  },
  {
    id: "USR-1006",
    fullName: "Pimchanok Wattana",
    email: "pimchanok.w@gmail.com",
    accountType: "Personal",
    department: "Customer",
    roles: ["Customer"],
    status: "Active",
    lastSession: "2026-11-11 16:20",
    createdAt: "2026-01-15",
  },
  {
    id: "USR-1007",
    fullName: "thanawat.dev@outlook.com",
    email: "thanawat.dev@outlook.com",
    accountType: "Personal",
    department: "Customer",
    roles: ["Customer"],
    status: "Active",
    lastSession: "2026-11-10 21:05",
    createdAt: "2026-04-08",
  },
];

const INITIAL_APPLIANCES: ApplianceItem[] = [
  {
    id: "APP-01",
    sku: "VC-AC-12K-INV",
    name: "VoltCraft Inverter Dual-Cool AC 12,000 BTU (Eco Inverter, เบอร์ 5 ★★★)",
    category: "Climate Control",
    wattageOrInverter: "Eco Dual-Inverter 980W",
    energyStarRating: "เบอร์ 5 ★★★ (SEER 22.8)",
    priceTHB: 16900,
    stockUnits: 42,
    lowStockThreshold: 15,
    published: true,
    thumbnailBg: "from-sky-500 to-blue-700",
    serialPrefix: "SN-AC12K",
  },
  {
    id: "APP-02",
    sku: "VC-REF-194-LIN",
    name: "Multi-Door Linear Inverter Refrigerator 19.4 cu.ft.",
    category: "Refrigeration",
    wattageOrInverter: "Linear Inverter 185W",
    energyStarRating: "เบอร์ 5 ★★★",
    priceTHB: 34900,
    stockUnits: 8,
    lowStockThreshold: 10,
    published: true,
    thumbnailBg: "from-slate-600 to-slate-900",
    serialPrefix: "SN-RF194",
  },
  {
    id: "APP-03",
    sku: "VC-WD-128-USN",
    name: "UltraSonic Front-Load Washer/Dryer 12/8 kg",
    category: "Laundry Systems",
    wattageOrInverter: "Direct-Drive 1900W",
    energyStarRating: "เบอร์ 5 ★★",
    priceTHB: 25900,
    stockUnits: 19,
    lowStockThreshold: 8,
    published: true,
    thumbnailBg: "from-indigo-500 to-slate-800",
    serialPrefix: "SN-WD128",
  },
  {
    id: "APP-04",
    sku: "VC-ROB-LIDAR-X",
    name: "Smart LiDAR Robot Vacuum & Mop with Auto-Empty Station",
    category: "Smart Home & Robotics",
    wattageOrInverter: "Brushless 6000Pa / 65W",
    energyStarRating: "เบอร์ 5 ★",
    priceTHB: 14500,
    stockUnits: 5,
    lowStockThreshold: 12,
    published: true,
    thumbnailBg: "from-amber-500 to-orange-700",
    serialPrefix: "SN-RB600",
  },
  {
    id: "APP-05",
    sku: "VC-AIR-H13-LAS",
    name: "HEPA H13 Smart Air Purifier with PM2.5 Dual Laser Sensor",
    category: "Air Purification",
    wattageOrInverter: "DC Brushless 48W",
    energyStarRating: "เบอร์ 5 ★★★",
    priceTHB: 7990,
    stockUnits: 64,
    lowStockThreshold: 20,
    published: true,
    thumbnailBg: "from-emerald-500 to-teal-700",
    serialPrefix: "SN-AP013",
  },
  {
    id: "APP-06",
    sku: "VC-IND-2600-TB",
    name: "Precision Induction Cooktop 2600W with Turbo Boost",
    category: "Kitchen Power",
    wattageOrInverter: "IGBT Half-Bridge 2600W",
    energyStarRating: "เบอร์ 5 ★★",
    priceTHB: 4590,
    stockUnits: 0,
    lowStockThreshold: 10,
    published: false,
    thumbnailBg: "from-rose-500 to-red-800",
    serialPrefix: "SN-IC260",
  },
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "LOG-9081",
    timestamp: "2026-11-11 19:15",
    operatorName: "Nattapong Srisuwan",
    operatorRole: "Sales",
    eventType: "PRICE_OVERRIDE",
    summary:
      "Adjusted VoltCraft Inverter Dual-Cool AC 12,000 BTU price: ฿18,900 -> ฿16,900 [11.11 Mega Campaign]",
    terminalIp: "10.24.18.104 (SALES-TERM-02)",
  },
  {
    id: "LOG-9080",
    timestamp: "2026-11-11 18:20",
    operatorName: "Surasak Boonmee",
    operatorRole: "Warehouse",
    eventType: "RESTOCK_INTAKE",
    summary:
      "Scanned 24 S/N units into Bay B-04 for HEPA H13 Smart Air Purifier (Batch #VC2611-B)",
    terminalIp: "10.24.90.12 (WH-SCANNER-07)",
  },
  {
    id: "LOG-9079",
    timestamp: "2026-11-11 16:45",
    operatorName: "Phonthep Kammai",
    operatorRole: "Admin",
    eventType: "ROLE_MODIFIED",
    summary:
      "Granted dual [Sales, Customer] multi-role token to Nattapong Srisuwan (Prevented duplicate email registration)",
    terminalIp: "10.24.01.01 (ADMIN-CORE-01)",
  },
  {
    id: "LOG-9078",
    timestamp: "2026-11-11 15:12",
    operatorName: "Surasak Boonmee",
    operatorRole: "Warehouse",
    eventType: "ORDER_DISPATCHED",
    summary:
      "Verified S/N barcode SN-RF194-00892 & generated Kerry Express dispatch slip for Order #ORD-88412",
    terminalIp: "10.24.90.12 (WH-SCANNER-07)",
  },
  {
    id: "LOG-9077",
    timestamp: "2026-11-11 13:30",
    operatorName: "Kornkanok Charoen",
    operatorRole: "Sales",
    eventType: "PROMOTION_APPLIED",
    summary:
      "Activated 0% 10-Month Installment Tag & Free Copper Piping Promo on Climate Control category",
    terminalIp: "10.24.18.109 (SALES-TERM-05)",
  },
  {
    id: "LOG-9076",
    timestamp: "2026-11-11 10:05",
    operatorName: "Phonthep Kammai",
    operatorRole: "Admin",
    eventType: "ROLE_MODIFIED",
    summary:
      "Suspended warehouse operator account Chaiwat Rattanaporn (USR-1005) pending quarterly security review",
    terminalIp: "10.24.01.01 (ADMIN-CORE-01)",
  },
];

// ==========================================
// 4. HELPER UTILITIES
// ==========================================
function formatTHB(amount: number): string {
  return `฿${amount.toLocaleString("en-US")}`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// ==========================================
// 5. MAIN MOBILE-FIRST COMPONENT
// ==========================================
export default function VoltCraftSuperAdminHub() {
  // Navigation & Mobile Drawer State
  const [activeTab, setActiveTab] = useState<NavTab>("users");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Core Data States
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [appliances, setAppliances] =
    useState<ApplianceItem[]>(INITIAL_APPLIANCES);
  const [auditLogs, setAuditLogs] =
    useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // User & RBAC Filter States
  const [userSearch, setUserSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<"All" | DepartmentType>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | AccountStatus>("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Catalog Filter States
  const [catalogSearch, setCatalogSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [editingThresholdId, setEditingThresholdId] = useState<string | null>(
    null
  );
  const [tempThresholdValue, setTempThresholdValue] = useState<number>(10);

  // Audit Filter State
  const [auditEventFilter, setAuditEventFilter] = useState<
    "ALL" | AuditEventType
  >("ALL");

  // Modals State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUserRoles, setEditingUserRoles] = useState<UserAccount | null>(
    null
  );

  // New Staff Account Form State
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("VoltCraft#2026!");
  const [newDepartment, setNewDepartment] = useState<DepartmentType>("Sales");
  const [newRoles, setNewRoles] = useState<RoleType[]>(["Sales", "Customer"]);
  const [formError, setFormError] = useState("");

  // Edit Roles Modal Temp State
  const [tempEditedRoles, setTempEditedRoles] = useState<RoleType[]>([]);
  const [tempEditedDept, setTempEditedDept] =
    useState<DepartmentType>("Sales");

  // Toast Notification State
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "warning" | "info";
  } | null>(null);

  const triggerToast = (
    message: string,
    type: "success" | "warning" | "info" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3600);
  };

  const appendAuditLog = (
    eventType: AuditEventType,
    summary: string,
    operatorName = "Phonthep Kammai",
    operatorRole: RoleType = "Admin"
  ) => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const newEntry: AuditLogEntry = {
      id: `LOG-${9082 + auditLogs.length}`,
      timestamp,
      operatorName,
      operatorRole,
      eventType,
      summary,
      terminalIp: "10.24.01.01 (ADMIN-CORE-01)",
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    setIsNotificationOpen(false);
  };

  // ==========================================
  // EXECUTIVE KPI CALCULATIONS
  // ==========================================
  const kpiStats = useMemo(() => {
    const staffCount = users.filter((u) =>
      u.roles.some((r) => r === "Admin" || r === "Sales" || r === "Warehouse")
    ).length;
    const customerCount = users.filter((u) =>
      u.roles.includes("Customer")
    ).length;

    const grossAssetValue = appliances.reduce(
      (sum, item) => sum + item.priceTHB * item.stockUnits,
      0
    );

    const lowStockItems = appliances.filter(
      (item) => item.stockUnits <= item.lowStockThreshold
    );

    return {
      totalUsers: users.length,
      staffCount,
      customerCount,
      grossAssetValue,
      pendingDispatchCount: 18,
      pendingSalesVerify: 7,
      pendingWarehousePack: 11,
      lowStockCount: lowStockItems.length,
    };
  }, [users, appliances]);

  // ==========================================
  // FILTERED DATASETS
  // ==========================================
  const filteredUsers = useMemo(() => {
    const query = (userSearch || globalSearch).trim().toLowerCase();
    return users
      .filter((u) => {
        if (deptFilter !== "All" && u.department !== deptFilter) return false;
        if (statusFilter !== "All" && u.status !== statusFilter) return false;
        if (query) {
          const matchName = u.fullName.toLowerCase().includes(query);
          const matchEmail = u.email.toLowerCase().includes(query);
          const matchId = u.id.toLowerCase().includes(query);
          const matchRole = u.roles.some((r) =>
            r.toLowerCase().includes(query)
          );
          return matchName || matchEmail || matchId || matchRole;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return a.fullName.localeCompare(b.fullName);
        }
        return b.fullName.localeCompare(a.fullName);
      });
  }, [users, userSearch, globalSearch, deptFilter, statusFilter, sortOrder]);

  const filteredAppliances = useMemo(() => {
    const query = (catalogSearch || globalSearch).trim().toLowerCase();
    return appliances.filter((item) => {
      if (categoryFilter !== "All" && item.category !== categoryFilter) {
        return false;
      }
      if (query) {
        return (
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.wattageOrInverter.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [appliances, catalogSearch, globalSearch, categoryFilter]);

  const filteredAuditLogs = useMemo(() => {
    const query = globalSearch.trim().toLowerCase();
    return auditLogs.filter((entry) => {
      if (auditEventFilter !== "ALL" && entry.eventType !== auditEventFilter) {
        return false;
      }
      if (query) {
        return (
          entry.summary.toLowerCase().includes(query) ||
          entry.operatorName.toLowerCase().includes(query) ||
          entry.eventType.toLowerCase().includes(query) ||
          entry.id.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [auditLogs, auditEventFilter, globalSearch]);

  // ==========================================
  // INTERACTIVE HANDLERS
  // ==========================================
  const handleToggleUserStatus = (user: UserAccount) => {
    const nextStatus: AccountStatus =
      user.status === "Active" ? "Suspended" : "Active";
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    appendAuditLog(
      "ROLE_MODIFIED",
      `Changed account operational status for ${user.fullName} (${user.email}) to [${nextStatus}]`
    );
    triggerToast(
      `Account ${user.fullName} marked as ${nextStatus}`,
      nextStatus === "Active" ? "success" : "warning"
    );
  };

  const handleDispatchPasswordReset = (user: UserAccount) => {
    appendAuditLog(
      "ROLE_MODIFIED",
      `Dispatched encrypted 2FA password reset token to ${user.email}`
    );
    triggerToast(`Password reset token dispatched to ${user.email}`, "info");
  };

  const handleDeleteUser = (user: UserAccount) => {
    if (user.id === "USR-1001") {
      triggerToast("Cannot delete primary Super Admin root account", "warning");
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    appendAuditLog(
      "ROLE_MODIFIED",
      `Revoked and purged account ${user.fullName} (${user.email}) from RBAC registry`
    );
    triggerToast(`User account ${user.fullName} removed from registry`, "warning");
  };

  const openEditRolesModal = (user: UserAccount) => {
    setEditingUserRoles(user);
    setTempEditedRoles([...user.roles]);
    setTempEditedDept(user.department);
  };

  const handleToggleTempRole = (role: RoleType) => {
    setTempEditedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSaveEditedRoles = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserRoles) return;
    if (tempEditedRoles.length === 0) {
      triggerToast("A user must have at least one assigned role", "warning");
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUserRoles.id
          ? {
              ...u,
              roles: tempEditedRoles,
              department: tempEditedDept,
              accountType: tempEditedRoles.some((r) => r !== "Customer")
                ? "Corporate"
                : "Personal",
            }
          : u
      )
    );

    appendAuditLog(
      "ROLE_MODIFIED",
      `Updated RBAC roles for ${editingUserRoles.fullName}: [${tempEditedRoles.join(
        ", "
      )}] | Dept: ${tempEditedDept}`
    );
    triggerToast(`Staff role permissions updated for ${editingUserRoles.fullName}`);
    setEditingUserRoles(null);
  };

  const handleToggleNewUserRole = (role: RoleType) => {
    setNewRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleCreateStaffAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const trimmedName = newFullName.trim();
    const trimmedEmail = newEmail.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      setFormError("Please enter both Full Name and Corporate Email.");
      return;
    }

    if (newRoles.length === 0) {
      setFormError("Select at least one RBAC role for this account.");
      return;
    }

    const emailExists = users.some(
      (u) => u.email.toLowerCase() === trimmedEmail
    );
    if (emailExists) {
      setFormError(
        "Email duplication prevented: This email already exists. Assign additional roles to the existing account instead."
      );
      return;
    }

    const newUser: UserAccount = {
      id: `USR-${1001 + users.length}`,
      fullName: trimmedName,
      email: trimmedEmail,
      accountType: newRoles.some((r) => r !== "Customer")
        ? "Corporate"
        : "Personal",
      department: newDepartment,
      roles: newRoles,
      status: "Active",
      lastSession: "Never (Provisioned Today)",
      createdAt: "2026-11-11",
    };

    setUsers((prev) => [newUser, ...prev]);
    appendAuditLog(
      "ROLE_MODIFIED",
      `Provisioned new account ${newUser.fullName} (${
        newUser.email
      }) with roles [${newUser.roles.join(", ")}]`
    );
    triggerToast(`New staff account ${newUser.fullName} provisioned`);

    setNewFullName("");
    setNewEmail("");
    setNewPassword("VoltCraft#2026!");
    setNewDepartment("Sales");
    setNewRoles(["Sales", "Customer"]);
    setIsAddUserModalOpen(false);
  };

  // Catalog Oversight Handlers
  const handleTogglePublishAppliance = (item: ApplianceItem) => {
    const nextState = !item.published;
    setAppliances((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, published: nextState } : a))
    );
    appendAuditLog(
      "PRICE_OVERRIDE",
      `Super Admin toggled storefront visibility for SKU ${item.sku} to [${
        nextState ? "PUBLISHED" : "HIDDEN"
      }]`
    );
    triggerToast(
      `New appliance SKU synchronized: ${item.sku} is now ${
        nextState ? "Published" : "Hidden"
      }`
    );
  };

  const handleSaveSafetyThreshold = (item: ApplianceItem) => {
    const safeVal = Math.max(1, tempThresholdValue);
    setAppliances((prev) =>
      prev.map((a) =>
        a.id === item.id ? { ...a, lowStockThreshold: safeVal } : a
      )
    );
    setEditingThresholdId(null);
    appendAuditLog(
      "RESTOCK_INTAKE",
      `Overrode safety low-stock alert threshold for ${item.sku} (${item.name}) to ${safeVal} units`
    );
    triggerToast(
      `Safety stock threshold updated to ${safeVal} units for ${item.sku}`
    );
  };

  const handleQuickEmergencyRestock = (item: ApplianceItem) => {
    const added = 15;
    setAppliances((prev) =>
      prev.map((a) =>
        a.id === item.id ? { ...a, stockUnits: a.stockUnits + added } : a
      )
    );
    appendAuditLog(
      "RESTOCK_INTAKE",
      `Super Admin authorized emergency restock intake (+${added} units) for ${item.sku}`
    );
    triggerToast(`Synchronized +${added} warehouse units for ${item.sku}`);
  };

  // Page Titles & Breadcrumbs
  const pageMeta = useMemo(() => {
    switch (activeTab) {
      case "overview":
        return {
          short: "Overview & KPIs",
          breadcrumb: "VoltCraft Hub / Governance / Overview & Operational KPIs",
        };
      case "users":
        return {
          short: "Users & RBAC",
          breadcrumb: "VoltCraft Hub / Governance / User & RBAC Access Control",
        };
      case "catalog":
        return {
          short: "Master Catalog",
          breadcrumb:
            "VoltCraft Hub / Governance / Master Catalog & Inventory Oversight",
        };
      case "audit":
        return {
          short: "Audit Logs",
          breadcrumb: "VoltCraft Hub / Governance / System Security Audit Logs",
        };
    }
  }, [activeTab]);

  // Shared Sidebar Content (Used in both Mobile Drawer and Desktop Fixed Sidebar)
  const renderSidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div className="overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 lg:p-6 border-b border-slate-800/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0">
              <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base lg:text-lg font-extrabold tracking-tight text-white">
                  VOLT<span className="text-amber-500">CRAFT</span>
                </span>
                <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  CORE
                </span>
              </div>
              <p className="text-[10px] lg:text-[11px] font-mono tracking-widest text-slate-400 uppercase mt-0.5">
                {THEME.subtitle}
              </p>
            </div>
          </div>

          {/* Mobile Close Drawer Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu"
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Role Architecture Status Pill */}
        <div className="px-5 py-3 border-b border-slate-900 bg-slate-900/50">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>4-ROLE ECOSYSTEM SYNC</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Central Governance
          </div>

          <button
            onClick={() => handleSelectTab("overview")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15 font-bold"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Overview & Operational KPIs</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
          </button>

          <button
            onClick={() => handleSelectTab("users")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "users"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15 font-bold"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <Users className="w-4 h-4 shrink-0" />
              <span>User & RBAC Management</span>
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === "users"
                  ? "bg-slate-950 text-amber-400 font-bold"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {users.length}
            </span>
          </button>

          <button
            onClick={() => handleSelectTab("catalog")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "catalog"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15 font-bold"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <Package className="w-4 h-4 shrink-0" />
              <span>Master Catalog & Inventory</span>
            </span>
            {kpiStats.lowStockCount > 0 && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeTab === "catalog"
                    ? "bg-slate-950 text-amber-400 font-bold"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {kpiStats.lowStockCount} Alert
              </span>
            )}
          </button>

          <button
            onClick={() => handleSelectTab("audit")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "audit"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15 font-bold"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <History className="w-4 h-4 shrink-0" />
              <span>System Security Audit Logs</span>
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === "audit"
                  ? "bg-slate-950 text-amber-400 font-bold"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {auditLogs.length}
            </span>
          </button>

          {/* Role Architecture Reference Box */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 px-1 space-y-2.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold px-1">
              Active Role Ecosystem
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-semibold">● Super Admin</span>
                <span className="text-slate-400 font-mono">RBAC & Audit</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-semibold">● Sales Staff</span>
                <span className="text-slate-400 font-mono">CRUD & Promo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-semibold">● Warehouse Ops</span>
                <span className="text-slate-400 font-mono">S/N & Dispatch</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-semibold">● Customer</span>
                <span className="text-slate-400 font-mono">Store & Warranty</span>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Footer Super Admin Profile Widget */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-extrabold flex items-center justify-center text-sm">
                PK
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 absolute -bottom-0.5 -right-0.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                Phonthep Kammai
              </p>
              <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 mt-0.5">
                Full Governance
              </span>
            </div>
          </div>
          <button
            onClick={() =>
              triggerToast(
                "Session locked. Re-authentication required for production sign-out.",
                "info"
              )
            }
            title="Sign Out"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row ${THEME.colors.pageBg} text-slate-900`}
    >
      {/* ==========================================
          FLOATING TOAST NOTIFICATION (MOBILE-SAFE)
      ========================================== */}
      {toast && (
        <div className="fixed bottom-20 inset-x-4 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 flex items-center justify-between sm:justify-start gap-3 px-4 py-3.5 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-2xl">
          <div className="flex items-center gap-3 min-w-0">
            {toast.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            {toast.type === "warning" && (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            {toast.type === "info" && (
              <Key className="w-5 h-5 text-sky-400 shrink-0" />
            )}
            <div className="text-xs font-medium tracking-wide leading-snug">
              {toast.message}
            </div>
          </div>
          <button
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
            className="text-slate-400 hover:text-white shrink-0 ml-2 cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ==========================================
          MOBILE SLIDE-OVER DRAWER (< lg)
      ========================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
          />
          <aside className="relative w-[82vw] max-w-xs bg-slate-950 text-slate-100 h-full border-r border-slate-800 shadow-2xl z-10">
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* ==========================================
          DESKTOP PERSISTENT SIDEBAR (>= lg)
      ========================================== */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:sticky lg:top-0 lg:h-screen bg-slate-950 text-slate-100 shrink-0 border-r border-slate-800 select-none">
        {renderSidebarContent()}
      </aside>

      {/* ==========================================
          MAIN WORKSPACE AREA
      ========================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* MOBILE-FIRST GLOBAL ACTION TOP BAR */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 lg:px-6 lg:py-3.5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Row 1 on Mobile: Menu + Title | Bell + New Staff CTA */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Open menu"
                  className="lg:hidden p-2 -ml-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 active:bg-slate-100 cursor-pointer"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Mobile Brand + Active Tab Label */}
                <div className="flex flex-col lg:hidden min-w-0">
                  <span className="text-xs font-extrabold tracking-tight text-slate-900 leading-none">
                    VOLT<span className="text-amber-600">CRAFT</span>{" "}
                    <span className="text-slate-400 font-mono font-normal">
                      / {pageMeta.short}
                    </span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-mono font-semibold mt-0.5">
                    ● 4-ROLE SYNC ONLINE
                  </span>
                </div>

                {/* Desktop Breadcrumb */}
                <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate">{pageMeta.breadcrumb}</span>
                </div>
              </div>

              {/* Mobile Quick Actions (Bell + Compact Add Staff) */}
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  onClick={() => setIsNotificationOpen((prev) => !prev)}
                  aria-label="Toggle alerts"
                  className="relative p-2.5 rounded-xl border border-slate-200 bg-white active:bg-slate-50 text-slate-700 cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
                </button>

                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="px-3 py-2.5 rounded-xl bg-amber-500 active:bg-amber-600 text-slate-950 font-bold text-xs inline-flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Staff</span>
                </button>
              </div>
            </div>

            {/* Row 2 on Mobile (Inline Right on Desktop): Global Search + Desktop Actions */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* Instant Global Search */}
              <div className="relative flex-1 lg:flex-none lg:w-72 xl:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Global filter SKU, user, IP, log..."
                  className="w-full pl-9 pr-3 sm:pr-16 py-2.5 lg:py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 transition-all"
                />
                <span className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  Ctrl + K
                </span>
              </div>

              {/* Desktop Notification Bell */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setIsNotificationOpen((prev) => !prev)}
                  aria-label="Toggle alerts"
                  className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
                </button>
              </div>

              {/* Desktop Contextual CTA */}
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="hidden lg:inline-flex px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>New Staff Account</span>
              </button>
            </div>
          </div>

          {/* Responsive Notification Dropdown (Full-width inset on mobile, anchored right on desktop) */}
          {isNotificationOpen && (
            <div className="fixed inset-x-4 top-16 sm:inset-x-auto sm:right-6 lg:top-16 sm:w-80 bg-white rounded-xl border border-slate-200 shadow-2xl p-4 z-40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">
                  System Telemetry Alerts
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                    {kpiStats.lowStockCount + 1} Unread
                  </span>
                  <button
                    onClick={() => setIsNotificationOpen(false)}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                  <p className="font-bold">Depleted Stock Alert: VC-IND-2600-TB</p>
                  <p className="text-[11px] mt-0.5">
                    Precision Induction Cooktop 2600W has 0 warehouse units remaining.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                  <p className="font-bold">Low Stock Warning: 2 Appliances</p>
                  <p className="text-[11px] mt-0.5">
                    Multi-Door Refrigerator (8 units) & LiDAR Robot Vacuum (5 units) below safety threshold.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
                  <p className="font-bold">New Sales Terminal Session</p>
                  <p className="text-[11px] mt-0.5">
                    Nattapong Srisuwan logged in from SALES-TERM-02.
                  </p>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* WORKSPACE BODY (Extra bottom padding on mobile for Bottom Tab Bar) */}
        <main className="p-4 pb-24 sm:p-6 sm:pb-24 lg:pb-8 space-y-5 lg:space-y-6 max-w-[1600px] w-full mx-auto">
          {/* C. EXECUTIVE METRIC GRID (MOBILE-FIRST STACK -> 2 COL -> 4 COL) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Total Managed Users */}
            <div className={`${THEME.colors.surface} p-4 sm:p-5`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Total Managed Users
                </span>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2.5 sm:mt-3 flex flex-wrap items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {kpiStats.totalUsers}
                </span>
                <span className="text-[11px] sm:text-xs text-emerald-600 font-semibold">
                  Zero Duplicate Emails
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
                <span>
                  Staff:{" "}
                  <strong className="text-slate-800">
                    {kpiStats.staffCount}
                  </strong>
                </span>
                <span>
                  Customers:{" "}
                  <strong className="text-slate-800">
                    {kpiStats.customerCount}
                  </strong>
                </span>
              </div>
            </div>

            {/* Card 2: Gross Catalog Asset Value */}
            <div className={`${THEME.colors.surface} p-4 sm:p-5`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Gross Catalog Value
                </span>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2.5 sm:mt-3 flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
                  {formatTHB(kpiStats.grossAssetValue)}
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
                <span>
                  SKUs:{" "}
                  <strong className="text-slate-800">{appliances.length}</strong>
                </span>
                <span className="text-amber-700 font-semibold">
                  {kpiStats.lowStockCount} Low-Stock Alerts
                </span>
              </div>
            </div>

            {/* Card 3: Pending Dispatch & Orders */}
            <div className={`${THEME.colors.surface} p-4 sm:p-5`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Pending Dispatch
                </span>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2.5 sm:mt-3 flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {kpiStats.pendingDispatchCount}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500">
                  Active Queue Items
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
                <span>
                  Sales Verify:{" "}
                  <strong className="text-blue-700">
                    {kpiStats.pendingSalesVerify}
                  </strong>
                </span>
                <span>
                  S/N Pack:{" "}
                  <strong className="text-amber-700">
                    {kpiStats.pendingWarehousePack}
                  </strong>
                </span>
              </div>
            </div>

            {/* Card 4: System Security Health */}
            <div className={`${THEME.colors.surface} p-4 sm:p-5`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Security Health
                </span>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-700">
                  100% Secure
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ISO-27001
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
                <span>
                  Exceptions: <strong className="text-emerald-700">0</strong>
                </span>
                <span>
                  Audit Logs:{" "}
                  <strong className="text-slate-800">{auditLogs.length}</strong>
                </span>
              </div>
            </div>
          </section>

          {/* ==========================================
              TAB 1: OVERVIEW & OPERATIONAL KPIS
          ========================================== */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
              {/* 4-Role Architecture Governance Matrix */}
              <div
                className={`${THEME.colors.surface} p-4 sm:p-6 xl:col-span-2 space-y-4`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                      VoltCraft 4-Role Operational Governance Matrix
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Real-time permission segregation across Storefront, Sales, Warehouse, and Super Admin.
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectTab("users")}
                    className="self-start sm:self-auto text-xs font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>Manage RBAC</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        Super Admin (Governance)
                      </span>
                      <Lock className="w-4 h-4 text-purple-600 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Central RBAC provisioning, multi-role assignment without email duplication, safety stock threshold overrides, and immutable audit compliance logs.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Sales Staff (Commercial)
                      </span>
                      <ShoppingBag className="w-4 h-4 text-blue-600 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Appliance catalog CRUD, technical BTU/Wattage spec sheets, promotional campaign pricing, and customer payment slip verification.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Warehouse & Logistics
                      </span>
                      <Package className="w-4 h-4 text-amber-600 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Physical inventory intake, serial number (S/N) barcode scanning for warranty registration, and carrier dispatch slip generation.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Customer Account
                      </span>
                      <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Storefront appliance comparison, Energy Star (เบอร์ 5) efficiency calculator, order tracking, and digital S/N warranty claims.
                    </p>
                  </div>
                </div>
              </div>

              {/* Critical Inventory Watchlist */}
              <div className={`${THEME.colors.surface} p-4 sm:p-6 space-y-4`}>
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Low-Stock Safety Watchlist
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Units at or below Super Admin threshold
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectTab("catalog")}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700 cursor-pointer shrink-0"
                  >
                    Full Catalog
                  </button>
                </div>

                <div className="space-y-3">
                  {appliances
                    .filter((a) => a.stockUnits <= a.lowStockThreshold)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono font-bold text-slate-500 block">
                            {item.sku}
                          </span>
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {item.name}
                          </p>
                          <span
                            className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded border ${
                              item.stockUnits === 0
                                ? THEME.colors.hardwareStatus.critical
                                : THEME.colors.hardwareStatus.warning
                            }`}
                          >
                            {item.stockUnits} / {item.lowStockThreshold} Min Units
                          </span>
                        </div>
                        <button
                          onClick={() => handleQuickEmergencyRestock(item)}
                          className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shrink-0 cursor-pointer"
                        >
                          +15 Intake
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 2: USER & RBAC MANAGEMENT (MOBILE CARDS + DESKTOP TABLE)
          ========================================== */}
          {activeTab === "users" && (
            <section className={`${THEME.colors.surface} overflow-hidden`}>
              {/* Mobile-First Filter Toolbar */}
              <div className="p-4 sm:p-5 border-b border-slate-200 space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                      User & RBAC Multi-Role Directory
                    </h2>
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {filteredUsers.length} Accounts
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Assign multiple roles (e.g.,{" "}
                    <code className="text-slate-700 font-semibold">
                      [Sales] + [Customer]
                    </code>
                    ) to a single email to prevent database duplication.
                  </p>
                </div>

                {/* Responsive Filter Grid */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search name, email, role..."
                      className="w-full pl-8 pr-3 py-2.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:flex items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2">
                      <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <select
                        value={deptFilter}
                        onChange={(e) =>
                          setDeptFilter(e.target.value as "All" | DepartmentType)
                        }
                        className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                      >
                        <option value="All">Dept: All</option>
                        <option value="Admin">Super Admin</option>
                        <option value="Sales">Sales Team</option>
                        <option value="Warehouse">Warehouse</option>
                        <option value="Customer">Customer</option>
                      </select>
                    </div>

                    <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <select
                        value={statusFilter}
                        onChange={(e) =>
                          setStatusFilter(
                            e.target.value as "All" | AccountStatus
                          )
                        }
                        className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                      >
                        <option value="All">Status: All</option>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>

                    <button
                      onClick={() =>
                        setSortOrder((prev) =>
                          prev === "asc" ? "desc" : "asc"
                        )
                      }
                      className="col-span-2 sm:col-span-1 justify-center px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      <span>Sort {sortOrder === "asc" ? "A–Z" : "Z–A"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* MOBILE CARD LIST (< lg) */}
              <div className="divide-y divide-slate-200 lg:hidden">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="p-4 space-y-3">
                    {/* Top Row: Avatar + Name + Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-extrabold flex items-center justify-center text-xs shrink-0 border border-slate-700">
                          {getInitials(user.fullName)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-sm truncate">
                              {user.fullName}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-semibold ${
                                user.accountType === "Corporate"
                                  ? "bg-slate-100 text-slate-700 border-slate-300"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }`}
                            >
                              {user.accountType}
                            </span>
                          </div>
                          <p className="text-slate-500 font-mono text-[11px] truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleUserStatus(user)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold border shrink-0 cursor-pointer ${
                          user.status === "Active"
                            ? THEME.colors.hardwareStatus.normal
                            : THEME.colors.hardwareStatus.critical
                        }`}
                      >
                        {user.status === "Active" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{user.status}</span>
                      </button>
                    </div>

                    {/* Roles Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${THEME.colors.roleBadges[role]}`}
                        >
                          [{role}]
                        </span>
                      ))}
                    </div>

                    {/* Session Meta */}
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                      <span>Last: {user.lastSession}</span>
                      <span className="font-mono text-slate-400">{user.id}</span>
                    </div>

                    {/* Touch-Friendly Action Row */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => openEditRolesModal(user)}
                        className="flex-1 py-2 px-3 rounded-lg border border-slate-200 bg-white active:bg-amber-50 text-slate-800 font-semibold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 text-amber-600" />
                        <span>Edit Roles</span>
                      </button>
                      <button
                        onClick={() => handleDispatchPasswordReset(user)}
                        aria-label="Reset password"
                        className="p-2.5 rounded-lg border border-slate-200 bg-white active:bg-slate-100 text-slate-600 cursor-pointer"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(user)}
                        aria-label="Toggle lock status"
                        className="p-2.5 rounded-lg border border-slate-200 bg-white active:bg-rose-50 text-slate-600 cursor-pointer"
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        aria-label="Delete user"
                        className="p-2.5 rounded-lg border border-slate-200 bg-white active:bg-rose-50 text-slate-400 active:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP DATA TABLE (>= lg) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-5">User Identity & Email</th>
                      <th className="py-3.5 px-4">Assigned RBAC Roles</th>
                      <th className="py-3.5 px-4">Operational Status</th>
                      <th className="py-3.5 px-4">Last Session & Created</th>
                      <th className="py-3.5 px-5 text-right">
                        Governance Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-extrabold flex items-center justify-center text-xs shrink-0 border border-slate-700">
                              {getInitials(user.fullName)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">
                                  {user.fullName}
                                </span>
                                <span
                                  className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                                    user.accountType === "Corporate"
                                      ? "bg-slate-100 text-slate-700 border-slate-300"
                                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  }`}
                                >
                                  {user.accountType}
                                </span>
                              </div>
                              <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                                {user.email} •{" "}
                                <span className="text-slate-400">
                                  {user.id}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {user.roles.map((role) => (
                              <span
                                key={role}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${THEME.colors.roleBadges[role]}`}
                              >
                                [{role}]
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggleUserStatus(user)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border cursor-pointer transition-all ${
                              user.status === "Active"
                                ? THEME.colors.hardwareStatus.normal
                                : THEME.colors.hardwareStatus.critical
                            }`}
                          >
                            {user.status === "Active" ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            <span>{user.status}</span>
                          </button>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-medium text-slate-800">
                            {user.lastSession}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Provisioned: {user.createdAt}
                          </div>
                        </td>

                        <td className="py-4 px-5 text-right">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditRolesModal(user)}
                              title="Edit Assigned RBAC Roles"
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-slate-700 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5 text-amber-600" />
                              <span>Roles</span>
                            </button>

                            <button
                              onClick={() => handleDispatchPasswordReset(user)}
                              title="Dispatch Password Reset Token"
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleToggleUserStatus(user)}
                              title={
                                user.status === "Active"
                                  ? "Suspend Account"
                                  : "Reactivate Account"
                              }
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteUser(user)}
                              title="Remove User"
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==========================================
              TAB 3: MASTER CATALOG & INVENTORY OVERSIGHT
          ========================================== */}
          {activeTab === "catalog" && (
            <section className={`${THEME.colors.surface} overflow-hidden`}>
              {/* Catalog Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                      Master Appliance Catalog & Stock Oversight
                    </h2>
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-300">
                      {filteredAppliances.length} SKUs
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Audit Sales pricing & Warehouse unit counts. Override low-stock thresholds or publication status.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      placeholder="Filter SKU, BTU, Wattage..."
                      className="w-full pl-8 pr-3 py-2.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 sm:py-2 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Appliance Categories</option>
                    <option value="Climate Control">Climate Control</option>
                    <option value="Refrigeration">Refrigeration</option>
                    <option value="Laundry Systems">Laundry Systems</option>
                    <option value="Smart Home & Robotics">
                      Smart Home & Robotics
                    </option>
                    <option value="Air Purification">Air Purification</option>
                    <option value="Kitchen Power">Kitchen Power</option>
                  </select>
                </div>
              </div>

              {/* MOBILE CATALOG CARDS (< lg) */}
              <div className="divide-y divide-slate-200 lg:hidden">
                {filteredAppliances.map((item) => {
                  const isOut = item.stockUnits === 0;
                  const isLow =
                    !isOut && item.stockUnits <= item.lowStockThreshold;

                  return (
                    <div key={item.id} className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.thumbnailBg} text-white flex flex-col items-center justify-center shrink-0 shadow-xs`}
                        >
                          <Zap className="w-4 h-4 text-amber-300" />
                          <span className="text-[9px] font-mono font-bold mt-0.5">
                            {item.sku.split("-")[1]}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 text-sm leading-snug">
                            {item.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 mt-1">
                            {item.sku} • {item.category}
                          </div>
                        </div>
                      </div>

                      {/* Specs & Energy Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-mono text-[11px] font-semibold">
                          {item.wattageOrInverter}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] border ${THEME.colors.hardwareStatus.energyStar}`}
                        >
                          {item.energyStarRating}
                        </span>
                      </div>

                      {/* Price & Stock Strip */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-[10px] uppercase text-slate-500 font-semibold block">
                            Selling Price
                          </span>
                          <span className="font-mono font-extrabold text-sm text-slate-900">
                            {formatTHB(item.priceTHB)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase text-slate-500 font-semibold block mb-0.5">
                            Warehouse Stock
                          </span>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                              isOut
                                ? THEME.colors.hardwareStatus.critical
                                : isLow
                                ? THEME.colors.hardwareStatus.warning
                                : THEME.colors.hardwareStatus.normal
                            }`}
                          >
                            {isOut
                              ? "0 Out-of-Stock"
                              : `${item.stockUnits} Units`}
                          </span>
                        </div>
                      </div>

                      {/* Safety Threshold + Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div>
                          {editingThresholdId === item.id ? (
                            <div className="inline-flex items-center gap-1.5">
                              <input
                                type="number"
                                min={1}
                                value={tempThresholdValue}
                                onChange={(e) =>
                                  setTempThresholdValue(Number(e.target.value))
                                }
                                className="w-16 px-2 py-1.5 border border-amber-400 rounded-lg text-xs font-mono"
                              />
                              <button
                                onClick={() => handleSaveSafetyThreshold(item)}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingThresholdId(item.id);
                                setTempThresholdValue(item.lowStockThreshold);
                              }}
                              className="inline-flex items-center gap-1 text-slate-700 font-mono text-xs py-1 cursor-pointer"
                            >
                              <span>Min {item.lowStockThreshold} units</span>
                              <Edit className="w-3.5 h-3.5 text-amber-600" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuickEmergencyRestock(item)}
                            className="px-3 py-2 rounded-lg border border-slate-200 bg-white active:bg-amber-50 text-slate-700 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                            <span>+15 Sync</span>
                          </button>
                          <button
                            onClick={() => handleTogglePublishAppliance(item)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold border cursor-pointer ${
                              item.published
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-300"
                            }`}
                          >
                            {item.published ? "Published" : "Hidden"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP MASTER CATALOG TABLE (>= lg) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-5">Appliance & Model SKU</th>
                      <th className="py-3.5 px-4">Wattage / Inverter Spec</th>
                      <th className="py-3.5 px-4">Energy Star Status</th>
                      <th className="py-3.5 px-4">Selling Price (THB)</th>
                      <th className="py-3.5 px-4">Warehouse Units</th>
                      <th className="py-3.5 px-4">Safety Threshold</th>
                      <th className="py-3.5 px-5 text-right">
                        Admin Oversight
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {filteredAppliances.map((item) => {
                      const isOut = item.stockUnits === 0;
                      const isLow =
                        !isOut && item.stockUnits <= item.lowStockThreshold;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3.5">
                              <div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.thumbnailBg} text-white flex flex-col items-center justify-center shrink-0 shadow-xs`}
                              >
                                <Zap className="w-4 h-4 text-amber-300" />
                                <span className="text-[9px] font-mono font-bold mt-0.5">
                                  {item.sku.split("-")[1]}
                                </span>
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-sm">
                                  {item.name}
                                </div>
                                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                                  SKU:{" "}
                                  <strong className="text-slate-700">
                                    {item.sku}
                                  </strong>{" "}
                                  • {item.category} • S/N Prefix:{" "}
                                  {item.serialPrefix}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-mono text-[11px] font-semibold">
                              {item.wattageOrInverter}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-md text-[11px] border ${THEME.colors.hardwareStatus.energyStar}`}
                            >
                              {item.energyStarRating}
                            </span>
                          </td>

                          <td className="py-4 px-4 font-mono font-extrabold text-sm text-slate-900">
                            {formatTHB(item.priceTHB)}
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                isOut
                                  ? THEME.colors.hardwareStatus.critical
                                  : isLow
                                  ? THEME.colors.hardwareStatus.warning
                                  : THEME.colors.hardwareStatus.normal
                              }`}
                            >
                              {isOut
                                ? "0 Out-of-Stock"
                                : `${item.stockUnits} Units`}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            {editingThresholdId === item.id ? (
                              <div className="inline-flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min={1}
                                  value={tempThresholdValue}
                                  onChange={(e) =>
                                    setTempThresholdValue(
                                      Number(e.target.value)
                                    )
                                  }
                                  className="w-16 px-2 py-1 border border-amber-400 rounded-lg text-xs font-mono"
                                />
                                <button
                                  onClick={() =>
                                    handleSaveSafetyThreshold(item)
                                  }
                                  className="px-2 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] cursor-pointer"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingThresholdId(item.id);
                                  setTempThresholdValue(item.lowStockThreshold);
                                }}
                                className="inline-flex items-center gap-1.5 text-slate-700 hover:text-amber-600 font-mono text-xs cursor-pointer"
                              >
                                <span>Min {item.lowStockThreshold} units</span>
                                <Edit className="w-3 h-3 opacity-70" />
                              </button>
                            )}
                          </td>

                          <td className="py-4 px-5 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleQuickEmergencyRestock(item)
                                }
                                title="Emergency +15 Unit Warehouse Sync"
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 text-slate-700 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                              >
                                <RefreshCw className="w-3 h-3 text-amber-600" />
                                <span>+15 Sync</span>
                              </button>

                              <button
                                onClick={() =>
                                  handleTogglePublishAppliance(item)
                                }
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-colors ${
                                  item.published
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                    : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                                }`}
                              >
                                {item.published ? "Published" : "Hidden"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==========================================
              TAB 4: SYSTEM SECURITY AUDIT LOGS
          ========================================== */}
          {activeTab === "audit" && (
            <section className={`${THEME.colors.surface} overflow-hidden`}>
              <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                      System Security & Operational Audit Trail
                    </h2>
                    <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                      Immutable Ledger
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Chronological compliance logs recording pricing changes, S/N scans, and RBAC modifications.
                  </p>
                </div>

                <select
                  value={auditEventFilter}
                  onChange={(e) =>
                    setAuditEventFilter(
                      e.target.value as "ALL" | AuditEventType
                    )
                  }
                  className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 sm:py-2 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">
                    All Event Types ({auditLogs.length})
                  </option>
                  <option value="PRICE_OVERRIDE">PRICE_OVERRIDE</option>
                  <option value="PROMOTION_APPLIED">PROMOTION_APPLIED</option>
                  <option value="RESTOCK_INTAKE">RESTOCK_INTAKE</option>
                  <option value="ROLE_MODIFIED">ROLE_MODIFIED</option>
                  <option value="ORDER_DISPATCHED">ORDER_DISPATCHED</option>
                </select>
              </div>

              {/* MOBILE AUDIT TIMELINE CARDS (< lg) */}
              <div className="divide-y divide-slate-200 lg:hidden">
                {filteredAuditLogs.map((log) => (
                  <div key={log.id} className="p-4 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-900 text-amber-400">
                        {log.eventType}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {log.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 leading-relaxed">
                      {log.summary}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">
                          {log.operatorName}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                            THEME.colors.roleBadges[log.operatorRole]
                          }`}
                        >
                          {log.operatorRole}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">
                        {log.id} • {log.terminalIp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP AUDIT TABLE (>= lg) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-5">Timestamp & Log ID</th>
                      <th className="py-3.5 px-4">Operator & Role</th>
                      <th className="py-3.5 px-4">Event Classification</th>
                      <th className="py-3.5 px-4">Change Summary</th>
                      <th className="py-3.5 px-5 text-right">
                        Terminal / Network IP
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {filteredAuditLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-5 font-mono">
                          <div className="font-bold text-slate-900">
                            {log.timestamp}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {log.id}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900">
                            {log.operatorName}
                          </div>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                              THEME.colors.roleBadges[log.operatorRole]
                            }`}
                          >
                            {log.operatorRole}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-md font-mono text-[11px] font-bold bg-slate-900 text-amber-400">
                            {log.eventType}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-slate-700 max-w-xl leading-relaxed">
                          {log.summary}
                        </td>

                        <td className="py-4 px-5 text-right font-mono text-[11px] text-slate-500">
                          {log.terminalIp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ==========================================
          MOBILE FIXED BOTTOM NAVIGATION BAR (< lg)
      ========================================== */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5"
      >
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          <button
            onClick={() => handleSelectTab("overview")}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "text-amber-400 bg-amber-500/10"
                : "text-slate-400"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => handleSelectTab("users")}
            className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
              activeTab === "users"
                ? "text-amber-400 bg-amber-500/10"
                : "text-slate-400"
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span>Users</span>
          </button>

          <button
            onClick={() => handleSelectTab("catalog")}
            className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
              activeTab === "catalog"
                ? "text-amber-400 bg-amber-500/10"
                : "text-slate-400"
            }`}
          >
            <div className="relative">
              <Package className="w-5 h-5 mb-0.5" />
              {kpiStats.lowStockCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-0.5 -right-1" />
              )}
            </div>
            <span>Catalog</span>
          </button>

          <button
            onClick={() => handleSelectTab("audit")}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
              activeTab === "audit"
                ? "text-amber-400 bg-amber-500/10"
                : "text-slate-400"
            }`}
          >
            <History className="w-5 h-5 mb-0.5" />
            <span>Audit</span>
          </button>
        </div>
      </nav>

      {/* ==========================================
          MODAL 1: "ADD STAFF ACCOUNT" (BOTTOM SHEET ON MOBILE)
      ========================================== */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[92dvh] flex flex-col border-t sm:border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold">
                    Provision New VoltCraft Account
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Multi-role RBAC without email duplication
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateStaffAccount}
              className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto"
            >
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g., Supaporn Techasit"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Corporate / Login Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="name@voltcraft.co.th"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Initial Temporary Password
                  </label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Primary Home Department
                </label>
                <select
                  value={newDepartment}
                  onChange={(e) =>
                    setNewDepartment(e.target.value as DepartmentType)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold"
                >
                  <option value="Sales">Sales Team (Commercial & Promos)</option>
                  <option value="Warehouse">Warehouse & Logistics Ops</option>
                  <option value="Admin">Super Admin Governance</option>
                  <option value="Customer">External Customer</option>
                </select>
              </div>

              {/* Multi-Select Checkboxes for Roles (Fixed Double-Click Handler) */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Assigned RBAC Roles (Multi-Select Enabled) *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(
                    ["Admin", "Sales", "Warehouse", "Customer"] as RoleType[]
                  ).map((role) => {
                    const checked = newRoles.includes(role);
                    return (
                      <label
                        key={role}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all select-none ${
                          checked
                            ? "bg-amber-50/70 border-amber-500 font-bold text-slate-900"
                            : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleNewUserRole(role)}
                          className="accent-amber-500 w-4 h-4"
                        />
                        <span>[{role}]</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold cursor-pointer"
                >
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2: EDIT MULTI-ROLE PERMISSIONS (BOTTOM SHEET ON MOBILE)
      ========================================== */}
      {editingUserRoles && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full max-h-[92dvh] flex flex-col border-t sm:border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="min-w-0 pr-2">
                <h3 className="text-sm font-extrabold">
                  Modify RBAC Role Tokens
                </h3>
                <p className="text-[11px] text-slate-400 font-mono truncate">
                  {editingUserRoles.fullName} ({editingUserRoles.email})
                </p>
              </div>
              <button
                onClick={() => setEditingUserRoles(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer shrink-0"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveEditedRoles}
              className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Primary Department Assignment
                </label>
                <select
                  value={tempEditedDept}
                  onChange={(e) =>
                    setTempEditedDept(e.target.value as DepartmentType)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold"
                >
                  <option value="Admin">Super Admin</option>
                  <option value="Sales">Sales Team</option>
                  <option value="Warehouse">Warehouse Ops</option>
                  <option value="Customer">Customer Account</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-2">
                  Active Multi-Role Permissions
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(
                    ["Admin", "Sales", "Warehouse", "Customer"] as RoleType[]
                  ).map((role) => {
                    const active = tempEditedRoles.includes(role);
                    return (
                      <button
                        type="button"
                        key={role}
                        onClick={() => handleToggleTempRole(role)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                          active
                            ? "bg-amber-50 border-amber-500 font-bold text-slate-900"
                            : "bg-slate-50 border-slate-200 text-slate-500"
                        }`}
                      >
                        <span>[{role}]</span>
                        {active && (
                          <CheckCircle2 className="w-4 h-4 text-amber-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingUserRoles(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold cursor-pointer"
                >
                  Save RBAC Roles
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}