"use client";

import { useCallback, useEffect, useState } from "react";
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
import BaseToast from "@/components/ui/BaseToast";
import { useCart } from "./hooks/useCart";
import { useProductFilters } from "./hooks/useProductFilters";
import { useToast } from "@/app/hooks/useToast";
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

  const basePrice = Number(item.price ?? 0);
  const now = new Date();
  const sale = item.sale;
  const isSaleActive =
    sale?.isActive &&
    Number(sale.value ?? 0) > 0 &&
    (!sale.startsAt || new Date(sale.startsAt) <= now) &&
    (!sale.expiresAt || new Date(sale.expiresAt) >= now);

  const discountAmount = isSaleActive
    ? sale.type === "percent"
      ? Math.round((basePrice * Number(sale.value)) / 100)
      : Number(sale.value)
    : 0;

  const finalPrice = Math.max(0, basePrice - discountAmount);
  const discountBadge = isSaleActive
    ? sale.type === "percent"
      ? `ลด ${sale.value}%`
      : `ลด ฿${Number(sale.value).toLocaleString()}`
    : item.badges?.discount;

  const attrs: Record<string, string> = item.attributes ?? {};
  const attrEntries = Object.entries(attrs).map(([k, v]) => `${k}: ${v}`);

  return {
    ...item,
    id: String(item._id ?? item.id),
    _id: String(item._id ?? item.id),
    sku: item.sku ?? "",
    modelCode: item.sku ?? item.slug ?? "",
    name: item.name ?? "Unnamed Appliance",
    slug: item.slug ?? "",
    description: item.description ?? "",
    categoryId: item.categoryId ?? null,
    categoryName,
    category: categoryName,
    price: finalPrice, // ราคาขายสุทธิหลังหักโปรโมชัน
    originalPrice: isSaleActive ? basePrice : Number(item.originalPrice ?? basePrice), // ราคาเต็มก่อนลด (เอาไว้ขีดฆ่า)
    images: Array.isArray(item.images) ? item.images : [],
    image: item.images?.[0] ?? "https://placehold.co/600x400?text=VoltCraft",
    attributes: attrs,
    status: item.status ?? "active",
    ratingAvg: Number(item.ratingAvg ?? 0),
    ratingCount: Number(item.ratingCount ?? 0),
    rating: Number(item.ratingAvg ?? 0),
    reviewsCount: Number(item.ratingCount ?? 0),
    stock: {
      onHand: Number(item.stock?.onHand ?? availableStock),
      reserved: Number(item.stock?.reserved ?? 0),
      available: availableStock,
    },
    inStock: availableStock > 0,
    primarySpec: attrEntries[0] ?? item.description ?? "-",
    secondarySpec: attrEntries[1] ?? "",
    badges: {
      discount: discountBadge,
      tech: Object.values(attrs)[0] ? String(Object.values(attrs)[0]) : "VoltCraft",
      service: availableStock > 0 ? `พร้อมส่ง (${availableStock})` : "สินค้าหมด",
    },
  } as ApplianceProduct;
}

export default function VoltCraftStorefrontPage() {
  const { toast, showToast, dismissToast } = useToast();

  const triggerToast = useCallback(
    (message: string) => {
      showToast(message, "success");
    },
    [showToast]
  );
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

        // ดึง Array ออกมาจากชั้นของ response (รองรับทั้ง { data: [...] }, { data: { items: [...] } }, { products: [...] })
        const payload = json?.data ?? json;
        const rawList = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload?.products)
          ? payload.products
          : Array.isArray(payload?.docs)
          ? payload.docs
          : [];

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
      <BaseToast toast={toast} onDismiss={dismissToast} />
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