"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// First-paint brand moment: a brief cocoa-bark curtain with the wordmark,
// wiping up to reveal the Hero. Doubles as cover for the next/font swap
// (SmoothScrollProvider already refreshes ScrollTrigger once fonts settle —
// this just means nobody sees that swap happen). Skipped entirely under
// prefers-reduced-motion: instant removal, nothing to wait on.
//
// Hero.tsx's own entrance timeline is hardcoded to start at 1.25s to line up
// with this curtain sliding away (see the timeline math below: 0.15 delay +
// 0.5 fade-in + 0.3 gap + 0.35 fade-out = curtain starts sliding at 1.25s,
// clears fully ~0.7s later). If this timing changes, update Hero.tsx to match.
//
// Deliberately does NOT lock document scroll: Lenis (SmoothScrollProvider)
// keeps running underneath regardless of this component, driven by its own
// rAF loop off gsap.ticker. Locking scroll here (e.g. `overflow: hidden` on
// <html>) would let Lenis's virtual scroll target keep accumulating wheel
// input while the real scroll is clamped to 0, producing a jump the instant
// the lock lifts. The curtain is on-screen for ~1.3s — not enough for that
// tradeoff to be worth the desync risk.
export function IntroCurtain() {
  const curtainRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = curtainRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { display: "none" });
      return;
    }

    const tl = gsap.timeline({
      delay: 0.15,
      onComplete: () => gsap.set(el, { display: "none" }),
    });
    tl.to(".intro-mark", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
      .to(".intro-mark", { opacity: 0, y: -12, duration: 0.35, ease: "power2.in" }, "+=0.3")
      .to(el, { yPercent: -100, duration: 0.7, ease: "expo.inOut" }, "-=0.05");

    return () => {
      tl.kill();
      gsap.set(el, { display: "none" });
    };
  });

  return (
    <div
      ref={curtainRef}
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-cocoa-bark"
    >
      <span className="intro-mark translate-y-3 font-[family-name:var(--font-display)] text-3xl font-black tracking-[-0.04em] text-bone opacity-0 sm:text-4xl">
        Yez.
      </span>
    </div>
  );
}
