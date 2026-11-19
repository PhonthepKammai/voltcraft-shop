import { USD_TO_THB } from "./constants";

export function formatTHB(amount: number): string {
  return `฿${Math.round(amount).toLocaleString()}`;
}

export function formatUSD(amountTHB: number): string {
  return `$${Math.round(amountTHB / USD_TO_THB).toLocaleString()}`;
}
