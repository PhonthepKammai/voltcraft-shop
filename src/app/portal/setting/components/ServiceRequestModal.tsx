import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import type { DigitalApplianceWarranty } from "../types";

interface ServiceRequestModalProps {
  serviceTargetWarranty: DigitalApplianceWarranty;
  setServiceTargetWarranty: Dispatch<SetStateAction<DigitalApplianceWarranty | null>>;
  serviceIssueNote: string;
  setServiceIssueNote: Dispatch<SetStateAction<string>>;
  servicePreferredDate: string;
  setServicePreferredDate: Dispatch<SetStateAction<string>>;
  handleSubmitTechnicianService: (e: React.FormEvent) => void;
}

export default function ServiceRequestModal({
  serviceTargetWarranty,
  setServiceTargetWarranty,
  serviceIssueNote,
  setServiceIssueNote,
  servicePreferredDate,
  setServicePreferredDate,
  handleSubmitTechnicianService,
}: ServiceRequestModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setServiceTargetWarranty(null)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-md w-full rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold">
              ZERO-COST DIRECT WARRANTY SERVICE
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-1">
              Book On-Site VoltCraft Technician
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              S/N: {serviceTargetWarranty.serialNumber} •{" "}
              {serviceTargetWarranty.modelSku}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setServiceTargetWarranty(null)}
            className="min-w-[36px] min-h-[36px] rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmitTechnicianService}
          className="space-y-3.5"
        >
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Preferred Technician Visit Date
            </label>
            <input
              type="date"
              required
              value={servicePreferredDate}
              onChange={(e) => setServicePreferredDate(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Symptom / Maintenance Request Note
            </label>
            <textarea
              rows={3}
              required
              value={serviceIssueNote}
              onChange={(e) => setServiceIssueNote(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm active:scale-95 transition-transform"
          >
            Confirm On-Site Service Dispatch
          </button>
        </form>
      </div>
    </div>
  );
}
