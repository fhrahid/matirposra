import React from "react";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import CategoryCard from "@/components/ui/CategoryCard";
import ProductCard from "@/components/ui/ProductCard";
import ArtisanCard from "@/components/ui/ArtisanCard";
import SectionHeader from "@/components/ui/SectionHeader";
import CartModal from "@/components/ui/CartModal";
import TrackingModal from "@/components/ui/TrackingModal";
import { ArrowRight, Truck, ShieldCheck, MapPin } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Artisan from "@/models/Artisan";
import Category from "@/models/Category";

// Mock Data as Fallback
const mockCategories = [
  { name: "রান্নাঘরের পণ্য", productCount: 48, icon: "🍲" },
  { name: "ঘর সাজানো", productCount: 62, icon: "🏠" },
  { name: "বাগানের পণ্য", productCount: 35, icon: "🌱" },
  { name: "আলোকসজ্জা", productCount: 24, icon: "🕯" },
  { name: "উপহারের সামগ্রী", productCount: 40, icon: "🎁" },
  { name: "ঐতিহ্যবাহী সংগ্রহ", productCount: 51, icon: "🏺" },
];

const mockProducts = [
  {
    id: "p1",
    name: "হস্তশিল্প মাটির হাঁড়ি",
    price: 350,
    originalPrice: 500,
    rating: 5,
    reviewsCount: 128,
    badge: "hot" as const,
    icon: "🏺",
  },
  {
    id: "p2",
    name: "টেরাকোটা ফুলদানি",
    price: 480,
    originalPrice: 650,
    rating: 4,
    reviewsCount: 84,
    badge: "new" as const,
    icon: "🏺",
  },
  {
    id: "p3",
    name: "মাটির চা সেট (৬ পিস)",
    price: 850,
    originalPrice: 1200,
    rating: 5,
    reviewsCount: 203,
    badge: "sale" as const,
    icon: "🫖",
  },
  {
    id: "p4",
    name: "সাজানোর মাটির ঘোড়া",
    price: 620,
    originalPrice: 800,
    rating: 5,
    reviewsCount: 67,
    icon: "🐴",
  },
  {
    id: "p5",
    name: "মাটির পানির ফিল্টার",
    price: 1250,
    originalPrice: 1800,
    rating: 4,
    reviewsCount: 156,
    badge: "hot" as const,
    icon: "🏺",
  },
];

const mockArtisans = [
  {
    name: "রহিম মৃধা",
    village: "ধামরাই, ঢাকা",
    experience: "২৫ বছরের অভিজ্ঞতা",
    story: "ধামরাইয়ের মাটি দিয়ে তৈরি প্রতিটি পাত্রে তিনি ঢেলে দেন নিজের জীবনের অভিজ্ঞতা। ছোটবেলা থেকে বাবার হাত ধরে শেখা এই শিল্পকে তিনি বাঁচিয়ে রেখেছেন প্রজন্মের পর প্রজন্ম ধরে।",
    image: "👨‍🎨"
  },
  {
    name: "রাবেয়া বেগম",
    village: "রাজশাহী",
    experience: "১৮ বছরের অভিজ্ঞতা",
    story: "রাজশাহীর ঐতিহ্যবাহী নকশায় টেরাকোটার পণ্য তৈরি করেন তিনি, যা আন্তর্জাতিক মানের। তাঁর হাতের ছোঁয়ায় মাটি যেন জীবন্ত হয়ে ওঠে নতুন রূপে।",
    image: "👩‍🎨"
  }
];

async function getData() {
  try {
    if (!process.env.MONGODB_URI) return null;
    await dbConnect();
    
    const [products, artisans, categories] = await Promise.all([
      Product.find({ isBestSelling: true }).limit(5).lean(),
      Artisan.find({}).limit(2).lean(),
      Category.find({}).limit(6).lean()
    ]);

    return {
      products: products.length > 0 ? products.map((p: any) => ({ ...p, id: p._id.toString() })) : mockProducts,
      artisans: artisans.length > 0 ? artisans : mockArtisans,
      categories: categories.length > 0 ? categories.map((c: any) => ({ name: c.name, count: c.productCount, icon: "🏺" })) : mockCategories
    };
  } catch (e) {
    console.error("Database fetch failed, using fallback data", e);
    return null;
  }
}

