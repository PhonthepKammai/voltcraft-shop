import { ShoppingBag, X, Check } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD_USD } from "../constants";
import type { CartAddOnField, CartCalculations, CartItem } from "../types";
import CartItemRow from "./CartItemRow";
import CartSummary from "./CartSummary";

interface CartDrawerProps {
  cart: CartItem[];
  totalCartItems: number;
  cartCalculations: CartCalculations;
  onClose: () => void;
  onCheckout: () => void;
  removeCartItem: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  toggleCartAddOn: (productId: string, field: CartAddOnField) => void;
}

export default function CartDrawer({
  cart,
  totalCartItems,
  cartCalculations,
  onClose,
  onCheckout,
  removeCartItem,
  updateCartQuantity,
  toggleCartAddOn,
}: CartDrawerProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-200"
      >
        {/* Cart Header */}
        <div className="p-4 sm:p-5 bg-slate-950 text-white border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-base font-extrabold">
                  Direct Factory Dispatch Cart
                </h2>
                <p className="text-xs text-slate-400">
                  {totalCartItems} {totalCartItems === 1 ? "Appliance" : "Appliances"} • Serial
                  Warranty Included
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free White-Glove Shipping Progress Bar */}
          <div className="mt-3.5 bg-slate-900 border border-slate-800 rounded-xl p-2.5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              {cartCalculations.shippingUSD === 0 && cart.length > 0 ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Unlocked: FREE White-Glove Fleet Delivery!
                </span>
              ) : (
                <span className="text-slate-300">
                  Add{" "}
                  <strong className="text-amber-400">
                    ${Math.max(0, FREE_SHIPPING_THRESHOLD_USD - cartCalculations.subtotalUSD)}
                  </strong>{" "}
                  for Free White-Glove Delivery
                </span>
              )}
              <span className="font-mono text-[11px] text-amber-400 font-bold">
                {cartCalculations.freeShippingProgress}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${cartCalculations.freeShippingProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {cart.length === 0 ? (
            <div className="text-center py-14 px-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-200/70 text-slate-500 flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Your Direct Dispatch Cart is Empty
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Explore VoltCraft inverter air conditioners, refrigerators, and smart cleaning
                systems with factory installation.
              </p>
              <button
                onClick={onClose}
                className="mt-5 min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                Browse Appliances
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                onRemove={removeCartItem}
                onQuantityChange={updateCartQuantity}
                onToggleAddOn={toggleCartAddOn}
              />
            ))
          )}
        </div>

        {/* Cart Footer Summary & Checkout CTA */}
        {cart.length > 0 && (
          <CartSummary
            totalCartItems={totalCartItems}
            cartCalculations={cartCalculations}
            onCheckout={onCheckout}
          />
        )}
      </div>
    </div>
  );
}
