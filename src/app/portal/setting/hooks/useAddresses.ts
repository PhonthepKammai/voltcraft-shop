import React, { useState } from "react";
import { INITIAL_ADDRESSES } from "../mockData";
import type {
  AddressFormState,
  ApplianceDeliveryAddress,
  TriggerToast,
  UserProfileData,
} from "../types";

export function useAddresses(profile: UserProfileData, triggerToast: TriggerToast) {
  const [addresses, setAddresses] =
    useState<ApplianceDeliveryAddress[]>(INITIAL_ADDRESSES);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState<AddressFormState>({
    label: "Condo",
    recipientName: "Alex Vance",
    recipientPhone: "089-452-8810",
    streetAddress: "",
    districtAndCity: "Bangkok",
    postalCode: "10900",
    floorNumber: "8th Floor",
    freightElevatorAvailable: true,
    doorframeWidthCm: 90,
    gateAccessNotes: "",
    isDefault: false,
  });

  const openAddAddressModal = () => {
    setEditingAddressId(null);
    setAddrForm({
      label: "Condo",
      recipientName: profile.fullName,
      recipientPhone: profile.phone,
      streetAddress: "",
      districtAndCity: "",
      postalCode: "",
      floorNumber: "12th Floor",
      freightElevatorAvailable: true,
      doorframeWidthCm: 90,
      gateAccessNotes: "",
      isDefault: addresses.length === 0,
    });
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (addr: ApplianceDeliveryAddress) => {
    setEditingAddressId(addr.id);
    setAddrForm({
      label: addr.label,
      recipientName: addr.recipientName,
      recipientPhone: addr.recipientPhone,
      streetAddress: addr.streetAddress,
      districtAndCity: addr.districtAndCity,
      postalCode: addr.postalCode,
      floorNumber: addr.floorNumber,
      freightElevatorAvailable: addr.freightElevatorAvailable,
      doorframeWidthCm: addr.doorframeWidthCm,
      gateAccessNotes: addr.gateAccessNotes,
      isDefault: addr.isDefault,
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrForm.streetAddress.trim() || !addrForm.districtAndCity.trim()) {
      triggerToast(
        "Incomplete Address",
        "Please enter the street/building address and district/city.",
        "rose"
      );
      return;
    }

    if (editingAddressId) {
      setAddresses((prev) =>
        prev.map((item) => {
          if (item.id === editingAddressId) {
            return { ...addrForm, id: editingAddressId };
          }
          return addrForm.isDefault ? { ...item, isDefault: false } : item;
        })
      );
      triggerToast(
        "Delivery address updated",
        `Updated logistics parameters for ${addrForm.label} (${addrForm.floorNumber}).`,
        "emerald"
      );
    } else {
      const newAddress: ApplianceDeliveryAddress = {
        ...addrForm,
        id: `addr-${Date.now()}`,
      };
      setAddresses((prev) => {
        const updated = newAddress.isDefault
          ? prev.map((a) => ({ ...a, isDefault: false }))
          : prev;
        return [newAddress, ...updated];
      });
      triggerToast(
        "Address added successfully",
        `Saved ${newAddress.label} with heavy-appliance elevator & floor metadata.`,
        "emerald"
      );
    }

    setIsAddressModalOpen(false);
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    triggerToast(
      "Default Dispatch Address Updated",
      "White-glove appliance fleet routing updated.",
      "amber"
    );
  };

  const handleDeleteAddress = (addr: ApplianceDeliveryAddress) => {
    if (addresses.length <= 1) {
      triggerToast(
        "Cannot Remove Last Address",
        "At least one primary appliance delivery address is required.",
        "rose"
      );
      return;
    }
    setAddresses((prev) => prev.filter((a) => a.id !== addr.id));
    triggerToast(
      "Address Removed",
      `Deleted ${addr.label} (${addr.districtAndCity}) from address book.`,
      "amber"
    );
  };

  return {
    addresses,
    isAddressModalOpen,
    setIsAddressModalOpen,
    editingAddressId,
    addrForm,
    setAddrForm,
    openAddAddressModal,
    openEditAddressModal,
    handleSaveAddress,
    handleSetDefaultAddress,
    handleDeleteAddress,
  };
}
