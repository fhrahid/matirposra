import React from "react";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/ui/CartModal";
import TrackingModal from "@/components/ui/TrackingModal";
import ProductCard from "@/components/ui/ProductCard";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { ChevronRight, Star, Truck, ShieldCheck, RotateCcw, Minus, Plus } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Product, { IProduct } from "@/models/Product";

async function getProduct(id: string) {
  try {
    await dbConnect();
    const product = await Product.findById(id).lean() as IProduct | null;
    if (!product) return null;
    return { ...product, id: product._id.toString() };
  } catch (e) {
    console.error("Failed to fetch product", e);
    return null;
  }
}

async function getRelatedProducts(category: string, currentId: string) {
  try {
    await dbConnect();
    const products = await Product.find({ 
      category, 
      _id: { $ne: currentId } 
    }).limit(4).lean() as IProduct[];
    return products.map((p) => ({ ...p, id: p._id.toString() }));
  } catch (e) {
    console.error("Failed to fetch related products", e);
    return [];
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <main className="min-h-screen bg-cream flex flex-col">
        <Header />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="font-tiro text-2xl text-text-dark mb-2">পণ্যটি পাওয়া যায়নি</h1>
          <p className="text-text-light mb-6">দুঃখিত, আপনি যে পণ্যটি খুঁজছেন তা বর্তমানে আমাদের সংগ্রহে নেই।</p>
          <Link href="/" className="bg-terracotta text-white px-8 py-2.5 rounded-full font-bold hover:bg-clay transition-all">
            হোমে ফিরে যান
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const relatedProducts = await getRelatedProducts(product.category, id);

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-sm text-text-light mb-8">
          <Link href="/" className="hover:text-terracotta">হোম</Link>
          <ChevronRight size={14} />
          <Link href={`/category/${product.category}`} className="hover:text-terracotta">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-text-dark font-medium truncate">{product.name}</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-sm border border-cream-dark overflow-hidden mb-12">
          <div className="flex flex-col lg:row-span-2 lg:flex-row">
            {/* LEFT: IMAGE GALLERY */}
            <div className="lg:w-1/2 p-6 md:p-10 bg-cream-dark/20 flex flex-col gap-4">
              <div className="aspect-square bg-cream-dark rounded-2xl flex items-center justify-center text-[120px] shadow-inner relative overflow-hidden">
                {product.icon}
                {product.badge && (
                  <div className="absolute top-6 left-6">
                    <Badge variant={product.badge} className="px-3 py-1.5 text-xs">
                      {product.badge === "new" ? "নতুন সংগ্রহ" : product.badge === "sale" ? "অফার" : "জনপ্রিয়"}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-cream-dark/40 rounded-lg flex items-center justify-center text-3xl cursor-pointer hover:border-terracotta border-1.5 border-transparent transition-all">
                    {product.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: INFO */}
            <div className="lg:w-1/2 p-6 md:p-10 lg:border-l border-cream-dark">
              <div className="mb-6">
                <h1 className="font-tiro text-3xl md:text-4xl text-text-dark mb-3">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-[#F5A623]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} fill={i < product.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-text-dark">{product.rating}.0</span>
                  </div>
                  <span className="text-text-light text-sm">|</span>
                  <span className="text-text-light text-sm">{product.reviewsCount}টি রিভিউ</span>
                  <span className="text-text-light text-sm">|</span>
                  <span className="text-leaf text-sm font-bold">স্টকে আছে</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl font-bold text-terracotta font-tiro">৳ {product.price.toLocaleString("bn-BD")}</span>
                {product.originalPrice && (
                  <span className="text-lg text-text-light line-through">৳ {product.originalPrice.toLocaleString("bn-BD")}</span>
                )}
                {product.originalPrice && (
                  <span className="bg-amber/10 text-amber text-xs font-bold px-2 py-1 rounded">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% ছাড়
                  </span>
                )}
              </div>

              <p className="text-text-mid leading-relaxed mb-8 text-[15px]">
                {product.description || "এই পণ্যটি আমাদের দক্ষ কারিগরদের দ্বারা অত্যন্ত যত্ন সহকারে তৈরি করা হয়েছে। এটি আপনার ঘরের সৌন্দর্য বৃদ্ধিতে সাহায্য করবে এবং দীর্ঘস্থায়ী স্থায়িত্ব প্রদান করবে।"}
              </p>

              <div className="flex flex-col gap-6 mb-8 border-y border-cream-dark py-8">
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-text-dark">পরিমাণ:</span>
                  <div className="flex items-center gap-3 bg-cream rounded-full px-2 py-1 border border-cream-dark">
                    <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-all text-text-mid"><Minus size={14} /></button>
                    <span className="font-bold w-6 text-center">১</span>
                    <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-all text-text-mid"><Plus size={14} /></button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-terracotta text-white py-3.5 rounded-xl font-bold hover:bg-earth transition-all shadow-lg shadow-terracotta/25 flex items-center justify-center gap-2">
                    কার্টে যোগ করুন
                  </button>
                  <button className="flex-1 bg-clay text-white py-3.5 rounded-xl font-bold hover:bg-earth transition-all shadow-lg shadow-clay/25">
                    এখনই কিনুন
                  </button>
                </div>
              </div>

              {/* FEATURES */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-cream-dark/10 border border-cream-dark/30">
                  <Truck size={20} className="text-terracotta mb-2" />
                  <span className="text-[10px] font-bold text-text-dark leading-tight">দ্রুত ডেলিভারি</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-cream-dark/10 border border-cream-dark/30">
                  <ShieldCheck size={20} className="text-terracotta mb-2" />
                  <span className="text-[10px] font-bold text-text-dark leading-tight">নিরাপদ পণ্য</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-cream-dark/10 border border-cream-dark/30">
                  <RotateCcw size={20} className="text-terracotta mb-2" />
                  <span className="text-[10px] font-bold text-text-dark leading-tight">সহজ রিটার্ন</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="font-tiro text-2xl text-clay mb-8 flex items-center gap-2">
              <span className="w-1 h-6 bg-terracotta rounded-full"></span>
              অনুরূপ পণ্যসমূহ
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
      <CartModal />
      <TrackingModal />
    </main>
  );
}
