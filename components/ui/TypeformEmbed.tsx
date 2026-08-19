"use client";

import { Widget } from "@typeform/embed-react";
import { typeformFormId, type Intent } from "@/lib/site-config";
import { track } from "@/lib/analytics";

// Inline, on-brand embed — brief/07-integrations-conversion-funnel.md §2:
// "no debe parecer un recurso externo desconectado de la marca." The
// selected intent (buy/sell/rent) rides in as a hidden field so the first
// question in Typeform can already know what the visitor picked.
export function TypeformEmbed({
  intent,
  className = "",
}: {
  intent: Intent;
  className?: string;
}) {
  return (
    <Widget
      id={typeformFormId}
      hidden={{ intent }}
      className={className}
      style={{ width: "100%", height: "600px" }}
      onReady={() => track("typeform_ready", { intent })}
      onStarted={() => track("typeform_start", { intent })}
      onSubmit={() => track("typeform_complete", { intent })}
    />
  );
}
