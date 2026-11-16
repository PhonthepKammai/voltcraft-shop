export type ActivePortalTab = "orders" | "catalog";

export type OrderStatus = "Pending Verification" | "Approved" | "Payment Issue";

export type OrderFilterType = "All" | OrderStatus;

export type ApplianceCategory =
  | "All"
  | "ACs"
  | "Refrigeration"
  | "Cleaning"
  | "Kitchen"
  | "Air Purifiers";

export type EnergyStarRating =
  | "No. 5 ★★★"
  | "No. 5 ★★"
  | "No. 5 ★"
  | "Standard Certified";

export interface OrderLineItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unitPriceTHB: number;
  thumbnail: string;
  isServiceAddOn?: boolean;
}

export interface SalesOrder {
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

export interface CatalogAppliance {
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

export interface ApplianceFormState {
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

export type ToastTone = "success" | "warning" | "danger";

export interface ToastState {
  title: string;
  detail?: string;
  tone: ToastTone;
}

export type ShowToast = (title: string, detail?: string, tone?: ToastTone) => void;

export interface OrderCounts {
  all: number;
  pending: number;
  approved: number;
  issue: number;
  approvedRevenueTHB: number;
}
