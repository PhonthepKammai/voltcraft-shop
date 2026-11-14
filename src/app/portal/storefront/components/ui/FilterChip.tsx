import { X } from "lucide-react";
import type { ReactNode } from "react";

type ChipTone = "amber" | "emerald" | "blue" | "rose";

const TONE_CLASSES: Record<ChipTone, string> = {
  amber: "bg-amber-50 text-amber-900 border-amber-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  rose: "bg-rose-50 text-rose-700 border-rose-200",
};

interface FilterChipProps {
  tone?: ChipTone;
  onRemove: () => void;
  children: ReactNode;
}

export default function FilterChip({ tone = "amber", onRemove, children }: FilterChipProps) {
  return (
    <button
      onClick={onRemove}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold active:scale-95 transition-transform ${TONE_CLASSES[tone]}`}
    >
      {children}
      <X className="w-3.5 h-3.5" />
    </button>
  );
}
