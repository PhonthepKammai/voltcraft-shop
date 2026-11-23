export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface ProductStock {
  onHand: number;
  reserved: number;
  available: number;
}

export interface BaseProduct {
  _id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  categoryId: ProductCategory | string | null;
  price: number;
  images: string[];
  attributes?: Record<string, string>;
  status: "draft" | "active" | "archived";
  ratingAvg: number;
  ratingCount: number;
  stock: ProductStock;
  createdAt?: string;
  updatedAt?: string;
}