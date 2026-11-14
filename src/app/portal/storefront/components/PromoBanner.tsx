import { Zap, ShieldCheck } from "lucide-react";

export default function PromoBanner() {
  return (
    <div className="bg-slate-950 text-amber-400 border-b border-slate-800 px-3 py-2 text-xs font-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold shrink-0">
            <Zap className="w-3 h-3 fill-amber-400" /> DIRECT FACTORY
          </span>
          <p className="truncate text-slate-200">
            Free White-Glove Installation &amp; 5-Year Compressor Warranty on Inverter Series
          </p>
        </div>
        <span className="hidden md:inline-flex items-center gap-1.5 text-slate-400 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          ISO-9001 Certified Lab Dispatch
        </span>
      </div>
    </div>
  );
}
