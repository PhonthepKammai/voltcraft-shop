import React from "react";
import { RoleType } from "../../types";
import { THEME } from "../../theme";

interface RoleBadgeProps {
  role: RoleType;
  showBrackets?: boolean;
  size?: "xs" | "sm";
}

export function RoleBadge({
  role,
  showBrackets = true,
  size = "sm",
}: RoleBadgeProps) {
  const sizeClasses =
    size === "xs"
      ? "px-2 py-0.5 rounded text-[10px]"
      : "px-2.5 py-1 rounded-md text-[11px]";

  return (
    <span
      className={`inline-block font-bold border ${sizeClasses} ${THEME.colors.roleBadges[role]}`}
    >
      {showBrackets ? `[${role}]` : role}
    </span>
  );
}