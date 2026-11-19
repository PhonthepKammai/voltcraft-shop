import type React from "react";
import type { Dispatch, SetStateAction } from "react";

interface BindSerialModalProps {
  setIsBindSerialModalOpen: Dispatch<SetStateAction<boolean>>;
  newSerialCode: string;
  setNewSerialCode: Dispatch<SetStateAction<string>>;
  newSerialModel: string;
  setNewSerialModel: Dispatch<SetStateAction<string>>;
  handleBindNewSerial: (e: React.FormEvent) => void;
}

export default function BindSerialModal({
  setIsBindSerialModalOpen,
  newSerialCode,
  setNewSerialCode,
  newSerialModel,
  setNewSerialModel,
  handleBindNewSerial,
}: BindSerialModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setIsBindSerialModalOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-md w-full rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Bind Showroom Appliance Serial Number
            </h3>
            <p className="text-xs text-slate-500">
              Link a showroom purchase directly to your digital warranty
              vault
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsBindSerialModalOpen(false)}
            className="min-w-[36px] min-h-[36px] rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleBindNewSerial} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Appliance Model
            </label>
            <select
              value={newSerialModel}
              onChange={(e) => setNewSerialModel(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900"
            >
              <option value="VC-IC-32D — VoltCraft DualZone Induction Cooktop 3200W">
                VC-IC-32D — VoltCraft DualZone Induction Cooktop 3200W
              </option>
              <option value="VC-AF-72L — VoltCraft VortexFryer Touch XXL 7.2L">
                VC-AF-72L — VoltCraft VortexFryer Touch XXL 7.2L
              </option>
              <option value="VC-AP-520 — VoltCraft PureBreathe Pro H13 HEPA Air Purifier">
                VC-AP-520 — VoltCraft PureBreathe Pro H13 HEPA Air Purifier
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Unique Serial Number (S/N Barcode on Chassis) *
            </label>
            <input
              type="text"
              required
              value={newSerialCode}
              onChange={(e) =>
                setNewSerialCode(e.target.value.toUpperCase())
              }
              placeholder="SN-IC-558291"
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono font-bold text-slate-900"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm active:scale-95 transition-transform"
          >
            Activate 5-Year Digital Warranty
          </button>
        </form>
      </div>
    </div>
  );
}
