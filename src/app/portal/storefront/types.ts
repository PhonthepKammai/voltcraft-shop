import type { Dispatch, SetStateAction } from "react";
import type { BaseProduct } from "@/types/product";

export type CategoryType = string;
export type SortOption = "featured" | "price-asc" | "price-desc" | "rating-desc" | "newest";

export interface ApplianceProduct extends BaseProduct {
  id: string; // แปลงมาจาก _id
  categoryName: string;
  image: string; // images[0]
  inStock: boolean; // stock.available > 0
  badges?: {
    discount?: string;
    tech?: string;
    service?: string;
  };
}

export interface CartItem {
  product: ApplianceProduct;
  quantity: number;
  addOnInstallation: boolean;
  addOnHaulAway: boolean;
}

export interface CartCalculations {
  subtotalUSD: number;
  installCount: number;
  addOnsUSD: number;
  shippingUSD: number;
  finalTotalUSD: number;
  totalSavingsUSD: number;
  freeShippingProgress: number;
}

export type CartAddOnField = "addOnInstallation" | "addOnHaulAway";

/** Everything the catalog UI needs to read and change filter state. */
export interface ProductFiltersApi {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  mobileSearchOpen: boolean;
  setMobileSearchOpen: Dispatch<SetStateAction<boolean>>;
  selectedCategory: CategoryType;
  setSelectedCategory: Dispatch<SetStateAction<CategoryType>>;
  availableCategories: string[]; // รายชื่อหมวดหมู่ที่มีจริงจาก API
  sortBy: SortOption;
  setSortBy: Dispatch<SetStateAction<SortOption>>;
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: Dispatch<SetStateAction<boolean>>;
  minPrice: number;
  setMinPrice: Dispatch<SetStateAction<number>>;
  maxPrice: number;
  setMaxPrice: Dispatch<SetStateAction<number>>;
  dynamicMaxPrice: number; // ราคาสูงสุดของสินค้าในระบบ
  onlyInStock: boolean;
  setOnlyInStock: Dispatch<SetStateAction<boolean>>;
  onlyWishlist: boolean;
  setOnlyWishlist: Dispatch<SetStateAction<boolean>>;
  selectedAttributes: Record<string, string>; // กรองตาม attributes ใน Schema เช่น { Resolution: "4K QLED" }
  setAttributeFilter: (key: string, value: string) => void;
  resetAllFilters: () => void;
  filteredProducts: ApplianceProduct[];
  activeFilterCount: number;
}
