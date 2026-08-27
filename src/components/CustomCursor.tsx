"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Desktop-only custom cursor: the wordmark's own "Y", in Cognac — the
 * monogram itself standing in for a cursor, not just a color borrowed from
 * it. Grows on hover over interactive elements. Never renders on touch
 * devices or when the user prefers reduced motion.
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    document.documentElement.classList.add("custom-cursor-active");
    cursor.style.opacity = "1";

    const quickX = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" });
    const quickY = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      quickX(e.clientX);
      quickY(e.clientY);
    };

    const isInteractive = (el: EventTarget | null) =>
      el instanceof HTMLElement && el.closest("a, button, [role='button'], input, textarea");

    const onOver = (e: MouseEvent) => {
      if (isInteractive(e.target)) gsap.to(cursor, { scale: 1.7, duration: 0.25, ease: "power2.out" });
    };
    const onOut = (e: MouseEvent) => {
      if (isInteractive(e.target)) gsap.to(cursor, { scale: 1, duration: 0.25, ease: "power2.out" });
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
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 select-none font-display text-xl leading-none text-cognac opacity-0 will-change-transform"
    >
      Y
    </div>
  );
}
