"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: string;
  badge?: "new" | "sale" | "hot";
  image?: string;
  images: string[];
  icon?: string;
  isBestSelling: boolean;
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => fetchProducts(), 0);
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="font-tiro text-3xl text-text-dark mb-2">ইনভেন্টরি ম্যানেজমেন্ট</h1>
          <p className="text-text-light text-sm">আপনার স্টোরের সকল পণ্য এখান থেকে যোগ বা এডিট করুন</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white border border-cream-dark rounded-xl px-4 py-2.5 focus-within:border-terracotta transition-colors shadow-sm">
            <Search size={18} className="text-text-light" />
            <input 
              type="text" 
              placeholder="পণ্য খুঁজুন..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none px-3 text-sm text-text-dark w-full md:w-48"
            />
          </div>
          <button className="bg-terracotta text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-clay transition-all shadow-lg shadow-terracotta/20 flex items-center gap-2">
            <Plus size={18} /> নতুন পণ্য
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-cream-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream border-b border-cream-dark">
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest">পণ্য</th>
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest">ক্যাটাগরি</th>
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest">মূল্য</th>
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest">রেটিং</th>
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-terracotta" size={32} />
                      <p className="text-sm text-text-mid font-medium">পণ্য লোড হচ্ছে...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-cream/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
                          {product.icon || "🏺"}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold text-text-dark">{product.name}</span>
                          {product.badge && (
                            <span className="text-[9px] w-fit bg-terracotta/10 text-terracotta px-1.5 py-0.5 rounded font-bold uppercase">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-medium text-text-mid bg-cream-dark/30 px-2.5 py-1 rounded-full border border-cream-dark/50">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-terracotta">৳{product.price.toLocaleString("bn-BD")}</span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-text-light line-through">৳{product.originalPrice.toLocaleString("bn-BD")}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                        ★ {product.rating}.0 <span className="text-[10px] text-text-light font-normal">({product.reviewsCount})</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-text-light hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 text-text-light hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-text-light italic">
                    কোনো পণ্য পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;
