import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { RoleType, DepartmentType, UserAccount } from "../types";

interface EditRolesModalProps {
  editingUserRoles: UserAccount;
  setEditingUserRoles: Dispatch<SetStateAction<UserAccount | null>>;
  tempEditedRoles: RoleType[];
  tempEditedDept: DepartmentType;
  setTempEditedDept: Dispatch<SetStateAction<DepartmentType>>;
  handleToggleTempRole: (role: RoleType) => void;
  handleSaveEditedRoles: (e: React.FormEvent) => void;
}

export default function EditRolesModal({
  editingUserRoles,
  setEditingUserRoles,
  tempEditedRoles,
  tempEditedDept,
  setTempEditedDept,
  handleToggleTempRole,
  handleSaveEditedRoles,
}: EditRolesModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full max-h-[92dvh] flex flex-col border-t sm:border border-slate-200 shadow-2xl overflow-hidden">
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="min-w-0 pr-2">
            <h3 className="text-sm font-extrabold">
              Modify RBAC Role Tokens
            </h3>
            <p className="text-[11px] text-slate-400 font-mono truncate">
              {editingUserRoles.fullName} ({editingUserRoles.email})
            </p>
          </div>
          <button
            onClick={() => setEditingUserRoles(null)}
            className="text-slate-400 hover:text-white p-1 cursor-pointer shrink-0"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSaveEditedRoles}
          className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto"
        >
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Primary Department Assignment
            </label>
            <select
              value={tempEditedDept}
              onChange={(e) =>
                setTempEditedDept(e.target.value as DepartmentType)
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold"
            >
              <option value="Admin">Super Admin</option>
              <option value="Sales">Sales Team</option>
              <option value="Warehouse">Warehouse Ops</option>
              <option value="Customer">Customer Account</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-2">
              Active Multi-Role Permissions
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(
                ["Admin", "Sales", "Warehouse", "Customer"] as RoleType[]
              ).map((role) => {
                const active = tempEditedRoles.includes(role);
                return (
                  <button
                    type="button"
                    key={role}
                    onClick={() => handleToggleTempRole(role)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                      active
                        ? "bg-amber-50 border-amber-500 font-bold text-slate-900"
                        : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}
                  >
                    <span>[{role}]</span>
                    {active && (
                      <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setEditingUserRoles(null)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold cursor-pointer"
            >
              Save RBAC Roles
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
