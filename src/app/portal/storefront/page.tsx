"use client";

import { useState } from "react";
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

export default function VoltCraftStorefrontPage() {
  const { toastMessage, triggerToast } = useToast();
  const { wishlistIds, toggleWishlist } = useWishlist(triggerToast);
  const filters = useProductFilters(wishlistIds);
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

  // UI overlay state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ApplianceProduct | null>(null);
  const [checkoutSuccessModal, setCheckoutSuccessModal] = useState(false);

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
