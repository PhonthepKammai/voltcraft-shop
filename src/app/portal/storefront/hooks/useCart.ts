import React, { useMemo, useState } from "react";
import {
  FREE_SHIPPING_THRESHOLD_USD,
  INSTALLATION_FEE_USD,
  SHIPPING_FEE_USD,
} from "../constants";
import { VOLTCRAFT_PRODUCTS } from "../mockData";
import type {
  ApplianceProduct,
  CartAddOnField,
  CartCalculations,
  CartItem,
} from "../types";

export function useCart(triggerToast: (msg: string) => void) {
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: VOLTCRAFT_PRODUCTS[0],
      quantity: 1,
      addOnInstallation: true,
      addOnHaulAway: true,
    },
  ]);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);

  // Add to Cart with Tactile Loading State
  const handleAddToCart = (
    product: ApplianceProduct,
    withInstall = false,
    withHaulAway = false,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    setAddingProductId(product.id);

    setTimeout(() => {
      setCart((prev) => {
        const existingIndex = prev.findIndex((item) => item.product.id === product.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + 1,
            addOnInstallation: updated[existingIndex].addOnInstallation || withInstall,
            addOnHaulAway: updated[existingIndex].addOnHaulAway || withHaulAway,
          };
          return updated;
        }
        return [
          ...prev,
          {
            product,
            quantity: 1,
            addOnInstallation: withInstall,
            addOnHaulAway: withHaulAway,
          },
        ];
      });

      setAddingProductId(null);
      setAddedSuccessId(product.id);
      triggerToast(`Added ${product.modelCode} to Direct Dispatch Cart`);

      setTimeout(() => {
        setAddedSuccessId((curr) => (curr === product.id ? null : curr));
      }, 1400);
    }, 280);
  };

  // Cart Operations
  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const toggleCartAddOn = (
    productId: string,
    field: CartAddOnField
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, [field]: !item[field] } : item
      )
    );
  };

  // Cart Calculations
  const totalCartItems = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const cartCalculations = useMemo<CartCalculations>(() => {
    const subtotalUSD = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const originalSubtotalUSD = cart.reduce(
      (sum, item) => sum + item.product.originalPrice * item.quantity,
      0
    );
    const installCount = cart.reduce(
      (sum, item) => sum + (item.addOnInstallation ? item.quantity : 0),
      0
    );
    const addOnsUSD = installCount * INSTALLATION_FEE_USD;
    const shippingUSD =
      subtotalUSD === 0 || subtotalUSD >= FREE_SHIPPING_THRESHOLD_USD ? 0 : SHIPPING_FEE_USD;
    const finalTotalUSD = subtotalUSD + addOnsUSD + shippingUSD;
    const totalSavingsUSD = originalSubtotalUSD - subtotalUSD;

    return {
      subtotalUSD,
      installCount,
      addOnsUSD,
      shippingUSD,
      finalTotalUSD,
      totalSavingsUSD,
      freeShippingProgress: Math.min(
        100,
        Math.round((subtotalUSD / FREE_SHIPPING_THRESHOLD_USD) * 100)
      ),
    };
  }, [cart]);

  return {
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
  };
}
