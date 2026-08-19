"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Thin top-edge bar tracking whole-document scroll fraction — sits above the
// grain overlay but below the nav pill/cursor. Lenis keeps native
// window.scrollY in sync (see SmoothScrollProvider), so a plain
// document.documentElement trigger works the same way it does for every
// other ScrollTrigger in the project.
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(barRef.current, { scaleX: 0 });
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    });

    // Decorative chrome, not content — hidden outright rather than static,
    // same call as every other reduced-motion branch in this project.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(barRef.current, { scaleX: 0 });
    });

    return () => mm.revert();
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-cognac"
      ref={barRef}
    />
  );
}
