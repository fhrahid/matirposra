"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, Package, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const router = useRouter();
  const { totalItems, setIsCartOpen, setIsTrackingOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-earth text-[#F5DEB3] text-xs py-1.5 text-center tracking-wide">
        🎉 বিশেষ অফার: ৫০০ টাকার বেশি কেনাকাটায় ফ্রি শিপিং! | হটলাইন: 01700-000000 | সকাল ৯টা - রাত ১০টা
      </div>

      {/* HEADER */}
      <header className="bg-white shadow-clay sticky top-0 z-[1000]">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-12 h-12 bg-gradient-to-br from-terracotta to-clay rounded-full flex items-center justify-center text-2xl shadow-clay transition-transform group-hover:scale-105">
              🏺
            </div>
            <div className="logo-text">
              <h1 className="font-tiro text-xl text-clay leading-tight">মাটির পশরা</h1>
              <p className="text-[10px] text-text-light font-normal">ঐতিহ্যের ছোঁয়ায় মাটির সৃষ্টি</p>
            </div>
          </Link>

          <div className="flex-1 flex items-center bg-cream border-1.5 border-cream-dark rounded-lg overflow-hidden transition-colors focus-within:border-terracotta">
            <input
              type="text"
              placeholder="মাটির পণ্য খুঁজুন... হাড়ি, ফুলদানি, শোপিস..."
              className="flex-1 bg-transparent px-4 py-2 text-sm text-text-dark outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              onClick={handleSearch}
              className="bg-terracotta px-4.5 py-2 text-white hover:bg-earth transition-colors"
            >
              <Search size={18} />
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button className="bg-transparent border-1.5 border-clay text-clay px-4 py-1.5 rounded-md text-sm font-medium hover:bg-clay hover:text-white transition-all">
              লগইন
            </button>
            <button className="bg-terracotta text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-earth transition-all">
              রেজিস্ট্রেশন
            </button>
            
            <div className="flex items-center gap-1 ml-2">
              <button className="flex flex-col items-center gap-0.5 p-1.5 text-text-mid hover:bg-cream-dark hover:text-terracotta rounded-lg transition-all">
                <Heart size={20} />
                <span className="text-[10px]">পছন্দ</span>
              </button>
              
              <button 
                onClick={() => setIsTrackingOpen(true)}
                className="flex flex-col items-center gap-0.5 p-1.5 text-text-mid hover:bg-cream-dark hover:text-terracotta rounded-lg transition-all"
              >
                <Package size={20} />
                <span className="text-[10px]">ট্র্যাকিং</span>
              </button>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative flex flex-col items-center gap-0.5 p-1.5 text-text-mid hover:bg-cream-dark hover:text-terracotta rounded-lg transition-all"
              >
                <ShoppingCart size={20} />
                <span className="text-[10px]">কার্ট</span>
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-terracotta text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
