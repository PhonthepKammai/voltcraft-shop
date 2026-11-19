import { Edit, Trash2, Key, CheckCircle2, XCircle, Lock } from "lucide-react";
import { THEME } from "../theme";
import type { UserAccount } from "../types";
import { getInitials } from "../utils";

interface UserMobileCardProps {
  user: UserAccount;
  handleToggleUserStatus: (user: UserAccount) => void;
  handleDispatchPasswordReset: (user: UserAccount) => void;
  handleDeleteUser: (user: UserAccount) => void;
  openEditRolesModal: (user: UserAccount) => void;
}

export default function UserMobileCard({
  user,
  handleToggleUserStatus,
  handleDispatchPasswordReset,
  handleDeleteUser,
  openEditRolesModal,
}: UserMobileCardProps) {
  return (
    <div className="p-4 space-y-3">
      {/* Top Row: Avatar + Name + Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-extrabold flex items-center justify-center text-xs shrink-0 border border-slate-700">
            {getInitials(user.fullName)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold text-slate-900 text-sm truncate">
                {user.fullName}
              </span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-semibold ${
                  user.accountType === "Corporate"
                    ? "bg-slate-100 text-slate-700 border-slate-300"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                {user.accountType}
              </span>
            </div>
            <p className="text-slate-500 font-mono text-[11px] truncate mt-0.5">
              {user.email}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleToggleUserStatus(user)}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold border shrink-0 cursor-pointer ${
            user.status === "Active"
              ? THEME.colors.hardwareStatus.normal
              : THEME.colors.hardwareStatus.critical
          }`}
        >
          {user.status === "Active" ? (
            <CheckCircle2 className="w-3 h-3" />
          ) : (
            <XCircle className="w-3 h-3" />
          )}
          <span>{user.status}</span>
        </button>
      </div>

      {/* Roles Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {user.roles.map((role) => (
          <span
            key={role}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${THEME.colors.roleBadges[role]}`}
          >
            [{role}]
          </span>
        ))}
      </div>

      {/* Session Meta */}
      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
        <span>Last: {user.lastSession}</span>
        <span className="font-mono text-slate-400">{user.id}</span>
      </div>

      {/* Touch-Friendly Action Row */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => openEditRolesModal(user)}
          className="flex-1 py-2 px-3 rounded-lg border border-slate-200 bg-white active:bg-amber-50 text-slate-800 font-semibold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Edit className="w-3.5 h-3.5 text-amber-600" />
          <span>Edit Roles</span>
        </button>
        <button
          onClick={() => handleDispatchPasswordReset(user)}
          aria-label="Reset password"
          className="p-2.5 rounded-lg border border-slate-200 bg-white active:bg-slate-100 text-slate-600 cursor-pointer"
        >
          <Key className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleToggleUserStatus(user)}
          aria-label="Toggle lock status"
          className="p-2.5 rounded-lg border border-slate-200 bg-white active:bg-rose-50 text-slate-600 cursor-pointer"
        >
          <Lock className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDeleteUser(user)}
          aria-label="Delete user"
          className="p-2.5 rounded-lg border border-slate-200 bg-white active:bg-rose-50 text-slate-400 active:text-rose-600 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
