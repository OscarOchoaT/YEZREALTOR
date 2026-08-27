"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Fixed "flight instrument" rail — a persistent readout of where the
 * visitor sits in the whole journey, not just within Method's own 4-phase
 * path below. Desktop gets the full rail (ticks + fill); below `lg` there's
 * no room for tick labels next to a single-column layout, so mobile/tablet
 * gets a slim top progress bar instead, driven by the same fill logic. Two
 * independent signals share the desktop rail, deliberately:
 *
 *  - the cognac fill height is continuous document scroll progress (same
 *    "read-progress" language as Manifesto's progressRef rule, just turned
 *    vertical) — always moving, never snaps.
 *  - the active tick is which named section is currently centered in the
 *    viewport (IntersectionObserver), independent of the fill's exact
 *    position — ticks are evenly spaced for legibility, not proportional to
 *    each section's actual height.
 *
 * Indices match Eyebrow's numbering (see Eyebrow.tsx) so the same "02 /
 * ABOUT" language appears both here and at the top of that section.
 * Not gated behind prefers-reduced-motion: this is a wayfinding aid (like
 * the header's scrolled-state), not decorative motion — nothing here
 * animates on a timer, it only reflects scroll position that already
 * happened.
 *
 * Wrapped in the same frosted Bone chip as Header's scrolled state
 * (bg-bone/90 backdrop-blur-sm) rather than floating bare: this is a fixed
 * overlay that has to stay legible over every background it ever sits on —
 * Bone sections, Manifesto/Footer's Espresso/Cocoa Bark, and each Method
 * phase page's solid-tone hero — and Cocoa-Bark-tinted text on a Cocoa Bark
 * hero is otherwise invisible.
 */
const STOPS = [
  { id: "hero", index: "00", label: "Start" },
  { id: "about", index: "02", label: "Yez" },
  { id: "method", index: "03", label: "Method" },
  { id: "services", index: "04", label: "Strategy" },
  { id: "credibility", index: "06", label: "Proof" },
  { id: "contact", index: "07", label: "Move" },
] as const;

const TRACK_HEIGHT = 264; // px — keep in sync with the inline height below.

export default function ScrollCompass() {
  const fillRef = useRef<HTMLDivElement>(null);
  const mobileFillRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const sections = STOPS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (sections.length === 0) return;
    requestAnimationFrame(() => setReady(true));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          const i = STOPS.findIndex((s) => s.id === id);
          if (i !== -1) setActiveIndex(i);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));

    let raf = 0;
    const updateFill = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (fillRef.current) fillRef.current.style.height = `${progress * 100}%`;
      if (mobileFillRef.current) mobileFillRef.current.style.width = `${progress * 100}%`;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(updateFill);
    };
    updateFill();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateFill);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateFill);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return (
    <>
      {/* Mobile/tablet equivalent: the side rail's ticks don't fit next to a
          single-column layout, so this keeps the same continuous
          scroll-progress signal (not the active-stop ticks) visible below
          lg. */}
      <div
        className={`pointer-events-none fixed inset-x-0 top-0 z-30 h-[2px] bg-cocoaBark/10 lg:hidden ${
          ready ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500`}
      >
        <div ref={mobileFillRef} className="h-full bg-cognac" style={{ width: 0 }} />
      </div>

      <div
        className={`pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:flex xl:right-8 ${
          ready ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500`}
      >
        <div
          className="relative flex flex-col justify-between rounded-full border border-cocoaBark/10 bg-bone/90 py-5 pl-4 pr-3.5 shadow-sm shadow-espresso/5 backdrop-blur-sm"
          style={{ height: TRACK_HEIGHT }}
        >
          {/* Base rail + continuous scroll-progress fill (Manifesto's
              progress rule, rotated 90deg). */}
          <div className="absolute bottom-5 right-[15px] top-5 w-px bg-cocoaBark/10" />
          <div ref={fillRef} className="absolute right-[15px] top-5 w-px bg-cognac" style={{ height: 0 }} />

          {STOPS.map((stop, i) => {
            const active = i === activeIndex;
            const href = isHome ? `#${stop.id}` : `/#${stop.id}`;
            return (
              <a key={stop.id} href={href} className="pointer-events-auto group flex items-center gap-2.5">
                <span
                  className={`font-mono text-[9px] uppercase tracking-caption transition-colors duration-300 ${
                    active ? "text-cognac" : "text-stone group-hover:text-cocoaBark/70"
                  }`}
                >
                  <span className="mr-1.5 text-cocoaBark/35">{stop.index}</span>
                  {stop.label}
                </span>
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full border transition-all duration-300 ${
                    active
                      ? "scale-125 border-cognac bg-cognac"
                      : "border-stone/60 bg-bone group-hover:border-cocoaBark/60"
                  }`}
                />
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}
