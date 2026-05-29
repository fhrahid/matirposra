"use client";

import React, { useState } from "react";
import { X, Search, Package, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const statusSteps: Record<string, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
};

const statusLabels: Record<string, string> = {
  pending: "অর্ডার নিশ্চিত হয়েছে",
  processing: "প্যাকেজিং সম্পন্ন",
  shipped: "ডেলিভারিম্যানের সাথে আছে",
  delivered: "ডেলিভারি সম্পন্ন",
};

const TrackingModal = () => {
  const { isTrackingOpen, setIsTrackingOpen } = useCart();
  const [orderNumber, setOrderNumber] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!isTrackingOpen) return null;

  const handleSearch = async () => {
    if (!orderNumber.trim()) return;
    
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/orders?orderNumber=${orderNumber.trim()}`);
      const data = await res.json();
      if (data.order) {
        setResult(data.order);
      } else {
        setResult("not-found");
      }
    } catch (error) {
      console.error("Tracking Fetch Error:", error);
      setResult("not-found");
    } finally {
      setLoading(false);
    }
  };

  const getSteps = (status: string) => {
    const currentStep = statusSteps[status] ?? 0;
    return [
      { title: "অর্ডার নিশ্চিত হয়েছে", done: currentStep >= 0, active: currentStep === 0 },
      { title: "প্যাকেজিং সম্পন্ন", done: currentStep >= 1, active: currentStep === 1 },
      { title: "ডেলিভারিম্যানের সাথে আছে", done: currentStep >= 2, active: currentStep === 2 },
      { title: "ডেলিভারি সম্পন্ন", done: currentStep >= 3, active: currentStep === 3 },
    ];
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-text-dark/55 z-[9999] backdrop-blur-[3px] flex items-start justify-center pt-20"
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsTrackingOpen(false);
        }}
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="bg-white rounded-[20px] w-full max-w-[680px] shadow-2xl overflow-hidden mx-4"
        >
          <div className="bg-gradient-to-br from-terracotta to-clay p-5 md:px-7 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[11px] text-white/85 font-semibold uppercase tracking-wider mb-1">
                <span className="w-1.5 h-1.5 bg-leaf-light rounded-full animate-pulse"></span>
                লাইভ অর্ডার ট্র্যাকিং
              </div>
              <h2 className="font-tiro text-2xl text-white">আপনার অর্ডার ট্র্যাক করুন</h2>
              <p className="text-xs text-white/80">রিয়েল-টাইমে আপনার পণ্যের অবস্থান জানুন</p>
            </div>
            <button 
              onClick={() => setIsTrackingOpen(false)}
              className="bg-white/20 text-white w-8.5 h-8.5 rounded-full flex items-center justify-center hover:bg-white/35 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-5 md:px-7 bg-cream border-b border-cream-dark flex gap-3">
            <input 
              className="flex-1 px-4.5 py-3 border-1.5 border-cream-dark rounded-xl font-hind text-[15px] text-text-dark bg-white outline-none focus:border-terracotta transition-colors"
              type="text" 
              placeholder="অর্ডার নম্বর লিখুন... (যেমন: MP-2025-001)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch}
              className="bg-terracotta text-white rounded-xl px-5.5 py-3 font-hind text-[15px] font-bold hover:bg-clay transition-all whitespace-nowrap"
            >
              🔍 খুঁজুন
            </button>
          </div>

          <div className="p-8 md:px-7 min-h-[220px] flex items-center justify-center bg-white">
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-terracotta" size={32} />
                <p className="text-sm text-text-mid">অর্ডার খোঁজা হচ্ছে...</p>
              </div>
            ) : !result ? (
              <div className="text-center py-4">
                <Package size={52} className="text-cream-dark mx-auto mb-3.5" />
                <h3 className="font-tiro text-lg text-text-dark mb-2">অর্ডার নম্বর দিন</h3>
                <p className="text-sm text-clay max-w-[320px] mx-auto leading-relaxed">আপনার অর্ডার নম্বরটি উপরের বক্সে লিখে "খুঁজুন" বাটনে চাপুন।</p>
              </div>
            ) : result === "not-found" ? (
              <div className="text-center py-4">
                <div className="text-5xl mb-3.5">😔</div>
                <h3 className="font-tiro text-lg text-text-dark mb-2">অর্ডার পাওয়া যায়নি</h3>
                <p className="text-sm text-clay max-w-[320px] mx-auto leading-relaxed mb-5">এই নম্বরে কোনো অর্ডার খুঁজে পাওয়া যায়নি। নম্বরটি আবার যাচাই করে চেষ্টা করুন।</p>
                <button 
                  onClick={() => setIsTrackingOpen(false)}
                  className="bg-terracotta text-white rounded-full px-7 py-2.5 font-hind text-sm font-bold hover:bg-clay transition-all"
                >
                  ← কেনাকাটায় ফিরুন
                </button>
              </div>
            ) : (
              <div className="w-full">
                <div className="bg-cream rounded-xl p-4 md:px-5 flex justify-between items-center flex-wrap gap-2.5 border border-cream-dark mb-5">
                  <div className="flex gap-10">
                    <div>
                      <div className="text-[12px] text-clay mb-0.5">অর্ডার নম্বর</div>
                      <div className="text-[15px] font-bold text-text-dark">{result.orderNumber}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-clay mb-0.5">মোট মূল্য</div>
                      <div className="text-[15px] font-bold text-text-dark">৳{result.totalPrice.toLocaleString("bn-BD")}</div>
                    </div>
                  </div>
                  <span className="bg-terracotta/12 text-terracotta text-[12px] font-bold px-3.5 py-1 rounded-full border border-terracotta/25">
                    🚚 {statusLabels[result.status] || result.status}
                  </span>
                </div>

                <div className="flex flex-col gap-0">
                  {getSteps(result.status).map((step, i, arr) => (
                    <div key={i} className={`flex gap-4 items-start relative ${i !== arr.length - 1 ? "after:content-[''] after:absolute after:left-[15px] after:top-8 after:w-0.5 after:h-[calc(100%+4px)] after:bg-cream-dark" : ""} ${step.done ? "after:bg-terracotta" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] flex-shrink-0 z-10 border-2 transition-all ${
                        step.done ? "bg-terracotta border-terracotta text-white" : 
                        step.active ? "bg-white border-terracotta animate-pulse text-terracotta" : 
                        "bg-cream-dark border-cream-dark opacity-40"
                      }`}>
                        {step.done ? "✓" : i + 1}
                      </div>
                      <div className="pb-5">
                        <h4 className={`text-[14px] font-bold mb-0.5 ${!step.done && !step.active ? "text-[#B0A090]" : "text-text-dark"}`}>{step.title}</h4>
                        {step.active && <span className="text-[12px] text-terracotta font-medium animate-pulse">প্রক্রিয়াধীন...</span>}
                        {step.done && !step.active && <span className="text-[12px] text-leaf font-medium">সম্পন্ন</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrackingModal;
