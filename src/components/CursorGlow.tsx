"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * A soft, warm light that follows the cursor across the whole (now dark)
 * site — the same "light through a round window" motif RadialAperture
 * establishes locally, made ambient. On a near-black page this single
 * layer is what makes the dark theme feel inhabited rather than flat:
 * the room seems to react to you standing in it.
 *
 * Desktop fine-pointer only, off under prefers-reduced-motion — same
 * gating as CustomCursor/Magnetic. Plain low-opacity gradient, no
 * mix-blend-mode: blend modes force the browser to recomposite against
 * everything underneath on every moved frame (expensive layered over the
 * Hero's WebGL canvas and the site-wide grain overlay) — a touch less
 * "pure light" than `screen` blending, not worth that cost for how subtle
 * this already is.
 */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const glow = glowRef.current;
    if (!glow) return;

    const quickX = gsap.quickTo(glow, "x", { duration: 0.9, ease: "power3.out" });
    const quickY = gsap.quickTo(glow, "y", { duration: 0.9, ease: "power3.out" });

    let shown = false;
    const onMove = (e: MouseEvent) => {
      quickX(e.clientX);
      quickY(e.clientY);
      if (!shown) {
        shown = true;
        gsap.to(glow, { opacity: 1, duration: 0.6, ease: "power1.out" });
      }
    };
    const onLeave = () => {
      shown = false;
      gsap.to(glow, { opacity: 0, duration: 0.5, ease: "power1.out" });
    };

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[25] h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-0 will-change-transform"
      style={{
        background: "radial-gradient(circle, rgba(227,178,124,0.08) 0%, rgba(122,82,57,0.04) 42%, transparent 72%)",
      }}
    />
  );
}
