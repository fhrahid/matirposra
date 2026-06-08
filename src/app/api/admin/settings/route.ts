import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

// Admin: read all settings. The RAG API key is write-only — we never return its
// value, only whether one is set.
export async function GET() {
  try {
    const s = await getSettings();
    return NextResponse.json({
      settings: {
        liveChatEnabled: s.liveChatEnabled,
        liveChatUrl: s.liveChatUrl,
        liveChatTitle: s.liveChatTitle,
        ragEnabled: s.ragEnabled,
        ragWebhookUrl: s.ragWebhookUrl,
        ragApiKeySet: !!s.ragApiKey,
        ragLastSyncAt: s.ragLastSyncAt || null,
      },
    });
  } catch (error) {
    console.error("Admin settings fetch error:", error);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

// Admin: update settings.
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const s = await getSettings();

    if (typeof body.liveChatEnabled === "boolean") s.liveChatEnabled = body.liveChatEnabled;
    if (typeof body.liveChatUrl === "string") s.liveChatUrl = body.liveChatUrl.trim();
    if (typeof body.liveChatTitle === "string") s.liveChatTitle = body.liveChatTitle.trim();

    if (typeof body.ragEnabled === "boolean") s.ragEnabled = body.ragEnabled;
    if (typeof body.ragWebhookUrl === "string") s.ragWebhookUrl = body.ragWebhookUrl.trim();
    // Only overwrite the key when a non-empty value is supplied (write-only).
    if (typeof body.ragApiKey === "string" && body.ragApiKey.trim()) {
      s.ragApiKey = body.ragApiKey.trim();
    }

    await s.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin settings update error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
