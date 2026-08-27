"use client";

import { SITE } from "@/content/site";
import { trackEvent } from "@/lib/analytics";

export default function WhatsAppButton() {
  const href = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(SITE.whatsappMessage)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click")}
      aria-label="Message Yez on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-cocoaBark text-bone shadow-lg shadow-espresso/20 transition-transform hover:scale-105 hover:bg-espresso"
    >
      <svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M16.004 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.258.593 4.428 1.716 6.34L3.2 28.8l6.656-1.746a12.74 12.74 0 0 0 6.148 1.566h.005c7.07 0 12.8-5.73 12.8-12.8 0-3.42-1.332-6.634-3.75-9.05a12.71 12.71 0 0 0-9.055-3.57Zm0 23.36h-.004a10.6 10.6 0 0 1-5.404-1.48l-.388-.23-3.95 1.037 1.055-3.85-.253-.395a10.56 10.56 0 0 1-1.618-5.642c0-5.85 4.76-10.61 10.612-10.61a10.54 10.54 0 0 1 7.507 3.114 10.53 10.53 0 0 1 3.104 7.5c0 5.85-4.76 10.556-10.66 10.556Zm5.815-7.933c-.319-.16-1.885-.93-2.177-1.037-.292-.107-.505-.16-.717.16-.213.32-.823 1.037-1.01 1.25-.187.213-.373.24-.692.08-.319-.16-1.347-.497-2.566-1.586-.949-.847-1.59-1.892-1.777-2.212-.187-.32-.02-.492.14-.652.144-.144.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.717-1.729-.983-2.367-.259-.622-.522-.538-.717-.548l-.611-.011a1.176 1.176 0 0 0-.85.4c-.293.32-1.116 1.09-1.116 2.658 0 1.567 1.143 3.081 1.303 3.294.16.213 2.25 3.436 5.453 4.82.762.329 1.357.526 1.82.673.765.244 1.46.21 2.011.127.613-.092 1.885-.77 2.15-1.513.267-.744.267-1.38.187-1.513-.08-.133-.293-.213-.612-.373Z" />
      </svg>
    </a>
  );
}
