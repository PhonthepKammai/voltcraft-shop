import { Lock } from "lucide-react";

export default function GlobalFooter() {
  return (
    <footer className="mt-auto pt-12 text-center">
      <div className="mb-3 flex items-center justify-center gap-2 text-slate-400">
        <Lock size={13} />
        <span className="text-[10px] font-bold uppercase tracking-wider">
          Secure Access Environment
        </span>
      </div>

      <p className="text-xs text-slate-400">
        © {new Date().getFullYear()} VoltCraft. All rights reserved.
      </p>

      <p className="mt-1 text-[10px] text-slate-500">
        Precision Power. Intelligent Living.
      </p>
    </footer>
  );
}
