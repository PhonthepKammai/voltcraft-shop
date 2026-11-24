import React, { useMemo, useState } from "react";
import { INITIAL_INVENTORY } from "../mockData";
import type {
  InventoryFilter,
  InventoryMetrics,
  ToastTone,
  WarehouseInventoryItem,
} from "../types";

export function useInventory(
  triggerToast: (title: string, detail?: string, tone?: ToastTone) => void
) {
  const [inventory, setInventory] =
    useState<WarehouseInventoryItem[]>(INITIAL_INVENTORY);
  const [inventoryFilter, setInventoryFilter] =
    useState<InventoryFilter>("All");
  const [inventorySearchQuery, setInventorySearchQuery] = useState("");
  const [restockModalItem, setRestockModalItem] =
    useState<WarehouseInventoryItem | null>(null);
  const [restockSelectedSku, setRestockSelectedSku] =
    useState<string>("VC-IC-32D");
  const [restockQty, setRestockQty] = useState<number>(10);
  const [restockBatchCode, setRestockBatchCode] = useState<string>(
    "LOT-2026-11W"
  );
  const [restockSupplierNote, setRestockSupplierNote] = useState<string>(
    "Factory QC Passed • Direct Pallet Intake Bay 4"
  );

  const inventoryMetrics = useMemo<InventoryMetrics>(() => {
    const lowStockItems = inventory.filter((i) => i.stockCount < 5);
    const outOfStockItems = inventory.filter((i) => i.stockCount === 0);
    const totalPhysicalUnits = inventory.reduce((sum, i) => sum + i.stockCount, 0);
    return {
      totalSkus: inventory.length,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
      totalPhysicalUnits,
    };
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      if (inventoryFilter === "Healthy Stock" && item.stockCount < 5) {
        return false;
      }
      if (inventoryFilter === "Low Stock (< 5)" && item.stockCount >= 5) {
        return false;
      }
      if (inventorySearchQuery.trim() !== "") {
        const q = inventorySearchQuery.toLowerCase();
        const matchSku = item.sku.toLowerCase().includes(q);
        const matchName = item.name.toLowerCase().includes(q);
        const matchLoc = item.storageLocation.toLowerCase().includes(q);
        if (!matchSku && !matchName && !matchLoc) return false;
      }
      return true;
    });
  }, [inventory, inventoryFilter, inventorySearchQuery]);

  const openRestockIntakeModal = (item?: WarehouseInventoryItem) => {
    if (item) {
      setRestockModalItem(item);
      setRestockSelectedSku(item.sku);
    } else {
      const defaultLowItem =
        inventory.find((i) => i.stockCount === 0) ||
        inventory.find((i) => i.stockCount < 5) ||
        inventory[0];
      setRestockModalItem(defaultLowItem);
      setRestockSelectedSku(defaultLowItem.sku);
    }
    setRestockQty(10);
    setRestockBatchCode(
      `LOT-2026-${Math.floor(10 + Math.random() * 89)}W`
    );
  };

  const handleConfirmRestockIntake = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSku = restockModalItem?.sku || restockSelectedSku;
    const addedUnits = Math.max(1, Number(restockQty) || 1);

    let updatedItemName = "";
    let updatedTotal = 0;

    setInventory((prev) =>
      prev.map((item) => {
        if (item.sku !== targetSku) return item;
        updatedItemName = item.name;
        updatedTotal = item.stockCount + addedUnits;
        return {
          ...item,
          stockCount: updatedTotal,
          lastIntakeDate: "Just now",
          lastIntakeBatch: `${restockBatchCode} (+${addedUnits})`,
        };
      })
    );

    triggerToast(
      `Restock Intake +${addedUnits} Units Added (${targetSku})`,
      `${updatedItemName} physical count updated to ${updatedTotal} units • Batch ${restockBatchCode} logged.`,
      "amber"
    );

    setRestockModalItem(null);
  };

  return {
    inventory,
    setInventory,
    inventoryFilter,
    setInventoryFilter,
    inventorySearchQuery,
    setInventorySearchQuery,
    restockModalItem,
    setRestockModalItem,
    restockSelectedSku,
    setRestockSelectedSku,
    restockQty,
    setRestockQty,
    restockBatchCode,
    setRestockBatchCode,
    restockSupplierNote,
    setRestockSupplierNote,
    inventoryMetrics,
    filteredInventory,
    openRestockIntakeModal,
    handleConfirmRestockIntake,
  };
}
