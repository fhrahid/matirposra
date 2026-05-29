"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Loader2 } from "lucide-react";

const AdminLoginPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple demo password check
    // In production, this should be an API call or use NextAuth
    setTimeout(() => {
      if (password === "admin123") {
        localStorage.setItem("admin_auth", "true");
        router.push("/admin");
      } else {
        setError("ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-terracotta to-clay rounded-3xl flex items-center justify-center text-4xl shadow-xl mx-auto mb-4 text-white">
            🏺
          </div>
          <h1 className="font-tiro text-3xl text-text-dark">অ্যাডমিন প্যানেল</h1>
          <p className="text-sm text-text-light mt-2">আপনার স্টোর পরিচালনা করতে লগইন করুন</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-clay/10 border border-cream-dark">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <User size={14} className="text-clay" /> ইউজারনেম
              </label>
              <input 
                type="text"
                disabled
                value="admin"
                className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none text-text-mid text-sm opacity-60 cursor-not-allowed"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <Lock size={14} className="text-clay" /> পাসওয়ার্ড
              </label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
              />
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta text-white py-4 rounded-xl font-bold hover:bg-clay transition-all shadow-lg shadow-terracotta/25 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "লগইন করুন"}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <button 
              onClick={() => router.push("/")}
              className="text-xs text-text-light hover:text-terracotta transition-colors"
            >
              ← মূল সাইটে ফিরে যান
            </button>
          </div>
        </div>
        
        <p className="text-center text-[10px] text-text-light mt-8">
          © ২০২৫ মাটির পশরা | অ্যাডমিন পোর্টাল
        </p>
      </div>
    </main>
  );
};

export default AdminLoginPage;
