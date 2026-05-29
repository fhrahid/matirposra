import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "new" | "sale" | "hot" | "default";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => {
  const variants = {
    new: "bg-leaf",
    sale: "bg-terracotta",
    hot: "bg-amber",
    default: "bg-terracotta",
  };

  return (
    <span className={`text-white text-[10px] px-2 py-0.5 rounded-md font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
