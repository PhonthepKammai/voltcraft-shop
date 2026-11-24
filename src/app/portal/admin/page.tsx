"use client";

import { useState } from "react";
import AddStaffModal from "./components/AddStaffModal";
import AuditTab from "./components/AuditTab";
import BottomNav from "./components/BottomNav";
import CatalogTab from "./components/CatalogTab";
import EditRolesModal from "./components/EditRolesModal";
import KpiGrid from "./components/KpiGrid";
import MobileDrawer from "./components/MobileDrawer";
import OverviewTab from "./components/OverviewTab";
import SidebarContent from "./components/SidebarContent";
import TopBar from "./components/TopBar";
import UsersTab from "./components/UsersTab";
import Toast from "@/components/ui/Toast";
import { useAuditLog } from "./hooks/useAuditLog";
import { useCatalog } from "./hooks/useCatalog";
import { useKpiStats } from "./hooks/useKpiStats";
import { useToast } from "@/app/hooks/useToast";
import { useUsers } from "./hooks/useUsers";
import { THEME } from "./theme";
import type { NavTab } from "./types";
import { getPageMeta } from "./utils";

export default function VoltCraftSuperAdminHub() {
  // Navigation & mobile drawer state
  const [activeTab, setActiveTab] = useState<NavTab>("users");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Domain hooks
  const { toast, showToast, dismissToast } = useToast();
  const auditApi = useAuditLog(globalSearch);
  const usersApi = useUsers(
    globalSearch,
    auditApi.appendAuditLog,
    showToast,
  );
  const catalogApi = useCatalog(
    globalSearch,
    auditApi.appendAuditLog,
    showToast,
  );
  const kpiStats = useKpiStats(usersApi.users, catalogApi.appliances);
  const pageMeta = getPageMeta(activeTab);

  const {
    deptFilter,
    editingUserRoles,
    filteredUsers,
    formError,
    handleCreateStaffAccount,
    handleDeleteUser,
    handleDispatchPasswordReset,
    handleSaveEditedRoles,
    handleToggleNewUserRole,
    handleToggleTempRole,
    handleToggleUserStatus,
    isAddUserModalOpen,
    newDepartment,
    newEmail,
    newFullName,
    newPassword,
    newRoles,
    openEditRolesModal,
    setDeptFilter,
    setEditingUserRoles,
    setIsAddUserModalOpen,
    setNewDepartment,
    setNewEmail,
    setNewFullName,
    setNewPassword,
    setSortOrder,
    setStatusFilter,
    setTempEditedDept,
    setUserSearch,
    sortOrder,
    statusFilter,
    tempEditedDept,
    tempEditedRoles,
    userSearch,
    users,
  } = usersApi;

  const {
    appliances,
    catalogSearch,
    categoryFilter,
    editingThresholdId,
    filteredAppliances,
    handleQuickEmergencyRestock,
    handleSaveSafetyThreshold,
    handleTogglePublishAppliance,
    setCatalogSearch,
    setCategoryFilter,
    setEditingThresholdId,
    setTempThresholdValue,
    tempThresholdValue,
  } = catalogApi;

  const {
    auditEventFilter,
    auditLogs,
    filteredAuditLogs,
    setAuditEventFilter,
  } = auditApi;

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    setIsNotificationOpen(false);
  };

  const sidebar = (
    <SidebarContent
      activeTab={activeTab}
      handleSelectTab={handleSelectTab}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      kpiStats={kpiStats}
      triggerToast={showToast}
      users={users}
      auditLogs={auditLogs}
    />
  );

  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row ${THEME.colors.pageBg} text-slate-900`}
    >
      <Toast toast={toast} onDismiss={dismissToast} />

      {/* Mobile slide-over drawer (< lg) */}
      {isMobileMenuOpen && (
        <MobileDrawer onClose={() => setIsMobileMenuOpen(false)}>
          {sidebar}
        </MobileDrawer>
      )}

      {/* Desktop persistent sidebar (>= lg) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:sticky lg:top-0 lg:h-screen bg-slate-950 text-slate-100 shrink-0 border-r border-slate-800 select-none">
        {sidebar}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          isNotificationOpen={isNotificationOpen}
          setIsNotificationOpen={setIsNotificationOpen}
          setIsAddUserModalOpen={setIsAddUserModalOpen}
          kpiStats={kpiStats}
          pageMeta={pageMeta}
        />

        {/* Workspace body */}
        <main className="p-4 pb-24 sm:p-6 sm:pb-24 lg:pb-8 space-y-5 lg:space-y-6 max-w-[1600px] w-full mx-auto">
          <KpiGrid
            appliances={appliances}
            auditLogs={auditLogs}
            kpiStats={kpiStats}
          />

          {activeTab === "overview" && (
            <OverviewTab
              appliances={appliances}
              handleSelectTab={handleSelectTab}
              handleQuickEmergencyRestock={handleQuickEmergencyRestock}
            />
          )}

          {activeTab === "users" && (
            <UsersTab
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              deptFilter={deptFilter}
              setDeptFilter={setDeptFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              filteredUsers={filteredUsers}
              handleToggleUserStatus={handleToggleUserStatus}
              handleDispatchPasswordReset={handleDispatchPasswordReset}
              handleDeleteUser={handleDeleteUser}
              openEditRolesModal={openEditRolesModal}
            />
          )}

          {activeTab === "catalog" && (
            <CatalogTab
              catalogSearch={catalogSearch}
              setCatalogSearch={setCatalogSearch}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              filteredAppliances={filteredAppliances}
              editingThresholdId={editingThresholdId}
              setEditingThresholdId={setEditingThresholdId}
              tempThresholdValue={tempThresholdValue}
              setTempThresholdValue={setTempThresholdValue}
              handleTogglePublishAppliance={handleTogglePublishAppliance}
              handleSaveSafetyThreshold={handleSaveSafetyThreshold}
              handleQuickEmergencyRestock={handleQuickEmergencyRestock}
            />
          )}

          {activeTab === "audit" && (
            <AuditTab
              auditLogs={auditLogs}
              auditEventFilter={auditEventFilter}
              setAuditEventFilter={setAuditEventFilter}
              filteredAuditLogs={filteredAuditLogs}
            />
          )}
        </main>
      </div>

      <BottomNav
        activeTab={activeTab}
        handleSelectTab={handleSelectTab}
        kpiStats={kpiStats}
      />

      {isAddUserModalOpen && (
        <AddStaffModal
          setIsAddUserModalOpen={setIsAddUserModalOpen}
          newFullName={newFullName}
          setNewFullName={setNewFullName}
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          newDepartment={newDepartment}
          setNewDepartment={setNewDepartment}
          newRoles={newRoles}
          formError={formError}
          handleToggleNewUserRole={handleToggleNewUserRole}
          handleCreateStaffAccount={handleCreateStaffAccount}
        />
      )}

      {editingUserRoles && (
        <EditRolesModal
          editingUserRoles={editingUserRoles}
          setEditingUserRoles={setEditingUserRoles}
          tempEditedRoles={tempEditedRoles}
          tempEditedDept={tempEditedDept}
          setTempEditedDept={setTempEditedDept}
          handleToggleTempRole={handleToggleTempRole}
          handleSaveEditedRoles={handleSaveEditedRoles}
        />
      )}
    </div>
  );
}
