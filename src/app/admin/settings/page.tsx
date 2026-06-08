"use client";

import React, { useEffect, useState } from "react";
import {
  MessageCircle,
  Database,
  Loader2,
  Save,
  RefreshCw,
  CheckCircle2,
  Info,
} from "lucide-react";

interface SettingsState {
  liveChatEnabled: boolean;
  liveChatUrl: string;
  liveChatTitle: string;
  ragEnabled: boolean;
  ragWebhookUrl: string;
  ragApiKey: string; // write-only input
  ragApiKeySet: boolean;
  ragLastSyncAt: string | null;
}

const initial: SettingsState = {
  liveChatEnabled: false,
  liveChatUrl: "",
  liveChatTitle: "লাইভ চ্যাট",
  ragEnabled: false,
  ragWebhookUrl: "",
  ragApiKey: "",
  ragApiKeySet: false,
  ragLastSyncAt: null,
};

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<SettingsState>(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
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
        setSettings((prev) => ({ ...prev, ...data.settings, ragApiKey: "" }));
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
          liveChatUrl: settings.liveChatUrl,
          liveChatTitle: settings.liveChatTitle,
          ragEnabled: settings.ragEnabled,
          ragWebhookUrl: settings.ragWebhookUrl,
          ragApiKey: settings.ragApiKey,
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

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/rag/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showNotice(`${data.synced}টি পণ্য RAG-তে সিঙ্ক হয়েছে।`);
        await load();
      } else {
        showNotice(data.error || "সিঙ্ক ব্যর্থ হয়েছে।");
      }
    } catch {
      showNotice("সিঙ্ক ব্যর্থ হয়েছে।");
    } finally {
      setSyncing(false);
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
          <p className="text-text-light text-sm">লাইভ চ্যাট ও RAG ইন্টিগ্রেশন এখান থেকে কনফিগার করুন</p>
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
          চালু করলে সকল কাস্টমার পেজ ও ল্যান্ডিং পেজে একটি ভাসমান চ্যাট বাটন দেখা যাবে (অ্যাডমিন প্যানেলে নয়)।
        </p>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-mid uppercase tracking-wider">চ্যাট iframe URL</label>
            <input
              value={settings.liveChatUrl}
              onChange={(e) => update({ liveChatUrl: e.target.value })}
              placeholder="https://tawk.to/chat/... বা যেকোনো লাইভ চ্যাট এম্বেড URL"
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-mid uppercase tracking-wider">উইজেট শিরোনাম</label>
            <input
              value={settings.liveChatTitle}
              onChange={(e) => update({ liveChatTitle: e.target.value })}
              placeholder="লাইভ চ্যাট"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* RAG INTEGRATION */}
      <div className="bg-white rounded-3xl shadow-sm border border-cream-dark p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-text-dark flex items-center gap-2">
            <span className="w-9 h-9 bg-leaf/10 text-leaf rounded-xl flex items-center justify-center">
              <Database size={18} />
            </span>
            RAG ইন্টিগ্রেশন
          </h3>
          <Toggle on={settings.ragEnabled} onChange={(v) => update({ ragEnabled: v })} />
        </div>
        <p className="text-xs text-text-light mb-6">
          চালু থাকলে প্রতিটি পণ্য যোগ, সম্পাদনা, মুছে ফেলা বা CSV ইমপোর্টের সময় আপনার RAG ওয়েবহুকে রিয়েল-টাইমে আপডেট পাঠানো হবে।
        </p>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-mid uppercase tracking-wider">RAG ওয়েবহুক URL</label>
            <input
              value={settings.ragWebhookUrl}
              onChange={(e) => update({ ragWebhookUrl: e.target.value })}
              placeholder="https://your-rag-service.com/ingest"
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-mid uppercase tracking-wider">
              API কী {settings.ragApiKeySet && <span className="text-leaf normal-case">(সেট করা আছে — পরিবর্তন করতে নতুন কী লিখুন)</span>}
            </label>
            <input
              type="password"
              value={settings.ragApiKey}
              onChange={(e) => update({ ragApiKey: e.target.value })}
              placeholder={settings.ragApiKeySet ? "•••••••••••• (অপরিবর্তিত)" : "Authorization Bearer টোকেন (ঐচ্ছিক)"}
              className={inputClass}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleSync}
              disabled={syncing || !settings.ragEnabled}
              className="bg-leaf text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-leaf-light transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {syncing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
              সম্পূর্ণ ক্যাটালগ এখনই সিঙ্ক করুন
            </button>
            {settings.ragLastSyncAt && (
              <span className="text-xs text-text-light">
                সর্বশেষ সিঙ্ক: {new Date(settings.ragLastSyncAt).toLocaleString("bn-BD")}
              </span>
            )}
          </div>
          <p className="text-[11px] text-text-light">
            সেভ করার পর &quot;সিঙ্ক&quot; বাটন ব্যবহার করুন। ওয়েবহুক বডি: <code className="bg-cream px-1 rounded">{`{ event, payload, source, at }`}</code>
          </p>
        </div>
      </div>

      {/* DIRECT DB CONNECTION INFO */}
      <div className="bg-cream-dark/20 rounded-3xl border border-cream-dark p-8">
        <h3 className="text-base font-bold text-text-dark flex items-center gap-2 mb-3">
          <Info size={18} className="text-clay" /> সরাসরি ডেটাবেস সংযোগ (রিয়েল-টাইম)
        </h3>
        <p className="text-sm text-text-mid leading-relaxed mb-3">
          আপনার RAG সরাসরি MongoDB-র সাথেও যুক্ত হতে পারে। সকল পণ্য <code className="bg-white px-1.5 py-0.5 rounded text-xs">matir-poshra</code> ডেটাবেসের <code className="bg-white px-1.5 py-0.5 rounded text-xs">products</code> কালেকশনে আছে।
        </p>
        <ul className="text-sm text-text-mid leading-relaxed list-disc pl-5 space-y-1.5">
          <li><strong>Change Streams:</strong> <code className="bg-white px-1.5 py-0.5 rounded text-xs">db.collection(&quot;products&quot;).watch()</code> দিয়ে insert/update/delete রিয়েল-টাইমে শুনুন।</li>
          <li><strong>কানেকশন স্ট্রিং:</strong> সার্ভারের <code className="bg-white px-1.5 py-0.5 rounded text-xs">.env.local</code> ফাইলের <code className="bg-white px-1.5 py-0.5 rounded text-xs">MONGODB_URI</code> ব্যবহার করুন।</li>
          <li><strong>ওয়েবহুক:</strong> উপরের RAG সেকশন চালু থাকলে প্রতিটি পরিবর্তনে পুশ নোটিফিকেশন পাবেন।</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
