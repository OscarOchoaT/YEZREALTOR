// Wordmark per brief/BRAND.pdf p.10-11 ("The Logo" — Construction, Variations).
// Rendered in type (Coolvetica/Rubik fallback) since no vector logo file has
// been delivered yet — swap for the real SVG mark once the client sends it,
// keeping the same primary/monogram/inverse roles.
import Link from "next/link";

type Variant = "primary" | "monogram";
type Tone = "dark" | "light";

const toneClasses: Record<Tone, { word: string; tagline: string }> = {
  dark: { word: "text-cocoa-bark", tagline: "text-cocoa-bark/70" },
  light: { word: "text-bone", tagline: "text-bone/70" },
};

export function Logo({
  variant = "primary",
  tone = "dark",
  href = "#hero",
  className = "",
}: {
  variant?: Variant;
  tone?: Tone;
  href?: string;
  className?: string;
}) {
  const colors = toneClasses[tone];

  return (
    <Link href={href} className={`inline-flex flex-col leading-none ${className}`}>
      <span
        className={`font-[family-name:var(--font-display)] font-black tracking-[-0.04em] ${colors.word}`}
        style={{ fontSize: "1.5rem" }}
      >
        {variant === "primary" ? "Yez." : "Y."}
      </span>
      <span
        className={`mt-0.5 font-[family-name:var(--font-body)] text-[9px] font-medium uppercase tracking-[0.22em] ${colors.tagline}`}
      >
        The Realtor
      </span>
    </Link>
  );
}
