import { Zap, ShieldCheck, Wrench, BatteryCharging } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="px-4 pt-5 pb-3">
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-5 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Decorative Industrial Grid Accent */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <BatteryCharging className="w-3.5 h-3.5" />
            Direct-To-Consumer Precision Engineering
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Crafted Electrical Power for{" "}
            <span className="text-amber-400">Modern Living</span>
          </h1>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            High-efficiency Gen-3 inverter compressors, medical-grade H13 air filtration, and
            commercial thermal systems shipped directly from VoltCraft engineering labs with
            certified in-home installation.
          </p>

          {/* Quick Assurance Trust Badges (3-Column Micro Grid) */}
          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-slate-800/90">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                  100% Inverter Efficiency
                </p>
                <p className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
                  No.5 Energy Star Certified
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                  Pro Installation Included
                </p>
                <p className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
                  Certified VoltCraft Technicians
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                  3-5 Year Direct Warranty
                </p>
                <p className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
                  On-site rapid swap guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
