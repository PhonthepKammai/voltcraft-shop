import { useMemo, useState } from "react";
import { DEFAULT_MAX_PRICE } from "../constants";
import { VOLTCRAFT_PRODUCTS } from "../mockData";
import type {
  CategoryType,
  ProductFiltersApi,
  SortOption,
  WattageTier,
} from "../types";

export function useProductFilters(wishlistIds: string[]): ProductFiltersApi {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  // Advanced Filter States (Drawer + Quick Chips)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(DEFAULT_MAX_PRICE);
  const [wattageTier, setWattageTier] = useState<WattageTier>("All");
  const [onlyEnergyStar, setOnlyEnergyStar] = useState<boolean>(false);
  const [onlyInverter, setOnlyInverter] = useState<boolean>(false);
  const [onlySmartWifi, setOnlySmartWifi] = useState<boolean>(false);
  const [onlyUltraQuiet, setOnlyUltraQuiet] = useState<boolean>(false);
  const [onlyWishlist, setOnlyWishlist] = useState<boolean>(false);

  // Reset All Filters
  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setMinPrice(0);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setWattageTier("All");
    setOnlyEnergyStar(false);
    setOnlyInverter(false);
    setOnlySmartWifi(false);
    setOnlyUltraQuiet(false);
    setOnlyWishlist(false);
    setSortBy("featured");
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return VOLTCRAFT_PRODUCTS.filter((p) => {
      // Search Filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCode = p.modelCode.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        const matchSpec =
          p.primarySpec.toLowerCase().includes(q) ||
          p.secondarySpec.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchCategory && !matchSpec) return false;
      }

      // Category Filter
      if (selectedCategory !== "All" && p.category !== selectedCategory) {
        return false;
      }

      // Wishlist Filter
      if (onlyWishlist && !wishlistIds.includes(p.id)) {
        return false;
      }

      // Price Filter
      if (p.price < minPrice || p.price > maxPrice) {
        return false;
      }

      // Wattage Tier Filter
      if (wattageTier === "Low (<500W)" && p.wattage >= 500) return false;
      if (
        wattageTier === "Medium (500W-1500W)" &&
        (p.wattage < 500 || p.wattage > 1500)
      )
        return false;
      if (wattageTier === "High (>1500W)" && p.wattage <= 1500) return false;

      // Spec Booleans
      if (onlyEnergyStar && !p.energyStar) return false;
      if (onlyInverter && !p.inverter) return false;
      if (onlySmartWifi && !p.smartWifi) return false;
      if (onlyUltraQuiet && !p.ultraQuiet) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating-desc") return b.rating - a.rating;
      return 0; // featured order
    });
  }, [
    searchQuery,
    selectedCategory,
    onlyWishlist,
    wishlistIds,
    minPrice,
    maxPrice,
    wattageTier,
    onlyEnergyStar,
    onlyInverter,
    onlySmartWifi,
    onlyUltraQuiet,
    sortBy,
  ]);

  // Active Filter Chips computation
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (minPrice > 0 || maxPrice < DEFAULT_MAX_PRICE) count++;
    if (wattageTier !== "All") count++;
    if (onlyEnergyStar) count++;
    if (onlyInverter) count++;
    if (onlySmartWifi) count++;
    if (onlyUltraQuiet) count++;
    if (onlyWishlist) count++;
    return count;
  }, [
    minPrice,
    maxPrice,
    wattageTier,
    onlyEnergyStar,
    onlyInverter,
    onlySmartWifi,
    onlyUltraQuiet,
    onlyWishlist,
  ]);

  return {
    searchQuery,
    setSearchQuery,
    mobileSearchOpen,
    setMobileSearchOpen,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    wattageTier,
    setWattageTier,
    onlyEnergyStar,
    setOnlyEnergyStar,
    onlyInverter,
    setOnlyInverter,
    onlySmartWifi,
    setOnlySmartWifi,
    onlyUltraQuiet,
    setOnlyUltraQuiet,
    onlyWishlist,
    setOnlyWishlist,
    resetAllFilters,
    filteredProducts,
    activeFilterCount,
  };
}
