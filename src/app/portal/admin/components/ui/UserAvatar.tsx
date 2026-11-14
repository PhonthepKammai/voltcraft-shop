import React from "react";
import { getInitials } from "../../formatters";

interface UserAvatarProps {
  fullName: string;
}

export function UserAvatar({ fullName }: UserAvatarProps) {
  return (
    <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-extrabold flex items-center justify-center text-xs shrink-0 border border-slate-700">
      {getInitials(fullName)}
    </div>
  );
}