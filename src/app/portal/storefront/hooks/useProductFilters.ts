import { useEffect, useMemo, useState } from "react";
import type {
  ApplianceProduct,
  CategoryType,
  ProductFiltersApi,
  SortOption,
} from "../types";

export function useProductFilters(
  products: ApplianceProduct[],
  wishlistIds: string[]
): ProductFiltersApi {
  // คำนวณราคาสูงสุดจากสินค้าจริงใน API (ป้องกันสินค้าแพงกว่าเพดานเริ่มต้นโดนซ่อน)
  const dynamicMaxPrice = useMemo(() => {
    if (products.length === 0) return 100000;
    return Math.max(...products.map((p) => p.price), 1000);
  }, [products]);

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  // Advanced Filter States
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(dynamicMaxPrice);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyWishlist, setOnlyWishlist] = useState<boolean>(false);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  // อัปเดต maxPrice อัตโนมัติเมื่อโหลดข้อมูลสินค้าจาก API เสร็จ
  useEffect(() => {
    setMaxPrice(dynamicMaxPrice);
  }, [dynamicMaxPrice]);

  // ดึงรายชื่อหมวดหมู่ทั้งหมดที่มีอยู่จริงในสินค้าจาก API
  const availableCategories = useMemo(() => {
    const names = products
      .map((p) => p.categoryName)
      .filter((name): name is string => Boolean(name && name.trim() !== ""));
    return ["All", ...Array.from(new Set(names))];
  }, [products]);

  const setAttributeFilter = (key: string, value: string) => {
    setSelectedAttributes((prev) => {
      const next = { ...prev };
      if (!value || value === "All") {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  // Reset All Filters
  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setMinPrice(0);
    setMaxPrice(dynamicMaxPrice);
    setOnlyInStock(false);
    setOnlyWishlist(false);
    setSelectedAttributes({});
    setSortBy("featured");
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // แสดงเฉพาะสินค้าสถานะ active
        if (p.status && p.status !== "active") return false;

        // Search Filter (ค้นหาจาก name, sku, description, categoryName และค่าทั้งหมดใน attributes)
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchCategory = p.categoryName.toLowerCase().includes(q);
          const matchDesc = (p.description ?? "").toLowerCase().includes(q);
          const matchAttr = Object.entries(p.attributes ?? {}).some(
            ([k, v]) =>
              k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q)
          );

          if (!matchName && !matchSku && !matchCategory && !matchDesc && !matchAttr) {
            return false;
          }
        }

        // Category Filter
        if (selectedCategory !== "All" && p.categoryName !== selectedCategory) {
          return false;
        }

        // In-Stock Filter
        if (onlyInStock && !p.inStock) {
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

        // Dynamic Attributes Filter
        for (const [attrKey, attrVal] of Object.entries(selectedAttributes)) {
          if (p.attributes?.[attrKey] !== attrVal) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating-desc") return b.ratingAvg - a.ratingAvg;
        if (sortBy === "newest") {
          return (
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
          );
        }
        return 0; // featured order
      });
  }, [
    products,
    searchQuery,
    selectedCategory,
    onlyInStock,
    onlyWishlist,
    wishlistIds,
    minPrice,
    maxPrice,
    selectedAttributes,
    sortBy,
  ]);

  // Active Filter Chips computation
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (minPrice > 0 || maxPrice < dynamicMaxPrice) count++;
    if (onlyInStock) count++;
    if (onlyWishlist) count++;
    count += Object.keys(selectedAttributes).length;
    return count;
  }, [minPrice, maxPrice, dynamicMaxPrice, onlyInStock, onlyWishlist, selectedAttributes]);

  return {
    searchQuery,
    setSearchQuery,
    mobileSearchOpen,
    setMobileSearchOpen,
    selectedCategory,
    setSelectedCategory,
    availableCategories,
    sortBy,
    setSortBy,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    dynamicMaxPrice,
    onlyInStock,
    setOnlyInStock,
    onlyWishlist,
    setOnlyWishlist,
    selectedAttributes,
    setAttributeFilter,
    resetAllFilters,
    filteredProducts,
    activeFilterCount,
  };
}