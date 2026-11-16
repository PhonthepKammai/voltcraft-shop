import { Package } from "lucide-react";
import type { CatalogApi } from "../hooks/useCatalog";
import ApplianceCard from "./ApplianceCard";
import CatalogToolbar from "./CatalogToolbar";

interface CatalogTabProps {
  catalogApi: CatalogApi;
}

export default function CatalogTab({ catalogApi }: CatalogTabProps) {
  const {
    catalog,
    catalogCategory,
    setCatalogCategory,
    catalogSearchQuery,
    setCatalogSearchQuery,
    onlyPromoItems,
    setOnlyPromoItems,
    filteredCatalog,
    openNewApplianceSheet,
    openEditApplianceSheet,
    openPromoModal,
    setDeletingAppliance,
  } = catalogApi;

  return (
    <section aria-label="Product Catalog Management" className="space-y-4">
      <CatalogToolbar
        catalog={catalog}
        catalogCategory={catalogCategory}
        setCatalogCategory={setCatalogCategory}
        catalogSearchQuery={catalogSearchQuery}
        setCatalogSearchQuery={setCatalogSearchQuery}
        onlyPromoItems={onlyPromoItems}
        setOnlyPromoItems={setOnlyPromoItems}
        onNewAppliance={openNewApplianceSheet}
      />

      {/* Appliance Catalog Grid */}
      {filteredCatalog.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No Appliances Match Your Filter
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try clearing your SKU search query or switching category tabs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCatalog.map((appliance) => (
            <ApplianceCard
              key={appliance.id}
              appliance={appliance}
              onEdit={openEditApplianceSheet}
              onPromo={openPromoModal}
              onDelete={setDeletingAppliance}
            />
          ))}
        </div>
      )}
    </section>
  );
}
