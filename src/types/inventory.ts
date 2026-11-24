import { StockMovementType } from "./constants";
import { BaseProduct } from "./product";
import { BaseUser } from "./user";

export interface BaseInventory {
  _id: string;
  productId: string | Pick<BaseProduct, "_id" | "sku" | "name" | "images" | "price">;
  onHand: number;
  reserved: number;
  available?: number;
  reorderPoint: number;
  location?: string;
  updatedAt?: string;
}

export interface BaseStockMovement {
  _id: string;
  productId: string | Pick<BaseProduct, "_id" | "sku" | "name">;
  type: StockMovementType;
  quantity: number;
  balanceAfter?: number;
  refType?: "order" | "manual" | "supplier";
  refId?: string;
  note?: string;
  createdBy: string | Pick<BaseUser, "_id" | "name">;
  createdAt: string;
}