import { Shield, Store, Package, ShoppingBag } from "lucide-react";

export const DEMO_ACCOUNTS = [
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
