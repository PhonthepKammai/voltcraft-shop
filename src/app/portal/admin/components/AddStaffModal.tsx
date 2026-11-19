import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import { Plus, AlertTriangle, XCircle } from "lucide-react";
import type { RoleType, DepartmentType } from "../types";

interface AddStaffModalProps {
  setIsAddUserModalOpen: Dispatch<SetStateAction<boolean>>;
  newFullName: string;
  setNewFullName: Dispatch<SetStateAction<string>>;
  newEmail: string;
  setNewEmail: Dispatch<SetStateAction<string>>;
  newPassword: string;
  setNewPassword: Dispatch<SetStateAction<string>>;
  newDepartment: DepartmentType;
  setNewDepartment: Dispatch<SetStateAction<DepartmentType>>;
  newRoles: RoleType[];
  formError: string;
  handleToggleNewUserRole: (role: RoleType) => void;
  handleCreateStaffAccount: (e: React.FormEvent) => void;
}

export default function AddStaffModal({
  setIsAddUserModalOpen,
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
  handleToggleNewUserRole,
  handleCreateStaffAccount,
}: AddStaffModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[92dvh] flex flex-col border-t sm:border border-slate-200 shadow-2xl overflow-hidden">
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold">
                Provision New VoltCraft Account
              </h3>
              <p className="text-[11px] text-slate-400">
                Multi-role RBAC without email duplication
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddUserModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleCreateStaffAccount}
          className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto"
        >
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              value={newFullName}
              onChange={(e) => setNewFullName(e.target.value)}
              placeholder="e.g., Supaporn Techasit"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Corporate / Login Email *
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="name@voltcraft.co.th"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Initial Temporary Password
              </label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Primary Home Department
            </label>
            <select
              value={newDepartment}
              onChange={(e) =>
                setNewDepartment(e.target.value as DepartmentType)
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold"
            >
              <option value="Sales">Sales Team (Commercial & Promos)</option>
              <option value="Warehouse">Warehouse & Logistics Ops</option>
              <option value="Admin">Super Admin Governance</option>
              <option value="Customer">External Customer</option>
            </select>
          </div>

          {/* Multi-Select Checkboxes for Roles (Fixed Double-Click Handler) */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Assigned RBAC Roles (Multi-Select Enabled) *
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(
                ["Admin", "Sales", "Warehouse", "Customer"] as RoleType[]
              ).map((role) => {
                const checked = newRoles.includes(role);
                return (
                  <label
                    key={role}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all select-none ${
                      checked
                        ? "bg-amber-50/70 border-amber-500 font-bold text-slate-900"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleNewUserRole(role)}
                      className="accent-amber-500 w-4 h-4"
                    />
                    <span>[{role}]</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(false)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold cursor-pointer"
            >
              Provision Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
