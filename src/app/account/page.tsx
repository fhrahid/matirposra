"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone, MapPin, Lock, Loader2, LogOut, CheckCircle2 } from "lucide-react";

const AccountPage = () => {
  const router = useRouter();
  const { user, loading, setUser, logout } = useAuth();

  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Redirect to login when we know there is no user.
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // Seed the form once the user loads.
  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", phone: user.phone || "", address: user.address || "" });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const payload: Record<string, string> = { ...form };
      if (passwords.newPassword) {
        payload.currentPassword = passwords.currentPassword;
        payload.newPassword = passwords.newPassword;
      }
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setPasswords({ currentPassword: "", newPassword: "" });
        setMessage("প্রোফাইল সফলভাবে আপডেট হয়েছে।");
      } else {
        setError(data.error || "আপডেট ব্যর্থ হয়েছে।");
      }
    } catch {
      setError("সার্ভারে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-cream">
        <Header />
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="animate-spin text-terracotta" size={36} />
          <p className="text-text-mid font-medium">লোড হচ্ছে...</p>
        </div>
        <Footer />
      </main>
    );
  }

  const inputClass =
    "w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm";

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-clay rounded-2xl flex items-center justify-center text-2xl shadow-lg text-white font-tiro">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-tiro text-3xl text-text-dark">{user.name}</h1>
            <p className="text-sm text-text-light flex items-center gap-1.5">
              <Mail size={13} /> {user.email}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream-dark">
          <h3 className="text-lg font-bold text-text-dark mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-terracotta rounded-full"></span>
            প্রোফাইল তথ্য
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <User size={14} className="text-clay" /> পূর্ণ নাম
              </label>
              <input required name="name" value={form.name} onChange={handleChange} className={inputClass} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                  <Mail size={14} className="text-clay" /> ইমেইল
                </label>
                <input value={user.email} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                  <Phone size={14} className="text-clay" /> ফোন নম্বর
                </label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="01700-000000" className={inputClass} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                <MapPin size={14} className="text-clay" /> ঠিকানা
              </label>
              <textarea name="address" value={form.address} onChange={handleChange} rows={2} placeholder="আপনার ঠিকানা" className={`${inputClass} resize-none`} />
            </div>

            <div className="pt-2 border-t border-cream-dark">
              <p className="text-sm font-bold text-text-mid mt-4 mb-3 flex items-center gap-2">
                <Lock size={14} className="text-clay" /> পাসওয়ার্ড পরিবর্তন (ঐচ্ছিক)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="password"
                  placeholder="বর্তমান পাসওয়ার্ড"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
                  className={inputClass}
                />
                <input
                  type="password"
                  placeholder="নতুন পাসওয়ার্ড"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>

            {message && (
              <p className="text-sm text-leaf font-medium flex items-center gap-1.5">
                <CheckCircle2 size={15} /> {message}
              </p>
            )}
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-terracotta text-white py-3.5 rounded-xl font-bold hover:bg-clay transition-all shadow-lg shadow-terracotta/25 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : "পরিবর্তন সংরক্ষণ করুন"}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-white text-red-500 border-1.5 border-cream-dark px-6 py-3.5 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={18} /> লগআউট
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default AccountPage;
