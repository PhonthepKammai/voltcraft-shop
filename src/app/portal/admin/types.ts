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

export type ToastType = "success" | "warning" | "info";

export interface ToastData {
  message: string;
  type: ToastType;
}

export interface KpiStats {
  totalUsers: number;
  staffCount: number;
  customerCount: number;
  grossAssetValue: number;
  pendingDispatchCount: number;
  pendingSalesVerify: number;
  pendingWarehousePack: number;
  lowStockCount: number;
}

export interface PageMeta {
  short: string;
  breadcrumb: string;
}
