import type { Dispatch, SetStateAction } from "react";
import type { UserProfileData } from "../types";
import IdentityCard from "./IdentityCard";
import PortalJumpBanner from "./PortalJumpBanner";
import StaffGatewayBanner from "./StaffGatewayBanner";

interface ProfileHeroProps {
  profile: UserProfileData;
  userInitials: string;
  addressCount: number;
  orderCount: number;
  warrantyCount: number;
  hasStaffRoles: boolean;
  setIsPortalSwitcherOpen: Dispatch<SetStateAction<boolean>>;
  activePortalSimulation: string | null;
  setActivePortalSimulation: Dispatch<SetStateAction<string | null>>;
}

export default function ProfileHero({
  profile,
  userInitials,
  addressCount,
  orderCount,
  warrantyCount,
  hasStaffRoles,
  setIsPortalSwitcherOpen,
  activePortalSimulation,
  setActivePortalSimulation,
}: ProfileHeroProps) {
  return (
    <section className="bg-slate-900 text-white border-b border-slate-800 px-4 py-5 sm:py-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <IdentityCard
          profile={profile}
          hasStaffRoles={hasStaffRoles}
          userInitials={userInitials}
          addressCount={addressCount}
          orderCount={orderCount}
          warrantyCount={warrantyCount}
        />

        {/* Conditional Staff Portal Gateway Banner */}
        {hasStaffRoles && <StaffGatewayBanner profile={profile} setIsPortalSwitcherOpen={setIsPortalSwitcherOpen} />}

        {/* Active Portal Jump Feedback Banner if triggered */}
        {activePortalSimulation && (
          <PortalJumpBanner
            activePortalSimulation={activePortalSimulation}
            setActivePortalSimulation={setActivePortalSimulation}
          />
        )}
      </div>
    </section>
  );
}
