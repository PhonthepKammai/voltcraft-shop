import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { AccountStatus } from "../../types";
import { THEME } from "../../theme";

interface StatusBadgeProps {
  status: AccountStatus;
  onClick?: () => void;
}

export function StatusBadge({ status, onClick }: StatusBadgeProps) {
  const isActive = status === "Active";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border cursor-pointer transition-all ${
        isActive
          ? THEME.colors.hardwareStatus.normal
          : THEME.colors.hardwareStatus.critical
      }`}
    >
      {isActive ? (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ) : (
        <XCircle className="w-3.5 h-3.5" />
      )}
      <span>{status}</span>
    </button>
  );
}