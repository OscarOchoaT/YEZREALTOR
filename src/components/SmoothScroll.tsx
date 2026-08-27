"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Below this width we treat the device as mobile: Lenis's rAF-driven virtual
// scroll fights ScrollTrigger's pin/scrub recalculation on mobile browsers,
// especially when the address bar shows/hides mid-scroll. Native scroll +
// ScrollTrigger.normalizeScroll is the combination GSAP recommends there.
// Keep in sync with Tailwind's `lg` breakpoint used throughout the site.
const MOBILE_BREAKPOINT = 1024;

/**
 * Wires Lenis smooth scroll into GSAP's ticker so ScrollTrigger stays in sync
 * with Lenis's virtual scroll position on desktop. On mobile, skips Lenis
 * entirely and normalizes native scroll instead. Respects
 * prefers-reduced-motion by skipping the smoothing layer altogether.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

    if (isMobile) {
      ScrollTrigger.normalizeScroll(true);
      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        ScrollTrigger.normalizeScroll(false);
      };
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
