"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TECH_VS_YEZ } from "@/content/method";
import MethodShowcase from "@/components/sections/MethodShowcase";
import MethodNodes from "@/components/sections/MethodNodes";
import InteractiveDotGrid from "@/components/InteractiveDotGrid";
import RadialAperture from "@/components/RadialAperture";

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
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hintRef = useRef<HTMLParagraphElement>(null);

  const compareRef = useRef<HTMLDivElement>(null);
  const compareEyebrowRef = useRef<HTMLSpanElement>(null);
  const compareColRefs = useRef<(HTMLDivElement | null)[]>([]);
  const compareClosingRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const cards = cardRefs.current.filter((el): el is HTMLButtonElement => Boolean(el));
      const compareItems = [compareEyebrowRef.current, ...compareColRefs.current, compareClosingRef.current].filter(
        (el): el is HTMLElement => Boolean(el)
      );
      const prefersReducedMotion = window.matchMedia(REDUCE_MOTION_QUERY).matches;

      if (prefersReducedMotion) {
        gsap.set(cards, { clearProps: "all" });
        gsap.set(hintRef.current, { autoAlpha: 1 });
        gsap.set(compareItems, { clearProps: "all" });
        return;
      }

      gsap.set(cards, { autoAlpha: 0, y: 24, scale: 0.96 });
      gsap.set(hintRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 25%",
          scrub: 1,
        },
      });
      tl.to(hintRef.current, { autoAlpha: 1, duration: 0.15 }, 0);
      tl.to(cards, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.07, duration: 0.3, ease: "power2.out" }, 0.05);

      // Comparison block below — its own separate scrub, same section-3 pattern.
      gsap.set(compareItems, { autoAlpha: 0, y: 20 });
      const compareTl = gsap.timeline({
        scrollTrigger: {
          trigger: compareRef.current,
          start: "top 82%",
          end: "top 40%",
          scrub: 1,
        },
      });
      compareItems.forEach((el, i) => {
        compareTl.to(el, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.6 }, i * 0.15);
      });
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
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-48 bg-gradient-to-b from-espresso to-transparent sm:h-64"
        />
        <div className="relative mx-auto max-w-6xl">
          <p
            ref={hintRef}
            className="mx-auto mb-8 flex max-w-md items-center justify-center gap-2 text-center font-mono text-[11px] uppercase tracking-caption text-bone/60"
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-cognac motion-safe:[animation:dot-pulse_2s_ease-in-out_infinite]"
            />
            The Next Move Method™ · Full Breakdown
          </p>
          <MethodNodes cardRefs={cardRefs} />
        </div>

        <div ref={compareRef} className="relative mx-auto mt-20 max-w-3xl">
          <span
            ref={compareEyebrowRef}
            className="mx-auto block text-center font-mono text-xs uppercase tracking-caption text-cognac"
          >
            {TECH_VS_YEZ.eyebrow}
          </span>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div
              ref={(el) => {
                compareColRefs.current[0] = el;
              }}
              className="flex flex-col gap-3 rounded-2xl bg-stone/20 p-8"
            >
              <h4 className="font-display text-xl tracking-subhead text-bone">
                {TECH_VS_YEZ.columns.technology.label}
              </h4>
              <ul className="flex flex-col gap-2">
                {TECH_VS_YEZ.columns.technology.items.map((item) => (
                  <li key={item} className="font-body text-sm font-light text-bone/75">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div
              ref={(el) => {
                compareColRefs.current[1] = el;
              }}
              className="flex flex-col gap-3 rounded-2xl bg-cocoaBark p-8"
            >
              <h4 className="font-display text-xl tracking-subhead text-bone">{TECH_VS_YEZ.columns.yez.label}</h4>
              <ul className="flex flex-col gap-2">
                {TECH_VS_YEZ.columns.yez.items.map((item) => (
                  <li key={item} className="font-body text-sm font-light text-bone/80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p
            ref={compareClosingRef}
            className="mt-10 text-center font-display text-xl tracking-subhead text-bone sm:text-2xl"
          >
            {TECH_VS_YEZ.closingLine}
          </p>
        </div>
      </section>
    </>
  );
}
