import { Zap, ShieldCheck, Truck, Wrench } from "lucide-react";

export default function FooterAssurance() {
  return (
    <footer className="mt-12 px-4">
      <div className="max-w-7xl mx-auto bg-slate-950 text-slate-300 rounded-2xl border border-slate-800 p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Scheduled White-Glove Fleet Delivery
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Every heavy appliance is transported upright via air-ride VoltCraft trucks with
                2-man stair carry and packaging haul-away.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Licensed Electrical &amp; HVAC Setup
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Add factory wall-mounting, vacuum line purging, or water-line plumbing directly in
                your cart for turnkey commissioning.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Direct Serial Registration &amp; 5-Yr Warranty
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                No third-party dealers or paper receipts required. Your appliance serial number is
                bound to your VoltCraft warranty ID at dispatch.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-bold text-white">VoltCraft Appliances Global Direct</span>
            <span>• WCAG AAA High-Contrast Interface</span>
          </div>
          <p>© {new Date().getFullYear()} VoltCraft Precision Electrical Systems. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
