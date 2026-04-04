"use client";

import { useState, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Search, Package2, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";

function TrackOrderContent() {
  const supabase = createClient();
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orderId.trim().toUpperCase().replace("#", "");
    if (!trimmed) return;

    setIsLoading(true);
    setError("");
    setOrderData(null);
    setSearched(true);

    // Query by short ID prefix (first 8 chars of UUID)
    const { data, error: dbError } = await supabase
      .from("orders")
      .select("id, status, total_amount, created_at, payment_method")
      .ilike("id", `${trimmed}%`)
      .single();

    setIsLoading(false);

    if (dbError || !data) {
      setError("No order found with that ID. Please double-check and try again.");
    } else {
      setOrderData(data);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Pending Verification":
        return { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Pending Verification", desc: "Your payment is being verified by our team." };
      case "Processing":
        return { icon: Package2, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", label: "Processing", desc: "Your order is being prepared for dispatch." };
      case "Shipped":
        return { icon: Truck, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", label: "Shipped", desc: "Your timepiece is on its way to you!" };
      case "Completed":
        return { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", border: "border-green-200", label: "Delivered", desc: "Your order has been delivered. Enjoy your timepiece!" };
      case "Cancelled":
        return { icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "Cancelled", desc: "This order has been cancelled." };
      default:
        return { icon: Clock, color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", label: status, desc: "Status update pending." };
    }
  };

  const steps = ["Pending Verification", "Processing", "Shipped", "Completed"];
  const getStepIndex = (status: string) => steps.indexOf(status);

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#c5a059] uppercase tracking-[0.3em] text-xs font-medium mb-3">Real-Time Updates</p>
          <h1 className="text-4xl md:text-5xl font-serif text-[#121c2d] mb-4">Track Your Order</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
            Enter your Order ID from your confirmation screen or WhatsApp message to see the latest status of your timepiece.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
          <label className="block text-xs uppercase tracking-widest text-gray-500 font-medium mb-3">Order ID</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-mono text-sm">#</span>
              <input
                type="text"
                required
                placeholder="e.g. A1B2C3D4"
                className="w-full min-h-[52px] border border-gray-200 pl-8 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#c5a059] transition-colors text-sm font-mono uppercase tracking-widest"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="min-h-[52px] px-8 bg-[#121c2d] text-white rounded-xl uppercase tracking-widest text-sm font-medium hover:bg-[#c5a059] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Search className="w-4 h-4" /> Track</>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Your Order ID was provided on the confirmation screen and in your WhatsApp message.
          </p>
        </form>

        {/* Results */}
        {searched && !isLoading && (
          <>
            {error ? (
              <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center">
                <XCircle className="w-12 h-12 text-red-300 mx-auto mb-4" />
                <p className="font-medium text-gray-700 mb-2">Order Not Found</p>
                <p className="text-sm text-gray-500">{error}</p>
                <Link
                  href="https://wa.me/919890902869"
                  target="_blank"
                  className="inline-block mt-6 text-sm text-[#c5a059] hover:underline underline-offset-4"
                >
                  Contact us on WhatsApp for help →
                </Link>
              </div>
            ) : orderData ? (
              <div className="space-y-4">
                {/* Status Card */}
                {(() => {
                  const cfg = getStatusConfig(orderData.status);
                  const Icon = cfg.icon;
                  return (
                    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden`}>
                      <div className="bg-[#121c2d] px-6 py-5">
                        <p className="text-xs text-[#c5a059] uppercase tracking-widest font-medium mb-1">Order Reference</p>
                        <p className="text-2xl font-mono text-white font-bold">#{orderData.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Placed on {new Date(orderData.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                        </p>
                      </div>

                      <div className="p-6 space-y-6">
                        {/* Current Status Badge */}
                        <div className={`flex items-start gap-4 p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white shadow-sm`}>
                            <Icon className={`w-5 h-5 ${cfg.color}`} />
                          </div>
                          <div>
                            <p className={`font-semibold text-sm ${cfg.color}`}>{cfg.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{cfg.desc}</p>
                          </div>
                        </div>

                        {/* Progress Bar (only for non-cancelled) */}
                        {orderData.status !== "Cancelled" && (
                          <div>
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-4">Progress</p>
                            <div className="flex items-center gap-0">
                              {steps.map((step, i) => {
                                const currentIdx = getStepIndex(orderData.status);
                                const isActive = i <= currentIdx;
                                const isCurrent = i === currentIdx;
                                return (
                                  <div key={step} className="flex items-center flex-1 last:flex-none">
                                    <div className="flex flex-col items-center">
                                      <div className={`w-4 h-4 rounded-full transition-all ${isActive ? "bg-[#c5a059]" : "bg-gray-200"} ${isCurrent ? "ring-4 ring-[#c5a059]/20" : ""}`} />
                                      <span className={`text-[9px] mt-1.5 uppercase tracking-wider text-center w-16 leading-tight ${isActive ? "text-[#121c2d] font-medium" : "text-gray-400"}`}>
                                        {step.split(" ")[0]}
                                      </span>
                                    </div>
                                    {i < steps.length - 1 && (
                                      <div className={`flex-1 h-0.5 mx-1 -mt-4 ${i < currentIdx ? "bg-[#c5a059]" : "bg-gray-200"}`} />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Order Meta */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Paid</p>
                            <p className="text-2xl font-serif text-[#121c2d]">₹{orderData.total_amount?.toLocaleString("en-IN")}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Payment</p>
                            <p className="text-sm font-medium text-gray-700">{orderData.payment_method}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Help Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#121c2d]">Need assistance?</p>
                    <p className="text-xs text-gray-400 mt-0.5">Our team responds within a few hours.</p>
                  </div>
                  <a
                    href="https://wa.me/919890902869"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-xl text-xs font-medium hover:bg-[#1fbc59] transition-colors whitespace-nowrap"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}

