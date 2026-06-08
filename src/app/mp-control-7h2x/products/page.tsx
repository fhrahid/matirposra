"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Upload,
  Download,
  X,
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
  stock: number;
  isBestSelling: boolean;
}

const CATEGORIES = [
  "রান্নাঘরের পণ্য",
  "ঘর সাজানো",
  "বাগানের পণ্য",
  "আলোকসজ্জা",
  "উপহারের সামগ্রী",
  "ঐতিহ্যবাহী সংগ্রহ",
];

const emptyForm = {
  name: "",
  description: "",
  category: CATEGORIES[0],
  price: "",
  originalPrice: "",
  stock: "",
  image: "",
  icon: "🏺",
  badge: "",
  isBestSelling: false,
};

type FormState = typeof emptyForm;

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [importing, setImporting] = useState(false);
  const [notice, setNotice] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    fetchProducts();
  }, []);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 4000);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* --------------------------------- Modal --------------------------------- */

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description || "",
      category: p.category,
      price: String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : "",
      stock: String(p.stock ?? 0),
      image: p.image || "",
      icon: p.icon || "🏺",
      badge: p.badge || "",
      isBestSelling: p.isBestSelling,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.price) {
      setFormError("নাম ও মূল্য আবশ্যক।");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      stock: form.stock ? Math.max(0, Number(form.stock)) : 0,
      image: form.image.trim() || "/placeholder-product.svg",
      icon: form.icon.trim() || "🏺",
      badge: form.badge || undefined,
      isBestSelling: form.isBestSelling,
    };

    setSaving(true);
    try {
      const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setModalOpen(false);
        await fetchProducts();
        showNotice(editingId ? "পণ্য আপডেট হয়েছে।" : "নতুন পণ্য যোগ হয়েছে।");
      } else {
        setFormError("সংরক্ষণ ব্যর্থ হয়েছে।");
      }
    } catch {
      setFormError("সার্ভারে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" পণ্যটি মুছে ফেলতে চান?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        showNotice("পণ্য মুছে ফেলা হয়েছে।");
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  /* ------------------------------- CSV import ------------------------------ */

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: text }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchProducts();
        showNotice(
          `${data.imported}টি পণ্য ইমপোর্ট হয়েছে${data.skipped ? `, ${data.skipped}টি বাদ পড়েছে` : ""}।`
        );
      } else {
        showNotice(data.error || "ইমপোর্ট ব্যর্থ হয়েছে।");
      }
    } catch {
      showNotice("ফাইল পড়তে সমস্যা হয়েছে।");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleExport = () => {
    window.location.href = "/api/admin/products/export";
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div>
          <h1 className="font-tiro text-3xl text-text-dark mb-2">ইনভেন্টরি ম্যানেজমেন্ট</h1>
          <p className="text-text-light text-sm">আপনার স্টোরের সকল পণ্য এখান থেকে যোগ বা এডিট করুন</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white border border-cream-dark rounded-xl px-4 py-2.5 focus-within:border-terracotta transition-colors shadow-sm">
            <Search size={18} className="text-text-light" />
            <input
              type="text"
              placeholder="পণ্য খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none px-3 text-sm text-text-dark w-full md:w-40"
            />
          </div>

          <button
            onClick={handleImportClick}
            disabled={importing}
            className="bg-white text-text-dark border-1.5 border-cream-dark px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-cream transition-all flex items-center gap-2"
          >
            {importing ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            CSV ইমপোর্ট
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={handleExport}
            className="bg-white text-text-dark border-1.5 border-cream-dark px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-cream transition-all flex items-center gap-2"
          >
            <Download size={18} /> CSV এক্সপোর্ট
          </button>

          <button
            onClick={openAdd}
            className="bg-terracotta text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-clay transition-all shadow-lg shadow-terracotta/20 flex items-center gap-2"
          >
            <Plus size={18} /> নতুন পণ্য
          </button>
        </div>
      </div>

      {notice && (
        <div className="mb-6 bg-leaf/10 border border-leaf/20 text-leaf text-sm font-medium px-5 py-3 rounded-xl">
          {notice}
        </div>
      )}

      <div className="bg-white rounded-[32px] shadow-sm border border-cream-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream border-b border-cream-dark">
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest">পণ্য</th>
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest">ক্যাটাগরি</th>
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest">মূল্য</th>
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest">স্টক</th>
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
                        <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center text-2xl shadow-inner flex-shrink-0 overflow-hidden">
                          {product.image && product.image.startsWith("http") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            product.icon || "🏺"
                          )}
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
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-text-dark">{(product.stock ?? 0).toLocaleString("bn-BD")} টি</span>
                        {product.stock > 0 ? (
                          <span className="text-[9px] w-fit bg-leaf/10 text-leaf px-1.5 py-0.5 rounded-full font-bold">স্টকে আছে</span>
                        ) : (
                          <span className="text-[9px] w-fit bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">স্টক নেই</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 text-text-light hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="p-2 text-text-light hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
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

      {/* ------------------------------ Add/Edit modal ------------------------------ */}
      {modalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-cream-dark w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-8 py-5 border-b border-cream-dark sticky top-0 bg-white rounded-t-3xl">
              <h3 className="font-tiro text-xl text-text-dark">
                {editingId ? "পণ্য সম্পাদনা" : "নতুন পণ্য যোগ করুন"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-text-light hover:text-terracotta hover:bg-cream rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-mid uppercase tracking-wider">পণ্যের নাম *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-mid uppercase tracking-wider">বিবরণ</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={2}
                  className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-mid uppercase tracking-wider">ক্যাটাগরি</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-mid uppercase tracking-wider">ব্যাজ</label>
                  <select
                    name="badge"
                    value={form.badge}
                    onChange={handleFormChange}
                    className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
                  >
                    <option value="">কোনোটি নয়</option>
                    <option value="new">নতুন (new)</option>
                    <option value="sale">অফার (sale)</option>
                    <option value="hot">হট (hot)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-mid uppercase tracking-wider">মূল্য (৳) *</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleFormChange}
                    className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-mid uppercase tracking-wider">আগের মূল্য (৳)</label>
                  <input
                    name="originalPrice"
                    type="number"
                    value={form.originalPrice}
                    onChange={handleFormChange}
                    placeholder="ছাড় থাকলে"
                    className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-mid uppercase tracking-wider">স্টক পরিমাণ</label>
                  <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleFormChange}
                    className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-text-mid uppercase tracking-wider">ইমেজ URL</label>
                  <input
                    name="image"
                    value={form.image}
                    onChange={handleFormChange}
                    placeholder="https://... (খালি রাখলে প্লেসহোল্ডার বসবে)"
                    className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-mid uppercase tracking-wider">আইকন (ইমোজি)</label>
                  <input
                    name="icon"
                    value={form.icon}
                    onChange={handleFormChange}
                    className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="isBestSelling"
                  checked={form.isBestSelling}
                  onChange={handleFormChange}
                  className="w-4 h-4 accent-terracotta"
                />
                <span className="text-sm font-medium text-text-mid">সর্বাধিক বিক্রিত হিসেবে দেখান (হোমপেজে)</span>
              </label>

              {formError && <p className="text-sm text-red-500 font-medium">{formError}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-terracotta text-white py-3.5 rounded-xl font-bold hover:bg-clay transition-all shadow-lg shadow-terracotta/25 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : editingId ? "আপডেট করুন" : "যোগ করুন"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3.5 rounded-xl font-bold border-1.5 border-cream-dark text-text-mid hover:bg-cream transition-all"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
