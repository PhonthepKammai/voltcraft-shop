import type { Dispatch, SetStateAction } from "react";
import { Barcode, Truck, Printer } from "lucide-react";
import type { FulfillmentOrder, DeliveryRouteManifest, ToastTone } from "../types";

interface ManifestPrintModalProps {
  orders: FulfillmentOrder[];
  printableManifestOrder: FulfillmentOrder | null;
  setPrintableManifestOrder: Dispatch<SetStateAction<FulfillmentOrder | null>>;
  printableRouteSheet: DeliveryRouteManifest | null;
  setPrintableRouteSheet: Dispatch<SetStateAction<DeliveryRouteManifest | null>>;
  triggerToast: (title: string, detail?: string, tone?: ToastTone) => void;
}

export default function ManifestPrintModal({
  orders,
  printableManifestOrder,
  setPrintableManifestOrder,
  printableRouteSheet,
  setPrintableRouteSheet,
  triggerToast,
}: ManifestPrintModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => {
        setPrintableManifestOrder(null);
        setPrintableRouteSheet(null);
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-slate-900 w-full max-w-lg rounded-2xl border border-slate-300 p-6 space-y-4 shadow-2xl"
      >
        {printableManifestOrder ? (
          <>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-mono text-xs font-bold">
                  VOLTCRAFT DIRECT SHIPPING LABEL
                </span>
                <h3 className="text-lg font-extrabold font-mono mt-1">
                  {printableManifestOrder.trackingTag}
                </h3>
              </div>
              <Barcode className="w-10 h-10 text-slate-900" />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Ref:</span>
                <strong className="font-mono">
                  {printableManifestOrder.orderRef}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient:</span>
                <strong>
                  {printableManifestOrder.customerName} (
                  {printableManifestOrder.customerPhone})
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Delivery Address:</span>
                <strong className="text-slate-900">
                  {printableManifestOrder.deliveryAddress}
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerToast(
                  `Shipping Label ${printableManifestOrder.trackingTag} Printed`,
                  "Ready to attach to outer appliance carton.",
                  "blue"
                );
                setPrintableManifestOrder(null);
              }}
              className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Confirm Print Shipping Label</span>
            </button>
          </>
        ) : (
          printableRouteSheet && (
            <>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-mono text-xs font-bold">
                    DRIVER MULTI-DROP MANIFEST
                  </span>
                  <h3 className="text-lg font-extrabold mt-1">
                    {printableRouteSheet.truckName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Driver: {printableRouteSheet.driverName} • Plate:{" "}
                    {printableRouteSheet.vehiclePlate}
                  </p>
                </div>
                <Truck className="w-8 h-8 text-slate-900" />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {orders
                  .filter((o) => o.assignedRouteId === printableRouteSheet.id)
                  .map((o, i) => (
                    <div
                      key={o.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                    >
                      <div>
                        <strong className="font-mono">
                          Stop #{i + 1}: {o.orderRef}
                        </strong>{" "}
                        — {o.customerName}
                        <p className="text-slate-500 truncate max-w-xs">
                          {o.deliveryAddress}
                        </p>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-slate-700">
                        {o.status}
                      </span>
                    </div>
                  ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerToast(
                    `Driver Manifest ${printableRouteSheet.routeCode} Printed`,
                    `Handed over to ${printableRouteSheet.driverName}.`,
                    "blue"
                  );
                  setPrintableRouteSheet(null);
                }}
                className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Driver Route Sheet</span>
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
}
