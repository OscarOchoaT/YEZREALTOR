"use client";

import Script from "next/script";
import { SITE } from "@/content/site";
import type { ServiceId } from "@/content/services";

/**
 * Inline "Live" Typeform embed. Loads Typeform's own embed script once and
 * lets it hydrate the `data-tf-live` div — no form is rebuilt by hand.
 *
 * TODO(client): to match the site palette instead of Typeform's default
 * theme, open this form in the Typeform builder → Design → and set:
 *   Background  #F4F0E8 (Bone)   Question text  #3D2A20 (Cocoa Bark)
 *   Answer text #1A120B (Espresso)   Button/accent  #7A5239 (Cognac)
 * The embed script picks up whatever theme is saved on the form itself.
 */
export default function TypeformEmbed({ source }: { source?: ServiceId | null }) {
  const formId = SITE.typeformBaseUrl.split("/").pop();

  return (
    <div className="overflow-hidden rounded-2xl border border-cocoaBark/15 bg-bone">
      <Script src="https://embed.typeform.com/next/embed.js" strategy="lazyOnload" />
      <div
        data-tf-live={formId}
        data-tf-hidden={source ? `source=${source}` : undefined}
        data-tf-opacity="100"
        style={{ width: "100%", height: "640px" }}
      />
    </div>
  );
}
