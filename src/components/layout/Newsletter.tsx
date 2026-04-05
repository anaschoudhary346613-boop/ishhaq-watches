"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="py-24 bg-[#121c2d] overflow-hidden relative">
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a059]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#c5a059]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif text-white tracking-wide">
              Join the ISHAAQ & CO Circle
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-light tracking-widest uppercase">
              Exclusive Access • Curated Collections • Horological Heritage
            </p>
          </div>

          {status === "success" ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-in fade-in zoom-in duration-700">
              <CheckCircle2 className="w-12 h-12 text-[#c5a059]" />
              <p className="text-white font-medium">Welcome to the inner circle.</p>
              <p className="text-gray-400 text-sm">A confirmation has been sent to your inbox.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative max-w-md mx-auto group">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-gray-700 py-4 px-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#c5a059] transition-colors font-light text-lg"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="absolute right-0 bottom-4 text-gray-400 hover:text-[#c5a059] transition-colors"
                aria-label="Subscribe"
              >
                {status === "loading" ? (
                  <div className="w-5 h-5 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-6 h-6" />
                )}
              </button>
            </form>
          )}

          <p className="text-[10px] text-gray-600 uppercase tracking-widest pt-4">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
}
