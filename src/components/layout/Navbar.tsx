"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { items, setIsOpen } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hydration fix for client-side Zustand store to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-40 transition-all duration-500",
        isScrolled
          ? "glass shadow-sm py-3 border-b border-gray-100"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 -ml-2 text-[#121c2d]"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex flex-col items-center group lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <span className="font-serif text-2xl tracking-wide text-[#121c2d]">
            ISHAAQ & CO
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-gray-500">
            Timepiece
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center space-x-10 text-xs font-medium uppercase tracking-widest text-[#121c2d]">
          <Link href="/#collection" className="hover:text-[#c5a059] transition-colors">Our Collection</Link>
          <Link href="/track-order" className="hover:text-[#c5a059] transition-colors">Track Order</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-6">
          <Link href="/account/orders" className="hidden lg:block text-[#121c2d] hover:text-[#c5a059] transition-colors" title="My Orders">
            <User className="w-5 h-5" />
          </Link>
          <button className="hidden lg:block text-[#121c2d] hover:text-[#c5a059] transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsOpen(true)}
            className="group relative text-[#121c2d] hover:text-[#c5a059] transition-colors p-2 -mr-2"
          >
            <ShoppingBag className="w-5 h-5" />
            {mounted && itemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#c5a059] text-white text-[9px] font-bold flex items-center justify-center rounded-full pointer-events-none group-hover:scale-110 transition-transform">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl py-4 px-6 flex flex-col space-y-4 border-t border-gray-100">
          <Link href="/#collection" onClick={() => setIsMobileMenuOpen(false)} className="text-[#121c2d] uppercase tracking-widest text-sm font-medium py-2 border-b border-gray-50">Our Collection</Link>
          <Link href="/track-order" onClick={() => setIsMobileMenuOpen(false)} className="text-[#121c2d] uppercase tracking-widest text-sm font-medium py-2 border-b border-gray-50">Track Order</Link>
          <Link href="/account/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-[#121c2d] uppercase tracking-widest text-sm font-medium py-2 border-b border-gray-50">My Orders</Link>
          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-[#121c2d] uppercase tracking-widest text-sm font-medium py-2">Login / Register</Link>
        </div>
      )}
    </header>
  );
}

