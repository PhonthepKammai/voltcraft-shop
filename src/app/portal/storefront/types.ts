import type { Dispatch, SetStateAction } from "react";

export type CategoryType =
  | "All"
  | "Climate Control"
  | "Refrigeration"
  | "Smart Cleaning"
  | "Kitchen Tech"
  | "Air Quality";

export type WattageTier = "All" | "Low (<500W)" | "Medium (500W-1500W)" | "High (>1500W)";
export type SortOption = "featured" | "price-asc" | "price-desc" | "rating-desc";

export interface ApplianceProduct {
  id: string;
  name: string;
  modelCode: string;
  category: Exclude<CategoryType, "All">;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  wattage: number;
  inverter: boolean;
  energyStar: boolean;
  smartWifi: boolean;
  ultraQuiet: boolean;
  noiseLevelDb: number;
  cordLengthM: number;
  circuitBreaker: string;
  dimensions: string;
  warrantyYears: number;
  primarySpec: string;
  secondarySpec: string;
  badges: {
    discount?: string;
    tech: string;
    service: string;
  };
  image: string;
  inStock: boolean;
  description: string;
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
  sortBy: SortOption;
  setSortBy: Dispatch<SetStateAction<SortOption>>;
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: Dispatch<SetStateAction<boolean>>;
  minPrice: number;
  setMinPrice: Dispatch<SetStateAction<number>>;
  maxPrice: number;
  setMaxPrice: Dispatch<SetStateAction<number>>;
  wattageTier: WattageTier;
  setWattageTier: Dispatch<SetStateAction<WattageTier>>;
  onlyEnergyStar: boolean;
  setOnlyEnergyStar: Dispatch<SetStateAction<boolean>>;
  onlyInverter: boolean;
  setOnlyInverter: Dispatch<SetStateAction<boolean>>;
  onlySmartWifi: boolean;
  setOnlySmartWifi: Dispatch<SetStateAction<boolean>>;
  onlyUltraQuiet: boolean;
  setOnlyUltraQuiet: Dispatch<SetStateAction<boolean>>;
  onlyWishlist: boolean;
  setOnlyWishlist: Dispatch<SetStateAction<boolean>>;
  resetAllFilters: () => void;
  filteredProducts: ApplianceProduct[];
  activeFilterCount: number;
}
