import type { Dispatch, SetStateAction } from "react";
import { Search, Filter, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { THEME } from "../theme";
import type { DepartmentType, AccountStatus, UserAccount } from "../types";
import UserMobileCard from "./UserMobileCard";
import UserTableRow from "./UserTableRow";

interface UsersTabProps {
  userSearch: string;
  setUserSearch: Dispatch<SetStateAction<string>>;
  deptFilter: "All" | DepartmentType;
  setDeptFilter: Dispatch<SetStateAction<"All" | DepartmentType>>;
  statusFilter: "All" | AccountStatus;
  setStatusFilter: Dispatch<SetStateAction<"All" | AccountStatus>>;
  sortOrder: "asc" | "desc";
  setSortOrder: Dispatch<SetStateAction<"asc" | "desc">>;
  filteredUsers: UserAccount[];
  handleToggleUserStatus: (user: UserAccount) => void;
  handleDispatchPasswordReset: (user: UserAccount) => void;
  handleDeleteUser: (user: UserAccount) => void;
  openEditRolesModal: (user: UserAccount) => void;
}

export default function UsersTab({
  userSearch,
  setUserSearch,
  deptFilter,
  setDeptFilter,
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder,
  filteredUsers,
  handleToggleUserStatus,
  handleDispatchPasswordReset,
  handleDeleteUser,
  openEditRolesModal,
}: UsersTabProps) {
  return (
    <section className={`${THEME.colors.surface} overflow-hidden`}>
      {/* Mobile-First Filter Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              User & RBAC Multi-Role Directory
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              {filteredUsers.length} Accounts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Assign multiple roles (e.g.,{" "}
            <code className="text-slate-700 font-semibold">
              [Sales] + [Customer]
            </code>
            ) to a single email to prevent database duplication.
          </p>
        </div>

        {/* Responsive Filter Grid */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search name, email, role..."
              className="w-full pl-8 pr-3 py-2.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2">
              <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <select
                value={deptFilter}
                onChange={(e) =>
                  setDeptFilter(e.target.value as "All" | DepartmentType)
                }
                className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All">Dept: All</option>
                <option value="Admin">Super Admin</option>
                <option value="Sales">Sales Team</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Customer">Customer</option>
              </select>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "All" | AccountStatus
                  )
                }
                className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <button
              onClick={() =>
                setSortOrder((prev) =>
                  prev === "asc" ? "desc" : "asc"
                )
              }
              className="col-span-2 sm:col-span-1 justify-center px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort {sortOrder === "asc" ? "A–Z" : "Z–A"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE CARD LIST (< lg) */}
      <div className="divide-y divide-slate-200 lg:hidden">
        {filteredUsers.map((user) => (
          <UserMobileCard
            key={user.id}
            user={user}
            handleToggleUserStatus={handleToggleUserStatus}
            handleDispatchPasswordReset={handleDispatchPasswordReset}
            handleDeleteUser={handleDeleteUser}
            openEditRolesModal={openEditRolesModal}
          />
        ))}
      </div>

      {/* DESKTOP DATA TABLE (>= lg) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-5">User Identity & Email</th>
              <th className="py-3.5 px-4">Assigned RBAC Roles</th>
              <th className="py-3.5 px-4">Operational Status</th>
              <th className="py-3.5 px-4">Last Session & Created</th>
              <th className="py-3.5 px-5 text-right">
                Governance Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {filteredUsers.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                handleToggleUserStatus={handleToggleUserStatus}
                handleDispatchPasswordReset={handleDispatchPasswordReset}
                handleDeleteUser={handleDeleteUser}
                openEditRolesModal={openEditRolesModal}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
