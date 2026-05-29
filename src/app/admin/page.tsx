import React from "react";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Artisan from "@/models/Artisan";
import { 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle2
} from "lucide-react";

async function getStats() {
  try {
    await dbConnect();
    const [productCount, orderCount, artisanCount, orders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Artisan.countDocuments(),
      Order.find({}).sort({ createdAt: -1 }).limit(5).lean()
    ]);

    const totalRevenue = (await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]))[0]?.total || 0;

    return {
      productCount,
      orderCount,
      artisanCount,
      totalRevenue,
      recentOrders: orders.map((o: any) => ({
        id: o._id.toString(),
        orderNumber: o.orderNumber,
        customerName: o.customer.name,
        totalPrice: o.totalPrice,
        status: o.status,
        createdAt: o.createdAt
      }))
    };
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return {
      productCount: 0,
      orderCount: 0,
      artisanCount: 0,
      totalRevenue: 0,
      recentOrders: []
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { name: "মোট পণ্য", value: stats.productCount, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "মোট অর্ডার", value: stats.orderCount, icon: Package, color: "text-amber-500", bg: "bg-amber-50" },
    { name: "মোট কারিগর", value: stats.artisanCount, icon: Users, color: "text-leaf", bg: "bg-leaf/10" },
    { name: "মোট আয়", value: `৳${stats.totalRevenue.toLocaleString("bn-BD")}`, icon: TrendingUp, color: "text-terracotta", bg: "bg-terracotta/10" },
  ];

  const statusMap: Record<string, { label: string, class: string }> = {
    pending: { label: "অপেক্ষমান", class: "bg-amber-100 text-amber-700" },
    processing: { label: "প্রসেসিং", class: "bg-blue-100 text-blue-700" },
    shipped: { label: "শিপড", class: "bg-purple-100 text-purple-700" },
    delivered: { label: "ডেলিভারড", class: "bg-green-100 text-green-700" },
    cancelled: { label: "বাতিল", class: "bg-red-100 text-red-700" },
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-tiro text-3xl text-text-dark mb-2">স্বাগতম, অ্যাডমিন!</h1>
        <p className="text-text-light text-sm">আপনার স্টোরের আজকের অবস্থা দেখুন</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((card) => (
          <div key={card.name} className="bg-white p-6 rounded-3xl shadow-sm border border-cream-dark hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center`}>
                <card.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-light uppercase tracking-widest">{card.name}</p>
                <h3 className="text-xl font-bold text-text-dark">{card.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT ORDERS */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-cream-dark p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-cream-dark">
            <h3 className="font-bold text-text-dark flex items-center gap-2">
              <Clock size={18} className="text-terracotta" /> সাম্প্রতিক অর্ডারসমূহ
            </h3>
            <button className="text-xs text-clay font-bold hover:underline">সব দেখুন →</button>
          </div>
          
          <div className="space-y-4">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-cream rounded-2xl border border-cream-dark hover:border-terracotta transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg shadow-inner">
                      📦
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-dark">{order.orderNumber}</h4>
                      <p className="text-xs text-text-light">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-terracotta mb-1">৳{order.totalPrice.toLocaleString("bn-BD")}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusMap[order.status].class}`}>
                      {statusMap[order.status].label}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-text-light italic text-sm">
                কোনো সাম্প্রতিক অর্ডার নেই
              </div>
            )}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-3xl shadow-sm border border-cream-dark p-8">
          <h3 className="font-bold text-text-dark mb-6">কুইক অ্যাকশন</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-terracotta text-white rounded-2xl font-bold text-sm hover:bg-clay transition-all shadow-lg shadow-terracotta/20">
              নতুন পণ্য যোগ করুন <ShoppingBag size={16} />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-white text-text-dark border-1.5 border-cream-dark rounded-2xl font-bold text-sm hover:bg-cream transition-all">
              কারিগর আপডেট করুন <Users size={16} />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-white text-text-dark border-1.5 border-cream-dark rounded-2xl font-bold text-sm hover:bg-cream transition-all">
              ইনভেন্টরি রিপোর্ট <TrendingUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
