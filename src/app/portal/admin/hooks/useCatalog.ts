import { useMemo, useState } from "react";
import { INITIAL_APPLIANCES } from "../mockData";
import type { ApplianceItem, ToastType } from "../types";
import type { AppendAuditLog } from "./useAuditLog";

export function useCatalog(
  globalSearch: string,
  appendAuditLog: AppendAuditLog,
  triggerToast: (message: string, type?: ToastType) => void
) {
  const [appliances, setAppliances] =
    useState<ApplianceItem[]>(INITIAL_APPLIANCES);

  const [catalogSearch, setCatalogSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [editingThresholdId, setEditingThresholdId] = useState<string | null>(
    null
  );
  const [tempThresholdValue, setTempThresholdValue] = useState<number>(10);

  const filteredAppliances = useMemo(() => {
    const query = (catalogSearch || globalSearch).trim().toLowerCase();
    return appliances.filter((item) => {
      if (categoryFilter !== "All" && item.category !== categoryFilter) {
        return false;
      }
      if (query) {
        return (
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.wattageOrInverter.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [appliances, catalogSearch, globalSearch, categoryFilter]);

  const handleTogglePublishAppliance = (item: ApplianceItem) => {
    const nextState = !item.published;
    setAppliances((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, published: nextState } : a))
    );
    appendAuditLog(
      "PRICE_OVERRIDE",
      `Super Admin toggled storefront visibility for SKU ${item.sku} to [${
        nextState ? "PUBLISHED" : "HIDDEN"
      }]`
    );
    triggerToast(
      `New appliance SKU synchronized: ${item.sku} is now ${
        nextState ? "Published" : "Hidden"
      }`
    );
  };

  const handleSaveSafetyThreshold = (item: ApplianceItem) => {
    const safeVal = Math.max(1, tempThresholdValue);
    setAppliances((prev) =>
      prev.map((a) =>
        a.id === item.id ? { ...a, lowStockThreshold: safeVal } : a
      )
    );
    setEditingThresholdId(null);
    appendAuditLog(
      "RESTOCK_INTAKE",
      `Overrode safety low-stock alert threshold for ${item.sku} (${item.name}) to ${safeVal} units`
    );
    triggerToast(
      `Safety stock threshold updated to ${safeVal} units for ${item.sku}`
    );
  };

  const handleQuickEmergencyRestock = (item: ApplianceItem) => {
    const added = 15;
    setAppliances((prev) =>
      prev.map((a) =>
        a.id === item.id ? { ...a, stockUnits: a.stockUnits + added } : a
      )
    );
    appendAuditLog(
      "RESTOCK_INTAKE",
      `Super Admin authorized emergency restock intake (+${added} units) for ${item.sku}`
    );
    triggerToast(`Synchronized +${added} warehouse units for ${item.sku}`);
  };

  return {
    appliances,
    catalogSearch,
    setCatalogSearch,
    categoryFilter,
    setCategoryFilter,
    editingThresholdId,
    setEditingThresholdId,
    tempThresholdValue,
    setTempThresholdValue,
    filteredAppliances,
    handleTogglePublishAppliance,
    handleSaveSafetyThreshold,
    handleQuickEmergencyRestock,
  };
}
