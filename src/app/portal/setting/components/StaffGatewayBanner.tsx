import type { Dispatch, SetStateAction } from "react";
import { Zap, ArrowUpRight } from "lucide-react";
import type { UserProfileData } from "../types";

interface StaffGatewayBannerProps {
  profile: UserProfileData;
  setIsPortalSwitcherOpen: Dispatch<SetStateAction<boolean>>;
}

export default function StaffGatewayBanner({ profile, setIsPortalSwitcherOpen }: StaffGatewayBannerProps) {
  return (
    <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-slate-950 border border-amber-500/40 rounded-2xl p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
          <Zap className="w-5 h-5 fill-slate-950" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-extrabold text-amber-300">
              Active Staff Access: Switch to Operations Portal
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 text-[10px] font-mono font-bold">
              {profile.activeStaffDepartment}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Your single VoltCraft account holds staff privileges. Jump
            directly to Sales Catalog CRUD or Warehouse S/N Scanner.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsPortalSwitcherOpen(true)}
        className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 shadow-sm active:scale-95 transition-transform duration-150"
      >
        <span>Role Switcher / Gateway</span>
        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
}
