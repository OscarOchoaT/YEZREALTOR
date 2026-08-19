import type { ReactNode } from "react";

// Caption/microcopy role — brief/BRAND.pdf p.17: JetBrains Mono, uppercase, 20% tracking.
export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-cognac ${className}`}
    >
      {children}
    </span>
  );
}
