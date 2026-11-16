import { Shield, Store, Package, ShoppingBag } from "lucide-react";
import type { Role, RoleConfig } from "./types";

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
    badgeClass:
      "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
    iconClass: "bg-emerald-500/15 text-emerald-300",
    buttonClass:
      "bg-emerald-500 text-slate-950 hover:bg-emerald-400",
    features: [
      "Product Catalog",
      "My Orders",
      "Digital Warranty",
    ],
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
    badgeClass:
      "border-blue-500/40 bg-blue-500/15 text-blue-300",
    iconClass: "bg-blue-500/15 text-blue-300",
    buttonClass: "bg-blue-500 text-white hover:bg-blue-400",
    features: [
      "Order Management",
      "Product Catalog",
      "Promotions",
    ],
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
    badgeClass:
      "border-amber-500/40 bg-amber-500/15 text-amber-300",
    iconClass: "bg-amber-500/15 text-amber-300",
    buttonClass:
      "bg-amber-500 text-slate-950 hover:bg-amber-400",
    features: [
      "Inventory Management",
      "Order Fulfillment",
      "Barcode Scanner",
    ],
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
    badgeClass:
      "border-purple-500/40 bg-purple-500/15 text-purple-300",
    iconClass: "bg-purple-500/15 text-purple-300",
    buttonClass:
      "bg-purple-500 text-white hover:bg-purple-400",
    features: [
      "User Management",
      "Access Control",
      "Audit Logs",
    ],
  },
};
