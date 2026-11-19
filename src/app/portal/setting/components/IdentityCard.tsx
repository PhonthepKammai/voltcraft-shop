import { CheckCircle2 } from "lucide-react";
import type { UserProfileData } from "../types";

interface IdentityCardProps {
  profile: UserProfileData;
  userInitials: string;
  addressCount: number;
  orderCount: number;
  warrantyCount: number;
  hasStaffRoles: boolean;
}

export default function IdentityCard({
  profile,
  userInitials,
  addressCount,
  orderCount,
  warrantyCount,
  hasStaffRoles,
}: IdentityCardProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        {/* Avatar with Initials */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xl sm:text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 border-2 border-amber-300">
          {userInitials}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-2xl font-extrabold text-white truncate">
              {profile.fullName}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified Member
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-medium truncate mt-0.5">
            {profile.email} •{" "}
            <span className="font-mono text-amber-400">
              {profile.memberId}
            </span>
          </p>

          {/* Assigned Multi-Role Chips */}
          <div className="flex items-center gap-1.5 flex-wrap mt-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
              Customer Storefront
            </span>
            {hasStaffRoles && (
              <>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-extrabold uppercase">
                  Sales Ops Staff
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase">
                  Warehouse Access
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Account Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-950/90 border border-slate-800 rounded-2xl p-3 text-center shrink-0">
        <div className="px-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Orders
          </span>
          <span className="text-sm sm:text-base font-extrabold text-white">
            {orderCount}
          </span>
        </div>
        <div className="px-2 border-x border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Active S/N
          </span>
          <span className="text-sm sm:text-base font-extrabold text-amber-400">
            {warrantyCount} Units
          </span>
        </div>
        <div className="px-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Addresses
          </span>
          <span className="text-sm sm:text-base font-extrabold text-emerald-400">
            {addressCount} Saved
          </span>
        </div>
      </div>
    </div>
  );
}
