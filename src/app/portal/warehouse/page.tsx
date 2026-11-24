"use client";

import { useState } from "react";
import BottomActionBar from "./components/BottomActionBar";
import ComplianceBanner from "./components/ComplianceBanner";
import DispatchTab from "./components/DispatchTab";
import FulfillmentTab from "./components/FulfillmentTab";
import InventoryTab from "./components/InventoryTab";
import ManifestPrintModal from "./components/ManifestPrintModal";
import PickSlipModal from "./components/PickSlipModal";
import RestockModal from "./components/RestockModal";
import TabNav from "./components/TabNav";
import TopHeader from "./components/TopHeader";
import Toast from "./components/ui/Toast";
import { useFulfillment } from "./hooks/useFulfillment";
import { useInventory } from "./hooks/useInventory";
import { useToast } from "./hooks/useToast";
import type { WarehouseTab } from "./types";

export default function VoltCraftWarehousePortalPage() {
  const [activeTab, setActiveTab] = useState<WarehouseTab>("fulfillment");

  const { toast, triggerToast, dismissToast } = useToast();
  const inventoryApi = useInventory(triggerToast);
  const fulfillmentApi = useFulfillment(
    inventoryApi.setInventory,
    triggerToast,
  );

  const {
    filteredInventory,
    handleConfirmRestockIntake,
    inventory,
    inventoryFilter,
    inventoryMetrics,
    inventorySearchQuery,
    openRestockIntakeModal,
    restockBatchCode,
    restockModalItem,
    restockQty,
    restockSupplierNote,
    setInventoryFilter,
    setInventorySearchQuery,
    setRestockBatchCode,
    setRestockModalItem,
    setRestockQty,
    setRestockSupplierNote,
  } = inventoryApi;

  const {
    filteredOrders,
    fulfillmentFilter,
    fulfillmentMetrics,
    handleDispatchEntireRoute,
    handleDispatchOrder,
    handleManualSerialChange,
    handleMarkOrderPacked,
    handleSimulateBarcodeScan,
    orderSearchQuery,
    orders,
    pickSlipModalOrder,
    printableManifestOrder,
    printableRouteSheet,
    scanningTarget,
    selectedRouteFilter,
    setFulfillmentFilter,
    setOrderSearchQuery,
    setPickSlipModalOrder,
    setPrintableManifestOrder,
    setPrintableRouteSheet,
    setSelectedRouteFilter,
  } = fulfillmentApi;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 pb-28">
      {/* A. Sticky header + tab navigation */}
      <div className="sticky top-0 z-40 shadow-xl">
        <TopHeader
          setActiveTab={setActiveTab}
          setFulfillmentFilter={setFulfillmentFilter}
          fulfillmentMetrics={fulfillmentMetrics}
        />
        <TabNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          fulfillmentMetrics={fulfillmentMetrics}
          inventoryMetrics={inventoryMetrics}
          openRestockIntakeModal={openRestockIntakeModal}
        />
      </div>

      {/* Main operational workspace */}
      <main className="max-w-7xl mx-auto px-4 pt-4">
        <ComplianceBanner />

        {activeTab === "fulfillment" && (
          <FulfillmentTab
            fulfillmentFilter={fulfillmentFilter}
            setFulfillmentFilter={setFulfillmentFilter}
            orderSearchQuery={orderSearchQuery}
            setOrderSearchQuery={setOrderSearchQuery}
            scanningTarget={scanningTarget}
            setPickSlipModalOrder={setPickSlipModalOrder}
            fulfillmentMetrics={fulfillmentMetrics}
            filteredOrders={filteredOrders}
            handleManualSerialChange={handleManualSerialChange}
            handleSimulateBarcodeScan={handleSimulateBarcodeScan}
            handleMarkOrderPacked={handleMarkOrderPacked}
            handleDispatchOrder={handleDispatchOrder}
          />
        )}

        {activeTab === "inventory" && (
          <InventoryTab
            inventoryFilter={inventoryFilter}
            setInventoryFilter={setInventoryFilter}
            inventorySearchQuery={inventorySearchQuery}
            setInventorySearchQuery={setInventorySearchQuery}
            filteredInventory={filteredInventory}
            openRestockIntakeModal={openRestockIntakeModal}
          />
        )}

        {activeTab === "dispatch" && (
          <DispatchTab
            orders={orders}
            selectedRouteFilter={selectedRouteFilter}
            setSelectedRouteFilter={setSelectedRouteFilter}
            setPrintableManifestOrder={setPrintableManifestOrder}
            setPrintableRouteSheet={setPrintableRouteSheet}
            handleDispatchOrder={handleDispatchOrder}
            handleDispatchEntireRoute={handleDispatchEntireRoute}
          />
        )}
      </main>

      {/* B. Mobile bottom action bar */}
      <BottomActionBar
        setActiveTab={setActiveTab}
        setInventoryFilter={setInventoryFilter}
        inventoryMetrics={inventoryMetrics}
        openRestockIntakeModal={openRestockIntakeModal}
      />

      {/* Modals */}
      {restockModalItem && (
        <RestockModal
          inventory={inventory}
          restockModalItem={restockModalItem}
          setRestockModalItem={setRestockModalItem}
          restockQty={restockQty}
          setRestockQty={setRestockQty}
          restockBatchCode={restockBatchCode}
          setRestockBatchCode={setRestockBatchCode}
          restockSupplierNote={restockSupplierNote}
          setRestockSupplierNote={setRestockSupplierNote}
          handleConfirmRestockIntake={handleConfirmRestockIntake}
        />
      )}

      {pickSlipModalOrder && (
        <PickSlipModal
          pickSlipModalOrder={pickSlipModalOrder}
          setPickSlipModalOrder={setPickSlipModalOrder}
          triggerToast={triggerToast}
        />
      )}

      {(printableManifestOrder || printableRouteSheet) && (
        <ManifestPrintModal
          orders={orders}
          printableManifestOrder={printableManifestOrder}
          setPrintableManifestOrder={setPrintableManifestOrder}
          printableRouteSheet={printableRouteSheet}
          setPrintableRouteSheet={setPrintableRouteSheet}
          triggerToast={triggerToast}
        />
      )}

      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
