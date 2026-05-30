"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2,
  MapPin,
  Award
} from "lucide-react";

interface Artisan {
  _id: string;
  name: string;
  village: string;
  experience: string;
  story: string;
  image?: string;
}

const AdminArtisansPage = () => {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchArtisans = async () => {
    try {
      const res = await fetch("/api/admin/artisans");
      const data = await res.json();
      setArtisans(data.artisans || []);
    } catch (error) {
      console.error("Failed to fetch artisans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => fetchArtisans(), 0);
  }, []);

  const filteredArtisans = artisans.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="font-tiro text-3xl text-text-dark mb-2">কারিগর ম্যানেজমেন্ট</h1>
          <p className="text-text-light text-sm">কারিগরদের গল্প ও তথ্য এখান থেকে পরিচালনা করুন</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white border border-cream-dark rounded-xl px-4 py-2.5 focus-within:border-terracotta transition-colors shadow-sm">
            <Search size={18} className="text-text-light" />
            <input 
              type="text" 
              placeholder="কারিগর খুঁজুন..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none px-3 text-sm text-text-dark w-full md:w-48"
            />
          </div>
          <button className="bg-terracotta text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-clay transition-all shadow-lg shadow-terracotta/20 flex items-center gap-2">
            <Plus size={18} /> নতুন কারিগর
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-cream-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream border-b border-cream-dark">
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest">কারিগর</th>
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest">ঠিকানা</th>
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest">অভিজ্ঞতা</th>
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest">গল্প</th>
                <th className="px-8 py-5 text-[11px] font-bold text-text-light uppercase tracking-widest text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-terracotta" size={32} />
                      <p className="text-sm text-text-mid font-medium">তথ্য লোড হচ্ছে...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredArtisans.length > 0 ? (
                filteredArtisans.map((artisan) => (
                  <tr key={artisan._id} className="hover:bg-cream/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
                          {artisan.image || "👨‍🎨"}
                        </div>
                        <span className="text-sm font-bold text-text-dark">{artisan.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1.5 text-xs text-text-mid">
                        <MapPin size={12} className="text-terracotta" /> {artisan.village}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-leaf">
                        <Award size={12} /> {artisan.experience}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[11px] text-text-light leading-relaxed max-w-[200px] truncate italic">
                        &quot;{artisan.story}&quot;
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-text-light hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 text-text-light hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-text-light italic">
                    কোনো কারিগরের তথ্য পাওয়া যায়নি
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

export default AdminArtisansPage;
