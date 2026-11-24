/** ค่าตั้งต้นของร้าน ปรับผ่าน env ได้ */
export const config = {
  shippingFee: Number(process.env.SHIPPING_FEE ?? 50),
  freeShippingMin: Number(process.env.FREE_SHIPPING_MIN ?? 1000),
  taxRate: Number(process.env.TAX_RATE ?? 0), // 0 = ราคารวม VAT แล้ว, 0.07 = บวก VAT 7%
};

export const calcShippingFee = (subtotal: number) =>
  subtotal >= config.freeShippingMin ? 0 : config.shippingFee;
