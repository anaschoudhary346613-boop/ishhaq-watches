"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Don't show the floating button inside the admin panel
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919890902869";
  const message = "Hello ISHAAQ & CO, I am interested in exploring your collection.";

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3.5 rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
      aria-label="Contact on WhatsApp"
    >
      {/* Official WhatsApp SVG Logo */}
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="fill-current w-7 h-7"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-[#121c2d] px-3 py-1.5 text-xs font-semibold uppercase tracking-widest rounded shadow gap-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none before:absolute before:top-1/2 before:-translate-y-1/2 before:-right-1 before:border-[5px] before:border-transparent before:border-l-white border border-gray-100">
        Concierge Chat
      </span>
    </a>
  );
}
