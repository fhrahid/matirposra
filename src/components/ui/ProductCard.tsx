"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, Heart } from "lucide-react";
import Badge from "./Badge";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewsCount: number;
    badge?: "new" | "sale" | "hot";
    icon?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Link 
      href={`/product/${product.id}`}
      className="bg-white rounded-xl overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:shadow-clay-hover border-1.5 border-transparent hover:border-cream-dark group relative block"
    >
      <div className="relative h-[180px] bg-cream-dark flex items-center justify-center text-6xl overflow-hidden">
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge variant={product.badge}>
              {product.badge === "new" ? "নতুন" : product.badge === "sale" ? "অফার" : "হট"}
            </Badge>
          </div>
        )}
        
        <button 
          onClick={handleLike}
          className={`absolute top-2.5 right-2.5 w-7.5 h-7.5 bg-white rounded-full flex items-center justify-center shadow-md transition-all z-10 ${
            isLiked ? "text-terracotta" : "text-text-light opacity-0 group-hover:opacity-100"
          } hover:scale-110`}
        >
          <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
        </button>

        <div className="transition-transform group-hover:scale-110 duration-500">
          {product.icon}
        </div>
      </div>

      <div className="p-3.5">
        <h3 className="text-[13.5px] font-bold text-text-dark mb-1.5 leading-snug h-9 overflow-hidden">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-[#F5A623] text-xs">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < product.rating ? "★" : "☆"}</span>
            ))}
          </div>
          <span className="text-[11px] text-text-light">({product.reviewsCount})</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[17px] font-bold text-terracotta">৳ {product.price.toLocaleString("bn-BD")}</span>
          {product.originalPrice && (
            <span className="text-xs text-text-light line-through">৳ {product.originalPrice.toLocaleString("bn-BD")}</span>
          )}
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleAddToCart}
            className={`flex-1 py-2 rounded-md font-hind text-xs font-semibold transition-colors ${
              added ? "bg-leaf text-white" : "bg-terracotta text-white hover:bg-earth"
            }`}
          >
            {added ? "✓ যোগ হয়েছে" : "কার্টে যোগ করুন"}
          </button>
          <div className="bg-cream-dark text-text-mid p-2 rounded-md group-hover:bg-clay group-hover:text-white transition-all">
            <Eye size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
