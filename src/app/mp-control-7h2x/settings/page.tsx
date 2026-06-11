"use client";

import React, { useEffect, useState } from "react";
import {
  MessageCircle,
  Loader2,
  Save,
  CheckCircle2,
} from "lucide-react";

interface SettingsState {
  liveChatEnabled: boolean;
  liveChatScriptUrl: string;
  liveChatTenantId: string;
}

const initial: SettingsState = {
  liveChatEnabled: false,
  liveChatScriptUrl: "https://symai.aetherbd.com/static/widget.js",
  liveChatTenantId: "",
};

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<SettingsState>(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 4000);
  };

  const load = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch (error) {
      console.error("Failed to load settings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = (patch: Partial<SettingsState>) =>
    setSettings((prev) => ({ ...prev, ...patch }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          liveChatEnabled: settings.liveChatEnabled,
          liveChatScriptUrl: settings.liveChatScriptUrl,
          liveChatTenantId: settings.liveChatTenantId,
        }),
      });
      if (res.ok) {
        showNotice("সেটিংস সংরক্ষিত হয়েছে।");
        await load();
      } else {
        showNotice("সংরক্ষণ ব্যর্থ হয়েছে।");
      }
    } catch {
      showNotice("সার্ভারে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 outline-none focus:border-terracotta transition-colors text-sm";

  const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${on ? "bg-terracotta" : "bg-cream-dark"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${on ? "left-6.5" : "left-0.5"}`}
        style={{ left: on ? "26px" : "2px" }}
      />
    </button>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="animate-spin text-terracotta" size={36} />
        <p className="text-text-mid font-medium">সেটিংস লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-tiro text-3xl text-text-dark mb-2">সেটিংস</h1>
          <p className="text-text-light text-sm">লাইভ চ্যাট উইজেট এখান থেকে কনফিগার করুন</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-terracotta text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-clay transition-all shadow-lg shadow-terracotta/20 flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          সংরক্ষণ করুন
        </button>
      </div>

      {notice && (
        <div className="mb-6 bg-leaf/10 border border-leaf/20 text-leaf text-sm font-medium px-5 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle2 size={16} /> {notice}
        </div>
      )}

      {/* LIVE CHAT */}
      <div className="bg-white rounded-3xl shadow-sm border border-cream-dark p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-text-dark flex items-center gap-2">
            <span className="w-9 h-9 bg-terracotta/10 text-terracotta rounded-xl flex items-center justify-center">
              <MessageCircle size={18} />
            </span>
            লাইভ চ্যাট উইজেট
          </h3>
          <Toggle on={settings.liveChatEnabled} onChange={(v) => update({ liveChatEnabled: v })} />
        </div>
        <p className="text-xs text-text-light mb-6">
          চালু করলে সকল কাস্টমার পেজ ও ল্যান্ডিং পেজে চ্যাট উইজেট স্ক্রিপ্টটি লোড হবে (অ্যাডমিন প্যানেলে নয়)। উইজেটটি নিজেই তার ভাসমান বাটন তৈরি করবে।
        </p>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-mid uppercase tracking-wider">উইজেট স্ক্রিপ্ট URL</label>
            <input
              value={settings.liveChatScriptUrl}
              onChange={(e) => update({ liveChatScriptUrl: e.target.value })}
              placeholder="https://symai.aetherbd.com/static/widget.js"
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-mid uppercase tracking-wider">Tenant ID (data-tenant-id)</label>
            <input
              value={settings.liveChatTenantId}
              onChange={(e) => update({ liveChatTenantId: e.target.value })}
              placeholder="be221dedb00cc7879ef4d6f2"
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
