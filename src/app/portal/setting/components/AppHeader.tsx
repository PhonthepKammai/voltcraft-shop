import type { Dispatch, SetStateAction } from "react";
import { Zap, LogOut } from "lucide-react";
import type { TriggerToast } from "../types";

interface AppHeaderProps {
  SimulateCustomerOnlyMode: boolean;
  setSimulateCustomerOnlyMode: Dispatch<SetStateAction<boolean>>;
  triggerToast: TriggerToast;
}

export default function AppHeader({
  SimulateCustomerOnlyMode,
  setSimulateCustomerOnlyMode,
  triggerToast,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* VoltCraft Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-sm shadow-amber-500/20 shrink-0">
            <Zap className="w-6 h-6 fill-slate-950 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                Volt<span className="text-amber-500">Craft</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 text-[10px] font-extrabold uppercase tracking-wider">
                ACCOUNT HUB
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block leading-none mt-0.5">
              Unified Member Profile, Appliance Logistics &amp; Digital S/N Vault
            </p>
          </div>
        </div>

        {/* Right Demo Role Toggle & Sign Out */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setSimulateCustomerOnlyMode((prev) => !prev)
            }
            className="hidden md:inline-flex min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 items-center gap-1.5 active:scale-95 transition-transform duration-150"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Demo Mode:{" "}
              <strong className="text-amber-400">
                {SimulateCustomerOnlyMode
                  ? "Customer Only"
                  : "Multi-Role Staff + Customer"}
              </strong>
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              triggerToast(
                "Session Signed Out",
                "Redirecting to VoltCraft Authentication Gateway (/login)...",
                "amber"
              )
            }
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-transform duration-150"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
