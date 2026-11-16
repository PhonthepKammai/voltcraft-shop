import { Zap } from "lucide-react";

export default function PortalBrand() {
  return (
    <div className="mb-8 flex justify-center">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
          <Zap size={23} />
        </div>

        <div>
          <p className="text-xl font-extrabold">
            Volt<span className="text-amber-500">Craft</span>
          </p>

          <p className="text-[10px] uppercase tracking-wider text-slate-400">
            Operational Environment
          </p>
        </div>
      </div>
    </div>
  );
}
