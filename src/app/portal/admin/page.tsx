"use client";

import React, { useState, useMemo } from "react";
import {
  NavTab,
  UserAccount,
  ApplianceItem,
  AuditLogEntry,
  DepartmentType,
  AccountStatus,
  AuditEventType,
  RoleType,
  ToastNotification,
  KpiStats,
} from "./types";
import { THEME } from "./theme";
import {
  INITIAL_USERS,
  INITIAL_APPLIANCES,
  INITIAL_AUDIT_LOGS,
} from "./admin-mock";
import { getCurrentFormattedTimestamp } from "./formatters";
import { ToastBanner } from "./components/ui/ToastBanner";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminTopBar } from "./components/AdminTopBar";
import { ExecutiveKpiGrid } from "./components/ExecutiveKpiGrid";
import { OverviewSection } from "./components/OverviewSection";
import { UserRbacTable } from "./components/UserRbacTable";
import { CatalogOversightTable } from "./components/CatalogOversightTable";
import { AuditLogTable } from "./components/AuditLogTable";
import { AddStaffModal } from "./components/AddStaffModal";
import { EditRolesModal } from "./components/EditRolesModal";

export default function VoltCraftSuperAdminHub() {
  // Navigation & Global Search State
  const [activeTab, setActiveTab] = useState<NavTab>("users");
  const [globalSearch, setGlobalSearch] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Core Data States
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [appliances, setAppliances] =
    useState<ApplianceItem[]>(INITIAL_APPLIANCES);
  const [auditLogs, setAuditLogs] =
    useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // User & RBAC Filter States
  const [userSearch, setUserSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<"All" | DepartmentType>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | AccountStatus>("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Catalog Filter States
  const [catalogSearch, setCatalogSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Audit Filter State
  const [auditEventFilter, setAuditEventFilter] = useState<
    "ALL" | AuditEventType
  >("ALL");

  // Modals State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUserRoles, setEditingUserRoles] = useState<UserAccount | null>(
    null
  );

  // Toast Notification State
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const triggerToast = (
    message: string,
    type: "success" | "warning" | "info" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3600);
  };

  const appendAuditLog = (
    eventType: AuditEventType,
    summary: string,
    operatorName = "Phonthep Kammai",
    operatorRole: RoleType = "Admin"
  ) => {
    const newEntry: AuditLogEntry = {
      id: `LOG-${9082 + auditLogs.length}`,
      timestamp: getCurrentFormattedTimestamp(),
      operatorName,
      operatorRole,
      eventType,
      summary,
      terminalIp: "10.24.01.01 (ADMIN-CORE-01)",
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Executive KPI Calculations
  const kpiStats: KpiStats = useMemo(() => {
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

  // Filtered Datasets
  const filteredUsers = useMemo(() => {
    const query = (userSearch || globalSearch).trim().toLowerCase();
    return users
      .filter((u) => {
        if (deptFilter !== "All" && u.department !== deptFilter) return false;
        if (statusFilter !== "All" && u.status !== statusFilter) return false;
        if (query) {
          const matchName = u.fullName.toLowerCase().includes(query);
          const matchEmail = u.email.toLowerCase().includes(query);
          const matchId = u.id.toLowerCase().includes(query);
          const matchRole = u.roles.some((r) =>
            r.toLowerCase().includes(query)
          );
          return matchName || matchEmail || matchId || matchRole;
        }
        return true;
      })
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.fullName.localeCompare(b.fullName)
          : b.fullName.localeCompare(a.fullName)
      );
  }, [users, userSearch, globalSearch, deptFilter, statusFilter, sortOrder]);

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

  const filteredAuditLogs = useMemo(() => {
    const query = globalSearch.trim().toLowerCase();
    return auditLogs.filter((entry) => {
      if (
        auditEventFilter !== "ALL" &&
        entry.eventType !== auditEventFilter
      ) {
        return false;
      }
      if (query) {
        return (
          entry.summary.toLowerCase().includes(query) ||
          entry.operatorName.toLowerCase().includes(query) ||
          entry.eventType.toLowerCase().includes(query) ||
          entry.id.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [auditLogs, auditEventFilter, globalSearch]);

  // Interactive Handlers: Users & RBAC
  const handleToggleUserStatus = (user: UserAccount) => {
    const nextStatus: AccountStatus =
      user.status === "Active" ? "Suspended" : "Active";
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    appendAuditLog(
      "ROLE_MODIFIED",
      `Changed account operational status for ${user.fullName} (${user.email}) to [${nextStatus}]`
    );
    triggerToast(
      `Account ${user.fullName} marked as ${nextStatus}`,
      nextStatus === "Active" ? "success" : "warning"
    );
  };

  const handleDispatchPasswordReset = (user: UserAccount) => {
    appendAuditLog(
      "ROLE_MODIFIED",
      `Dispatched encrypted 2FA password reset token to ${user.email}`
    );
    triggerToast(`Password reset token dispatched to ${user.email}`, "info");
  };

  const handleDeleteUser = (user: UserAccount) => {
    if (user.id === "USR-1001") {
      triggerToast("Cannot delete primary Super Admin root account", "warning");
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    appendAuditLog(
      "ROLE_MODIFIED",
      `Revoked and purged account ${user.fullName} (${user.email}) from RBAC registry`
    );
    triggerToast(
      `User account ${user.fullName} removed from registry`,
      "warning"
    );
  };

  const handleSaveEditedRoles = (
    user: UserAccount,
    updatedRoles: RoleType[],
    updatedDept: DepartmentType
  ) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? {
              ...u,
              roles: updatedRoles,
              department: updatedDept,
              accountType: updatedRoles.some((r) => r !== "Customer")
                ? "Corporate"
                : "Personal",
            }
          : u
      )
    );

    appendAuditLog(
      "ROLE_MODIFIED",
      `Updated RBAC roles for ${user.fullName}: [${updatedRoles.join(
        ", "
      )}] | Dept: ${updatedDept}`
    );
    triggerToast(`Staff role permissions updated for ${user.fullName}`);
    setEditingUserRoles(null);
  };

  const handleCreateStaffAccount = (payload: {
    fullName: string;
    email: string;
    department: DepartmentType;
    roles: RoleType[];
  }) => {
    const newUser: UserAccount = {
      id: `USR-${1001 + users.length}`,
      fullName: payload.fullName,
      email: payload.email,
      accountType: payload.roles.some((r) => r !== "Customer")
        ? "Corporate"
        : "Personal",
      department: payload.department,
      roles: payload.roles,
      status: "Active",
      lastSession: "Never (Provisioned Today)",
      createdAt: "2026-11-11",
    };

    setUsers((prev) => [newUser, ...prev]);
    appendAuditLog(
      "ROLE_MODIFIED",
      `Provisioned new account ${newUser.fullName} (${
        newUser.email
      }) with roles [${newUser.roles.join(", ")}]`
    );
    triggerToast(`New staff account ${newUser.fullName} provisioned`);
  };

  // Interactive Handlers: Catalog Oversight
  const handleTogglePublishAppliance = (item: ApplianceItem) => {
    const nextState = !item.published;
    setAppliances((prev) =>
      prev.map((a) =>
        a.id === item.id ? { ...a, published: nextState } : a
      )
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

  const handleSaveSafetyThreshold = (
    item: ApplianceItem,
    newThreshold: number
  ) => {
    const safeVal = Math.max(1, newThreshold);
    setAppliances((prev) =>
      prev.map((a) =>
        a.id === item.id ? { ...a, lowStockThreshold: safeVal } : a
      )
    );
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

  const activeBreadcrumb = useMemo(() => {
    switch (activeTab) {
      case "overview":
        return "VoltCraft Hub / Governance / Overview & Operational KPIs";
      case "users":
        return "VoltCraft Hub / Governance / User & RBAC Access Control";
      case "catalog":
        return "VoltCraft Hub / Governance / Master Catalog & Inventory Oversight";
      case "audit":
        return "VoltCraft Hub / Governance / System Security Audit Logs";
    }
  }, [activeTab]);

  return (
    <div className={`min-h-screen flex ${THEME.colors.pageBg} text-slate-900`}>
      <ToastBanner toast={toast} onDismiss={() => setToast(null)} />

      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        userCount={users.length}
        lowStockCount={kpiStats.lowStockCount}
        auditLogCount={auditLogs.length}
        onSignOut={() =>
          triggerToast(
            "Session locked. Re-authentication required for production sign-out.",
            "info"
          )
        }
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar
          breadcrumb={activeBreadcrumb}
          globalSearch={globalSearch}
          onGlobalSearchChange={setGlobalSearch}
          isNotificationOpen={isNotificationOpen}
          onToggleNotifications={() => setIsNotificationOpen((prev) => !prev)}
          lowStockCount={kpiStats.lowStockCount}
          onOpenAddUserModal={() => setIsAddUserModalOpen(true)}
        />

        <main className="p-6 space-y-6 max-w-[1600px] w-full mx-auto">
          <ExecutiveKpiGrid
            kpiStats={kpiStats}
            activeSkuCount={appliances.length}
            auditLogCount={auditLogs.length}
          />

          {activeTab === "overview" && (
            <OverviewSection
              appliances={appliances}
              onNavigateTab={setActiveTab}
              onQuickEmergencyRestock={handleQuickEmergencyRestock}
            />
          )}

          {activeTab === "users" && (
            <UserRbacTable
              users={filteredUsers}
              userSearch={userSearch}
              onUserSearchChange={setUserSearch}
              deptFilter={deptFilter}
              onDeptFilterChange={setDeptFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              sortOrder={sortOrder}
              onToggleSortOrder={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              onToggleUserStatus={handleToggleUserStatus}
              onOpenEditRoles={setEditingUserRoles}
              onDispatchPasswordReset={handleDispatchPasswordReset}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {activeTab === "catalog" && (
            <CatalogOversightTable
              appliances={filteredAppliances}
              catalogSearch={catalogSearch}
              onCatalogSearchChange={setCatalogSearch}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              onSaveSafetyThreshold={handleSaveSafetyThreshold}
              onQuickEmergencyRestock={handleQuickEmergencyRestock}
              onTogglePublishAppliance={handleTogglePublishAppliance}
            />
          )}

          {activeTab === "audit" && (
            <AuditLogTable
              logs={filteredAuditLogs}
              totalLogsCount={auditLogs.length}
              auditEventFilter={auditEventFilter}
              onAuditEventFilterChange={setAuditEventFilter}
            />
          )}
        </main>
      </div>

      <AddStaffModal
        isOpen={isAddUserModalOpen}
        existingUsers={users}
        onClose={() => setIsAddUserModalOpen(false)}
        onCreateAccount={handleCreateStaffAccount}
      />

      <EditRolesModal
        user={editingUserRoles}
        onClose={() => setEditingUserRoles(null)}
        onSaveRoles={handleSaveEditedRoles}
        onValidationError={(msg) => triggerToast(msg, "warning")}
      />
    </div>
  );
}