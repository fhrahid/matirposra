"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "🏠 হোম", href: "/" },
  { name: "🍲 রান্নাঘর", href: "/category/kitchen" },
  { name: "🏠 ঘর সাজানো", href: "/category/decor" },
  { name: "🌱 বাগান", href: "/category/garden" },
  { name: "🕯 আলোকসজ্জা", href: "/category/lighting" },
  { name: "🎁 উপহার", href: "/category/gifts" },
  { name: "👨‍🎨 কারিগরের গল্প", href: "/category/heritage" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-gradient-to-r from-clay to-earth sticky top-[77px] z-[999] shadow-md">
      <div className="max-w-7xl mx-auto px-6 flex items-center overflow-x-auto no-scrollbar">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`text-[#F5DEB3] text-[13.5px] font-medium px-4 py-3.5 whitespace-nowrap border-b-2 transition-all hover:text-white hover:bg-white/10 hover:border-terracotta-light ${
              pathname === link.href ? "text-white border-white" : "border-transparent"
            }`}
          >
            {link.name}
          </Link>
        ))}
        <Link
          href="/offers"
          className="ml-auto bg-terracotta text-white px-4 py-2 rounded-sm font-bold animate-pulse hover:animate-none"
        >
          🔥 অফার
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
