"use client";

// Shared "intent" (buy/sell/rent) selection so choosing a tab in #services
// carries over to #profile-selector automatically instead of each section
// tracking its own local state (brief/08 Fase 3 nice-to-have). A plain
// context avoids the useSearchParams + Suspense route that was deferred —
// no URL/history surface, no hydration risk.
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Intent } from "@/lib/site-config";

const IntentContext = createContext<{
  intent: Intent;
  setIntent: (intent: Intent) => void;
} | null>(null);

export function IntentProvider({ children }: { children: ReactNode }) {
  const [intent, setIntent] = useState<Intent>("buy");
  const value = useMemo(() => ({ intent, setIntent }), [intent]);

  return <IntentContext.Provider value={value}>{children}</IntentContext.Provider>;
}

export function useIntent() {
  const ctx = useContext(IntentContext);
  if (!ctx) throw new Error("useIntent must be used within an IntentProvider");
  return ctx;
}
