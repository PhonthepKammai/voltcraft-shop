import React, { useState } from "react";
import { Plus, XCircle, AlertTriangle } from "lucide-react";
import { DepartmentType, RoleType, UserAccount } from "../types";

interface AddStaffModalProps {
  isOpen: boolean;
  existingUsers: UserAccount[];
  onClose: () => void;
  onCreateAccount: (payload: {
    fullName: string;
    email: string;
    department: DepartmentType;
    roles: RoleType[];
  }) => void;
}

const ALL_ROLES: RoleType[] = ["Admin", "Sales", "Warehouse", "Customer"];

export function AddStaffModal({
  isOpen,
  existingUsers,
  onClose,
  onCreateAccount,
}: AddStaffModalProps) {
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("VoltCraft#2026!");
  const [newDepartment, setNewDepartment] = useState<DepartmentType>("Sales");
  const [newRoles, setNewRoles] = useState<RoleType[]>(["Sales", "Customer"]);
  const [formError, setFormError] = useState("");

  if (!isOpen) return null;

  const handleToggleRole = (role: RoleType) => {
    setNewRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    const emailExists = existingUsers.some(
      (u) => u.email.toLowerCase() === trimmedEmail
    );
    if (emailExists) {
      setFormError(
        "Email duplication prevented: This email already exists. Assign additional roles to the existing account instead."
      );
      return;
    }

    onCreateAccount({
      fullName: trimmedName,
      email: trimmedEmail,
      department: newDepartment,
      roles: newRoles,
    });

    // Reset internal form state
    setNewFullName("");
    setNewEmail("");
    setNewPassword("VoltCraft#2026!");
    setNewDepartment("Sales");
    setNewRoles(["Sales", "Customer"]);
    setFormError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold">
                Provision New VoltCraft Account
              </h3>
              <p className="text-[11px] text-slate-400">
                Multi-role RBAC assignment without email duplication
              </p>
            </div>
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

          {/* Multi-Select Checkboxes for Roles */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Assigned RBAC Roles (Multi-Select Enabled) *
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {ALL_ROLES.map((role) => {
                const checked = newRoles.includes(role);
                return (
                  <label
                    key={role}
                    onClick={() => handleToggleRole(role)}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      checked
                        ? "bg-amber-50/70 border-amber-500 font-bold text-slate-900"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="accent-amber-500"
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
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold cursor-pointer"
            >
              Provision Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}