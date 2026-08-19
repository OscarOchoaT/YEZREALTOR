"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const VARIANTS = {
  // Over bg-bone/linen — matches the opacity range already cleared by the
  // Fase 4 WCAG contrast audit for decorative background shapes on this bg.
  light: [
    "radial-gradient(circle at 30% 30%, var(--color-cognac), transparent 70%)",
    "radial-gradient(circle at 60% 40%, var(--color-siena), transparent 70%)",
    "radial-gradient(circle at 50% 50%, var(--color-stone), transparent 70%)",
  ],
  // Over bg-cocoa-bark — lighter, lower-contrast glows so they read as ambient
  // light rather than muddying the dark background.
  dark: [
    "radial-gradient(circle at 30% 30%, var(--color-stone), transparent 70%)",
    "radial-gradient(circle at 60% 40%, var(--color-linen), transparent 70%)",
    "radial-gradient(circle at 50% 50%, var(--color-siena), transparent 70%)",
  ],
} as const;

// Slow-drifting blurred gradient blobs — an ambient "aurora" backdrop built
// from CSS transforms only (no WebGL/3D), so it carries none of the desktop
// rendering risk that sank the Phase 2 React Three Fiber scenes. Purely
// decorative: aria-hidden, pointer-events none, must be placed inside a
// `relative overflow-hidden` ancestor.
export function AuroraField({
  variant = "light",
  className = "",
}: {
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const gradients = VARIANTS[variant];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const blobs = gsap.utils.toArray<HTMLElement>(".aurora-blob", ref.current!);
        blobs.forEach((blob, i) => {
          gsap.to(blob, {
            x: gsap.utils.random(-50, 50),
            y: gsap.utils.random(-40, 40),
            scale: gsap.utils.random(0.9, 1.2),
            duration: gsap.utils.random(11, 17),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.7,
          });
        });
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className="aurora-blob absolute -left-1/4 top-0 h-[60vmax] w-[60vmax] rounded-full opacity-30 blur-3xl"
        style={{ background: gradients[0] }}
      />
      <div
        className="aurora-blob absolute right-[-10%] top-1/4 h-[48vmax] w-[48vmax] rounded-full opacity-25 blur-3xl"
        style={{ background: gradients[1] }}
      />
      <div
        className="aurora-blob absolute bottom-[-15%] left-1/3 h-[42vmax] w-[42vmax] rounded-full opacity-20 blur-3xl"
        style={{ background: gradients[2] }}
      />
    </div>
  );
}
