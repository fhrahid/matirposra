"use client";

import React, { useEffect, useState } from "react";
import {
  Loader2,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  ChevronDown,
  Calendar,
  Search,
} from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  icon?: string;
}

interface CustomerOrder {
  _id: string;
  orderNumber: string;
  customer: { name: string; phone: string; address: string };
  items: OrderItem[];
  totalPrice: number;
  status: keyof typeof statusMap;
  createdAt: string;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinedAt: string;
  orderCount: number;
  totalSpent: number;
  orders: CustomerOrder[];
}

const statusMap: Record<string, { label: string; class: string }> = {
  pending: { label: "অপেক্ষমান", class: "bg-amber-100 text-amber-700 border-amber-200" },
  processing: { label: "প্রসেসিং", class: "bg-blue-100 text-blue-700 border-blue-200" },
  shipped: { label: "শিপড", class: "bg-purple-100 text-purple-700 border-purple-200" },
  delivered: { label: "ডেলিভারড", class: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "বাতিল", class: "bg-red-100 text-red-700 border-red-200" },
};

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/admin/customers");
        const data = await res.json();
        setCustomers(data.customers || []);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    };
    setTimeout(() => fetchCustomers(), 0);
  }, []);

  const filtered = customers.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-tiro text-3xl text-text-dark mb-2">কাস্টমার ও অর্ডার হিস্ট্রি</h1>
          <p className="text-text-light text-sm">নিবন্ধিত ব্যবহারকারীদের প্রোফাইল ও তাদের সম্পূর্ণ অর্ডার ইতিহাস দেখুন</p>
        </div>

        <div className="flex items-center bg-white border border-cream-dark rounded-xl px-4 py-2.5 focus-within:border-terracotta transition-colors shadow-sm">
          <Search size={18} className="text-text-light" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="নাম, ইমেইল বা ফোন খুঁজুন..."
            className="bg-transparent border-none outline-none px-3 text-sm text-text-dark w-full md:w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="animate-spin text-terracotta" size={36} />
          <p className="text-text-mid font-medium">কাস্টমার লোড হচ্ছে...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-cream-dark p-16 text-center text-text-light italic">
          কোনো কাস্টমার পাওয়া যায়নি
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => {
            const isOpen = expanded === c._id;
            return (
              <div
                key={c._id}
                className="bg-white rounded-3xl shadow-sm border border-cream-dark overflow-hidden"
              >
                {/* Profile header */}
                <button
                  onClick={() => setExpanded(isOpen ? null : c._id)}
                  className="w-full text-left p-6 flex flex-col lg:flex-row lg:items-center gap-4 hover:bg-cream/40 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-text-dark truncate">{c.name}</div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-text-light mt-1">
                        <span className="flex items-center gap-1"><Mail size={12} /> {c.email}</span>
                        {c.phone && <span className="flex items-center gap-1"><Phone size={12} /> {c.phone}</span>}
                      </div>
                      {c.address && (
                        <div className="flex items-start gap-1 text-[11px] text-text-light mt-1">
                          <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{c.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-center">
                      <div className="text-lg font-bold text-text-dark flex items-center gap-1 justify-center">
                        <ShoppingBag size={15} className="text-clay" /> {c.orderCount.toLocaleString("bn-BD")}
                      </div>
                      <div className="text-[10px] text-text-light uppercase tracking-wider">অর্ডার</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-terracotta">৳{c.totalSpent.toLocaleString("bn-BD")}</div>
                      <div className="text-[10px] text-text-light uppercase tracking-wider">মোট খরচ</div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-text-light transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {/* Order history */}
                {isOpen && (
                  <div className="border-t border-cream-dark bg-cream/30 p-6">
                    {c.orders.length === 0 ? (
                      <p className="text-sm text-text-light italic text-center py-4">
                        এই ব্যবহারকারী এখনো কোনো অর্ডার করেননি।
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {c.orders.map((o) => (
                          <div key={o._id} className="bg-white rounded-2xl border border-cream-dark p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-sm text-text-dark font-mono">{o.orderNumber}</span>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusMap[o.status]?.class || ""}`}>
                                  {statusMap[o.status]?.label || o.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-text-light">
                                <Calendar size={12} /> {new Date(o.createdAt).toLocaleString("bn-BD")}
                              </div>
                            </div>

                            {/* Item summary */}
                            <div className="space-y-1.5 mb-3">
                              {o.items.map((it, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs">
                                  <span className="text-text-mid">
                                    {it.icon ? `${it.icon} ` : ""}{it.name}
                                    <span className="text-text-light"> × {it.qty.toLocaleString("bn-BD")}</span>
                                  </span>
                                  <span className="text-text-dark font-medium">
                                    ৳{(it.price * it.qty).toLocaleString("bn-BD")}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Shipping address + total */}
                            <div className="flex flex-wrap items-start justify-between gap-3 pt-3 border-t border-cream-dark">
                              <div className="flex items-start gap-1.5 text-[11px] text-text-light max-w-md">
                                <MapPin size={13} className="mt-0.5 flex-shrink-0 text-clay" />
                                <span>{o.customer.address}</span>
                              </div>
                              <div className="text-sm font-bold text-terracotta">
                                মোট: ৳{o.totalPrice.toLocaleString("bn-BD")}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminCustomersPage;
