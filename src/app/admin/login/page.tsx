"use client";

import { useAdminStore } from "@/store/useAdminStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const { login } = useAdminStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy authentication
    if (email === "admin@ISHAAQ.com" && password === "luxury") {
      login();
      router.push("/admin/orders");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] px-4">
      <div className="max-w-md w-full bg-white p-10 shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-[#121c2d] flex items-center justify-center rounded-full mb-4">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-serif text-[#121c2d]">Admin Portal</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to manage inventory and orders.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-200">
              Invalid credentials. Try admin@ISHAAQ.com / luxury.
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full border-gray-300 border p-3 focus:outline-none focus:border-[#c5a059] transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full border-gray-300 border p-3 focus:outline-none focus:border-[#c5a059] transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#121c2d] text-white py-4 mt-4 uppercase tracking-widest text-sm font-medium hover:bg-[#1a2942] transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

