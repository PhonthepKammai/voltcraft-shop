import type { Dispatch, SetStateAction } from "react";
import { Plus } from "lucide-react";
import type { DigitalApplianceWarranty, TriggerToast } from "../types";
import WarrantyCard from "./WarrantyCard";

interface WarrantiesTabProps {
  warranties: DigitalApplianceWarranty[];
  setServiceTargetWarranty: Dispatch<SetStateAction<DigitalApplianceWarranty | null>>;
  setIsBindSerialModalOpen: Dispatch<SetStateAction<boolean>>;
  triggerToast: TriggerToast;
}

export default function WarrantiesTab({
  warranties,
  setServiceTargetWarranty,
  setIsBindSerialModalOpen,
  triggerToast,
}: WarrantiesTabProps) {
  return (
    <section
      aria-label="Digital Warranties and Serial Numbers"
      className="space-y-4"
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Digital Warranties &amp; Registered Serial Numbers (S/N)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Paperless factory warranty vault. Your appliance Serial
            Numbers are automatically bound at warehouse dispatch.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsBindSerialModalOpen(true)}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 shadow-sm active:scale-95 transition-transform duration-150"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Register Retail S/N</span>
        </button>
      </div>

      {/* Warranty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {warranties.map((war) => (
          <WarrantyCard
            key={war.id}
            war={war}
            setServiceTargetWarranty={setServiceTargetWarranty}
            triggerToast={triggerToast}
          />
        ))}
      </div>
    </section>
  );
}
