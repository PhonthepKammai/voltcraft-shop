import type { Dispatch, SetStateAction } from "react";
import { ArrowUpRight } from "lucide-react";
import type { UserProfileData, TriggerToast } from "../types";

interface PortalSwitcherModalProps {
  profile: UserProfileData;
  setIsPortalSwitcherOpen: Dispatch<SetStateAction<boolean>>;
  setActivePortalSimulation: Dispatch<SetStateAction<string | null>>;
  triggerToast: TriggerToast;
}

export default function PortalSwitcherModal({
  profile,
  setIsPortalSwitcherOpen,
  setActivePortalSimulation,
  triggerToast,
}: PortalSwitcherModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => setIsPortalSwitcherOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 text-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold uppercase">
              SINGLE-ACCOUNT MULTI-ROLE GATEWAY
            </span>
            <h3 className="text-lg font-extrabold text-white mt-1">
              Switch Operational Session Context
            </h3>
            <p className="text-xs text-slate-400">
              Logged in as {profile.fullName} ({profile.email})
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPortalSwitcherOpen(false)}
            className="min-w-[40px] min-h-[40px] rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => {
              setActivePortalSimulation(
                "/portal/sales (Sales & Catalog Operations)"
              );
              setIsPortalSwitcherOpen(false);
              triggerToast(
                "Switched to Sales Operations Portal",
                "Routing to /portal/sales • Catalog CRUD & Order Verification active.",
                "blue"
              );
            }}
            className="w-full p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/60 flex items-center justify-between text-left active:scale-95 transition-all"
          >
            <div>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase">
                SALES OPS PORTAL
              </span>
              <p className="text-sm font-bold text-white mt-1">
                Sales &amp; Catalog Management (/portal/sales)
              </p>
              <p className="text-xs text-slate-400">
                Verify payment slips, adjust pricing &amp; launch promos
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-amber-400 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePortalSimulation(
                "/portal/warehouse (Warehouse & S/N Logistics)"
              );
              setIsPortalSwitcherOpen(false);
              triggerToast(
                "Switched to Warehouse Logistics Portal",
                "Routing to /portal/warehouse • Barcode S/N Scanner active.",
                "amber"
              );
            }}
            className="w-full p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/60 flex items-center justify-between text-left active:scale-95 transition-all"
          >
            <div>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase">
                WAREHOUSE OPS
              </span>
              <p className="text-sm font-bold text-white mt-1">
                Warehouse &amp; S/N Scanner (/portal/warehouse)
              </p>
              <p className="text-xs text-slate-400">
                Bind appliance serial numbers, restock intake &amp; fleet
                manifests
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-amber-400 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePortalSimulation("/ (Customer Direct Storefront)");
              setIsPortalSwitcherOpen(false);
              triggerToast(
                "Returned to Customer Storefront",
                "Browsing VoltCraft Direct Storefront (/) as verified member.",
                "emerald"
              );
            }}
            className="w-full p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/60 flex items-center justify-between text-left active:scale-95 transition-all"
          >
            <div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase">
                CUSTOMER VIEW
              </span>
              <p className="text-sm font-bold text-white mt-1">
                VoltCraft Direct Storefront (/)
              </p>
              <p className="text-xs text-slate-400">
                Shop inverter appliances with employee/member warranty lock
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-amber-400 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
