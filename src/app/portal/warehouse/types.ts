export type WarehouseTab = "fulfillment" | "inventory" | "dispatch";

export type FulfillmentStatus = "Ready to Pick" | "Packed & S/N Bound" | "Dispatched";

export type FulfillmentFilter = "All" | FulfillmentStatus;

export type InventoryFilter = "All" | "Healthy Stock" | "Low Stock (< 5)";

export interface FulfillmentLineItem {
  id: string;
  sku: string;
  name: string;
  storageLocation: string;
  quantity: number;
  serialPrefix: string;
  boundSerials: string[];
  thumbnail: string;
}

export interface FulfillmentOrder {
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

export interface WarehouseInventoryItem {
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

export interface DeliveryRouteManifest {
  id: string;
  routeCode: string;
  truckName: string;
  driverName: string;
  driverPhone: string;
  vehiclePlate: string;
  departureBay: string;
  zoneCoverage: string;
}

export interface ScanningTarget {
  orderId: string;
  itemId: string;
  serialIndex: number;
}

export type ToastTone = "amber" | "emerald" | "blue" | "rose";

export interface ToastState {
  title: string;
  detail?: string;
  tone: ToastTone;
}

export interface FulfillmentMetrics {
  all: number;
  readyToPick: number;
  packed: number;
  dispatched: number;
}

export interface InventoryMetrics {
  totalSkus: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalPhysicalUnits: number;
}
