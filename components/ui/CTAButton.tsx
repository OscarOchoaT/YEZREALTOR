"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import { useMagnetic } from "@/lib/useMagnetic";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-cognac text-bone hover:bg-siena border border-cognac hover:scale-[1.03] active:scale-[0.97]",
  secondary:
    "bg-transparent text-inherit border border-current hover:bg-cocoa-bark/5 hover:scale-[1.03] active:scale-[0.97]",
  // No magnetic pull/scale here — this variant reads as an inline text link
  // (e.g. "Learn how I work →"), where that motion would feel like a bug
  // rather than a button. The underline sweep is the whole hover treatment.
  ghost: "link-underline bg-transparent text-inherit hover:opacity-90",
};

export function CTAButton({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
  label,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  /** Analytics label — defaults to href if omitted (children can be JSX, not always a plain string). */
  label?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-[family-name:var(--font-body)] text-sm font-medium tracking-wide transition duration-200";

  const onClick = () => track("cta_click", { label: label ?? href, href });

  // Magnetic pull only for actual pill buttons (primary/secondary) — see
  // the comment on the ghost variant above for why it's skipped there.
  // useMagnetic itself no-ops (no listeners at all) on touch devices and
  // under prefers-reduced-motion, so this is desktop-only regardless.
  const magneticRef = useMagnetic<HTMLAnchorElement>(0.3);
  const magneticProps = variant === "ghost" ? {} : { ref: magneticRef };

  if (external || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel="noopener noreferrer"
        onClick={onClick}
        className={`${base} ${variantClasses[variant]} ${className}`}
        {...magneticProps}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${base} ${variantClasses[variant]} ${className}`}
      {...magneticProps}
    >
      {children}
    </Link>
  );
}
