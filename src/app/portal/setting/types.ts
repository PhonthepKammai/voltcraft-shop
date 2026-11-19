export type ProfileTabId =
  | "personal"
  | "addresses"
  | "orders"
  | "warranties"
  | "security";

export type RoleCode = "customer" | "sales" | "warehouse" | "admin";

export type AddressLabelType = "Home" | "Condo" | "Office / Studio";

export type OrderLifecycleStatus =
  | "Delivered & Installed"
  | "Out for Delivery"
  | "Packed"
  | "Processing";

export interface UserProfileData {
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

export interface ApplianceDeliveryAddress {
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

export interface OrderLineSummary {
  sku: string;
  name: string;
  qty: number;
  priceTHB: number;
  serialNumber?: string;
  includesProInstall: boolean;
}

export interface CustomerApplianceOrder {
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

export interface DigitalApplianceWarranty {
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

export type AddressFormState = Omit<ApplianceDeliveryAddress, "id">;

export type ToastTone = "emerald" | "amber" | "blue" | "rose";

export interface ToastState {
  title: string;
  detail?: string;
  tone: ToastTone;
}

export type TriggerToast = (title: string, detail?: string, tone?: ToastTone) => void;
