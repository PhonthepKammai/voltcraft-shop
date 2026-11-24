import type { Dispatch, SetStateAction } from "react";
import type { FulfillmentOrder, DeliveryRouteManifest } from "../types";
import { DELIVERY_ROUTES } from "../mockData";
import RouteSheet from "./RouteSheet";

interface DispatchTabProps {
  orders: FulfillmentOrder[];
  selectedRouteFilter: string;
  setSelectedRouteFilter: Dispatch<SetStateAction<string>>;
  setPrintableManifestOrder: Dispatch<SetStateAction<FulfillmentOrder | null>>;
  setPrintableRouteSheet: Dispatch<SetStateAction<DeliveryRouteManifest | null>>;
  handleDispatchOrder: (order: FulfillmentOrder) => void;
  handleDispatchEntireRoute: (route: DeliveryRouteManifest) => void;
}

export default function DispatchTab({
  orders,
  selectedRouteFilter,
  setSelectedRouteFilter,
  setPrintableManifestOrder,
  setPrintableRouteSheet,
  handleDispatchOrder,
  handleDispatchEntireRoute,
}: DispatchTabProps) {
  return (
    <section aria-label="Dispatch and Driver Manifests" className="space-y-5">
      {/* Route Selector Pills */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedRouteFilter("All")}
            className={`min-h-[48px] px-4 py-2 rounded-xl text-xs font-bold border active:scale-95 transition-all ${
              selectedRouteFilter === "All"
                ? "bg-amber-500 text-slate-950 border-amber-500"
                : "bg-slate-900 text-slate-300 border-slate-800"
            }`}
          >
            All Fleet Trucks ({DELIVERY_ROUTES.length})
          </button>
          {DELIVERY_ROUTES.map((rt) => (
            <button
              key={rt.id}
              type="button"
              onClick={() => setSelectedRouteFilter(rt.id)}
              className={`min-h-[48px] px-4 py-2 rounded-xl text-xs font-bold border active:scale-95 transition-all ${
                selectedRouteFilter === rt.id
                  ? "bg-amber-500 text-slate-950 border-amber-500"
                  : "bg-slate-900 text-slate-300 border-slate-800"
              }`}
            >
              {rt.truckName.split(" - ")[0]} ({rt.routeCode})
            </button>
          ))}
        </div>
      </div>

      {/* Route Delivery Sheets */}
      <div className="space-y-6">
        {DELIVERY_ROUTES.filter(
          (r) =>
            selectedRouteFilter === "All" || r.id === selectedRouteFilter
        ).map((route) => (
          <RouteSheet
            key={route.id}
            route={route}
            orders={orders}
            setPrintableManifestOrder={setPrintableManifestOrder}
            setPrintableRouteSheet={setPrintableRouteSheet}
            handleDispatchOrder={handleDispatchOrder}
            handleDispatchEntireRoute={handleDispatchEntireRoute}
          />
        ))}
      </div>
    </section>
  );
}
