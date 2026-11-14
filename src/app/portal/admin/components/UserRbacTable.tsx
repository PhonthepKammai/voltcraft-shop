import React from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Edit,
  Key,
  Lock,
  Trash2,
} from "lucide-react";
import {
  UserAccount,
  DepartmentType,
  AccountStatus,
} from "../types";
import { THEME } from "../theme";
import { RoleBadge } from "./ui/RoleBadge";
import { StatusBadge } from "./ui/StatusBadge";
import { UserAvatar } from "./ui/UserAvatar";

interface UserRbacTableProps {
  users: UserAccount[];
  userSearch: string;
  onUserSearchChange: (val: string) => void;
  deptFilter: "All" | DepartmentType;
  onDeptFilterChange: (val: "All" | DepartmentType) => void;
  statusFilter: "All" | AccountStatus;
  onStatusFilterChange: (val: "All" | AccountStatus) => void;
  sortOrder: "asc" | "desc";
  onToggleSortOrder: () => void;
  onToggleUserStatus: (user: UserAccount) => void;
  onOpenEditRoles: (user: UserAccount) => void;
  onDispatchPasswordReset: (user: UserAccount) => void;
  onDeleteUser: (user: UserAccount) => void;
}

export function UserRbacTable({
  users,
  userSearch,
  onUserSearchChange,
  deptFilter,
  onDeptFilterChange,
  statusFilter,
  onStatusFilterChange,
  sortOrder,
  onToggleSortOrder,
  onToggleUserStatus,
  onOpenEditRoles,
  onDispatchPasswordReset,
  onDeleteUser,
}: UserRbacTableProps) {
  return (
    <section className={`${THEME.colors.surface} overflow-hidden`}>
      {/* Toolbar Header */}
      <div className="p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900">
              User & RBAC Multi-Role Directory
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              {users.length} Accounts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign multiple roles (e.g.,{" "}
            <code className="text-slate-700 font-semibold">
              [Sales] + [Customer]
            </code>
            ) to a single corporate email to prevent database duplication.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Instant Search by Name/Email */}
          <div className="relative w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => onUserSearchChange(e.target.value)}
              placeholder="Search name, email, role..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500"
            />
          </div>

          {/* Department Filter Dropdown */}
          <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={deptFilter}
              onChange={(e) =>
                onDeptFilterChange(e.target.value as "All" | DepartmentType)
              }
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">Dept: All Roles</option>
              <option value="Admin">Dept: Super Admin</option>
              <option value="Sales">Dept: Sales Team</option>
              <option value="Warehouse">Dept: Warehouse Ops</option>
              <option value="Customer">Dept: Customer</option>
            </select>
          </div>

          {/* Status Filter Dropdown */}
          <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(e.target.value as "All" | AccountStatus)
              }
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">Status: All</option>
              <option value="Active">Status: Active</option>
              <option value="Suspended">Status: Suspended</option>
            </select>
          </div>

          {/* Sort Order Button */}
          <button
            type="button"
            onClick={onToggleSortOrder}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === "asc" ? "A–Z" : "Z–A"}</span>
          </button>
        </div>
      </div>

      {/* RBAC Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-5">User Identity & Email</th>
              <th className="py-3.5 px-4">Assigned RBAC Roles</th>
              <th className="py-3.5 px-4">Operational Status</th>
              <th className="py-3.5 px-4">Last Session & Created</th>
              <th className="py-3.5 px-5 text-right">Governance Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-50/80 transition-colors"
              >
                {/* Column 1: User Info */}
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <UserAvatar fullName={user.fullName} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {user.fullName}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                            user.accountType === "Corporate"
                              ? "bg-slate-100 text-slate-700 border-slate-300"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {user.accountType}
                        </span>
                      </div>
                      <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                        {user.email} •{" "}
                        <span className="text-slate-400">{user.id}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Column 2: Assigned Multi-Roles */}
                <td className="py-4 px-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {user.roles.map((role) => (
                      <RoleBadge key={role} role={role} />
                    ))}
                  </div>
                </td>

                {/* Column 3: Operational Status */}
                <td className="py-4 px-4">
                  <StatusBadge
                    status={user.status}
                    onClick={() => onToggleUserStatus(user)}
                  />
                </td>

                {/* Column 4: Last Session & Creation Date */}
                <td className="py-4 px-4">
                  <div className="font-medium text-slate-800">
                    {user.lastSession}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Provisioned: {user.createdAt}
                  </div>
                </td>

                {/* Column 5: Actions */}
                <td className="py-4 px-5 text-right">
                  <div className="inline-flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenEditRoles(user)}
                      title="Edit Assigned RBAC Roles"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-slate-700 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-amber-600" />
                      <span>Roles</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDispatchPasswordReset(user)}
                      title="Dispatch Password Reset Token"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleUserStatus(user)}
                      title={
                        user.status === "Active"
                          ? "Suspend Account"
                          : "Reactivate Account"
                      }
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteUser(user)}
                      title="Remove User"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}