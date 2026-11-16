import React, { useMemo, useState } from "react";
import { INITIAL_CATALOG } from "../mockData";
import type {
  ApplianceCategory,
  ApplianceFormState,
  CatalogAppliance,
  ShowToast,
} from "../types";
import { formatTHB } from "../utils";

/**
 * @param onItemAdded called after a brand-new appliance is saved (e.g. to switch to the catalog tab)
 */
export function useCatalog(showToast: ShowToast, onItemAdded: () => void) {
  const [catalog, setCatalog] = useState<CatalogAppliance[]>(INITIAL_CATALOG);
  const [catalogCategory, setCatalogCategory] = useState<ApplianceCategory>("All");
  const [catalogSearchQuery, setCatalogSearchQuery] = useState("");
  const [onlyPromoItems, setOnlyPromoItems] = useState(false);

  const [isApplianceSheetOpen, setIsApplianceSheetOpen] = useState(false);
  const [editingApplianceId, setEditingApplianceId] = useState<string | null>(null);
  const [formState, setFormState] = useState<ApplianceFormState>({
    name: "",
    sku: "",
    category: "ACs",
    description: "",
    wattage: 1200,
    inverter: true,
    energyRating: "No. 5 ★★★",
    dimensionsCm: "60.0 x 85.0 x 55.0 cm",
    priceTHB: 12900,
    originalPriceTHB: 14900,
    published: true,
    imageUrl:
      "https://images.unsplash.com/photo-1631545806609-35d4ae490431?auto=format&fit=crop&w=800&q=85",
    warehouseStock: 10,
  });

  const [promoTargetAppliance, setPromoTargetAppliance] =
    useState<CatalogAppliance | null>(null);
  const [customPromoPercent, setCustomPromoPercent] = useState<number>(15);

  const [deletingAppliance, setDeletingAppliance] =
    useState<CatalogAppliance | null>(null);

  const filteredCatalog = useMemo(() => {
    return catalog.filter((item) => {
      if (catalogCategory !== "All" && item.category !== catalogCategory) {
        return false;
      }
      if (onlyPromoItems && item.originalPriceTHB <= item.priceTHB) {
        return false;
      }
      if (catalogSearchQuery.trim() !== "") {
        const q = catalogSearchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchSku = item.sku.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchCat) return false;
      }
      return true;
    });
  }, [catalog, catalogCategory, onlyPromoItems, catalogSearchQuery]);

  const openNewApplianceSheet = () => {
    setEditingApplianceId(null);
    setFormState({
      name: "",
      sku: `VC-NEW-${Math.floor(100 + Math.random() * 899)}`,
      category: "ACs",
      description:
        "High-efficiency VoltCraft precision appliance engineered with industrial thermal protection and direct 5-year warranty.",
      wattage: 1100,
      inverter: true,
      energyRating: "No. 5 ★★★",
      dimensionsCm: "75.0 x 32.0 x 21.0 cm",
      priceTHB: 14900,
      originalPriceTHB: 17900,
      published: true,
      imageUrl:
        "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=85",
      warehouseStock: 0, // Initialized at 0; Warehouse staff manages physical receiving
    });
    setIsApplianceSheetOpen(true);
  };

  const openEditApplianceSheet = (appliance: CatalogAppliance) => {
    setEditingApplianceId(appliance.id);
    setFormState({
      id: appliance.id,
      name: appliance.name,
      sku: appliance.sku,
      category: appliance.category,
      description: appliance.description,
      wattage: appliance.wattage,
      inverter: appliance.inverter,
      energyRating: appliance.energyRating,
      dimensionsCm: appliance.dimensionsCm,
      priceTHB: appliance.priceTHB,
      originalPriceTHB: appliance.originalPriceTHB,
      published: appliance.published,
      imageUrl: appliance.imageUrl,
      warehouseStock: appliance.warehouseStock,
    });
    setIsApplianceSheetOpen(true);
  };

  const handleSaveApplianceForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.sku.trim()) {
      showToast(
        "Validation Required",
        "Please enter both Appliance Model Name and SKU code.",
        "warning"
      );
      return;
    }

    const sanitizedSellingPrice = Math.max(100, Number(formState.priceTHB) || 0);
    const sanitizedOriginalPrice = Math.max(
      sanitizedSellingPrice,
      Number(formState.originalPriceTHB) || sanitizedSellingPrice
    );

    if (editingApplianceId) {
      setCatalog((prev) =>
        prev.map((item) =>
          item.id === editingApplianceId
            ? {
                ...item,
                name: formState.name.trim(),
                sku: formState.sku.trim().toUpperCase(),
                category: formState.category,
                description: formState.description.trim(),
                wattage: Number(formState.wattage) || 0,
                inverter: formState.inverter,
                energyRating: formState.energyRating,
                dimensionsCm: formState.dimensionsCm.trim(),
                priceTHB: sanitizedSellingPrice,
                originalPriceTHB: sanitizedOriginalPrice,
                published: formState.published,
                imageUrl: formState.imageUrl.trim(),
                updatedAt: "Just now",
              }
            : item
        )
      );
      showToast(
        `Appliance ${formState.sku.toUpperCase()} Updated`,
        `Selling price set to ${formatTHB(sanitizedSellingPrice)} • Specs synced live.`,
        "success"
      );
    } else {
      const newAppliance: CatalogAppliance = {
        id: `cat-${Date.now()}`,
        sku: formState.sku.trim().toUpperCase(),
        name: formState.name.trim(),
        category: formState.category,
        description: formState.description.trim(),
        wattage: Number(formState.wattage) || 0,
        inverter: formState.inverter,
        energyRating: formState.energyRating,
        dimensionsCm: formState.dimensionsCm.trim() || "50 x 50 x 50 cm",
        priceTHB: sanitizedSellingPrice,
        originalPriceTHB: sanitizedOriginalPrice,
        warehouseStock: 0, // Strict Role Rule: Warehouse team receives physical stock
        published: formState.published,
        imageUrl:
          formState.imageUrl.trim() ||
          "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=85",
        updatedAt: "Added just now",
      };
      setCatalog((prev) => [newAppliance, ...prev]);
      onItemAdded();
      showToast(
        `New Appliance ${newAppliance.sku} Added to Catalog`,
        `Published at ${formatTHB(newAppliance.priceTHB)} (Awaiting Warehouse Stock Intake).`,
        "success"
      );
    }

    setIsApplianceSheetOpen(false);
  };

  const openPromoModal = (appliance: CatalogAppliance, discountPct: number) => {
    setPromoTargetAppliance(appliance);
    setCustomPromoPercent(discountPct > 0 ? discountPct : 15);
  };

  const handleApplyPromoDiscount = (percentOff: number) => {
    if (!promoTargetAppliance) return;
    const baseComparePrice =
      promoTargetAppliance.originalPriceTHB > promoTargetAppliance.priceTHB
        ? promoTargetAppliance.originalPriceTHB
        : Math.round(promoTargetAppliance.priceTHB * 1.15);

    const newSellingPrice =
      percentOff === 0
        ? baseComparePrice
        : Math.round((baseComparePrice * (100 - percentOff)) / 10) * 10;

    setCatalog((prev) =>
      prev.map((item) =>
        item.id === promoTargetAppliance.id
          ? {
              ...item,
              priceTHB: newSellingPrice,
              originalPriceTHB: baseComparePrice,
              updatedAt: "Promo updated just now",
            }
          : item
      )
    );

    if (percentOff === 0) {
      showToast(
        `Promo Cleared on ${promoTargetAppliance.sku}`,
        `Restored standard MSRP price of ${formatTHB(baseComparePrice)}.`,
        "warning"
      );
    } else {
      showToast(
        `Campaign -${percentOff}% Live on ${promoTargetAppliance.sku}`,
        `Promo price updated to ${formatTHB(newSellingPrice)} (Was ${formatTHB(baseComparePrice)}).`,
        "success"
      );
    }

    setPromoTargetAppliance(null);
  };

  const handleConfirmDeleteAppliance = () => {
    if (!deletingAppliance) return;
    const deletedSku = deletingAppliance.sku;
    const deletedName = deletingAppliance.name;
    setCatalog((prev) => prev.filter((item) => item.id !== deletingAppliance.id));
    setDeletingAppliance(null);
    showToast(
      `Appliance ${deletedSku} Removed from Catalog`,
      `${deletedName} has been archived from the customer storefront.`,
      "danger"
    );
  };

  return {
    catalog,
    catalogCategory,
    setCatalogCategory,
    catalogSearchQuery,
    setCatalogSearchQuery,
    onlyPromoItems,
    setOnlyPromoItems,
    isApplianceSheetOpen,
    setIsApplianceSheetOpen,
    editingApplianceId,
    formState,
    setFormState,
    promoTargetAppliance,
    setPromoTargetAppliance,
    customPromoPercent,
    setCustomPromoPercent,
    deletingAppliance,
    setDeletingAppliance,
    filteredCatalog,
    openNewApplianceSheet,
    openEditApplianceSheet,
    handleSaveApplianceForm,
    openPromoModal,
    handleApplyPromoDiscount,
    handleConfirmDeleteAppliance,
  };
}

export type CatalogApi = ReturnType<typeof useCatalog>;
