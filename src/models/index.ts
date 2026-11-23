// src/models/index.ts

// user
export { User } from "./user/User";

// catalog
export { Category } from "./catalog/Category";
export { Product } from "./catalog/Product";
export { Review } from "./catalog/Review";

// inventory
export { Inventory } from "./inventory/Inventory";
export { StockMovement } from "./inventory/StockMovement";

// sales
export { Cart } from "./sales/Cart";
export { Order } from "./sales/Order";
export { Payment } from "./sales/Payment";
export { Shipment } from "./sales/Shipment";
export { Coupon } from "./sales/Coupon";
export { CouponRedemption } from "./sales/CouponRedemption";

// system
export { Counter } from "./system/Counter";
export { AuditLog } from "./system/AuditLog";

// constants (ให้ import จากที่เดียวกันได้)
export * from "./_shared/constants";