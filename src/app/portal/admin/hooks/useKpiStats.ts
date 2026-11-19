import { useMemo } from "react";
import type { ApplianceItem, KpiStats, UserAccount } from "../types";

export function useKpiStats(users: UserAccount[], appliances: ApplianceItem[]) {
  const kpiStats = useMemo<KpiStats>(() => {
    const staffCount = users.filter((u) =>
      u.roles.some((r) => r === "Admin" || r === "Sales" || r === "Warehouse")
    ).length;
    const customerCount = users.filter((u) =>
      u.roles.includes("Customer")
    ).length;

    const grossAssetValue = appliances.reduce(
      (sum, item) => sum + item.priceTHB * item.stockUnits,
      0
    );

    const lowStockItems = appliances.filter(
      (item) => item.stockUnits <= item.lowStockThreshold
    );

    return {
      totalUsers: users.length,
      staffCount,
      customerCount,
      grossAssetValue,
      pendingDispatchCount: 18,
      pendingSalesVerify: 7,
      pendingWarehousePack: 11,
      lowStockCount: lowStockItems.length,
    };
  }, [users, appliances]);

  return kpiStats;
}
