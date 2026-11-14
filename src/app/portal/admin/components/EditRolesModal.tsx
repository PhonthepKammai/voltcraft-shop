import React, { useState, useEffect } from "react";
import { XCircle, CheckCircle2 } from "lucide-react";
import { UserAccount, RoleType, DepartmentType } from "../types";

interface EditRolesModalProps {
  user: UserAccount | null;
  onClose: () => void;
  onSaveRoles: (
    user: UserAccount,
    updatedRoles: RoleType[],
    updatedDept: DepartmentType
  ) => void;
  onValidationError: (message: string) => void;
}

const ALL_ROLES: RoleType[] = ["Admin", "Sales", "Warehouse", "Customer"];

export function EditRolesModal({
  user,
  onClose,
  onSaveRoles,
  onValidationError,
}: EditRolesModalProps) {
  const [tempEditedRoles, setTempEditedRoles] = useState<RoleType[]>([]);
  const [tempEditedDept, setTempEditedDept] =
    useState<DepartmentType>("Sales");

  useEffect(() => {
    if (user) {
      setTempEditedRoles([...user.roles]);
      setTempEditedDept(user.department);
    }
  }, [user]);

  if (!user) return null;

  const handleToggleTempRole = (role: RoleType) => {
    setTempEditedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempEditedRoles.length === 0) {
      onValidationError("A user must have at least one assigned role");
      return;
    }
    onSaveRoles(user, tempEditedRoles, tempEditedDept);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold">Modify RBAC Role Tokens</h3>
            <p className="text-[11px] text-slate-400 font-mono">
              {user.fullName} ({user.email})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
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
              {ALL_ROLES.map((role) => {
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
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold cursor-pointer"
            >
              Save RBAC Roles
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}