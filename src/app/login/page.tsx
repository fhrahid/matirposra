"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Loader2 } from "lucide-react";

const LoginPage = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        router.push("/account");
      } else {
        setError(data.error || "লগইন ব্যর্থ হয়েছে।");
      }
    } catch {
      setError("সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm";

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <Navbar />

      <div className="max-w-md mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-clay rounded-2xl flex items-center justify-center text-3xl shadow-xl mx-auto mb-4 text-white">
            🏺
          </div>
          <h1 className="font-tiro text-3xl text-text-dark">স্বাগতম</h1>
          <p className="text-sm text-text-light mt-2">আপনার অ্যাকাউন্টে লগইন করুন</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream-dark">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <Mail size={14} className="text-clay" /> ইমেইল
              </label>
              <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputClass} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <Lock size={14} className="text-clay" /> পাসওয়ার্ড
              </label>
              <input required type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className={inputClass} />
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta text-white py-3.5 rounded-xl font-bold hover:bg-clay transition-all shadow-lg shadow-terracotta/25 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "লগইন করুন"}
            </button>
          </form>

          <p className="text-center text-sm text-text-light mt-6">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/register" className="text-terracotta font-bold hover:underline">
              রেজিস্ট্রেশন করুন
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default LoginPage;
