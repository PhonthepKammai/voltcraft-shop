"use client";

import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
  type LucideIcon,
} from "lucide-react";

export type ToastVariant = "success" | "warning" | "error" | "info";

export interface ToastData {
  title: string;
  detail?: string;
  variant?: ToastVariant;
  icon?: LucideIcon;
}

interface ToastProps {
  toast: ToastData | null;
  onDismiss?: () => void;
}

const VARIANT_CONFIG: Record<
  ToastVariant,
  { border: string; iconBg: string; iconColor: string; defaultIcon: LucideIcon }
> = {
  success: {
    border: "border-emerald-500/50",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    defaultIcon: CheckCircle2,
  },
  warning: {
    border: "border-amber-500/50",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    defaultIcon: AlertTriangle,
  },
  error: {
    border: "border-rose-500/50",
    iconBg: "bg-rose-500/20",
    iconColor: "text-rose-400",
    defaultIcon: XCircle,
  },
  info: {
    border: "border-sky-500/50",
    iconBg: "bg-sky-500/20",
    iconColor: "text-sky-400",
    defaultIcon: Info,
  },
};

export default function Toast({ toast, onDismiss }: ToastProps) {
  if (!toast) return null;

  const variant = toast.variant ?? "info";
  const config = VARIANT_CONFIG[variant];
  const IconComponent = toast.icon ?? config.defaultIcon;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 z-50 max-w-md mx-auto sm:mx-0 animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div
        className={`p-3.5 rounded-2xl border shadow-2xl flex items-start gap-3 backdrop-blur-md bg-slate-950/95 text-white ${config.border}`}
      >
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.iconBg} ${config.iconColor}`}
        >
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0 self-center">
          <p className="text-xs font-extrabold text-white leading-snug">
            {toast.title}
          </p>
          {toast.detail && (
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              {toast.detail}
            </p>
          )}
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}