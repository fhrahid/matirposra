"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import CartModal from "@/components/ui/CartModal";
import TrackingModal from "@/components/ui/TrackingModal";
import { Search as SearchIcon, Loader2 } from "lucide-react";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-cream-dark rounded-xl flex items-center justify-center text-terracotta">
            <SearchIcon size={24} />
          </div>
          <div>
            <h1 className="font-tiro text-3xl text-text-dark">অনুসন্ধানের ফলাফল</h1>
            <p className="text-sm text-text-light">
              "{query}"-এর জন্য {products.length}টি পণ্য পাওয়া গেছে
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-terracotta" size={40} />
            <p className="text-text-mid font-medium">পণ্য খোঁজা হচ্ছে...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-cream-dark max-w-2xl mx-auto">
            <div className="text-7xl mb-6">🏺</div>
            <h3 className="font-tiro text-2xl text-text-dark mb-3">দুঃখিত, কোনো পণ্য পাওয়া যায়নি</h3>
            <p className="text-text-mid mb-8 leading-relaxed">
              আপনার অনুসন্ধানের সাথে মিলে এমন কোনো পণ্য খুঁজে পাওয়া যায়নি। অনুগ্রহ করে অন্য কোনো শব্দ দিয়ে আবার চেষ্টা করুন।
            </p>
            <button 
              onClick={() => window.history.back()}
              className="bg-terracotta text-white px-10 py-3 rounded-full font-bold hover:bg-clay transition-all shadow-lg shadow-terracotta/25"
            >
              পিছনে ফিরে যান
            </button>
          </div>
        )}
      </div>

      <Footer />
      <CartModal />
      <TrackingModal />
    </main>
  );
};

export default SearchPage;
