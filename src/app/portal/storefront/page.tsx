"use client";

import { useEffect, useState } from "react";
import CartDrawer from "./components/CartDrawer";
import CategoryNav from "./components/CategoryNav";
import CheckoutSuccessModal from "./components/CheckoutSuccessModal";
import FilterBar from "./components/FilterBar";
import FilterDrawer from "./components/FilterDrawer";
import FooterAssurance from "./components/FooterAssurance";
import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import MobileCartBar from "./components/MobileCartBar";
import ProductGrid from "./components/ProductGrid";
import PromoBanner from "./components/PromoBanner";
import QuickViewModal from "./components/QuickViewModal";
import Toast from "./components/ui/Toast";
import { useCart } from "./hooks/useCart";
import { useProductFilters } from "./hooks/useProductFilters";
import { useToast } from "./hooks/useToast";
import { useWishlist } from "./hooks/useWishlist";
import type { ApplianceProduct } from "./types";

// ฟังก์ชันแปลงข้อมูลจาก /api/products ให้เข้ากับทั้ง Schema ใหม่และ UI Component เดิม
function normalizeApiProduct(item: any): ApplianceProduct {
  const categoryName =
    typeof item.categoryId === "object" && item.categoryId !== null
      ? item.categoryId.name
      : item.category ?? "Uncategorized";

  const availableStock =
    typeof item.stock === "object" && item.stock !== null
      ? Number(item.stock.available ?? item.stock.onHand ?? 0)
      : Number(item.stock ?? 0);

  const attrs: Record<string, string> = item.attributes ?? {};
  const attrEntries = Object.entries(attrs).map(([k, v]) => `${k}: ${v}`);

  return {
    ...item,
    id: String(item._id ?? item.id),
    _id: String(item._id ?? item.id),
    sku: item.sku ?? "",
    modelCode: item.sku ?? item.slug ?? "", // รองรับ ProductCard / QuickViewModal เดิม
    name: item.name ?? "Unnamed Appliance",
    slug: item.slug ?? "",
    description: item.description ?? "",
    categoryId: item.categoryId ?? null,
    categoryName,
    category: categoryName, // รองรับ Component เดิมที่เรียก product.category
    price: Number(item.price ?? 0),
    originalPrice: Number(item.originalPrice ?? item.price ?? 0),
    images: Array.isArray(item.images) ? item.images : [],
    image: item.images?.[0] ?? "https://placehold.co/600x400?text=VoltCraft",
    attributes: attrs,
    status: item.status ?? "active",
    ratingAvg: Number(item.ratingAvg ?? 0),
    ratingCount: Number(item.ratingCount ?? 0),
    rating: Number(item.ratingAvg ?? 0), // รองรับ ProductCard เดิมที่เรียก product.rating
    reviewsCount: Number(item.ratingCount ?? 0), // รองรับ ProductCard เดิมที่เรียก product.reviewsCount
    stock: {
      onHand: Number(item.stock?.onHand ?? availableStock),
      reserved: Number(item.stock?.reserved ?? 0),
      available: availableStock,
    },
    inStock: availableStock > 0,
    // ดึงค่าจาก attributes (เช่น ScreenSize, Resolution) มาแสดงเป็นสเปกบนการ์ด
    primarySpec: attrEntries[0] ?? item.description ?? "-",
    secondarySpec: attrEntries[1] ?? "",
    badges: {
      discount: item.badges?.discount ?? undefined,
      tech: Object.values(attrs)[0] ? String(Object.values(attrs)[0]) : "VoltCraft",
      service: availableStock > 0 ? `พร้อมส่ง (${availableStock})` : "สินค้าหมด",
    },
  } as ApplianceProduct;
}

export default function VoltCraftStorefrontPage() {
  const { toastMessage, triggerToast } = useToast();
  const { wishlistIds, toggleWishlist } = useWishlist(triggerToast);

  const [products, setProducts] = useState<ApplianceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = useProductFilters(products, wishlistIds);

  const {
    cart,
    setCart,
    addingProductId,
    addedSuccessId,
    handleAddToCart,
    updateCartQuantity,
    removeCartItem,
    toggleCartAddOn,
    totalCartItems,
    cartCalculations,
  } = useCart(triggerToast);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ApplianceProduct | null>(null);
  const [checkoutSuccessModal, setCheckoutSuccessModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลสินค้าได้");

        const json = await res.json();
        const rawList = Array.isArray(json)
          ? json
          : json.products || json.data || [];

        const mappedProducts = rawList.map(normalizeApiProduct);
        setProducts(mappedProducts);
      } catch (err: any) {
        setError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ API");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <div className="p-12 text-center text-slate-500">กำลังโหลดข้อมูลสินค้า...</div>;
  }

  if (error) {
    return <div className="p-12 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950 pb-20">
      {/* A. Sticky navigation & header */}
      <div className="sticky top-0 z-40 shadow-sm">
        <PromoBanner />
        <Header
          filters={filters}
          wishlistCount={wishlistIds.length}
          totalCartItems={totalCartItems}
          onOpenCart={() => setIsCartOpen(true)}
        />
        <CategoryNav filters={filters} />
      </div>

      {/* B. Hero */}
      <HeroBanner />

      {/* C. Filter controls */}
      <FilterBar filters={filters} />

      {/* D. Catalog grid */}
      <ProductGrid
        products={filters.filteredProducts}
        wishlistIds={wishlistIds}
        addingProductId={addingProductId}
        addedSuccessId={addedSuccessId}
        onResetFilters={filters.resetAllFilters}
        onQuickView={setQuickViewProduct}
        onToggleWishlist={toggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <FooterAssurance />

      {/* C2. Filter drawer */}
      {filters.isFilterDrawerOpen && <FilterDrawer filters={filters} />}

      {/* E. Cart drawer */}
      {isCartOpen && (
        <CartDrawer
          cart={cart}
          totalCartItems={totalCartItems}
          cartCalculations={cartCalculations}
          onClose={() => setIsCartOpen(false)}
          onCheckout={() => {
            setIsCartOpen(false);
            setCheckoutSuccessModal(true);
          }}
          removeCartItem={removeCartItem}
          updateCartQuantity={updateCartQuantity}
          toggleCartAddOn={toggleCartAddOn}
        />
      )}

      {/* F. Quick-view modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onOpenCart={() => setIsCartOpen(true)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Checkout confirmation */}
      {checkoutSuccessModal && (
        <CheckoutSuccessModal
          cartCalculations={cartCalculations}
          onClose={() => setCheckoutSuccessModal(false)}
          onComplete={() => {
            setCheckoutSuccessModal(false);
            setCart([]);
          }}
        />
      )}

      {/* Toast & floating mobile cart bar */}
      <Toast message={toastMessage} />
      {totalCartItems > 0 && !isCartOpen && (
        <MobileCartBar
          totalCartItems={totalCartItems}
          cartCalculations={cartCalculations}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}
    </div>
  );
}