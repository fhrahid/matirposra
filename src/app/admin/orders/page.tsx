"use client";

import React, { useEffect, useState } from "react";
import { 
  Package, 
  Search, 
  ExternalLink, 
  MoreVertical,
  Loader2,
  Calendar,
  Phone,
  MapPin,
  CheckCircle2
} from "lucide-react";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // In a real app, this would be an admin-only API
      // For demo, we'll use a direct fetch (ideally protected by layout auth)
      const res = await fetch("/api/orders/all"); // We'll need to create this or use a query
      // Wait, let's create a specific admin orders API for fetching all
      const response = await fetch("/api/admin/orders");
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setUpdating(null);
    }
  };

  const statusMap: Record<string, { label: string, class: string }> = {
    pending: { label: "অপেক্ষমান", class: "bg-amber-100 text-amber-700 border-amber-200" },
    processing: { label: "প্রসেসিং", class: "bg-blue-100 text-blue-700 border-blue-200" },
    shipped: { label: "শিপড", class: "bg-purple-100 text-purple-700 border-purple-200" },
    delivered: { label: "ডেলিভারড", class: "bg-green-100 text-green-700 border-green-200" },
    cancelled: { label: "বাতিল", class: "bg-red-100 text-red-700 border-red-200" },
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-tiro text-3xl text-text-dark mb-2">অর্ডার ম্যানেজমেন্ট</h1>
          <p className="text-text-light text-sm">সবগুলো কাস্টমার অর্ডার এখান থেকে পরিচালনা করুন</p>
        </div>
        
        <div className="flex items-center bg-white border border-cream-dark rounded-xl px-4 py-2.5 focus-within:border-terracotta transition-colors shadow-sm">
          <Search size={18} className="text-text-light" />
          <input 
            type="text" 
            placeholder="অর্ডার নম্বর খুঁজুন..." 
            className="bg-transparent border-none outline-none px-3 text-sm text-text-dark w-full md:w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-cream-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream border-b border-cream-dark">
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest">অর্ডার ও তারিখ</th>
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest">কাস্টমার</th>
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest">পণ্য</th>
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest">মোট মূল্য</th>
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest">স্ট্যাটাস</th>
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-terracotta" size={32} />
                      <p className="text-sm text-text-mid font-medium">অর্ডার লোড হচ্ছে...</p>
                    </div>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-cream/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-text-dark">{order.orderNumber}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-text-light">
                          <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-text-dark">{order.customer.name}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-text-light">
                          <Phone size={12} /> {order.customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-text-mid">{order.items.length}টি আইটেম</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-text-light truncate max-w-[150px]">
                          {order.items.map((it: any) => it.name).join(", ")}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-terracotta">৳{order.totalPrice.toLocaleString("bn-BD")}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="relative">
                        {updating === order._id ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-cream rounded-full border border-cream-dark">
                            <Loader2 className="animate-spin text-terracotta" size={12} />
                            <span className="text-[10px] font-bold text-text-mid">আপডেট...</span>
                          </div>
                        ) : (
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            className={`text-[10px] font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer appearance-none ${statusMap[order.status].class}`}
                          >
                            <option value="pending">অপেক্ষমান</option>
                            <option value="processing">প্রসেসিং</option>
                            <option value="shipped">শিপড</option>
                            <option value="delivered">ডেলিভারড</option>
                            <option value="cancelled">বাতিল</option>
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-text-light hover:text-terracotta hover:bg-cream rounded-lg transition-all">
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-text-light italic">
                    কোনো অর্ডার পাওয়া যায়নি
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

export default AdminOrdersPage;
