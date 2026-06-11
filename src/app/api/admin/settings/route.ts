import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

// Admin: read all settings.
export async function GET() {
  try {
    const s = await getSettings();
    return NextResponse.json({
      settings: {
        liveChatEnabled: s.liveChatEnabled,
        liveChatScriptUrl: s.liveChatScriptUrl,
        liveChatTenantId: s.liveChatTenantId,
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
    if (typeof body.liveChatScriptUrl === "string") s.liveChatScriptUrl = body.liveChatScriptUrl.trim();
    if (typeof body.liveChatTenantId === "string") s.liveChatTenantId = body.liveChatTenantId.trim();

    await s.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin settings update error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
