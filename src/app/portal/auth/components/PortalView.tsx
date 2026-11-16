import { Zap, Package, LayoutDashboard, LogOut, ChevronRight, Users, Activity } from "lucide-react";
import { ROLE_CONFIG } from "../roleConfig";
import type { Role, UserAccount } from "../types";

interface PortalViewProps {
  currentUser: UserAccount | null;
  selectedRole: Role | null;
  handleSwitchRole: () => void;
  handleSignOut: () => void;
}

export default function PortalView({
  currentUser,
  selectedRole,
  handleSwitchRole,
  handleSignOut,
}: PortalViewProps) {
  if (!currentUser || !selectedRole) return null;

  const config = ROLE_CONFIG[selectedRole];

  const moduleIcons = [
    <LayoutDashboard key="dashboard" size={18} />,
    <Package key="package" size={18} />,
    <Users key="users" size={18} />,
  ];

  return (
    <section className="mx-auto w-full max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Portal Header */}
        <div className="border-b border-slate-700 p-6 sm:p-8">
          <div className="mb-7 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                <Zap size={23} />
              </div>

              <div>
                <p className="font-extrabold text-white">
                  VoltCraft
                </p>

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Operational Portal
                </p>
              </div>
            </div>

            <span
              className={`rounded-lg border px-3 py-2 text-[10px] font-bold uppercase ${config.badgeClass}`}
            >
              {selectedRole}
            </span>
          </div>

          <div
            className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${config.iconClass}`}
          >
            {config.icon}
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-400">
            Session Active
          </p>

          <h2 className="text-2xl font-extrabold sm:text-3xl">
            {config.title}
          </h2>

          <p className="mt-2 text-sm text-slate-300">
            Welcome, {currentUser.name}.
          </p>
        </div>

        {/* Portal Content */}
        <div className="p-6 sm:p-8">
          <div className="mb-7 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Activity
                size={17}
                className="text-emerald-400"
              />

              <span className="text-sm font-bold text-emerald-300">
                Portal Access Confirmed
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-300">
              You are currently operating in the{" "}
              <span className="font-bold text-white">
                {config.title}
              </span>{" "}
              context. This page is a frontend demonstration of
              the role-based portal entry.
            </p>
          </div>

          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              Available Modules
            </h3>

            <span className="text-xs text-slate-400">
              {config.features.length} modules
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {config.features.map((feature, index) => (
              <div
                key={feature}
                className="flex min-h-[110px] flex-col justify-between rounded-xl border border-slate-700 bg-slate-950 p-4 transition hover:border-slate-500"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-amber-400">
                    {moduleIcons[index]}
                  </div>

                  <ChevronRight
                    size={16}
                    className="text-slate-400"
                  />
                </div>

                <p className="mt-4 text-xs font-bold text-slate-200">
                  {feature}
                </p>
              </div>
            ))}
          </div>

          {/* Session Information */}
          <div className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200">
                Current Account
              </p>

              <p className="mt-1 truncate text-xs text-slate-300">
                {currentUser.email}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Active Session
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {currentUser.roles.length > 1 && (
              <button
                type="button"
                onClick={handleSwitchRole}
                className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-600 text-sm font-bold text-slate-200 transition hover:bg-slate-800 active:scale-95"
              >
                <LayoutDashboard size={17} />
                Switch Role
              </button>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 text-sm font-bold text-slate-950 transition hover:bg-amber-400 active:scale-95"
            >
              <LogOut size={17} />
              Sign Out
            </button>
          </div>

          <div className="mt-5 text-center">
            <span className="break-all text-[10px] text-slate-400">
              Destination: {config.destination}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
