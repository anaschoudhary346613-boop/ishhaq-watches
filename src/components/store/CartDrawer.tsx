"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem } = useCartStore();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-serif text-[#121c2d]">Your Cart</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p>Your cart is empty.</p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#c5a059] hover:underline uppercase tracking-widest text-sm font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                        {item.brand}
                      </p>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm font-medium text-[#c5a059] mt-1">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 text-gray-500 hover:text-black transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-500 hover:text-black transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-gray-400 hover:text-red-500 underline transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-lg font-serif font-medium text-[#121c2d]">
                ₹{total.toLocaleString()}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="w-full bg-[#121c2d] text-white py-4 flex justify-center items-center font-medium uppercase tracking-widest text-sm hover:bg-[#1a2942] transition-colors"
            >
              Secure Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

