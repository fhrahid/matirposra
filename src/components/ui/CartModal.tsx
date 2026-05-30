"use client";

import React from "react";
import { X, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

import { useRouter } from "next/navigation";

const CartModal = () => {
  const router = useRouter();
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cartItems, 
    updateQty, 
    removeFromCart, 
    totalItems, 
    totalPrice 
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-text-dark/55 z-[9999] backdrop-blur-[3px] flex items-start justify-center pt-20"
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsCartOpen(false);
        }}
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="bg-white rounded-[20px] w-full max-w-[600px] shadow-2xl overflow-hidden max-h-[80vh] flex flex-col mx-4"
        >
          <div className="bg-gradient-to-br from-terracotta to-clay p-5 md:px-7 flex items-center justify-between flex-shrink-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[11px] text-white/85 font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-[#7fff7f] rounded-full animate-pulse"></span>
                আপনার শপিং কার্ট
              </div>
              <h2 className="font-tiro text-xl text-white">🛒 কার্ট</h2>
              <p className="text-xs text-white/75 mt-0.5">
                {cartItems.length > 0 ? `${totalItems}টি পণ্য আছে` : "কার্টে কোনো পণ্য নেই"}
              </p>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="bg-white/18 text-white w-8.5 h-8.5 rounded-full flex items-center justify-center hover:bg-white/32 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-8 md:px-7 md:py-8">
            {cartItems.length === 0 ? (
              <div className="text-center py-6 flex flex-col items-center gap-3.5">
                <div className="text-6xl grayscale-[0.2]">🏺</div>
                <div className="font-tiro text-lg text-clay">আপনার কার্টটি এখনো খালি</div>
                <p className="text-sm text-text-mid leading-relaxed max-w-[420px]">
                  আমাদের হাতে তৈরি মাটির পণ্যের অনন্য সংগ্রহ ঘুরে দেখুন এবং নিজের ঘর, প্রিয়জন কিংবা বিশেষ মুহূর্তের জন্য পছন্দের কিছু বেছে নিন।
                </p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="mt-1.5 bg-terracotta text-white font-hind text-sm font-semibold px-7 py-2.5 rounded-full shadow-lg shadow-terracotta/35 hover:bg-clay hover:-translate-y-0.5 transition-all"
                >
                  🛍️ পণ্য দেখুন
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3.5 bg-cream rounded-xl p-3 md:px-3.5 border border-cream-dark">
                    <div className="text-3xl w-13 h-13 bg-cream-dark rounded-xl flex items-center justify-center flex-shrink-0">
                      {item.icon || "🏺"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-text-dark truncate mb-0.5">{item.name}</div>
                      <div className="text-sm text-terracotta font-bold">৳{item.price.toLocaleString("bn-BD")}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQty(item.id, -1)}
                        className="w-6.5 h-6.5 bg-cream-dark rounded-md text-sm hover:bg-terracotta hover:text-white transition-all"
                      >
                        −
                      </button>
                      <span className="font-bold text-sm min-w-[18px] text-center">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.id, 1)}
                        className="w-6.5 h-6.5 bg-cream-dark rounded-md text-sm hover:bg-terracotta hover:text-white transition-all"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-text-light hover:text-[#c0392b] transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t-1.5 border-cream-dark p-4.5 md:px-7 md:py-6 bg-white flex-shrink-0">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] text-text-light">সাবটোটাল</span>
                <span className="text-[13px] font-semibold text-text-dark">৳{totalPrice.toLocaleString("bn-BD")}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] text-text-light">ডেলিভারি চার্জ</span>
                <span className="text-[13px] text-leaf font-medium">✓ বিনামূল্যে</span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-dashed border-cream-dark mt-1.5 mb-4">
                <span className="text-base font-bold text-text-dark">মোট</span>
                <span className="text-xl font-bold text-terracotta font-tiro">৳{totalPrice.toLocaleString("bn-BD")}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-terracotta to-clay text-white py-3.5 rounded-xl font-hind text-[15px] font-bold shadow-lg shadow-terracotta/35 hover:opacity-90 hover:-translate-y-0.5 transition-all"
              >
                অর্ডার করুন →
              </button>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-transparent text-text-mid border-1.5 border-cream-dark py-2.5 rounded-xl font-hind text-[13px] font-medium mt-2 hover:border-terracotta hover:text-terracotta transition-all"
              >
                ← কেনাকাটা চালিয়ে যান
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CartModal;
