import { Trash2 } from "lucide-react";
import type { CatalogAppliance } from "../types";

interface DeleteConfirmModalProps {
  deletingAppliance: CatalogAppliance;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ deletingAppliance, onClose, onConfirm }: DeleteConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-md w-full rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Remove Appliance SKU from Catalog?
            </h3>
            <p className="text-xs text-slate-500">
              SKU: <span className="font-mono font-bold">{deletingAppliance.sku}</span>
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          You are about to remove{" "}
          <strong className="text-slate-900">{deletingAppliance.name}</strong> from the
          VoltCraft storefront catalog. Existing warehouse audit logs will remain intact.
        </p>

        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => onClose()}
            className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs sm:text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
