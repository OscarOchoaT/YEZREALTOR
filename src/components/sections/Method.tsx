"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import HumanTech from "@/components/sections/HumanTech";
import MethodShowcase from "@/components/sections/MethodShowcase";
import MethodNodes from "@/components/sections/MethodNodes";
import InteractiveDotGrid from "@/components/InteractiveDotGrid";
import RadialAperture from "@/components/RadialAperture";
import { BRAND_METHOD, UI_I18N } from "@/content/ui";
import { useContent } from "@/i18n/LocaleProvider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * The Next Move Method's full presence: MethodShowcase carries the drama
 * (a full-screen, pinned phase-by-phase takeover — see that file), and this
 * component follows it with the quick-reference grid for anyone who wants
 * to jump straight to a specific phase's full page, plus the human-vs-tech
 * comparison closing the case for the method itself.
 */
export default function Method() {
  const ui = useContent(UI_I18N);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hintRef = useRef<HTMLParagraphElement>(null);


  useGSAP(
    () => {
      const cards = cardRefs.current.filter((el): el is HTMLButtonElement => Boolean(el));
      const prefersReducedMotion = window.matchMedia(REDUCE_MOTION_QUERY).matches;

      if (prefersReducedMotion) {
        gsap.set(cards, { clearProps: "all" });
        gsap.set(hintRef.current, { autoAlpha: 1 });
        return;
      }

      gsap.set(cards, { autoAlpha: 0, y: 24, scale: 0.96 });
      gsap.set(hintRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      });
      // Plays once at full strength (not scrubbed), so the cards are never
      // stuck half-faded at whatever scroll position the visitor rests on.
      tl.to(hintRef.current, { autoAlpha: 1, duration: 0.4 }, 0);
      tl.to(cards, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.7, ease: "power2.out" }, 0.1);
    },
    { scope: sectionRef }
  );

  return (
    <>
      <MethodShowcase />

      <section ref={sectionRef} className="relative overflow-hidden bg-espresso px-6 py-20 sm:py-28">
        <InteractiveDotGrid />
        <RadialAperture
          variant="dark"
          tone="cognac"
          className="left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2"
        />
        {/* Solid-to-transparent bridge across the handoff from MethodShowcase
            above — guarantees the seam reads as one continuous espresso
            surface no matter how the pinned section's own fade lands. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-espresso to-transparent sm:h-32"
        />
        <div className="relative z-[2] mx-auto max-w-6xl">
          <p
            ref={hintRef}
            className="mx-auto mb-8 flex max-w-md items-center justify-center gap-2 text-center font-mono text-sm uppercase tracking-caption text-bone sm:text-base"
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full bg-cognac motion-safe:[animation:dot-pulse_2s_ease-in-out_infinite]"
            />
            {BRAND_METHOD} <span className="text-bone/60">· {ui.fullBreakdown}</span>
          </p>
          <MethodNodes cardRefs={cardRefs} />
        </div>

        <HumanTech />
      </section>
    </>
  );
}
