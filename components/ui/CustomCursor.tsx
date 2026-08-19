"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Trailing accent ring + dot that follows the pointer, gated to real mice
// (hover:hover + pointer:fine) and prefers-reduced-motion:no-preference so
// touch devices and reduced-motion users never pay for it. Deliberately
// additive: the native cursor is never hidden (no `cursor: none`), so if
// anything here misbehaves the pointer itself is still fully usable.
//
// Contextual label upgrade (2026-08-19 "second iteration"): any element with
// a `data-cursor="VIEW"` / `data-cursor="EXPLORE"` etc. attribute swells the
// ring into a small pill carrying that word — a quiet, editorial cue rather
// than an icon or a color change, matching "elegant, never infantile"
// from the brief. Elements without the attribute keep the plain ring+dot.
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFinePointer || reduced) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot || !label) return;

    gsap.set([ring, dot], { xPercent: -50, yPercent: -50, opacity: 0 });

    const moveRing = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const moveRingY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
    const moveDot = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const moveDotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });

    let revealed = false;
    let activeLabelEl: Element | null = null;

    function onMove(e: MouseEvent) {
      if (!revealed) {
        revealed = true;
        gsap.to([ring, dot], { opacity: 1, duration: 0.3 });
      }
      moveRing(e.clientX);
      moveRingY(e.clientY);
      moveDot(e.clientX);
      moveDotY(e.clientY);
    }

    function onOver(e: MouseEvent) {
      const target = e.target as Element | null;
      const cursorEl = target?.closest<HTMLElement>("[data-cursor]");
      if (cursorEl) {
        activeLabelEl = cursorEl;
        label!.textContent = cursorEl.dataset.cursor ?? "";
        // Grow the box itself (width/height), not `scale` — scaling the ring
        // would blow the label text up 3-4x along with it. This keeps the
        // wordmark crisp at a fixed size while the pill grows to fit it.
        gsap.to(ring, {
          width: 96,
          height: 40,
          borderRadius: 999,
          backgroundColor: "var(--color-bone)",
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(dot, { opacity: 0, duration: 0.2 });
        gsap.to(label, { opacity: 1, duration: 0.25, delay: 0.08 });
        return;
      }
      if (target?.closest("a, button, [role='button'], input, textarea")) {
        gsap.to(ring, { scale: 2.1, duration: 0.35, ease: "power2.out" });
      }
    }

    function onOut(e: MouseEvent) {
      const target = e.target as Element | null;
      if (activeLabelEl && target?.closest("[data-cursor]") === activeLabelEl) {
        activeLabelEl = null;
        gsap.to(ring, {
          width: 32,
          height: 32,
          borderRadius: 999,
          backgroundColor: "rgba(0,0,0,0)",
          duration: 0.35,
          ease: "power2.out",
        });
        gsap.to(dot, { opacity: 1, duration: 0.2 });
        gsap.to(label, { opacity: 0, duration: 0.15 });
        return;
      }
      if (target?.closest("a, button, [role='button'], input, textarea")) {
        gsap.to(ring, { scale: 1, duration: 0.35, ease: "power2.out" });
      }
    }

    function onLeaveWindow() {
      gsap.to([ring, dot], { opacity: 0, duration: 0.2 });
      gsap.to(label, { opacity: 0, duration: 0.15 });
      revealed = false;
      activeLabelEl = null;
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mouseout", onOut, { passive: true });
    window.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      window.removeEventListener("mouseleave", onLeaveWindow);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] flex h-8 w-8 items-center justify-center rounded-full border border-cognac bg-bone/0 opacity-0"
      >
        <span
          ref={labelRef}
          className="whitespace-nowrap font-[family-name:var(--font-mono)] text-[9px] font-medium uppercase tracking-[0.15em] text-cognac opacity-0"
        />
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-cognac opacity-0"
      />
    </>
  );
}
