import React, { useState } from "react";
import { VOLTCRAFT_PRODUCTS } from "../mockData";

export function useWishlist(triggerToast: (msg: string) => void) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(["vc-ac-01", "vc-sc-03"]);

  const toggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const item = VOLTCRAFT_PRODUCTS.find((p) => p.id === productId);
      if (exists) {
        triggerToast(`Removed ${item?.modelCode || "appliance"} from Saved Specs`);
        return prev.filter((id) => id !== productId);
      } else {
        triggerToast(`Saved ${item?.modelCode || "appliance"} to Wishlist`);
        return [...prev, productId];
      }
    });
  };

  return { wishlistIds, toggleWishlist };
}
