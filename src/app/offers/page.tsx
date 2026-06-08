import React from "react";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import CartModal from "@/components/ui/CartModal";
import TrackingModal from "@/components/ui/TrackingModal";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Product, { IProduct } from "@/models/Product";

async function getDiscountedProducts() {
  try {
    await dbConnect();
    // Products where the original price is higher than the current price.
    const products = (await Product.find({
      originalPrice: { $exists: true, $ne: null },
      $expr: { $gt: ["$originalPrice", "$price"] },
    })
      .sort({ createdAt: -1 })
      .lean()) as IProduct[];
    return products.map((p) => ({ ...p, id: p._id.toString() }));
  } catch (e) {
    console.error("Failed to fetch offers", e);
    return [];
  }
}

export default async function OffersPage() {
  const products = await getDiscountedProducts();

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-sm text-text-light mb-8">
          <Link href="/" className="hover:text-terracotta">হোম</Link>
          <ChevronRight size={14} />
          <span className="text-text-dark font-medium">অফার</span>
        </nav>

        {/* BANNER */}
        <div className="bg-gradient-to-r from-terracotta to-clay rounded-2xl p-8 md:px-12 mb-10 relative overflow-hidden shadow-clay">
          <div className="relative z-10">
            <h1 className="font-tiro text-3xl md:text-4xl text-white mb-2">🔥 বিশেষ অফার</h1>
            <p className="text-sm text-white/85">সীমিত সময়ের জন্য আকর্ষণীয় ছাড়ে আপনার পছন্দের মাটির পণ্য কিনুন</p>
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-7xl opacity-20 hidden md:block select-none">🏺</div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="font-tiro text-2xl text-clay flex items-center gap-2">
            <span className="w-1 h-6 bg-terracotta rounded-full"></span>
            ছাড়ের পণ্যসমূহ
          </h2>
          <span className="text-sm text-text-light">{products.length}টি পণ্য অফারে আছে</span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-cream-dark">
            <div className="text-6xl mb-4">🏺</div>
            <h3 className="font-tiro text-xl text-text-dark mb-2">এই মুহূর্তে কোনো অফার নেই</h3>
            <p className="text-text-light mb-6">শীঘ্রই নতুন অফার আসছে। আমাদের সাথেই থাকুন।</p>
            <Link href="/" className="bg-terracotta text-white px-8 py-2.5 rounded-full font-bold hover:bg-clay transition-all">
              কেনাকাটায় ফিরে যান
            </Link>
          </div>
        )}
      </div>

      <Footer />
      <CartModal />
      <TrackingModal />
    </main>
  );
}
