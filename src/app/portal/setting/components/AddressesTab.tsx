import { Plus } from "lucide-react";
import type { ApplianceDeliveryAddress } from "../types";
import AddressCard from "./AddressCard";

interface AddressesTabProps {
  addresses: ApplianceDeliveryAddress[];
  openAddAddressModal: () => void;
  openEditAddressModal: (addr: ApplianceDeliveryAddress) => void;
  handleSetDefaultAddress: (id: string) => void;
  handleDeleteAddress: (addr: ApplianceDeliveryAddress) => void;
}

export default function AddressesTab({
  addresses,
  openAddAddressModal,
  openEditAddressModal,
  handleSetDefaultAddress,
  handleDeleteAddress,
}: AddressesTabProps) {
  return (
    <section aria-label="Delivery Addresses" className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Heavy Appliance Delivery Addresses
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pre-configured with floor level, freight elevator
            availability, and gate clearance for 2-man installation
            teams.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddAddressModal}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 shadow-sm active:scale-95 transition-transform duration-150"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add New Address</span>
        </button>
      </div>

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            addr={addr}
            openEditAddressModal={openEditAddressModal}
            handleSetDefaultAddress={handleSetDefaultAddress}
            handleDeleteAddress={handleDeleteAddress}
          />
        ))}
      </div>
    </section>
  );
}
