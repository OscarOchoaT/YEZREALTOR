"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ServiceId } from "@/content/services";

/**
 * Tracks which CTA (buy/sell) the visitor entered through, so the
 * Contact section's Typeform embed can pass it as a hidden field for
 * downstream analytics/segmentation.
 */
const SourceContext = createContext<{
  source: ServiceId | null;
  setSource: (source: ServiceId) => void;
}>({ source: null, setSource: () => {} });

export function SourceProvider({ children }: { children: React.ReactNode }) {
  const [source, setSource] = useState<ServiceId | null>(null);
  const value = useMemo(() => ({ source, setSource }), [source]);
  return <SourceContext.Provider value={value}>{children}</SourceContext.Provider>;
}

export function useSource() {
  return useContext(SourceContext);
}
