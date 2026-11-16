import { Tag, Edit3, Trash2 } from "lucide-react";
import type { CatalogAppliance } from "../types";
import { calculateDiscountPercent, formatTHB } from "../utils";

interface ApplianceCardProps {
  appliance: CatalogAppliance;
  onEdit: (appliance: CatalogAppliance) => void;
  onPromo: (appliance: CatalogAppliance, discountPct: number) => void;
  onDelete: (appliance: CatalogAppliance) => void;
}

export default function ApplianceCard({ appliance, onEdit, onPromo, onDelete }: ApplianceCardProps) {
  const discountPct = calculateDiscountPercent(
    appliance.priceTHB,
    appliance.originalPriceTHB
  );
  const isOutOfStock = appliance.warehouseStock === 0;
  const isLowStock =
    appliance.warehouseStock > 0 && appliance.warehouseStock <= 5;


  return (
    <article
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
    >
      <div>
        {/* Thumbnail with Overlay Badges for Energy Rating & Inverter Tag */}
        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden border-b border-slate-100">
          <img
            src={appliance.imageUrl}
            alt={appliance.name}
            className="w-full h-full object-cover"
          />

          {/* Top-Left: Energy Star Rating & Inverter Badge */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 text-[11px] font-semibold shadow-sm">
              ⚡ Energy {appliance.energyRating}
            </span>
            {appliance.inverter && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-amber-400 border border-slate-700 text-[11px] font-bold shadow-sm">
                Eco Inverter
              </span>
            )}
          </div>

          {/* Top-Right: Active Promo Discount Badge */}
          {discountPct > 0 && (
            <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-extrabold shadow-sm">
              -{discountPct}% PROMO
            </span>
          )}

          {/* Bottom-Left: Read-Only Warehouse Stock Count Indicator */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <span
              title="Warehouse Stock Count (Read-Only for Sales Role)"
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border shadow-sm backdrop-blur-sm ${
                isOutOfStock
                  ? "bg-rose-50/95 text-rose-700 border-rose-200"
                  : isLowStock
                  ? "bg-amber-50/95 text-amber-800 border-amber-300"
                  : "bg-emerald-50/95 text-emerald-700 border-emerald-200"
              }`}
            >
              {isOutOfStock
                ? "0 units - Out of Stock (Warehouse)"
                : isLowStock
                ? `${appliance.warehouseStock} units - Low stock`
                : `${appliance.warehouseStock} units in stock`}
            </span>

            <span className="px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono">
              {appliance.wattage}W
            </span>
          </div>
        </div>

        {/* Card Body: SKU, Title, Specs & Pricing */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              SKU: {appliance.sku}
            </span>
            <span>{appliance.category}</span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2">
            {appliance.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {appliance.description}
          </p>

          {/* Technical Specs Pill Row */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 pt-1">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold">
              Power: {appliance.wattage}W
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold">
              {appliance.inverter ? "Inverter Drive" : "Standard Drive"}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold">
              {appliance.dimensionsCm}
            </span>
          </div>

          {/* Pricing Row: Selling Price + Compare-at Strikethrough */}
          <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Storefront Selling Price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {formatTHB(appliance.priceTHB)}
                </span>
                {appliance.originalPriceTHB > appliance.priceTHB && (
                  <span className="text-xs text-slate-400 line-through font-medium">
                    {formatTHB(appliance.originalPriceTHB)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">
                Updated {appliance.updatedAt}
              </span>
              <span
                className={`text-[11px] font-bold ${
                  appliance.published
                    ? "text-emerald-700"
                    : "text-slate-500"
                }`}
              >
                ● {appliance.published ? "Published Live" : "Draft Mode"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Quick Actions (Edit, 1-Tap Promo, Delete) */}
      <div className="p-3 bg-slate-50 border-t border-slate-200/80 grid grid-cols-7 gap-2">
        <button
          type="button"
          onClick={() => onEdit(appliance)}
          className="col-span-3 min-h-[44px] px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all duration-150"
        >
          <Edit3 className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Edit / Price</span>
        </button>

        <button
          type="button"
          onClick={() => onPromo(appliance, discountPct)}
          className="col-span-3 min-h-[44px] px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-medium text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-150"
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Promo %</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete(appliance)}
          aria-label={`Delete ${appliance.name}`}
          className="col-span-1 min-h-[44px] rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 flex items-center justify-center active:scale-95 transition-all duration-150"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}
