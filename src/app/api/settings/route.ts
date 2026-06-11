import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

// Public endpoint — returns ONLY customer-safe settings (live chat).
export async function GET() {
  try {
    const s = await getSettings();
    return NextResponse.json({
      liveChat: {
        enabled: s.liveChatEnabled,
        scriptUrl: s.liveChatScriptUrl,
        tenantId: s.liveChatTenantId,
      },
    });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json({
      liveChat: { enabled: false, scriptUrl: "", tenantId: "" },
    });
  }
}
