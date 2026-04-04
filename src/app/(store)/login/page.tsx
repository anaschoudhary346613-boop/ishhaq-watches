"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid login credentials.");
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#faf9f6] px-4 py-32">
      <div className="max-w-md w-full bg-white p-10 shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif text-[#121c2d]">Sign In</h1>
          <p className="text-sm text-gray-500 mt-2">Access your exclusive client portal.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-200">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full border-gray-300 border p-3 focus:outline-none focus:border-[#c5a059] transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-xs uppercase tracking-wider text-gray-700">Password</label>
              <Link href="#" className="text-xs text-[#c5a059] hover:underline">Forgot password?</Link>
            </div>
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
            disabled={loading}
            className="w-full bg-[#121c2d] text-white py-4 mt-4 uppercase tracking-widest text-sm font-medium hover:bg-[#c5a059] transition-colors disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-8">
          Don't have an account? <Link href="/register" className="text-[#121c2d] hover:text-[#c5a059] underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
