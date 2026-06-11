"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface LiveChatConfig {
  enabled: boolean;
  scriptUrl: string;
  tenantId: string;
}

// Element id used both for the injected <script> and the widget's mounted root,
// so we can find and remove them when navigating into the admin panel.
const SCRIPT_ID = "live-chat-widget-script";

// Loads the admin-configured third-party live-chat widget by injecting its
// <script defer data-tenant-id="..."> tag. The widget self-mounts its own
// floating button/panel, so this component renders nothing itself. The script
// is loaded on customer-facing pages only and removed inside the admin panel.
const LiveChatWidget = () => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/mp-control-7h2x") ?? false;

  useEffect(() => {
    if (isAdmin) {
      // Tear down any previously injected widget when entering the admin panel.
      document.getElementById(SCRIPT_ID)?.remove();
      return;
    }

    let active = true;

    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        const cfg: LiveChatConfig | undefined = data.liveChat;
        if (!cfg?.enabled || !cfg.scriptUrl || !cfg.tenantId) return;
        // Already injected — don't load it twice.
        if (document.getElementById(SCRIPT_ID)) return;

        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = cfg.scriptUrl;
        script.defer = true;
        script.setAttribute("data-tenant-id", cfg.tenantId);
        document.body.appendChild(script);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [isAdmin]);

  return null;
};

export default LiveChatWidget;
