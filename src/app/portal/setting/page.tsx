"use client";

import { useState } from "react";
import AddressModal from "./components/AddressModal";
import AddressesTab from "./components/AddressesTab";
import AppHeader from "./components/AppHeader";
import BindSerialModal from "./components/BindSerialModal";
import OrderInvoiceModal from "./components/OrderInvoiceModal";
import OrdersTab from "./components/OrdersTab";
import PersonalInfoTab from "./components/PersonalInfoTab";
import PortalSwitcherModal from "./components/PortalSwitcherModal";
import ProfileHero from "./components/ProfileHero";
import SecurityTab from "./components/SecurityTab";
import ServiceRequestModal from "./components/ServiceRequestModal";
import TabNav from "./components/TabNav";
import WarrantiesTab from "./components/WarrantiesTab";
import Toast from "./components/ui/Toast";
import { useAddresses } from "./hooks/useAddresses";
import { useOrders } from "./hooks/useOrders";
import { useProfile } from "./hooks/useProfile";
import { useSecurityForm } from "./hooks/useSecurityForm";
import { useToast } from "./hooks/useToast";
import { useWarranties } from "./hooks/useWarranties";
import type { ProfileTabId } from "./types";

export default function VoltCraftProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState<ProfileTabId>("personal");
  const [isPortalSwitcherOpen, setIsPortalSwitcherOpen] = useState(false);
  const [activePortalSimulation, setActivePortalSimulation] = useState<string | null>(null);

  const { toast, triggerToast } = useToast();
  const profileApi = useProfile(triggerToast);
  const { profile } = profileApi;
  const addressApi = useAddresses(profile, triggerToast);
  const ordersApi = useOrders();
  const warrantyApi = useWarranties(profile, triggerToast);
  const securityApi = useSecurityForm(triggerToast);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950 pb-20">
      <AppHeader
        SimulateCustomerOnlyMode={profileApi.SimulateCustomerOnlyMode}
        setSimulateCustomerOnlyMode={profileApi.setSimulateCustomerOnlyMode}
        triggerToast={triggerToast}
      />

      <ProfileHero
        profile={profile}
        userInitials={profileApi.userInitials}
        addressCount={addressApi.addresses.length}
        orderCount={ordersApi.orders.length}
        warrantyCount={warrantyApi.warranties.length}
        hasStaffRoles={profileApi.hasStaffRoles}
        setIsPortalSwitcherOpen={setIsPortalSwitcherOpen}
        activePortalSimulation={activePortalSimulation}
        setActivePortalSimulation={setActivePortalSimulation}
      />

      <main className="max-w-7xl mx-auto px-4 pt-4 sm:pt-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <TabNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            addressCount={addressApi.addresses.length}
            orderCount={ordersApi.orders.length}
            warrantyCount={warrantyApi.warranties.length}
          />

          <div className="flex-1 w-full min-w-0">
            {activeTab === "personal" && (
              <PersonalInfoTab
                profile={profile}
                nameInput={profileApi.nameInput}
                setNameInput={profileApi.setNameInput}
                phoneInput={profileApi.phoneInput}
                setPhoneInput={profileApi.setPhoneInput}
                windowInput={profileApi.windowInput}
                setWindowInput={profileApi.setWindowInput}
                lineAlertsInput={profileApi.lineAlertsInput}
                setLineAlertsInput={profileApi.setLineAlertsInput}
                smsAlertsInput={profileApi.smsAlertsInput}
                setSmsAlertsInput={profileApi.setSmsAlertsInput}
                handleSavePersonalInfo={profileApi.handleSavePersonalInfo}
              />
            )}

            {activeTab === "addresses" && (
              <AddressesTab
                addresses={addressApi.addresses}
                openAddAddressModal={addressApi.openAddAddressModal}
                openEditAddressModal={addressApi.openEditAddressModal}
                handleSetDefaultAddress={addressApi.handleSetDefaultAddress}
                handleDeleteAddress={addressApi.handleDeleteAddress}
              />
            )}

            {activeTab === "orders" && (
              <OrdersTab
                orders={ordersApi.orders}
                setSelectedOrderModal={ordersApi.setSelectedOrderModal}
              />
            )}

            {activeTab === "warranties" && (
              <WarrantiesTab
                warranties={warrantyApi.warranties}
                setServiceTargetWarranty={warrantyApi.setServiceTargetWarranty}
                setIsBindSerialModalOpen={warrantyApi.setIsBindSerialModalOpen}
                triggerToast={triggerToast}
              />
            )}

            {activeTab === "security" && (
              <SecurityTab
                currentPassword={securityApi.currentPassword}
                setCurrentPassword={securityApi.setCurrentPassword}
                newPassword={securityApi.newPassword}
                setNewPassword={securityApi.setNewPassword}
                confirmNewPassword={securityApi.confirmNewPassword}
                setConfirmNewPassword={securityApi.setConfirmNewPassword}
                handleUpdatePassword={securityApi.handleUpdatePassword}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {addressApi.isAddressModalOpen && (
        <AddressModal
          editingAddressId={addressApi.editingAddressId}
          addrForm={addressApi.addrForm}
          setAddrForm={addressApi.setAddrForm}
          setIsAddressModalOpen={addressApi.setIsAddressModalOpen}
          handleSaveAddress={addressApi.handleSaveAddress}
        />
      )}

      {isPortalSwitcherOpen && (
        <PortalSwitcherModal
          profile={profile}
          setIsPortalSwitcherOpen={setIsPortalSwitcherOpen}
          setActivePortalSimulation={setActivePortalSimulation}
          triggerToast={triggerToast}
        />
      )}

      {ordersApi.selectedOrderModal && (
        <OrderInvoiceModal
          profile={profile}
          selectedOrderModal={ordersApi.selectedOrderModal}
          setSelectedOrderModal={ordersApi.setSelectedOrderModal}
          triggerToast={triggerToast}
        />
      )}

      {warrantyApi.serviceTargetWarranty && (
        <ServiceRequestModal
          serviceTargetWarranty={warrantyApi.serviceTargetWarranty}
          setServiceTargetWarranty={warrantyApi.setServiceTargetWarranty}
          serviceIssueNote={warrantyApi.serviceIssueNote}
          setServiceIssueNote={warrantyApi.setServiceIssueNote}
          servicePreferredDate={warrantyApi.servicePreferredDate}
          setServicePreferredDate={warrantyApi.setServicePreferredDate}
          handleSubmitTechnicianService={warrantyApi.handleSubmitTechnicianService}
        />
      )}

      {warrantyApi.isBindSerialModalOpen && (
        <BindSerialModal
          setIsBindSerialModalOpen={warrantyApi.setIsBindSerialModalOpen}
          newSerialCode={warrantyApi.newSerialCode}
          setNewSerialCode={warrantyApi.setNewSerialCode}
          newSerialModel={warrantyApi.newSerialModel}
          setNewSerialModel={warrantyApi.setNewSerialModel}
          handleBindNewSerial={warrantyApi.handleBindNewSerial}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
