"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";

interface LiveChatConfig {
  enabled: boolean;
  url: string;
  title: string;
}

// Floating live-chat widget. The chat embed URL is configured by the admin and
// shown inside a panel that the customer can open and close with the floating
// button. Hidden entirely inside the admin panel.
const LiveChatWidget = () => {
  const pathname = usePathname();
  const [config, setConfig] = useState<LiveChatConfig | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (active) setConfig(data.liveChat || null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Never show in the admin panel.
  if (pathname?.startsWith("/mp-control-7h2x")) return null;
  if (!config?.enabled || !config.url) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[1200] flex flex-col items-end gap-3">
      {open && (
        <div className="w-[90vw] max-w-[380px] h-[70vh] max-h-[640px] bg-white rounded-2xl shadow-2xl border border-cream-dark overflow-hidden flex flex-col animate-in">
          <div className="bg-terracotta text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <span className="font-bold text-sm flex items-center gap-2">
              <MessageCircle size={16} /> {config.title || "লাইভ চ্যাট"}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-white/20 rounded-md transition-colors"
              aria-label="বন্ধ করুন"
            >
              <X size={18} />
            </button>
          </div>
          <iframe
            src={config.url}
            title={config.title || "Live chat"}
            className="flex-1 w-full border-0"
            allow="microphone; camera; clipboard-write; autoplay"
          />
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-terracotta text-white shadow-xl shadow-terracotta/30 flex items-center justify-center hover:bg-clay transition-all hover:scale-105"
        aria-label={open ? "চ্যাট বন্ধ করুন" : "চ্যাট খুলুন"}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default LiveChatWidget;
