import React, { useState } from "react";
import type { TriggerToast } from "../types";

export function useSecurityForm(triggerToast: TriggerToast) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      triggerToast(
        "Password Fields Required",
        "Please complete your current password and new password fields.",
        "rose"
      );
      return;
    }
    if (newPassword.length < 6) {
      triggerToast(
        "Weak Password",
        "New password must contain at least 6 characters.",
        "rose"
      );
      return;
    }
    if (newPassword !== confirmNewPassword) {
      triggerToast(
        "Password Mismatch",
        "New password and confirmation do not match.",
        "rose"
      );
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    triggerToast(
      "Password changed",
      "Your unified single-account security credentials have been rotated.",
      "emerald"
    );
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    handleUpdatePassword,
  };
}
