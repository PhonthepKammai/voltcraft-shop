import { Edit, Trash2, Key, CheckCircle2, XCircle, Lock } from "lucide-react";
import { THEME } from "../theme";
import type { UserAccount } from "../types";
import { getInitials } from "../utils";

interface UserTableRowProps {
  user: UserAccount;
  handleToggleUserStatus: (user: UserAccount) => void;
  handleDispatchPasswordReset: (user: UserAccount) => void;
  handleDeleteUser: (user: UserAccount) => void;
  openEditRolesModal: (user: UserAccount) => void;
}

export default function UserTableRow({
  user,
  handleToggleUserStatus,
  handleDispatchPasswordReset,
  handleDeleteUser,
  openEditRolesModal,
}: UserTableRowProps) {
  return (
    <tr
      className="hover:bg-slate-50/80 transition-colors"
    >
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-extrabold flex items-center justify-center text-xs shrink-0 border border-slate-700">
            {getInitials(user.fullName)}
          </div>
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
              <span className="text-slate-400">
                {user.id}
              </span>
            </div>
          </div>
        </div>
      </td>

      <td className="py-4 px-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {user.roles.map((role) => (
            <span
              key={role}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${THEME.colors.roleBadges[role]}`}
            >
              [{role}]
            </span>
          ))}
        </div>
      </td>

      <td className="py-4 px-4">
        <button
          onClick={() => handleToggleUserStatus(user)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border cursor-pointer transition-all ${
            user.status === "Active"
              ? THEME.colors.hardwareStatus.normal
              : THEME.colors.hardwareStatus.critical
          }`}
        >
          {user.status === "Active" ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <XCircle className="w-3.5 h-3.5" />
          )}
          <span>{user.status}</span>
        </button>
      </td>

      <td className="py-4 px-4">
        <div className="font-medium text-slate-800">
          {user.lastSession}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          Provisioned: {user.createdAt}
        </div>
      </td>

      <td className="py-4 px-5 text-right">
        <div className="inline-flex items-center justify-end gap-1.5">
          <button
            onClick={() => openEditRolesModal(user)}
            title="Edit Assigned RBAC Roles"
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-slate-700 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5 text-amber-600" />
            <span>Roles</span>
          </button>

          <button
            onClick={() => handleDispatchPasswordReset(user)}
            title="Dispatch Password Reset Token"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleToggleUserStatus(user)}
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
            onClick={() => handleDeleteUser(user)}
            title="Remove User"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
