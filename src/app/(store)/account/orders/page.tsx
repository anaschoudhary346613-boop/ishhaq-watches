"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Package2, Clock, ArrowLeft } from "lucide-react";

export default function CustomerOrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
    setSearched(true);
  };

  const statusColor = (status: string) => {
    if (status === "Completed") return "bg-green-100 text-green-700";
    if (status === "Shipped") return "bg-blue-100 text-blue-700";
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#121c2d] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <h1 className="text-3xl font-serif text-[#121c2d] mb-2">Your Orders</h1>
        <p className="text-sm text-gray-500 mb-8">Enter your email address to view your order history.</p>

        <form onSubmit={handleSearch} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            required
            placeholder="Enter your email address..."
            className="flex-1 min-h-[44px] border border-gray-200 px-4 py-2 rounded focus:outline-none focus:border-[#c5a059] text-sm transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="min-h-[44px] px-8 bg-[#121c2d] text-white text-sm uppercase tracking-widest font-medium rounded hover:bg-[#c5a059] transition-colors"
          >
            Find Orders
          </button>
        </form>

        {loading && searched && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse space-y-3">
                <div className="h-4 bg-gray-100 rounded w-40" />
                <div className="h-3 bg-gray-100 rounded w-64" />
              </div>
            ))}
          </div>
        )}

        {!loading && searched && orders.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Package2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium text-gray-600">No orders found for this email</p>
            <p className="text-sm mt-2">Make sure you use the same email you checked out with.</p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono text-xs text-gray-400 mb-1">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "long", year: "numeric"
                      })}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="h-px bg-gray-50 mb-4" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Ship To</p>
                    <p className="font-medium text-gray-800">{order.customer_name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{order.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order Total</p>
                    <p className="text-2xl font-serif text-[#121c2d]">₹{order.total_amount?.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{order.payment_method}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

