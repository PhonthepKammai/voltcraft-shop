import { Zap } from "lucide-react";

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-950 text-white border border-amber-500/40 shadow-xl flex items-center gap-2 text-xs font-semibold whitespace-nowrap">
      <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
      <span>{message}</span>
    </div>
  );
}
