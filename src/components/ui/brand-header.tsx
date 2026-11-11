import { Zap } from "lucide-react";

export default function BrandHeader() {
  return (
    <header className="mb-8 flex flex-col items-center text-center sm:mb-10">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10 shadow-[0_0_40px_rgba(245,158,11,0.15)]">
        <Zap
          size={32}
          strokeWidth={2.5}
          className="fill-amber-500 text-amber-500"
        />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        Volt<span className="text-amber-500">Craft</span>
      </h1>

      <p className="mt-2 text-sm text-slate-300">
        Precision Power & Smart Home Hub
      </p>

      <div className="mt-4 flex min-h-[32px] items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5">
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-200">
          Secure Authentication Gateway
        </span>
      </div>
    </header>
  );
}
