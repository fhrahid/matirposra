import React from "react";
import Link from "next/link";
import { Share2, Camera, Video, Globe, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#2C1A0E] to-[#1A0E08] pt-14 pb-5 text-[#B89070]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
        <div className="footer-logo">
          <h2 className="font-tiro text-2xl text-white mb-2.5">🏺 মাটির পশরা</h2>
          <p className="text-sm leading-relaxed mb-4">
            বাংলাদেশের ঐতিহ্যবাহী মাটির শিল্পকে ভালোবেসে গড়ে তোলা একটি প্ল্যাটফর্ম। সরাসরি কারিগরের কাছ থেকে আপনার দরজায়।
          </p>
          <div className="space-y-1.5 text-sm">
            <p className="flex items-center gap-2">
              <Phone size={14} className="text-terracotta-light" /> 01700-000000
            </p>
            <p className="flex items-center gap-2">
              <Mail size={14} className="text-terracotta-light" /> info@matirposhara.com
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={14} className="text-terracotta-light" /> ঢাকা, বাংলাদেশ
            </p>
          </div>
          <div className="flex gap-2.5 mt-3.5">
            {[Share2, Camera, Video, Globe].map((Icon, i) => (
              <Link
                key={i}
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-lg hover:bg-terracotta hover:-translate-y-0.5 transition-all"
              >
                <Icon size={18} />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white mb-4 pb-2.5 border-b border-white/10">গুরুত্বপূর্ণ লিংক</h3>
          <ul className="space-y-2 text-[13px]">
            {["আমাদের সম্পর্কে", "কারিগরের গল্প", "সাধারণ প্রশ্নোত্তর", "রিটার্ন নীতি", "গোপনীয়তা নীতি", "যোগাযোগ করুন"].map((item) => (
              <li key={item}>
                <Link href="#" className="hover:text-terracotta-light transition-colors flex items-center gap-1.5">
                  <span className="text-terracotta-light">›</span> {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white mb-4 pb-2.5 border-b border-white/10">ক্যাটাগরি</h3>
          <ul className="space-y-2 text-[13px]">
            {["রান্নাঘরের পণ্য", "ঘর সাজানোর পণ্য", "বাগানের পণ্য", "আলোকসজ্জা", "উপহারের সামগ্রী", "ঐতিহ্যবাহী সংগ্রহ"].map((item) => (
              <li key={item}>
                <Link href="#" className="hover:text-terracotta-light transition-colors flex items-center gap-1.5">
                  <span className="text-terracotta-light">›</span> {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white mb-4 pb-2.5 border-b border-white/10">নিউজলেটার</h3>
          <p className="text-[13px] mb-3.5 leading-relaxed">নতুন পণ্য ও অফারের আপডেট পেতে সাবস্ক্রাইব করুন।</p>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="আপনার ইমেইল লিখুন"
              className="bg-white/10 border border-white/15 rounded-md px-3.5 py-2.5 text-white text-[13px] outline-none"
            />
            <button className="bg-terracotta text-white py-2.5 rounded-md text-[13px] font-bold hover:bg-earth transition-colors">
              সাবস্ক্রাইব করুন
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-5 border-t border-white/10 flex items-center justify-between text-[12px]">
        <span>© ২০২৫ মাটির পশরা। সর্বস্বত্ব সংরক্ষিত।</span>
        <span>🇧🇩 বাংলাদেশে তৈরি, ভালোবাসায় তৈরি</span>
      </div>
    </footer>
  );
};

export default Footer;
