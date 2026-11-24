// src/lib/pricing.ts
export function getEffectivePrice(product: {
  price: number;
  sale?: {
    isActive?: boolean;
    type?: "percent" | "fixed";
    value?: number;
    startsAt?: Date | string | null;
    expiresAt?: Date | string | null;
  };
}) {
  const now = new Date();
  const sale = product.sale;

  // เช็กว่าเปิดโปรโมชันอยู่และอยู่ในช่วงเวลาที่กำหนดหรือไม่
  const isSaleValid =
    sale?.isActive &&
    (sale.value ?? 0) > 0 &&
    (!sale.startsAt || new Date(sale.startsAt) <= now) &&
    (!sale.expiresAt || new Date(sale.expiresAt) >= now);

  if (!isSaleValid) {
    return {
      originalPrice: product.price,
      finalPrice: product.price,
      discountAmount: 0,
      isOnSale: false,
    };
  }

  const discountAmount =
    sale!.type === "percent"
      ? Math.round((product.price * sale!.value!) / 100)
      : sale!.value!;

  const finalPrice = Math.max(0, product.price - discountAmount);

  return {
    originalPrice: product.price, // ราคาเต็ม (เอาไว้ขีดฆ่าโชว์หน้าเว็บ)
    finalPrice,                   // ราคาขายจริง (เอาไปคำนวณลง Cart / Order)
    discountAmount,               // ส่วนลดต่อชิ้น
    isOnSale: true,
  };
}