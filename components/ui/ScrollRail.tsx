"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// A persistent element that travels the entire length of the page — the
// "CONTINUOUS ELEMENTS" ask from the 2026-08-19 "second iteration" brief.
// Unlike ScrollProgress (a flat top-edge bar), this is a vertical rail of
// section markers fixed to the right edge: a small dot per milestone that
// grows into a short line and label when its section is active, and a
// connecting thread whose fill height tracks whole-document scroll — so the
// page reads as one continuous journey with waypoints, not a stack of
// independent blocks. Desktop only (there's no room for it on narrow
// viewports, and NavPill already gives mobile its own wayfinding).
const waypoints = [
  { id: "hero", label: "Start" },
  { id: "manifesto", label: "Manifesto" },
  { id: "method", label: "Method" },
  { id: "about", label: "About" },
  { id: "why-yez", label: "Why Yez" },
  { id: "contact", label: "Contact" },
];

export function ScrollRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(waypoints[0].id);

  useEffect(() => {
    const sections = waypoints
      .map((w) => document.getElementById(w.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((el) => observer.observe(el));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cleanupFill = () => {};
    if (!reduced && fillRef.current) {
      gsap.set(fillRef.current, { scaleY: 0 });
      const tween = gsap.to(fillRef.current, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      cleanupFill = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }

    return () => {
      observer.disconnect();
      cleanupFill();
    };
  }, []);

  return (
    <div
      ref={railRef}
      className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      {/* mix-blend-mode: difference (white base) auto-inverts against
          whatever section is currently behind the rail — visible on both
          the bone/linen light sections and the cocoa-bark dark ones without
          needing to track section theme separately. Same trick as
          GrainOverlay's blend-based texture elsewhere in this project. */}
      <div className="relative flex flex-col items-end gap-5 mix-blend-difference">
        <span className="absolute right-[3px] top-0 h-full w-px bg-white/25" aria-hidden="true" />
        <div
          ref={fillRef}
          className="absolute right-[3px] top-0 h-full w-px origin-top bg-white"
          aria-hidden="true"
        />
        {waypoints.map((w) => {
          const isActive = active === w.id;
          return (
            <a
              key={w.id}
              href={`#${w.id}`}
              className="pointer-events-auto group flex items-center gap-3"
              aria-label={w.label}
            >
              <span
                className={`font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-white transition-all duration-300 ${
                  isActive
                    ? "translate-x-0 opacity-100"
                    : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"
                }`}
              >
                {w.label}
              </span>
              <span
                className={`relative z-10 block rounded-full border border-white bg-white transition-all duration-300 ${
                  isActive ? "h-2 w-2" : "h-1.5 w-1.5 opacity-50 group-hover:opacity-100"
                }`}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
