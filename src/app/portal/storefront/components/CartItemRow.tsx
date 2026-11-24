import { Wrench, Plus, Minus, Trash2 } from "lucide-react";
import { INSTALLATION_FEE_THB, INSTALLATION_FEE_USD } from "../constants";
import type { CartAddOnField, CartItem } from "../types";

interface CartItemRowProps {
  item: CartItem;
  onRemove: (productId: string) => void;
  onQuantityChange: (productId: string, delta: number) => void;
  onToggleAddOn: (productId: string, field: CartAddOnField) => void;
}

export default function CartItemRow({ item, onRemove, onQuantityChange, onToggleAddOn }: CartItemRowProps) {
  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-3"
    >
      <div className="flex gap-3">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-20 h-20 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
              {item.product.modelCode}
            </span>
            <button
              onClick={() => onRemove(item.product.id)}
              aria-label="Remove item"
              className="text-slate-400 hover:text-rose-600 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 mt-0.5">
            {item.product.name}
          </h4>

          <p className="text-[11px] text-slate-500 mt-0.5">
            {item.product.primarySpec} • {item.product.wattage}W •{" "}
            {item.product.warrantyYears}-Yr Warranty
          </p>

          <div className="mt-2 flex items-center justify-between">
            <div>
              <span className="text-sm font-extrabold text-slate-900">
                ${(item.product.price * item.quantity).toLocaleString()}
              </span>
            </div>

            {/* Quantity Stepper */}
            <div className="inline-flex items-center border border-slate-200 rounded-xl bg-slate-50">
              <button
                onClick={() => onQuantityChange(item.product.id, -1)}
                aria-label="Decrease quantity"
                className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-200 rounded-l-xl active:scale-95"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 text-xs font-bold text-slate-900">
                {item.quantity}
              </span>
              <button
                onClick={() => onQuantityChange(item.product.id, 1)}
                aria-label="Increase quantity"
                className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-200 rounded-r-xl active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Direct-to-Consumer Specialty Appliance Upsell Checkboxes */}
      <div className="pt-2.5 border-t border-slate-100 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Direct Technician Services (Per Unit):
        </p>

        <label className="flex items-start gap-2.5 p-2 rounded-xl bg-amber-50/70 border border-amber-200/80 cursor-pointer">
          <input
            type="checkbox"
            checked={item.addOnInstallation}
            onChange={() =>
              onToggleAddOn(item.product.id, "addOnInstallation")
            }
            className="mt-0.5 w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between font-bold text-amber-950">
              <span className="flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-amber-600" />
                On-Site Pro Wall Mounting &amp; Setup
              </span>
              <span>
                +${INSTALLATION_FEE_USD} / ฿{INSTALLATION_FEE_THB.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-amber-800/80">
              Includes brackets, circuit load test &amp; commissioning
            </p>
          </div>
        </label>

        <label className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
          <input
            type="checkbox"
            checked={item.addOnHaulAway}
            onChange={() => onToggleAddOn(item.product.id, "addOnHaulAway")}
            className="mt-0.5 w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between font-semibold text-slate-800">
              <span>Old Appliance Disposal &amp; Eco Haul-Away</span>
              <span className="text-emerald-700 font-bold">FREE</span>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}
