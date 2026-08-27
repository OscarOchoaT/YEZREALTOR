"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { METHOD_INTRO, TECH_VS_YEZ } from "@/content/method";
import MethodPath, { type MethodPathHandle } from "@/components/sections/MethodPath";
import MethodNodes from "@/components/sections/MethodNodes";
import DotGridBackground from "@/components/DotGridBackground";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default function Method() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const pathHandleRef = useRef<MethodPathHandle>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hintRef = useRef<HTMLParagraphElement>(null);

  const compareRef = useRef<HTMLDivElement>(null);
  const compareEyebrowRef = useRef<HTMLSpanElement>(null);
  const compareColRefs = useRef<(HTMLDivElement | null)[]>([]);
  const compareClosingRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const pathEl = pathHandleRef.current?.pathEl ?? null;
      const dotEls = (pathHandleRef.current?.dotEls ?? []).filter((el): el is HTMLDivElement => Boolean(el));
      const cards = cardRefs.current.filter((el): el is HTMLButtonElement => Boolean(el));
      const compareItems = [compareEyebrowRef.current, ...compareColRefs.current, compareClosingRef.current].filter(
        (el): el is HTMLElement => Boolean(el)
      );
      const prefersReducedMotion = window.matchMedia(REDUCE_MOTION_QUERY).matches;

      if (prefersReducedMotion) {
        if (pathEl) gsap.set(pathEl, { strokeDasharray: "none" });
        gsap.set(dotEls, { autoAlpha: 1, scale: 1 });
        gsap.set(cards, { clearProps: "all" });
        gsap.set(hintRef.current, { autoAlpha: 1 });
        gsap.set(compareItems, { clearProps: "all" });
        return;
      }

      // A single scrubbed (not pinned) reveal — the section scrolls
      // normally. Deliberately no pin here: stacking a second pinned
      // ScrollTrigger directly under the Hero's own pin corrupted both
      // sections' scroll-progress math (words never settling, phases
      // bleeding into each other). A scrub tied to the block's own scroll
      // position is far more robust and still reads as one choreographed
      // beat: path draws, node dots light up, cards settle in, hint appears.
      if (pathEl) {
        const pathLength = pathEl.getTotalLength();
        gsap.set(pathEl, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
      }
      gsap.set(dotEls, { autoAlpha: 0, scale: 0.5 });
      gsap.set(cards, { autoAlpha: 0, y: 24, scale: 0.96 });
      gsap.set(hintRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 55%",
          scrub: 1,
        },
      });

      if (pathEl) {
        tl.to(pathEl, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);
      }
      dotEls.forEach((dot, i) => {
        tl.to(dot, { autoAlpha: 1, scale: 1, duration: 0.15, ease: "power1.out" }, i * 0.18);
      });
      tl.to(hintRef.current, { autoAlpha: 1, duration: 0.15 }, 0.55);
      tl.to(cards, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.07, duration: 0.3, ease: "power2.out" }, 0.6);

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
    <section id="method" ref={sectionRef} className="relative bg-bone px-6 py-24 sm:py-32">
      <DotGridBackground />
      <div className="relative mx-auto max-w-6xl">
        <div ref={introRef} className="mx-auto mb-4 max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-caption text-cognac">{METHOD_INTRO.eyebrow}</span>
          <h2 className="mt-3 font-display text-3xl tracking-headline text-cocoaBark sm:text-4xl">
            {METHOD_INTRO.headline}
          </h2>
        </div>

        <MethodPath ref={pathHandleRef} />

        <p
          ref={hintRef}
          className="mx-auto mb-8 max-w-md text-center font-mono text-[11px] uppercase tracking-caption text-stone"
        >
          Hover to preview · Click to explore each phase
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
            <h4 className="font-display text-xl tracking-subhead text-cocoaBark">
              {TECH_VS_YEZ.columns.technology.label}
            </h4>
            <ul className="flex flex-col gap-2">
              {TECH_VS_YEZ.columns.technology.items.map((item) => (
                <li key={item} className="font-body text-sm font-light text-cocoaBark/75">
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
          className="mt-10 text-center font-display text-xl tracking-subhead text-cocoaBark sm:text-2xl"
        >
          {TECH_VS_YEZ.closingLine}
        </p>
      </div>
    </section>
  );
}
