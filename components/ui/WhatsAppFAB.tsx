"use client";

import { whatsappHref } from "@/lib/site-config";
import { track } from "@/lib/analytics";

export function WhatsAppFAB() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Yez on WhatsApp"
      onClick={() => track("whatsapp_click")}
      className="fab-pulse group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-cocoa-bark text-bone shadow-lg transition-transform duration-200 hover:scale-105"
    >
      <span
        aria-hidden="true"
        className="fab-pulse-ring pointer-events-none absolute inset-0 rounded-full border border-cognac"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.4 5.08L2 22l5.2-1.5a9.9 9.9 0 0 0 4.84 1.24h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm5.72 14.05c-.24.68-1.38 1.3-1.9 1.37-.5.08-1.13.11-1.83-.12-.42-.13-.96-.31-1.66-.6-2.92-1.26-4.82-4.2-4.97-4.4-.14-.19-1.2-1.6-1.2-3.05 0-1.46.76-2.17 1.03-2.47.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.68.53.25.6.85 2.07.92 2.22.07.15.12.32.02.51-.1.19-.15.3-.3.47-.14.16-.3.36-.43.48-.15.14-.3.29-.13.57.17.28.76 1.26 1.63 2.04 1.12 1 2.06 1.31 2.34 1.46.28.14.44.12.6-.07.17-.19.72-.84.91-1.13.19-.28.38-.23.63-.14.26.1 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.68-.16 1.35Z" />
      </svg>
    </a>
  );
}
