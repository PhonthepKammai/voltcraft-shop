import React from "react";
import { CheckCircle2, AlertTriangle, Key, XCircle } from "lucide-react";
import { ToastNotification } from "../../types";

interface ToastBannerProps {
  toast: ToastNotification | null;
  onDismiss: () => void;
}

export function ToastBanner({ toast, onDismiss }: ToastBannerProps) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-2xl">
      {toast.type === "success" && (
        <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
      )}
      {toast.type === "warning" && (
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
      )}
      {toast.type === "info" && (
        <Key className="w-5 h-5 text-sky-400 shrink-0" />
      )}
      <div className="text-xs font-medium tracking-wide">{toast.message}</div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-slate-400 hover:text-white ml-2"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
}