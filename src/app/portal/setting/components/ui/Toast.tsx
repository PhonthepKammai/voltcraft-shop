import { CheckCircle2 } from "lucide-react";
import type { ToastState } from "../../types";

interface ToastProps {
  toast: ToastState | null;
}

export default function Toast({ toast }: ToastProps) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-5 inset-x-4 sm:inset-x-auto sm:right-6 z-50 max-w-md mx-auto sm:mx-0">
      <div
        className={`p-3.5 rounded-2xl border shadow-2xl flex items-start gap-3 backdrop-blur-md bg-slate-950/95 text-white ${
          toast.tone === "emerald"
            ? "border-emerald-500/60"
            : toast.tone === "amber"
            ? "border-amber-500/60"
            : toast.tone === "blue"
            ? "border-blue-500/60"
            : "border-rose-500/60"
        }`}
      >
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
            toast.tone === "emerald"
              ? "bg-emerald-500/20 text-emerald-300"
              : toast.tone === "amber"
              ? "bg-amber-500/20 text-amber-300"
              : toast.tone === "blue"
              ? "bg-blue-500/20 text-blue-300"
              : "bg-rose-500/20 text-rose-300"
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-extrabold text-white">{toast.title}</p>
          {toast.detail && (
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              {toast.detail}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
