"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  LogOut, 
  ChevronRight
} from "lucide-react";

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  const navLinks = [
    { name: "ওভারভিউ", href: "/admin", icon: LayoutDashboard },
    { name: "পণ্যসমূহ", href: "/admin/products", icon: ShoppingBag },
    { name: "অর্ডারসমূহ", href: "/admin/orders", icon: Package },
    { name: "কারিগর", href: "/admin/artisans", icon: Users },
  ];

  return (
    <aside className="w-72 bg-earth h-screen sticky top-0 flex flex-col text-white/80">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-2xl group-hover:bg-terracotta transition-colors">
            🏺
          </div>
          <div>
            <h2 className="font-tiro text-lg text-white leading-tight">অ্যাডমিন প্যানেল</h2>
            <p className="text-[10px] uppercase tracking-widest text-white/40">মাটির পশরা</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group ${
                isActive 
                  ? "bg-white/10 text-white font-semibold" 
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <link.icon size={20} className={isActive ? "text-terracotta-light" : "group-hover:text-terracotta-light transition-colors"} />
                <span className="text-sm">{link.name}</span>
              </div>
              {isActive && <ChevronRight size={14} className="text-terracotta-light" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-medium"
        >
          <LogOut size={18} />
          লগআউট
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
