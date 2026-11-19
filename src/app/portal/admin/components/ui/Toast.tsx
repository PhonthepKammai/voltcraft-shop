import { Key, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { ToastData } from "../../types";

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-20 inset-x-4 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 flex items-center justify-between sm:justify-start gap-3 px-4 py-3.5 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-2xl">
      <div className="flex items-center gap-3 min-w-0">
        {toast.type === "success" && (
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
        )}
        {toast.type === "warning" && (
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
        )}
        {toast.type === "info" && (
          <Key className="w-5 h-5 text-sky-400 shrink-0" />
        )}
        <div className="text-xs font-medium tracking-wide leading-snug">
          {toast.message}
        </div>
      </div>
      <button
        onClick={() => onDismiss()}
        aria-label="Dismiss notification"
        className="text-slate-400 hover:text-white shrink-0 ml-2 cursor-pointer"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
}
