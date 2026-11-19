import React, { useState } from "react";
import { INITIAL_WARRANTIES } from "../mockData";
import type { DigitalApplianceWarranty, TriggerToast, UserProfileData } from "../types";

export function useWarranties(profile: UserProfileData, triggerToast: TriggerToast) {
  const [warranties, setWarranties] =
    useState<DigitalApplianceWarranty[]>(INITIAL_WARRANTIES);
  const [serviceTargetWarranty, setServiceTargetWarranty] =
    useState<DigitalApplianceWarranty | null>(null);
  const [serviceIssueNote, setServiceIssueNote] = useState(
    "Schedule annual inverter coil cleaning, filter sanitization, and amp-draw telemetry check."
  );
  const [servicePreferredDate, setServicePreferredDate] =
    useState("2026-11-20");

  const [isBindSerialModalOpen, setIsBindSerialModalOpen] = useState(false);
  const [newSerialCode, setNewSerialCode] = useState("SN-IC-558291");
  const [newSerialModel, setNewSerialModel] = useState(
    "VC-IC-32D — VoltCraft DualZone Induction Cooktop 3200W"
  );

  const handleSubmitTechnicianService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTargetWarranty) return;

    setWarranties((prev) =>
      prev.map((w) =>
        w.id === serviceTargetWarranty.id
          ? {
              ...w,
              lastServiceStatus: `On-Site Technician Booked for ${servicePreferredDate}`,
            }
          : w
      )
    );

    triggerToast(
      `Technician Dispatched for ${serviceTargetWarranty.serialNumber}`,
      `Warranty ticket logged for ${servicePreferredDate} • Zero-cost direct coverage.`,
      "blue"
    );
    setServiceTargetWarranty(null);
  };

  const handleBindNewSerial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSerialCode.trim()) return;

    const [skuPart, namePart] = newSerialModel.split(" — ");
    const createdWarranty: DigitalApplianceWarranty = {
      id: `war-${Date.now()}`,
      applianceName: namePart || "VoltCraft Precision Smart Appliance",
      modelSku: skuPart || "VC-IC-32D",
      serialNumber: newSerialCode.trim().toUpperCase(),
      category: "Kitchen Tech",
      installedDate: "13 Nov 2026",
      expiryDate: "13 Nov 2031",
      countdownLabel: "5 Years 0 Months Remaining",
      coveragePercentRemaining: 100,
      compressorWarrantyYears: 5,
      installingTechnician: "Self-Registered / Direct Factory Bind",
      breakerSpec: "20A Dedicated Circuit",
      imageUrl:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=85",
      lastServiceStatus: "Digital Warranty Activated • 100% Coverage",
    };

    setWarranties((prev) => [createdWarranty, ...prev]);
    setIsBindSerialModalOpen(false);
    triggerToast(
      `Serial Number ${createdWarranty.serialNumber} Registered`,
      `5-Year Direct Factory Warranty bound to ${profile.email}.`,
      "emerald"
    );
  };

  return {
    warranties,
    serviceTargetWarranty,
    setServiceTargetWarranty,
    serviceIssueNote,
    setServiceIssueNote,
    servicePreferredDate,
    setServicePreferredDate,
    isBindSerialModalOpen,
    setIsBindSerialModalOpen,
    newSerialCode,
    setNewSerialCode,
    newSerialModel,
    setNewSerialModel,
    handleSubmitTechnicianService,
    handleBindNewSerial,
  };
}
