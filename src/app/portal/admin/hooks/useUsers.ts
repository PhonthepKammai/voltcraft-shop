import React, { useMemo, useState } from "react";
import { DEFAULT_NEW_PASSWORD } from "../constants";
import { INITIAL_USERS } from "../mockData";
import type {
  AccountStatus,
  DepartmentType,
  RoleType,
  ToastType,
  UserAccount,
} from "../types";
import type { AppendAuditLog } from "./useAuditLog";

export function useUsers(
  globalSearch: string,
  appendAuditLog: AppendAuditLog,
  triggerToast: (message: string, type?: ToastType) => void
) {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);

  const [userSearch, setUserSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<"All" | DepartmentType>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | AccountStatus>("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUserRoles, setEditingUserRoles] = useState<UserAccount | null>(
    null
  );

  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState(DEFAULT_NEW_PASSWORD);
  const [newDepartment, setNewDepartment] = useState<DepartmentType>("Sales");
  const [newRoles, setNewRoles] = useState<RoleType[]>(["Sales", "Customer"]);
  const [formError, setFormError] = useState("");

  const [tempEditedRoles, setTempEditedRoles] = useState<RoleType[]>([]);
  const [tempEditedDept, setTempEditedDept] =
    useState<DepartmentType>("Sales");

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
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return a.fullName.localeCompare(b.fullName);
        }
        return b.fullName.localeCompare(a.fullName);
      });
  }, [users, userSearch, globalSearch, deptFilter, statusFilter, sortOrder]);

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
    triggerToast(`User account ${user.fullName} removed from registry`, "warning");
  };

  const openEditRolesModal = (user: UserAccount) => {
    setEditingUserRoles(user);
    setTempEditedRoles([...user.roles]);
    setTempEditedDept(user.department);
  };

  const handleToggleTempRole = (role: RoleType) => {
    setTempEditedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSaveEditedRoles = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserRoles) return;
    if (tempEditedRoles.length === 0) {
      triggerToast("A user must have at least one assigned role", "warning");
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUserRoles.id
          ? {
              ...u,
              roles: tempEditedRoles,
              department: tempEditedDept,
              accountType: tempEditedRoles.some((r) => r !== "Customer")
                ? "Corporate"
                : "Personal",
            }
          : u
      )
    );

    appendAuditLog(
      "ROLE_MODIFIED",
      `Updated RBAC roles for ${editingUserRoles.fullName}: [${tempEditedRoles.join(
        ", "
      )}] | Dept: ${tempEditedDept}`
    );
    triggerToast(`Staff role permissions updated for ${editingUserRoles.fullName}`);
    setEditingUserRoles(null);
  };

  const handleToggleNewUserRole = (role: RoleType) => {
    setNewRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleCreateStaffAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const trimmedName = newFullName.trim();
    const trimmedEmail = newEmail.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      setFormError("Please enter both Full Name and Corporate Email.");
      return;
    }

    if (newRoles.length === 0) {
      setFormError("Select at least one RBAC role for this account.");
      return;
    }

    const emailExists = users.some(
      (u) => u.email.toLowerCase() === trimmedEmail
    );
    if (emailExists) {
      setFormError(
        "Email duplication prevented: This email already exists. Assign additional roles to the existing account instead."
      );
      return;
    }

    const newUser: UserAccount = {
      id: `USR-${1001 + users.length}`,
      fullName: trimmedName,
      email: trimmedEmail,
      accountType: newRoles.some((r) => r !== "Customer")
        ? "Corporate"
        : "Personal",
      department: newDepartment,
      roles: newRoles,
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

    setNewFullName("");
    setNewEmail("");
    setNewPassword(DEFAULT_NEW_PASSWORD);
    setNewDepartment("Sales");
    setNewRoles(["Sales", "Customer"]);
    setIsAddUserModalOpen(false);
  };

  return {
    users,
    userSearch,
    setUserSearch,
    deptFilter,
    setDeptFilter,
    statusFilter,
    setStatusFilter,
    sortOrder,
    setSortOrder,
    filteredUsers,
    isAddUserModalOpen,
    setIsAddUserModalOpen,
    editingUserRoles,
    setEditingUserRoles,
    newFullName,
    setNewFullName,
    newEmail,
    setNewEmail,
    newPassword,
    setNewPassword,
    newDepartment,
    setNewDepartment,
    newRoles,
    formError,
    tempEditedRoles,
    tempEditedDept,
    setTempEditedDept,
    handleToggleUserStatus,
    handleDispatchPasswordReset,
    handleDeleteUser,
    openEditRolesModal,
    handleToggleTempRole,
    handleSaveEditedRoles,
    handleToggleNewUserRole,
    handleCreateStaffAccount,
  };
}
