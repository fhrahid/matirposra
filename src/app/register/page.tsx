"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone, MapPin, Lock, Loader2 } from "lucide-react";

const RegisterPage = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("পাসওয়ার্ড দুটি মিলছে না।");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        const redirect = new URLSearchParams(window.location.search).get("redirect");
        router.push(redirect || "/account");
      } else {
        setError(data.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।");
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

      <div className="max-w-md mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-clay rounded-2xl flex items-center justify-center text-3xl shadow-xl mx-auto mb-4 text-white">
            🏺
          </div>
          <h1 className="font-tiro text-3xl text-text-dark">নতুন অ্যাকাউন্ট খুলুন</h1>
          <p className="text-sm text-text-light mt-2">মাটির পশরায় যোগ দিন এবং কেনাকাটা শুরু করুন</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream-dark">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <User size={14} className="text-clay" /> পূর্ণ নাম
              </label>
              <input required name="name" value={form.name} onChange={handleChange} placeholder="যেমন: রহিম মৃধা" className={inputClass} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <Mail size={14} className="text-clay" /> ইমেইল
              </label>
              <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputClass} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <Phone size={14} className="text-clay" /> ফোন নম্বর
              </label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="01700-000000" className={inputClass} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <MapPin size={14} className="text-clay" /> ঠিকানা
              </label>
              <textarea name="address" value={form.address} onChange={handleChange} rows={2} placeholder="আপনার ঠিকানা" className={`${inputClass} resize-none`} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <Lock size={14} className="text-clay" /> পাসওয়ার্ড
              </label>
              <input required type="password" name="password" value={form.password} onChange={handleChange} placeholder="কমপক্ষে ৬ অক্ষর" className={inputClass} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <Lock size={14} className="text-clay" /> পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input required type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="আবার লিখুন" className={inputClass} />
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta text-white py-3.5 rounded-xl font-bold hover:bg-clay transition-all shadow-lg shadow-terracotta/25 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "অ্যাকাউন্ট তৈরি করুন"}
            </button>
          </form>

          <p className="text-center text-sm text-text-light mt-6">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link href="/login" className="text-terracotta font-bold hover:underline">
              লগইন করুন
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default RegisterPage;
