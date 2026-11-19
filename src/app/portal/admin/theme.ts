export const THEME = {
  brandName: "VoltCraft",
  subtitle: "ADMIN PORTAL",
  tagline: "Smart Living, Crafted Power",
  colors: {
    pageBg: "bg-slate-50",
    surface: "bg-white border border-slate-200 rounded-xl shadow-sm",
    sidebarBg: "bg-slate-900",
    primaryBtn:
      "bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-colors",
    heading: "text-slate-900",
    muted: "text-slate-500",
    roleBadges: {
      Admin: "bg-purple-50 text-purple-700 border-purple-200",
      Sales: "bg-blue-50 text-blue-700 border-blue-200",
      Warehouse: "bg-amber-50 text-amber-700 border-amber-200",
      Customer: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    hardwareStatus: {
      normal: "bg-emerald-50 text-emerald-700 border-emerald-200",
      warning: "bg-amber-50 text-amber-700 border-amber-200",
      critical: "bg-rose-50 text-rose-700 border-rose-200",
      energyStar: "bg-amber-50 text-amber-800 border-amber-300 font-semibold",
    },
  },
} as const;
