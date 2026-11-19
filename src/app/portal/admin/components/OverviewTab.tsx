import { Package, ShoppingBag, ChevronRight, Lock, Zap } from "lucide-react";
import { THEME } from "../theme";
import type { NavTab, ApplianceItem } from "../types";

interface OverviewTabProps {
  appliances: ApplianceItem[];
  handleSelectTab: (tab: NavTab) => void;
  handleQuickEmergencyRestock: (item: ApplianceItem) => void;
}

export default function OverviewTab({
  appliances,
  handleSelectTab,
  handleQuickEmergencyRestock,
}: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
      {/* 4-Role Architecture Governance Matrix */}
      <div
        className={`${THEME.colors.surface} p-4 sm:p-6 xl:col-span-2 space-y-4`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              VoltCraft 4-Role Operational Governance Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time permission segregation across Storefront, Sales, Warehouse, and Super Admin.
            </p>
          </div>
          <button
            onClick={() => handleSelectTab("users")}
            className="self-start sm:self-auto text-xs font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Manage RBAC</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                Super Admin (Governance)
              </span>
              <Lock className="w-4 h-4 text-purple-600 shrink-0" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Central RBAC provisioning, multi-role assignment without email duplication, safety stock threshold overrides, and immutable audit compliance logs.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Sales Staff (Commercial)
              </span>
              <ShoppingBag className="w-4 h-4 text-blue-600 shrink-0" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Appliance catalog CRUD, technical BTU/Wattage spec sheets, promotional campaign pricing, and customer payment slip verification.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Warehouse & Logistics
              </span>
              <Package className="w-4 h-4 text-amber-600 shrink-0" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Physical inventory intake, serial number (S/N) barcode scanning for warranty registration, and carrier dispatch slip generation.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Customer Account
              </span>
              <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Storefront appliance comparison, Energy Star (เบอร์ 5) efficiency calculator, order tracking, and digital S/N warranty claims.
            </p>
          </div>
        </div>
      </div>

      {/* Critical Inventory Watchlist */}
      <div className={`${THEME.colors.surface} p-4 sm:p-6 space-y-4`}>
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              Low-Stock Safety Watchlist
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Units at or below Super Admin threshold
            </p>
          </div>
          <button
            onClick={() => handleSelectTab("catalog")}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 cursor-pointer shrink-0"
          >
            Full Catalog
          </button>
        </div>

        <div className="space-y-3">
          {appliances
            .filter((a) => a.stockUnits <= a.lowStockThreshold)
            .map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <span className="text-[10px] font-mono font-bold text-slate-500 block">
                    {item.sku}
                  </span>
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {item.name}
                  </p>
                  <span
                    className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded border ${
                      item.stockUnits === 0
                        ? THEME.colors.hardwareStatus.critical
                        : THEME.colors.hardwareStatus.warning
                    }`}
                  >
                    {item.stockUnits} / {item.lowStockThreshold} Min Units
                  </span>
                </div>
                <button
                  onClick={() => handleQuickEmergencyRestock(item)}
                  className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shrink-0 cursor-pointer"
                >
                  +15 Intake
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
