import type { Dispatch, SetStateAction } from "react";
import { User, MapPin, Package, ShieldCheck, KeyRound, ChevronRight, Wrench } from "lucide-react";
import type { ProfileTabId } from "../types";
import type { ReactNode } from "react";

interface TabNavProps {
  activeTab: ProfileTabId;
  setActiveTab: Dispatch<SetStateAction<ProfileTabId>>;
  addressCount: number;
  orderCount: number;
  warrantyCount: number;
}

export default function TabNav({
  activeTab,
  setActiveTab,
  addressCount,
  orderCount,
  warrantyCount,
}: TabNavProps) {
  const NAVIGATION_TABS: {
    id: ProfileTabId;
    label: string;
    badge?: string;
    icon: ReactNode;
  }[] = [
    {
      id: "personal",
      label: "Personal Info",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "addresses",
      label: "Delivery Addresses",
      badge: `${addressCount}`,
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: "orders",
      label: "Order History",
      badge: `${orderCount}`,
      icon: <Package className="w-4 h-4" />,
    },
    {
      id: "warranties",
      label: "Digital Warranties",
      badge: `${warrantyCount} S/N`,
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: "security",
      label: "Security & Password",
      icon: <KeyRound className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 sticky top-[68px] z-30 bg-slate-50/95 backdrop-blur-md lg:bg-transparent py-1 lg:py-0">
      <nav
        aria-label="Account Settings Sections"
        className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar"
      >
        {NAVIGATION_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between gap-2.5 active:scale-95 transition-all duration-150 ${
                isActive
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={
                    isActive ? "text-slate-950" : "text-amber-600"
                  }
                >
                  {tab.icon}
                </span>
                <span className="whitespace-nowrap">{tab.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {tab.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                      isActive
                        ? "bg-slate-950 text-amber-400"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
                <ChevronRight
                  className={`w-4 h-4 hidden lg:inline ${
                    isActive ? "text-slate-950" : "text-slate-400"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Desktop Support Assurance Card */}
      <div className="hidden lg:block mt-4 bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
          <Wrench className="w-4 h-4" />
          Direct Engineering Care
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Need on-site compressor diagnostics or voltage load verification?
          Our licensed technicians respond within 24 hours.
        </p>
        <div className="pt-1 text-xs font-mono text-amber-400 font-bold">
          Hotline: 1490-VOLT (24/7)
        </div>
      </div>
    </aside>
  );
}
