import type { Dispatch, SetStateAction } from "react";
import { Truck, Printer, Check } from "lucide-react";
import type { FulfillmentOrder, DeliveryRouteManifest } from "../types";
import { getOrderSerialProgress } from "../utils";

interface RouteSheetProps {
  route: DeliveryRouteManifest;
  orders: FulfillmentOrder[];
  setPrintableManifestOrder: Dispatch<SetStateAction<FulfillmentOrder | null>>;
  setPrintableRouteSheet: Dispatch<SetStateAction<DeliveryRouteManifest | null>>;
  handleDispatchOrder: (order: FulfillmentOrder) => void;
  handleDispatchEntireRoute: (route: DeliveryRouteManifest) => void;
}

export default function RouteSheet({
  route,
  orders,
  setPrintableManifestOrder,
  setPrintableRouteSheet,
  handleDispatchOrder,
  handleDispatchEntireRoute,
}: RouteSheetProps) {
  const assignedOrders = orders.filter(
    (o) => o.assignedRouteId === route.id
  );
  const packedReadyCount = assignedOrders.filter(
    (o) => o.status === "Packed & S/N Bound"
  ).length;

  return (
    <div
      className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-md"
    >
      {/* Route Truck Header */}
      <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-mono text-xs font-extrabold">
              {route.routeCode}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 text-xs font-bold">
              {route.departureBay}
            </span>
            <span className="text-xs text-slate-400">
              {route.zoneCoverage}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-white pt-1">
            {route.truckName}
          </h3>
          <p className="text-xs text-slate-300">
            Driver:{" "}
            <strong className="text-white">{route.driverName}</strong> (
            {route.driverPhone}) • Plate:{" "}
            <span className="font-mono text-amber-400 font-bold">
              {route.vehiclePlate}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPrintableRouteSheet(route)}
            className="min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Route Manifest Sheet</span>
          </button>

          <button
            type="button"
            onClick={() => handleDispatchEntireRoute(route)}
            className="min-h-[48px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-2 active:scale-95 transition-all shadow-md"
          >
            <Truck className="w-4 h-4 stroke-[2.3]" />
            <span>
              Dispatch Ready Drops ({packedReadyCount})
            </span>
          </button>
        </div>
      </div>

      {/* Multi-Drop Order Stops Table / Cards */}
      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignedOrders.map((ord, dropIdx) => {
          const progress = getOrderSerialProgress(ord);
          return (
            <div
              key={ord.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs flex items-center justify-center">
                      #{dropIdx + 1}
                    </span>
                    <span className="font-mono text-sm font-extrabold text-white">
                      {ord.orderRef}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                      ord.status === "Dispatched"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                        : ord.status === "Packed & S/N Bound"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold text-white">
                    {ord.customerName} ({ord.customerPhone})
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {ord.deliveryAddress}
                  </p>
                </div>

                {/* Items & Bound S/Ns summary */}
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 space-y-1">
                  {ord.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-300 truncate">
                        {it.quantity}x {it.sku}
                      </span>
                      <span className="font-mono text-[11px] text-emerald-400 font-bold">
                        S/N:{" "}
                        {it.boundSerials.filter(Boolean).join(", ") ||
                          "Pending Scan"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPrintableManifestOrder(ord)}
                  className="flex-1 min-h-[48px] px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Print Shipping Label</span>
                </button>

                {ord.status !== "Dispatched" ? (
                  <button
                    type="button"
                    onClick={() => handleDispatchOrder(ord)}
                    className={`flex-1 min-h-[48px] px-3 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
                      progress.isComplete
                        ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                        : "bg-slate-800 text-slate-500 border border-slate-700"
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Mark Out for Delivery</span>
                  </button>
                ) : (
                  <span className="flex-1 min-h-[48px] px-3 py-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" />
                    In Transit
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
