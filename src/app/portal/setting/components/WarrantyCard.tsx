import type { Dispatch, SetStateAction } from "react";
import { ShieldCheck, Clock, Wrench, ArrowUpRight } from "lucide-react";
import type { DigitalApplianceWarranty, TriggerToast } from "../types";

interface WarrantyCardProps {
  war: DigitalApplianceWarranty;
  setServiceTargetWarranty: Dispatch<SetStateAction<DigitalApplianceWarranty | null>>;
  triggerToast: TriggerToast;
}

export default function WarrantyCard({ war, setServiceTargetWarranty, triggerToast }: WarrantyCardProps) {
  return (
    <article
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
    >
      <div>
        {/* Header Banner with Image & S/N Pill */}
        <div className="relative h-40 bg-slate-900 overflow-hidden">
          <img
            src={war.imageUrl}
            alt={war.applianceName}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[11px] font-extrabold flex items-center gap-1 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              ACTIVE {war.compressorWarrantyYears}-YR WARRANTY
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 text-amber-400 border border-amber-500/40 font-mono text-xs font-extrabold">
              {war.serialNumber}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">
              SKU: {war.modelSku} • {war.category}
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-white line-clamp-1">
              {war.applianceName}
            </h3>
          </div>
        </div>

        {/* Warranty Countdown & Technical Telemetry */}
        <div className="p-4 space-y-3.5">
          {/* Countdown Progress Bar */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                {war.countdownLabel}
              </span>
              <span className="font-mono text-[11px] font-bold text-amber-800">
                Exp: {war.expiryDate}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-amber-200/70 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{
                  width: `${war.coveragePercentRemaining}%`,
                }}
              />
            </div>
          </div>

          {/* Spec Metadata Rows */}
          <div className="text-xs space-y-1.5 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="flex justify-between">
              <span className="text-slate-500">
                Serial Number (S/N):
              </span>
              <span className="font-mono font-extrabold text-slate-900">
                {war.serialNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">
                Commissioning Date:
              </span>
              <span className="font-semibold text-slate-900">
                {war.installedDate}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">
                Certified Installer:
              </span>
              <span className="font-semibold text-slate-800">
                {war.installingTechnician}
              </span>
            </div>
            <div className="pt-1.5 border-t border-slate-200 flex justify-between items-center">
              <span className="text-slate-500">
                Diagnostic Log:
              </span>
              <span className="text-[11px] font-bold text-emerald-700">
                {war.lastServiceStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Warranty Action Buttons */}
      <div className="p-4 pt-0 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setServiceTargetWarranty(war)}
          className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform duration-150"
        >
          <Wrench className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Request Technician Service</span>
        </button>

        <button
          type="button"
          onClick={() =>
            triggerToast(
              `Engineering Manual Opened (${war.modelSku})`,
              `Downloaded PDF wiring & inverter care guide for ${war.serialNumber}.`,
              "blue"
            )
          }
          className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform duration-150"
        >
          <span>Manual</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
}
