"use client";

import React, { useState } from "react";
import { Star, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const ProductSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");
  const [rating, setRating] = useState(searchParams.get("rating") || "");

  const updateFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("min", minPrice); else params.delete("min");
    if (maxPrice) params.set("max", maxPrice); else params.delete("max");
    if (rating) params.set("rating", rating); else params.delete("rating");
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleRatingChange = (stars: number) => {
    const newRating = rating === stars.toString() ? "" : stars.toString();
    setRating(newRating);
    const params = new URLSearchParams(searchParams.toString());
    if (newRating) params.set("rating", newRating); else params.delete("rating");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setRating("");
    router.push(pathname);
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 border border-cream-dark">
        <div className="flex items-center justify-between mb-5 pb-2 border-b border-cream-dark">
          <h3 className="font-bold text-text-dark">ফিল্টার করুন</h3>
          {(minPrice || maxPrice || rating) && (
            <button onClick={clearFilters} className="text-[10px] text-terracotta hover:underline flex items-center gap-0.5">
              <X size={10} /> মুছুন
            </button>
          )}
        </div>
        
        {/* PRICE RANGE */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-text-mid mb-4">মূল্য পরিসীমা</h4>
          <div className="flex items-center gap-2 mb-3">
            <input 
              type="number" 
              placeholder="মিন" 
              className="w-full px-3 py-1.5 bg-cream border border-cream-dark rounded-md text-xs outline-none focus:border-terracotta" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="text-text-light">−</span>
            <input 
              type="number" 
              placeholder="ম্যাক্স" 
              className="w-full px-3 py-1.5 bg-cream border border-cream-dark rounded-md text-xs outline-none focus:border-terracotta" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <button 
            onClick={updateFilters}
            className="w-full bg-clay text-white py-1.5 rounded-md text-xs font-semibold hover:bg-earth transition-colors"
          >
            প্রয়োগ করুন
          </button>
        </div>

        {/* RATING */}
        <div>
          <h4 className="text-sm font-semibold text-text-mid mb-4">রেটিং</h4>
          <div className="space-y-2.5">
            {[4, 3, 2].map((stars) => (
              <label key={stars} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-3.5 h-3.5 accent-terracotta" 
                  checked={rating === stars.toString()}
                  onChange={() => handleRatingChange(stars)}
                />
                <div className="flex text-[#F5A623] gap-0.5 group-hover:scale-105 transition-transform">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} fill={i < stars ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-xs text-text-light">& up</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProductSidebar;
