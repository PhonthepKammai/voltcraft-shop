"use client";

import { useState } from "react";
import ApplianceFormSheet from "./components/ApplianceFormSheet";
import BottomBar from "./components/BottomBar";
import CatalogTab from "./components/CatalogTab";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import FlagIssueModal from "./components/FlagIssueModal";
import OrdersTab from "./components/OrdersTab";
import PromoModal from "./components/PromoModal";
import RoleBanner from "./components/RoleBanner";
import SlipInspectorModal from "./components/SlipInspectorModal";
import TabSwitcher from "./components/TabSwitcher";
import TopBar from "./components/TopBar";
import BaseToast from "@/components/ui/BaseToast";
import { useCatalog } from "./hooks/useCatalog";
import { useOrders } from "./hooks/useOrders";
import { useToast } from "@/app/hooks/useToast";
import type { ActivePortalTab } from "./types";

export default function VoltCraftSalesPortalPage() {
  const [activeTab, setActiveTab] = useState<ActivePortalTab>("orders");
  const { toast, showToast, dismissToast } = useToast();
  const ordersApi = useOrders(showToast);
  const catalogApi = useCatalog(showToast, () => setActiveTab("catalog"));

  const { orderCounts, orderSearchQuery, setOrderSearchQuery } = ordersApi;
  const { catalog, catalogSearchQuery, setCatalogSearchQuery, openNewApplianceSheet } =
    catalogApi;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950 pb-28">
      {/* A. Sticky top app bar + tab switcher */}
      <div className="sticky top-0 z-40 shadow-md">
        <TopBar
          orderCounts={orderCounts}
          onViewPending={() => {
            setActiveTab("orders");
            ordersApi.setOrderFilter("Pending Verification");
          }}
        />
        <TabSwitcher
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          orderCounts={orderCounts}
          catalogCount={catalog.length}
          onNewAppliance={openNewApplianceSheet}
        />
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 pt-4">
        <RoleBanner />
        {activeTab === "orders" && <OrdersTab ordersApi={ordersApi} />}
        {activeTab === "catalog" && <CatalogTab catalogApi={catalogApi} />}
      </main>

      {/* B. Mobile bottom action bar */}
      <BottomBar
        activeTab={activeTab}
        orderCounts={orderCounts}
        orderSearchQuery={orderSearchQuery}
        setOrderSearchQuery={setOrderSearchQuery}
        catalogSearchQuery={catalogSearchQuery}
        setCatalogSearchQuery={setCatalogSearchQuery}
        onNewAppliance={openNewApplianceSheet}
      />

      {/* Modals & sheets */}
      {catalogApi.isApplianceSheetOpen && (
        <ApplianceFormSheet
          editingApplianceId={catalogApi.editingApplianceId}
          formState={catalogApi.formState}
          setFormState={catalogApi.setFormState}
          onClose={() => catalogApi.setIsApplianceSheetOpen(false)}
          onSubmit={catalogApi.handleSaveApplianceForm}
        />
      )}

      {catalogApi.promoTargetAppliance && (
        <PromoModal
          promoTargetAppliance={catalogApi.promoTargetAppliance}
          customPromoPercent={catalogApi.customPromoPercent}
          setCustomPromoPercent={catalogApi.setCustomPromoPercent}
          onClose={() => catalogApi.setPromoTargetAppliance(null)}
          onApply={catalogApi.handleApplyPromoDiscount}
        />
      )}

      {ordersApi.inspectingSlipOrder && (
        <SlipInspectorModal
          inspectingSlipOrder={ordersApi.inspectingSlipOrder}
          onClose={() => ordersApi.setInspectingSlipOrder(null)}
          onApprove={ordersApi.handleApproveOrderToWarehouse}
        />
      )}

      {ordersApi.flaggingOrder && (
        <FlagIssueModal
          flaggingOrder={ordersApi.flaggingOrder}
          flagIssueReason={ordersApi.flagIssueReason}
          setFlagIssueReason={ordersApi.setFlagIssueReason}
          onClose={() => ordersApi.setFlaggingOrder(null)}
          onConfirm={ordersApi.handleConfirmFlagPaymentIssue}
        />
      )}

      {catalogApi.deletingAppliance && (
        <DeleteConfirmModal
          deletingAppliance={catalogApi.deletingAppliance}
          onClose={() => catalogApi.setDeletingAppliance(null)}
          onConfirm={catalogApi.handleConfirmDeleteAppliance}
        />
      )}

      <Toast toastMessage={toastMessage} onDismiss={dismissToast} />
    </div>
  );
}
