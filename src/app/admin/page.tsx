"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";
import { createClient } from "@/utils/supabase/client";
import { ShoppingBag, Package2, TrendingUp, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { isAuthenticated } = useAdminStore();
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    const [ordersRes, productsRes] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("id"),
    ]);

    if (ordersRes.data) {
      const orders = ordersRes.data;
      const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
      const pendingOrders = orders.filter((o: any) => o.status === "Processing").length;
      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: productsRes.data?.length || 0,
        pendingOrders,
      });
      setRecentOrders(orders.slice(0, 5));
    }
    setLoading(false);
  };

  if (!mounted || !isAuthenticated) return null;

  const StatCard = ({ title, value, icon: Icon, color, sub }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-2">{title}</p>
        {loading ? (
          <div className="h-8 w-32 bg-gray-100 rounded animate-pulse" />
        ) : (
          <p className="text-3xl font-serif text-[#121c2d]">{value}</p>
        )}
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );

  const statusColor = (status: string) => {
    if (status === "Completed") return "bg-green-100 text-green-700";
    if (status === "Shipped") return "bg-blue-100 text-blue-700";
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-[#121c2d]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back to ISHAAQ & CO admin.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
          icon={TrendingUp}
          color="bg-[#c5a059]/10 text-[#c5a059]"
          sub="All time"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="bg-blue-50 text-blue-500"
          sub="All time"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Clock}
          color="bg-amber-50 text-amber-500"
          sub="Need processing"
        />
        <StatCard
          title="Products"
          value={stats.totalProducts}
          icon={Package2}
          color="bg-purple-50 text-purple-500"
          sub="In inventory"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between py-5 px-6 border-b border-gray-100">
          <h2 className="font-serif text-lg text-[#121c2d]">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-[#c5a059] hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-40 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-56 animate-pulse" />
                </div>
                <div className="h-6 bg-gray-100 rounded w-24 animate-pulse" />
              </div>
            ))
          ) : recentOrders.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              <ShoppingBag className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No orders yet. Share your store link!</p>
            </div>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 hover:bg-gray-50 gap-4">
                <div>
                  <p className="font-medium text-sm text-gray-900">{order.customer_name}</p>
                  <p className="text-xs text-gray-400">{order.email} · {new Date(order.created_at).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                  <span className="font-medium text-sm">₹{order.total_amount?.toLocaleString("en-IN")}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/products/new" className="bg-[#121c2d] text-white rounded-xl p-6 hover:bg-[#1a2942] transition-colors flex items-center justify-between group">
          <div>
            <p className="font-serif text-lg">Add New Watch</p>
            <p className="text-xs text-gray-400 mt-1">Upload product to inventory</p>
          </div>
          <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
        <Link href="/admin/orders" className="bg-white border border-gray-200 text-[#121c2d] rounded-xl p-6 hover:border-[#c5a059] transition-colors flex items-center justify-between group">
          <div>
            <p className="font-serif text-lg">Manage Orders</p>
            <p className="text-xs text-gray-400 mt-1">{stats.pendingOrders} pending orders</p>
          </div>
          <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

