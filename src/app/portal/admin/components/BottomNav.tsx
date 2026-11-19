import { LayoutDashboard, Users, Package, History } from "lucide-react";
import type { NavTab, KpiStats } from "../types";

interface BottomNavProps {
  activeTab: NavTab;
  handleSelectTab: (tab: NavTab) => void;
  kpiStats: KpiStats;
}

export default function BottomNav({ activeTab, handleSelectTab, kpiStats }: BottomNavProps) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5"
    >
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
        <button
          onClick={() => handleSelectTab("overview")}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
            activeTab === "overview"
              ? "text-amber-400 bg-amber-500/10"
              : "text-slate-400"
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => handleSelectTab("users")}
          className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
            activeTab === "users"
              ? "text-amber-400 bg-amber-500/10"
              : "text-slate-400"
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>Users</span>
        </button>

        <button
          onClick={() => handleSelectTab("catalog")}
          className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
            activeTab === "catalog"
              ? "text-amber-400 bg-amber-500/10"
              : "text-slate-400"
          }`}
        >
          <div className="relative">
            <Package className="w-5 h-5 mb-0.5" />
            {kpiStats.lowStockCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-0.5 -right-1" />
            )}
          </div>
          <span>Catalog</span>
        </button>

        <button
          onClick={() => handleSelectTab("audit")}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
            activeTab === "audit"
              ? "text-amber-400 bg-amber-500/10"
              : "text-slate-400"
          }`}
        >
          <History className="w-5 h-5 mb-0.5" />
          <span>Audit</span>
        </button>
      </div>
    </nav>
  );
}
