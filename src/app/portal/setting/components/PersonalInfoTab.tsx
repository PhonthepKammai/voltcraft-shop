import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import { CheckCircle2 } from "lucide-react";
import type { UserProfileData } from "../types";

interface PersonalInfoTabProps {
  profile: UserProfileData;
  nameInput: string;
  setNameInput: Dispatch<SetStateAction<string>>;
  phoneInput: string;
  setPhoneInput: Dispatch<SetStateAction<string>>;
  windowInput: string;
  setWindowInput: Dispatch<SetStateAction<string>>;
  lineAlertsInput: boolean;
  setLineAlertsInput: Dispatch<SetStateAction<boolean>>;
  smsAlertsInput: boolean;
  setSmsAlertsInput: Dispatch<SetStateAction<boolean>>;
  handleSavePersonalInfo: (e: React.FormEvent) => void;
}

export default function PersonalInfoTab({
  profile,
  nameInput,
  setNameInput,
  phoneInput,
  setPhoneInput,
  windowInput,
  setWindowInput,
  lineAlertsInput,
  setLineAlertsInput,
  smsAlertsInput,
  setSmsAlertsInput,
  handleSavePersonalInfo,
}: PersonalInfoTabProps) {
  return (
    <section
      aria-label="Personal Information"
      className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Personal Information &amp; Dispatch Preferences
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your primary contact details for white-glove
            delivery and digital warranty ownership.
          </p>
        </div>
        <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-mono text-xs font-bold self-start sm:self-center">
          Joined {profile.joinedDate}
        </span>
      </div>

      <form onSubmit={handleSavePersonalInfo} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="profile-fullname"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Full Name *
            </label>
            <input
              id="profile-fullname"
              type="text"
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="profile-phone"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Primary Phone Number (Technician Contact) *
            </label>
            <input
              id="profile-phone"
              type="tel"
              required
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Read-Only Verified Email Address */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="profile-email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Email Address (Unified Single-Account ID)
            </label>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
              <CheckCircle2 className="w-3 h-3" />
              Verified &amp; Bound to S/N Vault
            </span>
          </div>
          <input
            id="profile-email"
            type="email"
            readOnly
            value={profile.email}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-sm font-medium text-slate-500 cursor-not-allowed"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            This email unifies your Customer Storefront, Digital
            Warranties, and Staff Portal permissions without account
            duplication.
          </p>
        </div>

        {/* Preferred Installation Time Window */}
        <div className="pt-2 border-t border-slate-100">
          <label
            htmlFor="install-window"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Preferred White-Glove Installation Window
          </label>
          <select
            id="install-window"
            value={windowInput}
            onChange={(e) => setWindowInput(e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Morning Slot (09:00 - 12:00)">
              Morning Slot (09:00 - 12:00)
            </option>
            <option value="Afternoon Slot (13:00 - 17:00)">
              Afternoon Slot (13:00 - 17:00)
            </option>
            <option value="Evening Condo Slot (17:30 - 20:00)">
              Evening Condo Slot (17:30 - 20:00)
            </option>
            <option value="Weekend Priority Only (Sat - Sun)">
              Weekend Priority Only (Sat - Sun)
            </option>
          </select>
        </div>

        {/* Notification Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-amber-400">
            <input
              type="checkbox"
              checked={lineAlertsInput}
              onChange={(e) => setLineAlertsInput(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">
                LINE Official Truck &amp; Technician Alerts
              </span>
              <span className="text-slate-500">
                Receive live GPS arrival notifications 30 mins before
                installation.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-amber-400">
            <input
              type="checkbox"
              checked={smsAlertsInput}
              onChange={(e) => setSmsAlertsInput(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">
                SMS Warranty &amp; Filter Maintenance Reminders
              </span>
              <span className="text-slate-500">
                6-month HEPA &amp; inverter coil checkup alerts.
              </span>
            </div>
          </label>
        </div>

        {/* Save Button */}
        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform duration-150"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.3]" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </section>
  );
}
