import { CouponType, ReviewStatus } from "./constants";
import { BaseProduct } from "./product";
import { BaseUser } from "./user";

export interface BaseCoupon {
  _id: string;
  code: string;
  description?: string;
  type: CouponType;
  value: number;
  maxDiscount?: number;
  minOrderAmount: number;
  applicableProductIds: string[];
  applicableCategoryIds: string[];
  usageLimit?: number;
  usedCount: number;
  perUserLimit: number;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface BaseReview {
  _id: string;
  productId: string | Pick<BaseProduct, "_id" | "name" | "sku">;
  customerId: string | Pick<BaseUser, "_id" | "name">;
  orderId: string;
  rating: number;
  comment?: string;
  images: { url: string }[];
  status: ReviewStatus;
  reply?: {
    text: string;
    by: string | Pick<BaseUser, "_id" | "name">;
    at: string;
  };
  createdAt: string;
}