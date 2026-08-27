"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Wraps a single interactive child (button/link) in an inline-block that
 * gently pulls toward the cursor within its own bounds, then springs back on
 * leave — desktop fine-pointer only, off under prefers-reduced-motion, same
 * gating as CustomCursor.tsx. Translates the wrapper, not the child itself,
 * so it works with any child (TransitionLink, plain <a>, <button>) without
 * needing to forward a ref into it.
 */
export default function Magnetic({
  children,
  strength = 0.4,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const quickX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const quickY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      quickX((e.clientX - (r.left + r.width / 2)) * strength);
      quickY((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}
