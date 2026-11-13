import {
  LayoutDashboard,
  CheckCircle2,
  Shield,
  User,
  ArrowRight,
  Lock,
  LogOut,
} from "lucide-react";
import { ROLE_CONFIG } from "../constants";
import { type UserAccount, type Role } from "../types";

interface GatewayViewProps {
  currentUser: UserAccount;
  onEnterRole: (role: Role, user: UserAccount) => void;
  onSignOut: () => void;
}

export function GatewayView({
  currentUser,
  onEnterRole,
  onSignOut,
}: GatewayViewProps) {
  return (
    <section className="mx-auto w-full max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Greeting */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.12)]">
          <LayoutDashboard size={29} />
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          <span className="flex min-h-7 items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            <CheckCircle2 size={12} />
            Authenticated
          </span>

          <span className="flex min-h-7 items-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-500/10 px-3 text-[10px] font-bold uppercase tracking-wider text-blue-300">
            <Shield size={12} />
            Multi-Role Account
          </span>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Welcome back,{" "}
          <span className="text-amber-400">
            {currentUser.name.split(" ")[0]}
          </span>
          !
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-300">
          Select your operational session context for this login. Your account
          has access to multiple VoltCraft environments.
        </p>
      </div>

      {/* Account Summary */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-amber-400">
            <User size={22} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              {currentUser.name}
            </p>

            <p className="truncate text-xs text-slate-300">
              {currentUser.email}
            </p>

            {currentUser.department && (
              <p className="mt-1 truncate text-[10px] text-slate-400">
                {currentUser.department}
              </p>
            )}
          </div>
        </div>

        <div className="flex min-h-9 items-center gap-2 self-start rounded-lg border border-slate-700 bg-slate-950 px-3 sm:self-auto">
          <Shield size={14} className="text-amber-400" />

          <span className="text-xs font-semibold text-slate-200">
            {currentUser.roles.length} Assigned Roles
          </span>
        </div>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {currentUser.roles.map((role) => {
          const config = ROLE_CONFIG[role];

          return (
            <article
              key={role}
              className="group flex flex-col rounded-2xl border border-slate-700 bg-slate-900 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-slate-500 hover:shadow-xl hover:shadow-black/20 sm:p-6"
            >
              {/* Card Header */}
              <div className="mb-5 flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.iconClass}`}
                >
                  {config.icon}
                </div>

                <span
                  className={`rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${config.badgeClass}`}
                >
                  {role}
                </span>
              </div>

              {/* Card Information */}
              <div className="mb-3">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {config.subtitle}
                </p>

                <h3 className="text-lg font-bold text-white">
                  {config.title}
                </h3>
              </div>

              <p className="mb-6 min-h-[48px] text-sm leading-relaxed text-slate-300">
                {config.description}
              </p>

              {/* Permissions */}
              <div className="mb-6 flex-1 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Available Permissions
                </p>

                {config.permissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-start gap-2 text-xs text-slate-200"
                  >
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-emerald-400"
                    />

                    <span>{permission}</span>
                  </div>
                ))}
              </div>

              {/* Entry Button */}
              <button
                type="button"
                onClick={() => onEnterRole(role, currentUser)}
                className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${config.buttonClass}`}
              >
                Enter Portal
                <ArrowRight size={17} />
              </button>
            </article>
          );
        })}
      </div>

      {/* Gateway Footer */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-700 pt-6 sm:flex-row">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Lock size={15} className="shrink-0 text-slate-400" />

          <span>Access is controlled by assigned account permissions.</span>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 text-sm font-bold text-slate-200 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300 active:scale-95 sm:w-auto"
        >
          <LogOut size={17} />
          Sign Out / Switch Account
        </button>
      </div>
    </section>
  );
}
