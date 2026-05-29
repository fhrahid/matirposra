"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ChevronLeft, CheckCircle2, Loader2, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, totalPrice, clearCart, setIsTrackingOpen } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Redirect if cart is empty and not on success screen
  useEffect(() => {
    if (cartItems.length === 0 && !success) {
      const timer = setTimeout(() => {
        if (cartItems.length === 0 && !success) router.push("/");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [cartItems, success, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items: cartItems.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            icon: item.icon
          })),
          totalPrice: totalPrice,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderNumber(data.orderNumber);
        setSuccess(true);
        clearCart();
      } else {
        alert("অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("সার্ভারে সমস্যা হয়েছে। দয়া করে পরে চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-cream">
        <Header />
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <div className="w-20 h-20 bg-leaf/15 text-leaf rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="font-tiro text-3xl text-text-dark mb-3">অর্ডার সফল হয়েছে!</h1>
          <p className="text-text-mid mb-8 leading-relaxed">
            আপনার অর্ডারটি আমরা গ্রহণ করেছি। আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
          </p>
          
          <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-cream-dark mb-8">
            <div className="text-xs text-text-light uppercase tracking-wider mb-1">আপনার অর্ডার নম্বর</div>
            <div className="text-2xl font-bold text-terracotta font-mono tracking-tight">{orderNumber}</div>
            <p className="text-[10px] text-text-light mt-2">এই নম্বরটি ট্র্যাকিংয়ের জন্য সংরক্ষণ করুন</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="bg-terracotta text-white px-8 py-3 rounded-xl font-bold hover:bg-clay transition-all shadow-lg shadow-terracotta/25">
              হোমে ফিরে যান
            </Link>
            <button 
              onClick={() => setIsTrackingOpen(true)}
              className="bg-white text-text-dark border-1.5 border-cream-dark px-8 py-3 rounded-xl font-bold hover:bg-cream transition-all"
            >
              অর্ডার ট্র্যাক করুন
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <Link href="/" className="flex items-center gap-1.5 text-text-light hover:text-terracotta text-sm mb-6 transition-colors">
              <ChevronLeft size={16} /> কেনাকাটায় ফিরে যান
            </Link>
            
            <h1 className="font-tiro text-3xl text-text-dark mb-8">অর্ডার সম্পন্ন করুন</h1>
            
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream-dark">
              <h3 className="text-lg font-bold text-text-dark mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-terracotta rounded-full"></span>
                ডেলিভারি তথ্য
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                      <User size={14} className="text-clay" /> আপনার নাম
                    </label>
                    <input 
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="যেমন: রহিম মৃধা"
                      className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                      <Phone size={14} className="text-clay" /> ফোন নম্বর
                    </label>
                    <input 
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="যেমন: 01700-000000"
                      className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-mid flex items-center gap-2">
                    <MapPin size={14} className="text-clay" /> সম্পূর্ণ ঠিকানা
                  </label>
                  <textarea 
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="আপনার বাসার নম্বর, রোড, এলাকা ও জেলা উল্লেখ করুন"
                    className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm resize-none"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-terracotta text-white py-4 rounded-xl font-bold text-lg hover:bg-earth transition-all shadow-xl shadow-terracotta/25 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><Loader2 className="animate-spin" /> প্রসেসিং হচ্ছে...</>
                    ) : (
                      "অর্ডার নিশ্চিত করুন ৳ " + totalPrice.toLocaleString("bn-BD")
                    )}
                  </button>
                  <p className="text-center text-[10px] text-text-light mt-4">
                    "অর্ডার নিশ্চিত করুন" বাটনে ক্লিক করার মাধ্যমে আপনি আমাদের শর্তাবলীতে সম্মত হচ্ছেন।
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:w-[400px]">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream-dark sticky top-24">
              <h3 className="text-lg font-bold text-text-dark mb-6">অর্ডার সামারি</h3>
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-14 h-14 bg-cream rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-text-dark truncate">{item.name}</div>
                      <div className="text-xs text-text-light mt-0.5">{item.qty} টি × ৳{item.price.toLocaleString("bn-BD")}</div>
                    </div>
                    <div className="text-sm font-bold text-terracotta">
                      ৳{(item.price * item.qty).toLocaleString("bn-BD")}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-6 border-t border-cream-dark">
                <div className="flex justify-between text-sm text-text-mid">
                  <span>সাবটোটাল</span>
                  <span>৳{totalPrice.toLocaleString("bn-BD")}</span>
                </div>
                <div className="flex justify-between text-sm text-text-mid">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="text-leaf font-bold">ফ্রি</span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-dashed border-cream-dark mt-2">
                  <span className="text-lg font-bold text-text-dark">মোট</span>
                  <span className="text-2xl font-bold text-terracotta font-tiro">
                    ৳{totalPrice.toLocaleString("bn-BD")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default CheckoutPage;
