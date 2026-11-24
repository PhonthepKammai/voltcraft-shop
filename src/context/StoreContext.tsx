// src/context/StoreContext.tsx
"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { useCart } from "@/app/portal/storefront/hooks/useCart";
import { useWishlist } from "@/app/portal/storefront/hooks/useWishlist";
import { useToast } from "@/app/hooks/useToast";

// 1. กำหนด Type ของข้อมูลที่จะแชร์ให้ทั้งเว็บใช้ร่วมกัน
type StoreContextType = ReturnType<typeof useCart> &
  ReturnType<typeof useWishlist>;

const StoreContext = createContext<StoreContextType | null>(null);

// 2. สร้าง Provider สำหรับครอบใน layout.tsx
export function StoreProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const triggerToast = useCallback(
    (msg: string) => showToast(msg, "success"),
    [showToast]
  );

  // นำ Hook เดิมของคุณมาทำงานอยู่จุดเดียวที่นี่
  const cartState = useCart(triggerToast);
  const wishlistState = useWishlist(triggerToast);

  return (
    <StoreContext.Provider value={{ ...cartState, ...wishlistState }}>
      {children}
    </StoreContext.Provider>
  );
}

// 3. สร้าง Hook สั้นๆ ให้ Component ลูกเรียกใช้งาน
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore ต้องถูกเรียกใช้ภายใต้ <StoreProvider> เท่านั้น");
  }
  return context;
}