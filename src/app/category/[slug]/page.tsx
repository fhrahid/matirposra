import React from "react";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductSidebar from "@/components/shop/ProductSidebar";
import ProductCard from "@/components/ui/ProductCard";
import CartModal from "@/components/ui/CartModal";
import TrackingModal from "@/components/ui/TrackingModal";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Product, { IProduct } from "@/models/Product";
import type { QueryFilter } from "mongoose";

const slugToName: Record<string, string> = {
  kitchen: "রান্নাঘরের পণ্য",
  decor: "ঘর সাজানো",
  garden: "বাগানের পণ্য",
  lighting: "আলোকসজ্জা",
  gifts: "উপহারের সামগ্রী",
  heritage: "ঐতিহ্যবাহী সংগ্রহ",
};

async function getCategoryProducts(slug: string, searchParams: { min?: string, max?: string, rating?: string }) {
  try {
    const categoryName = slugToName[slug];
    if (!categoryName) return [];
    
    await dbConnect();
    
    const query: QueryFilter<IProduct> = { category: categoryName };
    
    // Price filter
    if (searchParams.min || searchParams.max) {
      query.price = {};
      if (searchParams.min) query.price.$gte = parseInt(searchParams.min);
      if (searchParams.max) query.price.$lte = parseInt(searchParams.max);
    }
    
    // Rating filter
    if (searchParams.rating) {
      query.rating = { $gte: parseInt(searchParams.rating) };
    }

    const products = await Product.find(query).lean() as IProduct[];
    return products.map((p) => ({ ...p, id: p._id.toString() }));
  } catch (e) {
    console.error("Failed to fetch category products", e);
    return [];
  }
}

export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }, 
  searchParams: { min?: string, max?: string, rating?: string } 
}) {
  const { slug } = params;
  const categoryName = slugToName[slug] || "সকল পণ্য";
  const products = await getCategoryProducts(slug, searchParams);

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-sm text-text-light mb-8">
          <Link href="/" className="hover:text-terracotta">হোম</Link>
          <ChevronRight size={14} />
          <span className="text-text-dark font-medium">{categoryName}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          <ProductSidebar />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-tiro text-3xl text-clay">{categoryName}</h1>
              <span className="text-sm text-text-light">{products.length}টি পণ্য পাওয়া গেছে</span>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-cream-dark">
                <div className="text-6xl mb-4">🏺</div>
                <h3 className="font-tiro text-xl text-text-dark mb-2">দুঃখিত, কোনো পণ্য পাওয়া যায়নি</h3>
                <p className="text-text-light mb-6">এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই। দয়া করে পরে আবার চেষ্টা করুন।</p>
                <Link href="/" className="bg-terracotta text-white px-8 py-2.5 rounded-full font-bold hover:bg-clay transition-all">
                  কেনাকাটায় ফিরে যান
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <CartModal />
      <TrackingModal />
    </main>
  );
}
