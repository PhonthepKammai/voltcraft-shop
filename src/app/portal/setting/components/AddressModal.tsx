import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import { MapPin } from "lucide-react";
import type { AddressLabelType, AddressFormState } from "../types";

interface AddressModalProps {
  editingAddressId: string | null;
  addrForm: AddressFormState;
  setAddrForm: Dispatch<SetStateAction<AddressFormState>>;
  setIsAddressModalOpen: Dispatch<SetStateAction<boolean>>;
  handleSaveAddress: (e: React.FormEvent) => void;
}

export default function AddressModal({
  editingAddressId,
  addrForm,
  setAddrForm,
  setIsAddressModalOpen,
  handleSaveAddress,
}: AddressModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => setIsAddressModalOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-slate-200 max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="px-5 py-4 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-extrabold">
                {editingAddressId
                  ? "Edit Appliance Delivery Address"
                  : "Add Heavy Appliance Delivery Address"}
              </h3>
              <p className="text-[11px] text-slate-400">
                Include floor &amp; elevator details for white-glove
                dispatch
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAddressModalOpen(false)}
            className="min-w-[40px] min-h-[40px] rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSaveAddress} className="p-5 space-y-4">
          {/* Address Tag Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Property Type / Label
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Condo", "Home", "Office / Studio"] as AddressLabelType[]).map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setAddrForm({ ...addrForm, label: type })
                    }
                    className={`min-h-[44px] py-2 px-3 rounded-xl text-xs font-bold border active:scale-95 transition-all ${
                      addrForm.label === type
                        ? "bg-amber-500 text-slate-950 border-amber-500"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Recipient Name *
              </label>
              <input
                type="text"
                required
                value={addrForm.recipientName}
                onChange={(e) =>
                  setAddrForm({ ...addrForm, recipientName: e.target.value })
                }
                className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={addrForm.recipientPhone}
                onChange={(e) =>
                  setAddrForm({
                    ...addrForm,
                    recipientPhone: e.target.value,
                  })
                }
                className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Building, Unit &amp; Street Address *
            </label>
            <input
              type="text"
              required
              value={addrForm.streetAddress}
              onChange={(e) =>
                setAddrForm({ ...addrForm, streetAddress: e.target.value })
              }
              placeholder="e.g., Noble Around Ari, Bldg X, Unit 1208"
              className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                District &amp; Province *
              </label>
              <input
                type="text"
                required
                value={addrForm.districtAndCity}
                onChange={(e) =>
                  setAddrForm({
                    ...addrForm,
                    districtAndCity: e.target.value,
                  })
                }
                placeholder="Phaya Thai, Bangkok"
                className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={addrForm.postalCode}
                onChange={(e) =>
                  setAddrForm({ ...addrForm, postalCode: e.target.value })
                }
                placeholder="10400"
                className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono text-slate-900"
              />
            </div>
          </div>

          {/* Specialized Appliance Site Attributes */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 block">
              Heavy Appliance Logistics Parameters
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Floor Number
                </label>
                <input
                  type="text"
                  value={addrForm.floorNumber}
                  onChange={(e) =>
                    setAddrForm({
                      ...addrForm,
                      floorNumber: e.target.value,
                    })
                  }
                  placeholder="e.g. 8th Floor"
                  className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Doorframe Width (cm)
                </label>
                <input
                  type="number"
                  min={60}
                  max={300}
                  value={addrForm.doorframeWidthCm}
                  onChange={(e) =>
                    setAddrForm({
                      ...addrForm,
                      doorframeWidthCm: Number(e.target.value) || 85,
                    })
                  }
                  className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-white text-sm font-mono text-slate-900"
                />
              </div>
            </div>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer">
              <span className="text-xs font-bold text-slate-900">
                Freight / Service Elevator Available
              </span>
              <input
                type="checkbox"
                checked={addrForm.freightElevatorAvailable}
                onChange={(e) =>
                  setAddrForm({
                    ...addrForm,
                    freightElevatorAvailable: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Gate Code / Juristic Lift Hours / Delivery Notes
              </label>
              <textarea
                rows={2}
                value={addrForm.gateAccessNotes}
                onChange={(e) =>
                  setAddrForm({
                    ...addrForm,
                    gateAccessNotes: e.target.value,
                  })
                }
                placeholder="e.g., Freight elevator requires booking before 16:00..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={addrForm.isDefault}
              onChange={(e) =>
                setAddrForm({ ...addrForm, isDefault: e.target.checked })
              }
              className="w-4 h-4 accent-amber-500 rounded"
            />
            <span>Set as default appliance delivery address</span>
          </label>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddressModalOpen(false)}
              className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[44px] py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm active:scale-95 transition-transform"
            >
              Save Delivery Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
