"use client";

import { useAdminStore } from "@/store/useAdminStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, ShoppingCart, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAdminStore();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If not authenticated and not on login page, children will handle redirect or showing login.
  // Actually, we'll just render it layout normally, but login route doesn't use this sidebar.
  if (!isAuthenticated && pathname !== "/admin") {
    // We let the pages handle protection
  }

  // Hide sidebar on the login page
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  const navItems = [
    { href: "/admin/products", icon: Package, label: "Inventory" },
    { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  ];

  if (!isAuthenticated) return <div className="min-h-screen bg-gray-50">{children}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans relative">
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-30 px-6 py-4 flex items-center justify-between">
        <span className="font-serif text-lg tracking-wide text-[#121c2d]">ISHAAQ & CO Admin</span>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -mr-2 bg-gray-100 rounded text-[#121c2d]"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-[#121c2d] text-gray-300 flex flex-col pt-10 fixed lg:relative z-50 h-screen transition-transform duration-300",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <button 
          onClick={() => setIsSidebarOpen(false)} 
          className="lg:hidden absolute top-6 right-6 p-2 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-8 pb-8 mb-8 border-b border-gray-700/50">
          <Link href="/" className="font-serif text-xl tracking-widest text-white block">
            ISHAAQ & CO
            <span className="block text-[10px] tracking-widest text-gray-400 mt-1">ADMIN PORTAL</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
              pathname === "/admin" ? "bg-[#1a2942] text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
            onClick={() => setIsSidebarOpen(false)}
          >
            <LayoutDashboard className="w-5 h-5 transition-colors" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                pathname.startsWith(item.href) ? "bg-[#1a2942] text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5 transition-colors" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700/50">
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-6 lg:p-10 pt-24 lg:pt-10 bg-gray-50 text-gray-900 w-full">
        {children}
      </main>
    </div>
  );
}

