import { Activity, AlertCircle, CheckCircle2, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastData {
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: () => void;
}

const BORDER: Record<ToastType, string> = {
  success: "border-emerald-500/40",
  error: "border-red-500/40",
  info: "border-blue-500/40",
};

export function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <div className="fixed left-1/2 top-4 z-50 w-[calc(100%-24px)] max-w-md -translate-x-1/2 animate-in fade-in slide-in-from-top-3 duration-200">
      <div
        role="status"
        aria-live="polite"
        className={`flex items-center gap-3 rounded-xl border bg-slate-900 p-4 shadow-2xl ${BORDER[toast.type]}`}
      >
        {toast.type === "success" ? (
          <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
        ) : toast.type === "error" ? (
          <AlertCircle size={20} className="shrink-0 text-red-400" />
        ) : (
          <Activity size={20} className="shrink-0 text-blue-400" />
        )}

        <p className="min-w-0 flex-1 text-sm text-slate-100">
          {toast.message}
        </p>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-800 hover:text-white active:scale-95"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );
}