import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import { ShieldCheck, KeyRound } from "lucide-react";

interface SecurityTabProps {
  currentPassword: string;
  setCurrentPassword: Dispatch<SetStateAction<string>>;
  newPassword: string;
  setNewPassword: Dispatch<SetStateAction<string>>;
  confirmNewPassword: string;
  setConfirmNewPassword: Dispatch<SetStateAction<string>>;
  handleUpdatePassword: (e: React.FormEvent) => void;
}

export default function SecurityTab({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  handleUpdatePassword,
}: SecurityTabProps) {
  return (
    <section
      aria-label="Security and Password Settings"
      className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6"
    >
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
          Security &amp; Single-Account Password
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Update your master password. Changes apply across your
          Customer Storefront and assigned Staff Operations Portals.
        </p>
      </div>

      <form
        onSubmit={handleUpdatePassword}
        className="max-w-xl space-y-4"
      >
        <div>
          <label
            htmlFor="sec-current-pass"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Current Password *
          </label>
          <input
            id="sec-current-pass"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="sec-new-pass"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              New Password *
            </label>
            <input
              id="sec-new-pass"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="sec-confirm-pass"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Confirm New Password *
            </label>
            <input
              id="sec-confirm-pass"
              type="password"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Active Multi-Role Session Protection
          </p>
          <p>
            Rotating your password will keep your current terminal
            signed in while revoking older browser tokens on showroom
            or warehouse handheld scanners.
          </p>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform duration-150"
        >
          <KeyRound className="w-4 h-4 stroke-[2.2]" />
          <span>Update Password</span>
        </button>
      </form>
    </section>
  );
}