export default async function Home() {
  const data = await getData();
  
  const categories = data?.categories || mockCategories;
  const products = data?.products || mockProducts;
  const artisans = data?.artisans || mockArtisans;

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <Navbar />
      
      <div className="pb-10">
        <Hero />

        {/* CATEGORIES */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <SectionHeader 
            title="জনপ্রিয় ক্যাটাগরি" 
            subtitle="আপনার পছন্দের পণ্য বেছে নিন" 
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <CategoryCard key={i} name={cat.name} count={cat.count || (cat as any).productCount} icon={(cat as any).icon} />
            ))}
          </div>
        </section>

        {/* BEST SELLING */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-tiro text-2xl text-clay flex items-center gap-2">
              <span className="w-1 h-6 bg-terracotta rounded-full"></span>
              সর্বাধিক বিক্রিত পণ্য
            </h2>
            <a href="#" className="text-terracotta text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              সব দেখুন <ArrowRight size={16} />
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((prod: any) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* ARTISAN SECTION */}
        <section className="bg-cream-dark/30 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="font-tiro text-3xl text-text-dark mb-2">👨‍🎨 কারিগরের গল্প</h2>
              <p className="text-sm text-clay">প্রতিটি পণ্যের পেছনে একজন দক্ষ কারিগরের হাতের ছোঁয়া</p>
            </div>
            <div className="flex flex-col gap-8">
              {artisans.map((artisan: any, i: number) => (
                <ArtisanCard key={i} artisan={artisan} />
              ))}
            </div>
          </div>
        </section>

        {/* MID BANNER */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-gradient-to-r from-[#3A5A2A] to-[#6B8F4A] rounded-2xl p-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-clay">
            <div className="relative z-10 text-center md:text-left">
              <h3 className="font-tiro text-2xl md:text-3xl text-white mb-2">গ্রামের কারিগরদের সরাসরি সহায়তা করুন</h3>
              <p className="text-sm text-white/80">প্রতিটি কেনাকাটায় একজন কারিগরের জীবন বদলে যায়</p>
            </div>
            <button className="bg-white text-leaf px-7 py-3 rounded-lg font-hind text-sm font-bold shadow-lg hover:bg-cream hover:-translate-y-0.5 transition-all z-10">
              কারিগরের গল্প পড়ুন
            </button>
            <div className="absolute right-10 text-6xl opacity-20 hidden md:block">🌿🏺🌿</div>
          </div>
        </section>

        {/* DELIVERY FEATURES */}
        <section className="bg-white border-y border-cream-dark py-12">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader 
              title="নিরাপদ ডেলিভারি সেবা" 
              subtitle="ভঙ্গুর মাটির পণ্যের জন্য বিশেষ নিরাপদ ডেলিভারি ব্যবস্থা" 
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Package, title: "নিরাপদ প্যাকেজিং", desc: "বিশেষ বাবল-র‍্যাপ ও ফোম দিয়ে প্রতিটি পণ্য সুরক্ষিতভাবে প্যাক করা হয়।", color: "bg-[#FEE9E7]" },
                { icon: ShieldCheck, title: "ভাঙন সুরক্ষা", desc: "যদি পণ্য ভেঙে যায়, আমরা ১০০% ক্ষতিপূরণ বা বিনামূল্যে প্রতিস্থাপন দিই।", color: "bg-[#E7F3E7]" },
                { icon: MapPin, title: "লাইভ ট্র্যাকিং", desc: "রিয়েল-টাইমে আপনার পণ্যের অবস্থান ট্র্যাক করুন এসএমএস ও অ্যাপের মাধ্যমে।", color: "bg-[#FFF5E0]" },
                { icon: Truck, title: "দ্রুত ডেলিভারি", desc: "ঢাকায় ২৪ ঘণ্টা, সারাদেশে ৩-৫ কার্যদিবসের মধ্যে ডেলিভারি।", color: "bg-[#E7EFF8]" },
              ].map((item, i) => (
                <div key={i} className="text-center p-5 rounded-xl hover:bg-cream transition-colors group">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-3.5 flex items-center justify-center text-2xl ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon size={28} className="text-text-dark" />
                  </div>
                  <h3 className="text-[15px] font-bold text-text-dark mb-1.5">{item.title}</h3>
                  <p className="text-[12.5px] text-text-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="relative h-[320px] md:h-[460px] rounded-2xl overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent z-10"></div>
             <div className="absolute inset-0 bg-clay/20 group-hover:bg-clay/10 transition-colors z-0"></div>
             {/* Placeholder for CTA background */}
             <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-10 select-none">🏺🏺🏺</div>
             
             <div className="absolute inset-0 flex items-end p-8 md:p-14 z-20">
                <div className="w-full flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
                  <p className="font-tiro text-lg md:text-2xl text-white leading-relaxed max-w-2xl drop-shadow-md">
                    এখনই আপনার পছন্দের মাটির পণ্যটি অর্ডার করুন — আমাদের সর্বোচ্চ সেবা ও আন্তরিকতা নিয়ে আমরা আপনার অপেক্ষায় আছি।
                  </p>
                  <button className="bg-terracotta text-white font-hind text-base font-bold px-8 py-3.5 rounded-full shadow-2xl shadow-terracotta/40 hover:bg-clay hover:-translate-y-1 transition-all whitespace-nowrap">
                    এখনই অর্ডার করুন →
                  </button>
                </div>
             </div>
          </div>
        </section>
      </div>

      <Footer />
      
      {/* MODALS */}
      <CartModal />
      <TrackingModal />
    </main>
  );
}
