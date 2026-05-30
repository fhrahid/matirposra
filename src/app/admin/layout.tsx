"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (pathname === "/admin/login") {
        setLoading(false);
        return;
      }

      const auth = localStorage.getItem("admin_auth");
      if (!auth) {
        router.push("/admin/login");
      } else {
        setIsAuth(true);
      }
      setLoading(false);
    };

    // Use a small timeout or requestAnimationFrame to avoid synchronous setState in effect
    const timeoutId = setTimeout(checkAuth, 0);
    return () => clearTimeout(timeoutId);
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-terracotta" size={40} />
        <p className="text-text-mid font-medium">ভেরিফাই করা হচ্ছে...</p>
      </div>
    );
  }

  // If it's the login page, just render children without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Only render dashboard if authenticated
  if (!isAuth) return null;

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
