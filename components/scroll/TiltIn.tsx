"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, DURATION, SCROLL_ENTER } from "@/lib/motion";

// Like Reveal, but flips the element up out of a 3D perspective instead of a
// flat fade — used where a grid of cards benefits from more presence than
// the standard fade-up (brief/08 Fase 4 immersive pass). Parent needs
// `style={{ perspective: "...px" }}` for the rotateX to read as depth rather
// than a flat squash. Same matchMedia gating as Reveal: no motion at all
// under prefers-reduced-motion.
export function TiltIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, {
          opacity: 0,
          y: 36,
          rotateX: 50,
          transformOrigin: "50% 100%",
          duration: DURATION.slow,
          delay,
          ease: EASE.out,
          scrollTrigger: {
            trigger: ref.current,
            start: SCROLL_ENTER,
            toggleActions: "play none none reverse",
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(ref.current, { opacity: 1, y: 0, rotateX: 0 });
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      className={`transition-transform duration-300 ease-out hover:-translate-y-1 ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
