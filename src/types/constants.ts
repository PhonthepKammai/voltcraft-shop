// src/types/voltcraft.ts

/* ───────────── Shared Enums / Unions ───────────── */

export type UserRole = "customer" | "sales" | "warehouse" | "admin";
export type UserStatus = "active" | "suspended";
export type ProductStatus = "draft" | "active" | "archived";
export type StockMovementType = "receive" | "reserve" | "release" | "ship" | "adjust" | "return";
export type OrderChannel = "online" | "sales";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";
export type PaymentStatus = "unpaid" | "paid" | "refunded";
export type PaymentMethod = "promptpay" | "transfer" | "card" | "cod";
export type PaymentVerifyStatus = "pending" | "verified" | "rejected" | "refunded";
export type ShipmentStatus = "preparing" | "shipped" | "delivered" | "failed";
export type CouponType = "percent" | "fixed" | "free_shipping";
export type ReviewStatus = "pending" | "published" | "hidden";