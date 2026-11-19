import type { Dispatch, SetStateAction } from "react";
import { CheckCircle2 } from "lucide-react";

interface PortalJumpBannerProps {
  activePortalSimulation: string | null;
  setActivePortalSimulation: Dispatch<SetStateAction<string | null>>;
}

export default function PortalJumpBanner({
  activePortalSimulation,
  setActivePortalSimulation,
}: PortalJumpBannerProps) {
  return (
    <div className="bg-slate-950 border border-emerald-500/50 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-emerald-300">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Session Route Ready:{" "}
          <strong className="text-white font-mono">
            {activePortalSimulation}
          </strong>
        </span>
      </div>
      <button
        type="button"
        onClick={() => setActivePortalSimulation(null)}
        className="text-slate-400 hover:text-white underline font-semibold"
      >
        Dismiss
      </button>
    </div>
  );
}
