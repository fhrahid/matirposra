import React from "react";
import Link from "next/link";

interface CategoryCardProps {
  name: string;
  count: number;
  icon?: string;
  href?: string;
}

const categorySlugMap: Record<string, string> = {
  "রান্নাঘরের পণ্য": "kitchen",
  "ঘর সাজানো": "decor",
  "বাগানের পণ্য": "garden",
  "আলোকসজ্জা": "lighting",
  "উপহারের সামগ্রী": "gifts",
  "ঐতিহ্যবাহী সংগ্রহ": "heritage",
};

const CategoryCard: React.FC<CategoryCardProps> = ({ name, count, icon = "🏺" }) => {
  const slug = categorySlugMap[name] || "all";
  
  return (
    <Link 
      href={`/category/${slug}`} 
      className="bg-white rounded-xl p-3 text-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-clay-hover border-1.5 border-transparent hover:border-terracotta-light shadow-sm block group"
    >
      <div className="w-full h-[120px] rounded-lg mb-3 flex items-center justify-center text-3xl bg-cream-dark overflow-hidden transition-colors group-hover:bg-cream">
        {icon}
      </div>
      <h3 className="text-[13px] font-bold text-text-dark mb-1">{name}</h3>
      <p className="text-[11px] text-text-light">{count}+ পণ্য</p>
    </Link>
  );
};

export default CategoryCard;
