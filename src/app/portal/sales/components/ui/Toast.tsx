import { CheckCircle2, Clock, Trash2, X } from "lucide-react";
import type { ToastState } from "../../types";

interface ToastProps {
  toastMessage: ToastState | null;
  onDismiss: () => void;
}

export default function Toast({ toastMessage, onDismiss }: ToastProps) {
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-20 z-50 max-w-md mx-auto sm:mx-0">
      <div
        className={`p-3.5 rounded-2xl border shadow-2xl flex items-start gap-3 backdrop-blur-md ${
          toastMessage.tone === "success"
            ? "bg-slate-900/95 text-white border-emerald-500/50"
            : toastMessage.tone === "warning"
            ? "bg-slate-900/95 text-white border-amber-500/60"
            : "bg-slate-900/95 text-white border-rose-500/60"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
            toastMessage.tone === "success"
              ? "bg-emerald-500/20 text-emerald-400"
              : toastMessage.tone === "warning"
              ? "bg-amber-500/20 text-amber-400"
              : "bg-rose-500/20 text-rose-400"
          }`}
        >
          {toastMessage.tone === "success" && <CheckCircle2 className="w-4 h-4" />}
          {toastMessage.tone === "warning" && <Clock className="w-4 h-4" />}
          {toastMessage.tone === "danger" && <Trash2 className="w-4 h-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-extrabold text-white">
            {toastMessage.title}
          </p>
          {toastMessage.detail && (
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              {toastMessage.detail}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDismiss()}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
