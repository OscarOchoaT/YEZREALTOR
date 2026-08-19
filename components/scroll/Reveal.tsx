"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, DURATION, SCROLL_ENTER } from "@/lib/motion";

// Generic scroll-in reveal used across sections (brief/08 Fase 1 checklist).
// Upgraded from a flat fade+translateY to a clip-path wipe + scale settle —
// the content unmasks from behind a hard edge and eases down from a slight
// overscale rather than simply fading into place, so it reads as a
// transformation instead of decoration (2026-08-19 "second iteration" pass —
// the brief for that pass explicitly named opacity+translateY entrances as
// the pattern to de-emphasize site-wide). Kept as one shared component so
// every section using <Reveal> picks up the upgrade for free.
// gsap.matchMedia() gates the animation on prefers-reduced-motion — reduced
// users get the content statically visible, no JS-driven motion at all.
export function Reveal({
  children,
  className = "",
  y = 24,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, {
          clipPath: "inset(0 0 100% 0)",
          scale: 1.06,
          y,
          duration: DURATION.slower,
          delay,
          ease: EASE.cinematic,
          scrollTrigger: {
            trigger: ref.current,
            start: SCROLL_ENTER,
            toggleActions: "play none none reverse",
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(ref.current, { clipPath: "inset(0 0 0% 0)", scale: 1, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className} style={{ clipPath: "inset(0 0 0% 0)" }}>
      {children}
    </div>
  );
}
