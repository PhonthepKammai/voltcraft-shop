import { Tag } from "lucide-react";

export default function RoleBanner() {
  return (
    <div className="mb-4 bg-white border border-slate-200 rounded-2xl p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
      <div className="flex items-center gap-2.5 text-xs">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-bold shrink-0">
          <Tag className="w-3.5 h-3.5 text-amber-600" />
          Role Scope: Sales &amp; Catalog Authority
        </span>
        <p className="text-slate-600">
          Full CRUD pricing, promo campaigns &amp; payment verification enabled.{" "}
          <span className="text-slate-500 font-medium">
            (Physical stock counts are read-only and controlled by Warehouse Ops).
          </span>
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-mono text-slate-500">
           Warehouse Sync: Live
        </span>
      </div>
    </div>

  );
}
