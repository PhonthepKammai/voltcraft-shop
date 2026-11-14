import { USD_TO_THB } from "./constants";

export function formatTHB(usd: number): string {
  const thb = Math.round((usd * USD_TO_THB) / 100) * 100 - 10;
  return `฿${thb.toLocaleString()}`;
}
