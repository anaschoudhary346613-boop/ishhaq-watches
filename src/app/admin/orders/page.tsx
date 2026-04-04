"use client";

import { useAdminStore } from "@/store/useAdminStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Package2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AdminOrders() {
  const { isAuthenticated } = useAdminStore();
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setOrders(data);
  };

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    fetchOrders();

    // Realtime subscription for new orders
    const channel = supabase
      .channel("admin:orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, router]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (!error) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    }
  };

  if (!mounted || !isAuthenticated) return null;

  const filtered = orders.filter(
    (o) =>
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.id?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status: string) => {
    if (status === "Completed") return "bg-green-100 text-green-700";
    if (status === "Shipped") return "bg-blue-100 text-blue-700";
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700"; // Processing default
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#121c2d]">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#c5a059] text-sm w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-gray-400">
                  <Package2 className="w-10 h-10 mx-auto mb-4 opacity-20" />
                  <p className="font-medium">No orders found.</p>
                  <p className="text-xs mt-1">Orders from your storefront will appear here in real-time.</p>
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{order.customer_name}</p>
                    <p className="text-gray-500 text-xs">{order.email}</p>
                    <p className="text-gray-400 text-xs">{order.address}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs">{order.phone}</td>
                  <td className="px-6 py-4 font-medium">₹{order.total_amount?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      className="text-xs border border-gray-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-[#c5a059] min-h-[36px]"
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

