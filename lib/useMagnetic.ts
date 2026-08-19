"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Subtle magnetic pull toward the pointer on hover — desktop with a real
// mouse only (hover:hover + pointer:fine) and prefers-reduced-motion:
// no-preference. On touch devices or reduced motion, no listeners are
// attached at all, so the element is completely inert (not just visually
// static — zero event-handling cost).
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const moveX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

    function onMove(e: MouseEvent) {
      // TS can't carry the `if (!el) return` narrowing above into this
      // nested closure (a known limitation for callbacks defined in the
      // same scope) — the guard already makes this safe at runtime.
      const rect = el!.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      moveX(relX * strength);
      moveY(relY * strength);
    }
    function onLeave() {
      moveX(0);
      moveY(0);
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return ref;
}
