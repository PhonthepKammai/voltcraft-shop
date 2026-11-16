import { USD_TO_THB } from "./constants";

export function formatTHB(amount: number): string {
  return `฿${Math.round(amount).toLocaleString()}`;
}

export function formatUSD(amountTHB: number): string {
  return `$${Math.round(amountTHB / USD_TO_THB).toLocaleString()}`;
}

export function calculateDiscountPercent(selling: number, original: number): number {
  if (!original || original <= selling) return 0;
  return Math.round(((original - selling) / original) * 100);
}
