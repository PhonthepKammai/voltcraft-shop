import { useState } from "react";
import { INITIAL_USER_PROFILE } from "../mockData";
import type { TriggerToast, UserProfileData } from "../types";

export function useProfile(triggerToast: TriggerToast) {
  const [profile, setProfile] = useState<UserProfileData>(INITIAL_USER_PROFILE);
  const [SimulateCustomerOnlyMode, setSimulateCustomerOnlyMode] =
    useState<boolean>(false);

  const [nameInput, setNameInput] = useState(INITIAL_USER_PROFILE.fullName);
  const [phoneInput, setPhoneInput] = useState(INITIAL_USER_PROFILE.phone);
  const [windowInput, setWindowInput] = useState(
    INITIAL_USER_PROFILE.preferredInstallationWindow
  );
  const [lineAlertsInput, setLineAlertsInput] = useState(
    INITIAL_USER_PROFILE.lineNotificationEnabled
  );
  const [smsAlertsInput, setSmsAlertsInput] = useState(
    INITIAL_USER_PROFILE.smsDispatchAlerts
  );

  const hasStaffRoles =
    !SimulateCustomerOnlyMode &&
    profile.roles.some((r) => r === "sales" || r === "warehouse" || r === "admin");

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !phoneInput.trim()) {
      triggerToast(
        "Required Fields Missing",
        "Please provide both your Full Name and Contact Phone Number.",
        "rose"
      );
      return;
    }

    setProfile((prev) => ({
      ...prev,
      fullName: nameInput.trim(),
      phone: phoneInput.trim(),
      preferredInstallationWindow: windowInput,
      lineNotificationEnabled: lineAlertsInput,
      smsDispatchAlerts: smsAlertsInput,
    }));

    triggerToast(
      "Profile updated",
      `Saved changes for ${nameInput.trim()} • Installation window synced.`,
      "emerald"
    );
  };

  const userInitials = profile.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return {
    profile,
    SimulateCustomerOnlyMode,
    setSimulateCustomerOnlyMode,
    nameInput,
    setNameInput,
    phoneInput,
    setPhoneInput,
    windowInput,
    setWindowInput,
    lineAlertsInput,
    setLineAlertsInput,
    smsAlertsInput,
    setSmsAlertsInput,
    hasStaffRoles,
    userInitials,
    handleSavePersonalInfo,
  };
}
