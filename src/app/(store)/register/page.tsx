"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] px-4 pt-20">
        <div className="max-w-md w-full bg-white p-10 shadow-sm border border-gray-100 text-center">
          <h2 className="text-2xl font-serif text-[#121c2d] mb-4">Account Created</h2>
          <p className="text-gray-600 text-sm mb-6">Welcome to ISHHAQ & CO. You will be redirected to the login page momentarily.</p>
          <div className="w-8 h-8 border-2 border-[#121c2d] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#faf9f6] px-4 py-32">
      <div className="max-w-md w-full bg-white p-10 shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif text-[#121c2d]">Create an Account</h1>
          <p className="text-sm text-gray-500 mt-2">Join our prestigious clientele.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-200">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                required
                className="w-full border-gray-300 border p-3 focus:outline-none focus:border-[#c5a059] transition-colors"
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                required
                className="w-full border-gray-300 border p-3 focus:outline-none focus:border-[#c5a059] transition-colors"
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full border-gray-300 border p-3 focus:outline-none focus:border-[#c5a059] transition-colors"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full border-gray-300 border p-3 focus:outline-none focus:border-[#c5a059] transition-colors"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#121c2d] text-white py-4 mt-2 uppercase tracking-widest text-sm font-medium hover:bg-[#c5a059] transition-colors disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Already have an account? <Link href="/login" className="text-[#121c2d] hover:text-[#c5a059] underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
