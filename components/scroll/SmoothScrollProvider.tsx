"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { track } from "@/lib/analytics";

// Lenis drives smooth scroll; ScrollTrigger reads scroll position from it via
// scrollerProxy so pinning/scrub stay in sync (brief/06 §1 stack decisions).
// Skipped entirely under prefers-reduced-motion — native scroll is the correct
// fallback there, not a smoothed one.
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // next/font swaps the fallback system font for the real webfont after
    // first paint, which can change text wrapping/line count in pinned
    // sections (e.g. #method's cards). ScrollTrigger measures pin start/end
    // off whatever layout exists when it's created, so a late font swap
    // desyncs those measurements — refreshing once fonts settle re-measures
    // everything and fixes the resulting overlap/misalignment.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      // gsap.ticker reports time in seconds; Lenis expects milliseconds.
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  // Analytics scaffolding — brief/07-integrations-conversion-funnel.md §6.
  // Runs regardless of reduced-motion (tracking isn't motion).
  useEffect(() => {
    const thresholds = [25, 50, 75, 100];
    const fired = new Set<number>();

    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;
      const percent = (doc.scrollTop / scrollable) * 100;
      for (const t of thresholds) {
        if (percent >= t && !fired.has(t)) {
          fired.add(t);
          track("scroll_depth", { percent: t });
        }
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            track("section_view", { section: entry.target.id });
            sectionObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.5 }
    );
    document
      .querySelectorAll("main section[id], footer[id]")
      .forEach((el) => sectionObserver.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      sectionObserver.disconnect();
    };
  }, []);

  return <>{children}</>;
}
