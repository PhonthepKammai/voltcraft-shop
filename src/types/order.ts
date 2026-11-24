import { OrderChannel, OrderStatus, PaymentMethod, PaymentStatus, PaymentVerifyStatus, ShipmentStatus } from "./constants";
import { BaseUser, UserAddress } from "./user";

export interface OrderItemSnapshot {
  productId: string;
  sku?: string;
  name?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface BaseOrder {
  _id: string;
  orderNo: string;
  customerId: string | Pick<BaseUser, "_id" | "name" | "email" | "phone">;
  salesId?: string | Pick<BaseUser, "_id" | "name"> | null;
  createdBy: string | Pick<BaseUser, "_id" | "name">;
  channel: OrderChannel;
  items: OrderItemSnapshot[];
  shippingAddress: Omit<UserAddress, "_id" | "label" | "isDefault">;
  subtotal: number;
  coupon?: {
    couponId?: string;
    code?: string;
    discountAmount?: number;
  };
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  statusHistory: {
    status: OrderStatus;
    by?: string | Pick<BaseUser, "_id" | "name">;
    at: string;
    note?: string;
  }[];
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BasePayment {
  _id: string;
  orderId: string | Pick<BaseOrder, "_id" | "orderNo" | "total">;
  method: PaymentMethod;
  amount: number;
  status: PaymentVerifyStatus;
  slipUrl?: string;
  paidAt?: string;
  verifiedBy?: string | Pick<BaseUser, "_id" | "name">;
  createdAt: string;
}

export interface BaseShipment {
  _id: string;
  orderId: string | Pick<BaseOrder, "_id" | "orderNo">;
  carrier?: string;
  trackingNo?: string;
  status: ShipmentStatus;
  packedBy?: string | Pick<BaseUser, "_id" | "name">;
  shippedAt?: string;
  deliveredAt?: string;
}