"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package2, Clock, MessageCircle } from "lucide-react";
import { Suspense } from "react";

function OrderConfirmedContent() {
  const params = useSearchParams();
  const orderId = params.get("id") || "—";
  const name = params.get("name") || "Valued Customer";
  const email = params.get("email") || "";
  const total = params.get("total") || "0";

  const whatsappMessage = `Hello ISHHAQ & CO, I have placed an order (ID: #${orderId}) for ₹${Number(total).toLocaleString("en-IN")} and completed the UPI payment. Please confirm receipt.`;

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-6 py-20">
      <div className="max-w-lg w-full">

        {/* Top Status Icon */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-20" />
          </div>
          <p className="text-[#c5a059] uppercase tracking-[0.3em] text-xs font-medium mb-2">
            Order Received
          </p>
          <h1 className="text-4xl font-serif text-[#121c2d] mb-3">
            Thank You, {name.split(" ")[0]}!
          </h1>
          <p className="text-gray-500 leading-relaxed">
            Your order has been placed and is awaiting payment verification. 
            We'll confirm and dispatch your timepiece as soon as we verify your UPI transfer.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="bg-[#121c2d] px-6 py-4">
            <p className="text-xs uppercase tracking-widest text-[#c5a059] font-medium mb-1">Order Reference</p>
            <p className="text-2xl font-mono text-white font-bold">#{orderId}</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#121c2d]">Pending Verification</p>
                <p className="text-xs text-gray-500 mt-0.5">Our team will verify your UPI payment and update the status within a few hours.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#121c2d]">Dispatch After Verification</p>
                <p className="text-xs text-gray-500 mt-0.5">Once verified, your watch will be carefully packaged and dispatched with a tracking number.</p>
              </div>
            </div>
            {email && (
              <div className="border-t border-gray-50 pt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500">Confirmation sent to</span>
                <span className="font-medium text-[#121c2d]">{email}</span>
              </div>
            )}
            <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
              <span className="text-gray-500 text-sm">Total Paid</span>
              <span className="text-xl font-serif text-[#121c2d]">₹{Number(total).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Track Your Order */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-6">
          <p className="text-sm font-medium text-[#121c2d] mb-1">Track Your Order Anytime</p>
          <p className="text-xs text-gray-500 mb-4">Enter your email on the orders page to see real-time status updates.</p>
          <Link
            href="/account/orders"
            className="block text-center w-full py-3 border border-[#121c2d] text-[#121c2d] text-sm uppercase tracking-widest font-medium hover:bg-[#121c2d] hover:text-white transition-colors"
          >
            View My Orders
          </Link>
        </div>

        {/* WhatsApp Verify */}
        <a
          href={`https://wa.me/919890902869?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 rounded-xl text-sm font-medium hover:bg-[#1fbc59] transition-colors mb-6"
        >
          <MessageCircle className="w-5 h-5" />
          Share Payment Proof on WhatsApp
        </a>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-[#c5a059] transition-colors underline-offset-4 hover:underline"
          >
            ← Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderConfirmedContent />
    </Suspense>
  );
}
