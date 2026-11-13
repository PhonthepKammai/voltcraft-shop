import { Store, ShoppingBag, Package, Shield } from "lucide-react";
import { type UserAccount, type Role, type RoleConfig, type DemoAccount } from "./types";

export const INITIAL_USERS: UserAccount[] = [
  {
    id: "VC-1001",
    name: "Alex Morgan",
    email: "customer@voltcraft.com",
    password: "password123",
    roles: ["customer"],
  },
  {
    id: "VC-1002",
    name: "Sarah Mitchell",
    email: "sales@voltcraft.com",
    password: "password123",
    roles: ["sales", "customer"],
    department: "Sales Operations",
  },
  {
    id: "VC-1003",
    name: "James Wilson",
    email: "warehouse@voltcraft.com",
    password: "password123",
    roles: ["warehouse", "customer"],
    department: "Warehouse Logistics",
  },
  {
    id: "VC-1004",
    name: "Michael Anderson",
    email: "admin@voltcraft.com",
    password: "password123",
    roles: ["admin", "sales", "warehouse", "customer"],
    department: "Executive Administration",
  },
];

export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  customer: {
    id: "customer",
    title: "Customer Storefront",
    subtitle: "Personal Shopping",
    description:
      "Explore smart electrical appliances, customize installations, and manage your purchases.",
    permissions: [
      "Browse smart appliances",
      "Customize installation options",
      "Manage digital warranties",
    ],
    destination: "/",
    icon: <Store size={24} />,
    badgeClass: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
    iconClass: "bg-emerald-500/15 text-emerald-300",
    buttonClass: "bg-emerald-500 text-slate-950 hover:bg-emerald-400",
    features: ["Product Catalog", "My Orders", "Digital Warranty"],
  },
  sales: {
    id: "sales",
    title: "Sales Portal",
    subtitle: "Sales Operations",
    description:
      "Manage customer orders, product catalogs, and promotional campaigns.",
    permissions: [
      "Verify customer orders",
      "Manage product catalog",
      "Set promotional prices",
    ],
    destination: "/portal/sales",
    icon: <ShoppingBag size={24} />,
    badgeClass: "border-blue-500/40 bg-blue-500/15 text-blue-300",
    iconClass: "bg-blue-500/15 text-blue-300",
    buttonClass: "bg-blue-500 text-white hover:bg-blue-400",
    features: ["Order Management", "Product Catalog", "Promotions"],
  },
  warehouse: {
    id: "warehouse",
    title: "Warehouse Portal",
    subtitle: "Inventory & Logistics",
    description:
      "Coordinate inventory, scan product barcodes, and process shipments.",
    permissions: [
      "Scan S/N barcodes",
      "Pack and process orders",
      "Manage physical inventory",
    ],
    destination: "/portal/warehouse",
    icon: <Package size={24} />,
    badgeClass: "border-amber-500/40 bg-amber-500/15 text-amber-300",
    iconClass: "bg-amber-500/15 text-amber-300",
    buttonClass: "bg-amber-500 text-slate-950 hover:bg-amber-400",
    features: ["Inventory Management", "Order Fulfillment", "Barcode Scanner"],
  },
  admin: {
    id: "admin",
    title: "Super Admin Hub",
    subtitle: "System Administration",
    description:
      "Oversee platform operations, user permissions, and system security.",
    permissions: [
      "System governance",
      "Manage RBAC user permissions",
      "Review system audit logs",
    ],
    destination: "/portal/admin",
    icon: <Shield size={24} />,
    badgeClass: "border-purple-500/40 bg-purple-500/15 text-purple-300",
    iconClass: "bg-purple-500/15 text-purple-300",
    buttonClass: "bg-purple-500 text-white hover:bg-purple-400",
    features: ["User Management", "Access Control", "Audit Logs"],
  },
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: "Customer Only",
    description: "Customer storefront",
    email: "customer@voltcraft.com",
    icon: <Store size={17} />,
    color: "text-emerald-400",
  },
  {
    label: "Sales Staff",
    description: "Sales + Customer",
    email: "sales@voltcraft.com",
    icon: <ShoppingBag size={17} />,
    color: "text-blue-400",
  },
  {
    label: "Warehouse Officer",
    description: "Warehouse + Customer",
    email: "warehouse@voltcraft.com",
    icon: <Package size={17} />,
    color: "text-amber-400",
  },
  {
    label: "Multi-Role User",
    description: "All 4 operational roles",
    email: "admin@voltcraft.com",
    icon: <Shield size={17} />,
    color: "text-purple-400",
  },
];

export const PASSWORD_STRENGTH_LABELS = [
  "",
  "Very Weak",
  "Weak",
  "Fair",
  "Good",
  "Strong",
];

export const INPUT_CLASS =
  "h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30";

export const LABEL_CLASS =
  "mb-2 block text-sm font-semibold text-slate-200";
