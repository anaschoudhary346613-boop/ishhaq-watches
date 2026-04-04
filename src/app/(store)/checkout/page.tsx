"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { UPIPayment } from "@/components/store/UPIPayment";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const [step, setStep] = useState<string>("shipping");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
        total_amount: total,
        status: "Pending Verification",
        payment_method: "UPI Transfer",
      };

      const { data: orderData, error } = await supabase
        .from("orders")
        .insert([orderPayload])
        .select()
        .single();

      if (error) throw error;

      // Fire confirmation email (non-blocking)
      if (orderData) {
        fetch("/api/send-order-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: formData.name,
            email: formData.email,
            address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
            total: total,
            orderId: orderData.id,
          }),
        }).catch(() => {});
      }

      // Clear cart
      clearCart();

      // Open WhatsApp with pre-filled payment proof message
      const waMessage = `Hello ISHHAQ & CO! 🕰️ I have just placed an order and completed my UPI payment.\n\nMy Order ID is: *#${orderData?.id?.slice(0, 8).toUpperCase()}*\nOrder Total: ₹${total.toLocaleString("en-IN")}\n\nCould you please verify and confirm my dispatch?`;
      const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919890902869";
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`, "_blank");

      // Redirect to success page
      router.push(`/order-confirmed?id=${orderData?.id?.slice(0, 8).toUpperCase() || "NEW"}&name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&total=${total}`);

    } catch (err: any) {
      alert(`Checkout failed: ${err.message || "Unknown error. Please try again."}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24">
        <h1 className="text-2xl font-serif mb-4">Your cart is empty</h1>
        <Link href="/" className="text-[#c5a059] hover:underline underline-offset-4">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Form Area */}
        <div className="lg:col-span-7">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm font-medium uppercase tracking-widest text-gray-400 mb-10">
            <span className={step === "shipping" ? "text-[#121c2d]" : "text-gray-400"}>Shipping</span>
            <ChevronRight className="w-4 h-4 mx-3" />
            <span className={step === "payment" ? "text-[#121c2d]" : "text-gray-400"}>Payment</span>
          </div>

          {step === "shipping" ? (
            <div className="bg-white p-8 shadow-sm rounded-sm">
              <h2 className="text-2xl font-serif text-[#121c2d] mb-6">Shipping Details</h2>
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input required type="text" className="w-full border-gray-300 border p-3 focus:outline-none focus:border-[#c5a059] transition-colors" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input required type="tel" className="w-full border-gray-300 border p-3 focus:outline-none focus:border-[#c5a059] transition-colors" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input required type="email" className="w-full border-gray-300 border p-3 focus:outline-none focus:border-[#c5a059] transition-colors" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input required type="text" placeholder="House/Flat No., Street, Area" className="w-full border-gray-300 border p-3 focus:outline-none focus:border-[#c5a059] transition-colors" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input required type="text" className="w-full border-gray-300 border p-3 focus:outline-none focus:border-[#c5a059] transition-colors" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input required type="text" className="w-full border-gray-300 border p-3 focus:outline-none focus:border-[#c5a059] transition-colors" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                    <input required type="text" maxLength={6} placeholder="6-digit PIN" className="w-full border-gray-300 border p-3 focus:outline-none focus:border-[#c5a059] transition-colors" value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#121c2d] text-white py-4 mt-4 uppercase tracking-widest text-sm font-medium hover:bg-[#c5a059] transition-colors">
                  Continue to Payment
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white p-8 shadow-sm rounded-sm">
              <h2 className="text-2xl font-serif text-[#121c2d] mb-6">Payment</h2>

              {/* Order Summary Card */}
              <div className="border border-gray-200 p-5 rounded-md mb-8 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Contact</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Ship to</span>
                  <span className="font-medium text-right max-w-[60%]">{formData.address}, {formData.city}, {formData.state} {formData.zip}</span>
                </div>
                <div className="flex items-center justify-between text-sm border-t pt-3">
                  <span className="text-gray-500">Amount Due</span>
                  <span className="text-xl font-serif text-[#121c2d]">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* UPI Payment Component */}
              <UPIPayment total={total} />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={() => setStep("shipping")}
                  className="sm:w-auto px-6 py-4 border border-gray-300 uppercase tracking-widest text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={isSubmitting}
                  className="flex-1 bg-[#121c2d] text-white py-4 uppercase tracking-widest text-sm font-medium hover:bg-[#c5a059] transition-colors disabled:opacity-60 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    "✓ I Have Paid — Confirm Order"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 shadow-sm rounded-sm sticky top-32">
            <h3 className="text-xl font-serif text-[#121c2d] mb-6 border-b border-gray-100 pb-4">Order Summary</h3>
            <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 bg-gray-50 flex-shrink-0 border border-gray-100 overflow-hidden">
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold z-10">
                      {item.quantity}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                    <p className="text-gray-500 text-xs mt-1 uppercase">{item.brand}</p>
                  </div>
                  <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-500 uppercase text-xs tracking-wider">Complimentary</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-4 mt-4">
                <span className="font-serif text-lg">Total</span>
                <span className="font-serif text-xl text-[#121c2d]">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
