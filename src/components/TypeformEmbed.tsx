"use client";

import { SITE } from "@/content/site";
import type { ServiceId } from "@/content/services";

/**
 * Plain iframe embed of the real Typeform from the brief
 * (form.typeform.com/to/DaucnE48). The form itself loads fine directly
 * (HTTP 200) — Typeform's JS "live embed" widget (data-tf-live +
 * embed.js) was the piece failing to fetch, likely a live-embed domain
 * restriction on undeployed/localhost origins. A plain iframe sidesteps
 * that: no third-party script, no widget hydration, just the hosted form.
 *
 * `source` (buy/sell, set by which Services card was clicked) is
 * passed through as a Typeform hidden field via the URL hash, Typeform's
 * documented convention for classic/iframe embeds.
 *
 * TODO(client): to match the site's dark palette instead of Typeform's
 * default theme, open this form in the Typeform builder → Design → and set:
 *   Background  #1A120B (Espresso)   Question text  #F4F0E8 (Bone)
 *   Answer text #F4F0E8 (Bone)   Button/accent  #7A5239 (Cognac)
 */
export default function TypeformEmbed({ source }: { source?: ServiceId | null }) {
  const src = source ? `${SITE.typeformBaseUrl}#source=${source}` : SITE.typeformBaseUrl;

  return (
    <div className="overflow-hidden rounded-2xl border border-bone/15 bg-espresso">
      <iframe
        key={src}
        src={src}
        title="Yez The Realtor — Contact form"
        allow="camera; microphone; autoplay; encrypted-media;"
        loading="lazy"
        style={{ width: "100%", height: "640px", border: "none" }}
      />
    </div>
  );
}
