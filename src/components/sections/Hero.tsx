"use client";

import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
      {/* MAIN HERO */}
      <div className="relative min-h-[340px] rounded-2xl overflow-hidden bg-[linear-gradient(135deg,rgba(44,26,14,0.72)_0%,rgba(92,61,46,0.65)_40%,rgba(139,69,19,0.6)_100%)] flex items-center shadow-clay">
        {/* Background Overlay - Simplified for implementation */}
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        
        <div className="relative z-10 p-10 md:p-12 max-w-[58%]">
          <div className="inline-block bg-white/15 text-[#F5DEB3] text-[11px] px-3 py-1 rounded-full mb-3.5 border border-[#F5DEB3]/30">
            ✨ নতুন সংগ্রহ ২০২৫
          </div>
          <h1 className="font-tiro text-3xl md:text-4xl text-white leading-tight mb-3 shadow-sm">
            প্রকৃতির ছোঁয়ায়<br />ঘর হোক আরও<br />সুন্দর
          </h1>
          <p className="text-sm text-[#D4B896] mb-6 leading-relaxed">
            হাতে তৈরি মাটির পণ্য, সরাসরি কারিগরের কাছ থেকে আপনার দরজায়।
          </p>
          <div className="flex gap-3 flex-wrap">
            <button className="bg-terracotta text-white px-6 py-2.5 rounded-lg font-hind text-sm font-semibold hover:bg-[#A33208] hover:-translate-y-0.5 transition-all shadow-lg shadow-terracotta/40">
              এখনই কিনুন →
            </button>
            <button className="bg-white/10 text-white border-1.5 border-white/40 px-6 py-2.5 rounded-lg font-hind text-sm hover:bg-white/20 transition-all backdrop-blur-md">
              সংগ্রহ দেখুন
            </button>
          </div>
        </div>
        
        <div className="absolute right-8 bottom-5 text-[100px] opacity-25 grayscale brightness-150 rotate-[-10deg] hidden md:block">
          🏺
        </div>
      </div>

      {/* SIDE HEROES */}
      <div className="flex flex-col gap-4">
        <div className="group relative flex-1 min-h-[155px] rounded-xl p-5.5 flex flex-col justify-end overflow-hidden shadow-clay cursor-pointer transition-transform hover:-translate-y-0.5 bg-gradient-to-br from-[#3A5A2A]/75 to-[#5A8040]/70">
          <span className="absolute top-2.5 right-3.5 text-6xl opacity-30 grayscale contrast-125">🍲</span>
          <p className="text-[11px] text-white/75 mb-1 font-medium">স্বাস্থ্যকর রান্না</p>
          <h3 className="font-tiro text-lg text-white leading-tight mb-2.5">ঐতিহ্যবাহী রান্নার পাত্র</h3>
          <Link href="#" className="text-[12px] text-white/85 border-b border-white/40 w-fit transition-colors group-hover:text-white">
            রান্নাঘরের পণ্য দেখুন ›
          </Link>
        </div>

        <div className="group relative flex-1 min-h-[155px] rounded-xl p-5.5 flex flex-col justify-end overflow-hidden shadow-clay cursor-pointer transition-transform hover:-translate-y-0.5 bg-gradient-to-br from-[#8B6914]/75 to-[#C4980A]/70">
          <span className="absolute top-2.5 right-3.5 text-6xl opacity-30 grayscale contrast-125">🎁</span>
          <p className="text-[11px] text-white/75 mb-1 font-medium">বিশেষ উপলক্ষে</p>
          <h3 className="font-tiro text-lg text-white leading-tight mb-2.5">হস্তশিল্প উপহার সেট</h3>
          <Link href="#" className="text-[12px] text-white/85 border-b border-white/40 w-fit transition-colors group-hover:text-white">
            উপহার সংগ্রহ দেখুন ›
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
