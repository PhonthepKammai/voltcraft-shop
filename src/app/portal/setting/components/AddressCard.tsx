import { Edit3, Trash2 } from "lucide-react";
import type { ApplianceDeliveryAddress } from "../types";

interface AddressCardProps {
  addr: ApplianceDeliveryAddress;
  openEditAddressModal: (addr: ApplianceDeliveryAddress) => void;
  handleSetDefaultAddress: (id: string) => void;
  handleDeleteAddress: (addr: ApplianceDeliveryAddress) => void;
}

export default function AddressCard({
  addr,
  openEditAddressModal,
  handleSetDefaultAddress,
  handleDeleteAddress,
}: AddressCardProps) {
  return (
    <article
      className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col justify-between gap-4 ${
        addr.isDefault
          ? "border-amber-500 ring-1 ring-amber-500/40"
          : "border-slate-200"
      }`}
    >
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-extrabold">
              {addr.label}
            </span>
            {addr.isDefault && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 text-xs font-extrabold">
                ★ Default Dispatch
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => openEditAddressModal(addr)}
              aria-label={`Edit ${addr.label} address`}
              className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center active:scale-95 transition-transform"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleDeleteAddress(addr)}
              aria-label={`Delete ${addr.label} address`}
              className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 flex items-center justify-center active:scale-95 transition-transform"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recipient & Street */}
        <div>
          <p className="text-sm font-bold text-slate-900">
            {addr.recipientName}{" "}
            <span className="font-mono text-xs text-slate-500 ml-1">
              ({addr.recipientPhone})
            </span>
          </p>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-snug">
            {addr.streetAddress}
          </p>
          <p className="text-xs font-semibold text-slate-800 mt-0.5">
            {addr.districtAndCity} {addr.postalCode}
          </p>
        </div>

        {/* Special Appliance Logistics Metadata Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">
              Installation Floor:
            </span>
            <span className="font-bold text-slate-900">
              {addr.floorNumber}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">
              Freight Elevator:
            </span>
            <span
              className={`font-bold px-2 py-0.5 rounded ${
                addr.freightElevatorAvailable
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              {addr.freightElevatorAvailable
                ? "✓ Elevator Available"
                : "Stair Carry / Ground Floor"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">
              Doorframe Clearance:
            </span>
            <span className="font-mono font-bold text-slate-900">
              {addr.doorframeWidthCm} cm
            </span>
          </div>
          {addr.gateAccessNotes && (
            <div className="pt-1.5 border-t border-slate-200 text-[11px] text-slate-600">
              <strong className="text-slate-800">
                Access / Gate Note:
              </strong>{" "}
              {addr.gateAccessNotes}
            </div>
          )}
        </div>
      </div>

      {!addr.isDefault && (
        <button
          type="button"
          onClick={() => handleSetDefaultAddress(addr.id)}
          className="w-full min-h-[44px] py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-xs font-bold text-slate-800 active:scale-95 transition-all"
        >
          Set as Default Delivery Address
        </button>
      )}
    </article>
  );
}
