import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product, { IProduct } from "@/models/Product";
import { getSettings } from "@/lib/settings";
import { serializeProduct } from "@/lib/rag";

// Push the entire product catalogue to the configured RAG webhook in one call.
// Used by the admin "Sync now" button for a full re-index.
export async function POST() {
  try {
    const s = await getSettings();
    if (!s.ragEnabled || !s.ragWebhookUrl) {
      return NextResponse.json(
        { error: "RAG ইন্টিগ্রেশন সক্রিয় নয় বা ওয়েবহুক URL সেট করা নেই।" },
        { status: 400 }
      );
    }

    await dbConnect();
    const products = (await Product.find({}).lean()) as unknown as IProduct[];
    const payload = products.map(serializeProduct);

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (s.ragApiKey) headers["Authorization"] = `Bearer ${s.ragApiKey}`;

    const res = await fetch(s.ragWebhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        event: "bulk",
        payload,
        source: "matir-poshara",
        at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `RAG সার্ভার রেসপন্স: ${res.status}` },
        { status: 502 }
      );
    }

    s.ragLastSyncAt = new Date();
    await s.save();

    return NextResponse.json({ success: true, synced: payload.length });
  } catch (error) {
    console.error("RAG sync error:", error);
    return NextResponse.json({ error: "RAG সিঙ্ক ব্যর্থ হয়েছে।" }, { status: 500 });
  }
}
