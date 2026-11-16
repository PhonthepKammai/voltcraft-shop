import { Zap, Package, Check, X, SlidersHorizontal, Image, DollarSign } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { ApplianceCategory, ApplianceFormState, EnergyStarRating } from "../types";
import { calculateDiscountPercent, formatTHB } from "../utils";

interface ApplianceFormSheetProps {
  editingApplianceId: string | null;
  formState: ApplianceFormState;
  setFormState: Dispatch<SetStateAction<ApplianceFormState>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ApplianceFormSheet({ editingApplianceId, formState, setFormState, onClose, onSubmit }: ApplianceFormSheetProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Sheet Header */}
        <div className="px-5 py-4 bg-slate-900 text-slate-100 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {editingApplianceId
                  ? `Edit Appliance SKU (${formState.sku})`
                  : "Add New VoltCraft Appliance"}
              </h2>
              <p className="text-[11px] text-slate-400">
                Configure technical specifications, energy certification &amp; storefront pricing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onClose()}
            className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={onSubmit}
          className="p-5 overflow-y-auto space-y-6 flex-1"
        >
          {/* 1. General Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-600" />
              1. General Appliance Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Appliance Model Name *
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  placeholder="e.g., VoltCraft AeroChill Pro 18,000 BTU Inverter AC"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Model SKU *
                </label>
                <input
                  type="text"
                  required
                  value={formState.sku}
                  onChange={(e) =>
                    setFormState({ ...formState, sku: e.target.value })
                  }
                  placeholder="VC-AC-18K"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Appliance Category
                </label>
                <select
                  value={formState.category}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      category: e.target.value as Exclude<
                        ApplianceCategory,
                        "All"
                      >,
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="ACs">ACs (Climate Control)</option>
                  <option value="Refrigeration">Refrigeration</option>
                  <option value="Cleaning">Cleaning Robotics</option>
                  <option value="Kitchen">Kitchen Tech</option>
                  <option value="Air Purifiers">Air Purifiers</option>
                </select>
              </div>

              {/* Read-Only Warehouse Stock Display inside Editor */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Warehouse Physical Stock (Read-Only)
                </label>
                <div className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-600 flex items-center justify-between">
                  <span>{formState.warehouseStock} units in Warehouse</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    Managed by Warehouse Ops
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Engineering &amp; Feature Description
              </label>
              <textarea
                rows={2}
                value={formState.description}
                onChange={(e) =>
                  setFormState({ ...formState, description: e.target.value })
                }
                placeholder="Highlight compressor generation, acoustic dB level, and warranty terms..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* 2. Technical Specifications */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              2. Technical Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rated Power (Wattage W)
                </label>
                <input
                  type="number"
                  min={10}
                  max={10000}
                  value={formState.wattage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      wattage: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Energy Saving Rating
                </label>
                <select
                  value={formState.energyRating}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      energyRating: e.target.value as EnergyStarRating,
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-amber-50/60 text-sm font-bold text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="No. 5 ★★★">No. 5 ★★★ (Max Efficiency)</option>
                  <option value="No. 5 ★★">No. 5 ★★ (High Efficiency)</option>
                  <option value="No. 5 ★">No. 5 ★ (Certified)</option>
                  <option value="Standard Certified">Standard TISI Certified</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dimensions (WxHxD cm)
                </label>
                <input
                  type="text"
                  value={formState.dimensionsCm}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      dimensionsCm: e.target.value,
                    })
                  }
                  placeholder="83.7 x 30.8 x 18.9 cm"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-amber-400">
              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                  Eco Inverter Compressor / Brushless Motor Technology
                </span>
                <span className="text-xs text-slate-500">
                  Displays the official Eco Inverter badge on customer storefront cards
                </span>
              </div>
              <input
                type="checkbox"
                checked={formState.inverter}
                onChange={(e) =>
                  setFormState({ ...formState, inverter: e.target.checked })
                }
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* 3. Pricing & Storefront Promotions */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-600" />
              3. Pricing &amp; Promotional Discount
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selling Price (THB ฿) *
                </label>
                <input
                  type="number"
                  min={100}
                  step={10}
                  required
                  value={formState.priceTHB}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      priceTHB: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Compare-at Original Price (฿)
                </label>
                <input
                  type="number"
                  min={100}
                  step={10}
                  value={formState.originalPriceTHB}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      originalPriceTHB: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Storefront Status
                </label>
                <select
                  value={formState.published ? "live" : "draft"}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      published: e.target.value === "live",
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="live">Publish Live on Storefront</option>
                  <option value="draft">Save as Internal Draft</option>
                </select>
              </div>
            </div>

            {/* Auto-calculated promo preview pill */}
            {formState.originalPriceTHB > formState.priceTHB && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
                <span className="font-bold">
                  Active Promotional Discount Preview:
                </span>
                <span className="font-extrabold">
                  -{calculateDiscountPercent(formState.priceTHB, formState.originalPriceTHB)}% OFF (Customer Saves{" "}
                  {formatTHB(formState.originalPriceTHB - formState.priceTHB)})
                </span>
              </div>
            )}
          </div>

          {/* 4. Product Image URL & Live Preview */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-amber-600" />
              4. Product Image URL &amp; Preview
            </h3>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input
                type="url"
                value={formState.imageUrl}
                onChange={(e) =>
                  setFormState({ ...formState, imageUrl: e.target.value })
                }
                placeholder="https://images.unsplash.com/..."
                className="w-full flex-1 h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                {formState.imageUrl ? (
                  <img
                    src={formState.imageUrl}
                    alt="Live preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">
                    No Image
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
            <button
              type="button"
              onClick={() => onClose()}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-100 active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[44px] py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Save Appliance Details</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
