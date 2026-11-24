import { ShieldCheck } from "lucide-react";

export default function ComplianceBanner() {
  return (
    <div className="mb-4 bg-slate-950 border border-slate-800 rounded-2xl p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-md">
      <div className="flex items-center gap-2.5 text-xs">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-extrabold shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
          Role Scope: Warehouse &amp; Logistics Authority
        </span>
        <p className="text-slate-300">
          Authorized for physical stock intake, S/N barcode warranty binding &amp; fleet
          dispatch.{" "}
          <span className="text-slate-400">
            (Catalog product names, specs, and selling prices are locked by Sales Ops).
          </span>
        </p>
      </div>
      <span className="text-[11px] font-mono text-emerald-400 shrink-0">
        ● Handheld Scanner Ready
      </span>
    </div>
  );
}
