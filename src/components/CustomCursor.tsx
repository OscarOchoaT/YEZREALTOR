"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Desktop-only custom cursor: a small Cognac dot — the same point the logo's
 * "." anchors to, reused here as a recurring brand motif. Grows on hover
 * over interactive elements. Never renders on touch devices or when the
 * user prefers reduced motion.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const dot = dotRef.current;
    if (!dot) return;

    document.documentElement.classList.add("custom-cursor-active");
    dot.style.opacity = "1";

    const quickX = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3.out" });
    const quickY = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      quickX(e.clientX);
      quickY(e.clientY);
    };

    const isInteractive = (el: EventTarget | null) =>
      el instanceof HTMLElement && el.closest("a, button, [role='button'], input, textarea");

    const onOver = (e: MouseEvent) => {
      if (isInteractive(e.target)) gsap.to(dot, { scale: 2.6, duration: 0.25, ease: "power2.out" });
    };
    const onOut = (e: MouseEvent) => {
      if (isInteractive(e.target)) gsap.to(dot, { scale: 1, duration: 0.25, ease: "power2.out" });
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cognac opacity-0 will-change-transform"
    />
  );
}
