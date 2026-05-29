import React from "react";
import { MapPin } from "lucide-react";

interface ArtisanCardProps {
  artisan: {
    name: string;
    village: string;
    experience: string;
    story: string;
    image?: string;
  };
}

const ArtisanCard: React.FC<ArtisanCardProps> = ({ artisan }) => {
  return (
    <div className="bg-white rounded-[20px] border-1.5 border-cream-dark transition-all hover:-translate-y-1.5 hover:border-terracotta hover:shadow-clay-hover shadow-clay overflow-hidden flex flex-col md:flex-row">
      <div className="md:w-80 min-h-[280px] bg-cream-dark flex items-center justify-center text-8xl grayscale contrast-125">
        {artisan.image || "👨‍🎨"}
      </div>
      <div className="flex-1 p-7 md:p-8 flex flex-col justify-center">
        <div className="mb-4">
          <h3 className="font-tiro text-2xl font-bold text-text-dark mb-1.5">{artisan.name}</h3>
          <p className="text-[13px] text-clay flex items-center gap-1 mb-2">
            <MapPin size={14} className="text-terracotta" /> 📍 {artisan.village}
          </p>
          <span className="text-xs bg-terracotta/12 text-terracotta px-3 py-1 rounded-full font-semibold border border-terracotta/25 inline-block">
            {artisan.experience}
          </span>
        </div>
        <p className="text-[15px] text-[#6B4C35] leading-relaxed italic mb-5 relative before:content-['\"'] before:text-2xl before:text-terracotta-light after:content-['\"'] after:text-2xl after:text-terracotta-light">
          {artisan.story}
        </p>
        <button className="border-1.5 border-terracotta text-terracotta px-5.5 py-2.5 rounded-full font-hind text-sm font-semibold hover:bg-terracotta hover:text-white transition-all self-start">
          পণ্য দেখুন →
        </button>
      </div>
    </div>
  );
};

export default ArtisanCard;
