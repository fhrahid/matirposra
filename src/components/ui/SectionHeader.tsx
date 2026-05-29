import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  showLine?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, className = "", showLine = true }) => {
  return (
    <div className={`text-center mb-7 ${className}`}>
      <h2 className="font-tiro text-2xl md:text-[26px] text-clay mb-1.5">{title}</h2>
      {subtitle && <p className="text-sm text-text-light">{subtitle}</p>}
      {showLine && (
        <div className="w-[60px] h-[3px] bg-gradient-to-r from-terracotta to-amber mx-auto mt-2.5 rounded-sm"></div>
      )}
    </div>
  );
};

export default SectionHeader;
