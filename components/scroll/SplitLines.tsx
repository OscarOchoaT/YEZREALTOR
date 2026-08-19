"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { EASE, DURATION, STAGGER, SCROLL_ENTER } from "@/lib/motion";

// Kinetic line reveal for section headings — each rendered line slides up
// from behind a mask as it scrolls into view, instead of the whole heading
// just fading as one block. Meant for the one or two big statements per
// section (h1/h2-level), not body copy — SplitText measures actual rendered
// lines, so it adapts to whatever the heading wraps to at any breakpoint.
//
// `mask: "lines"` (GSAP's built-in line-mask option) wraps each line in its
// own overflow-hidden container automatically, which is what makes the
// "slides up from behind a hard edge" effect work instead of the text just
// sliding up in the open.
export function SplitLines({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(ref.current, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
        });

        // Perspective on the mask parent (not the line itself) so rotateX
        // below reads as each line physically tipping up into place rather
        // than a flat vertical slide — a cheap way to give heading reveals
        // real depth instead of just opacity+translate.
        gsap.set(split.lines.map((l) => l.parentElement), {
          perspective: 600,
        });

        gsap.from(split.lines, {
          yPercent: 110,
          rotateX: -40,
          transformOrigin: "50% 100%",
          opacity: 0,
          duration: DURATION.slow,
          delay,
          stagger: STAGGER.base,
          ease: EASE.out,
          scrollTrigger: {
            trigger: ref.current,
            start: SCROLL_ENTER,
            toggleActions: "play none none reverse",
          },
        });

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
