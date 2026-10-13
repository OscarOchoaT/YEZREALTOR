"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Eyebrow from "@/components/Eyebrow";
import { DIFFERENTIATOR_I18N } from "@/content/differentiator";
import { useContent } from "@/i18n/LocaleProvider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const svgProps = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "h-10 w-10",
  "aria-hidden": true,
} as const;

// One line icon per point, in the same order as DIFFERENTIATOR.points.
const ICONS: ReactNode[] = [
  // financial picture: rising line over a baseline
  <svg key="fin" {...svgProps}>
    <path d="M6 40h36M8 32l9-9 7 6 14-17" />
    <path d="M30 12h8v8" />
  </svg>,
  // personal representation: two people
  <svg key="rep" {...svgProps}>
    <circle cx="17" cy="16" r="6" />
    <circle cx="33" cy="19" r="4.5" />
    <path d="M6 40c0-7 5-12 11-12s11 5 11 12M29 30c5-1 11 2 13 10" />
  </svg>,
  // technology: chip
  <svg key="tech" {...svgProps}>
    <rect x="13" y="13" width="22" height="22" rx="3" />
    <rect x="19" y="19" width="10" height="10" rx="1.5" />
    <path d="M19 6v7M29 6v7M19 35v7M29 35v7M6 19h7M6 29h7M35 19h7M35 29h7" />
  </svg>,
  // bilingual: two speech bubbles
  <svg key="bil" {...svgProps}>
    <path d="M8 9h22a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H18l-7 6v-6H8a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2Z" />
    <path d="M36 18h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3v6l-7-6H22a2 2 0 0 1-2-2v-2" />
  </svg>,
  // Austin market: map pin
  <svg key="mkt" {...svgProps}>
    <path d="M24 43s14-12 14-23a14 14 0 0 0-28 0c0 11 14 23 14 23Z" />
    <circle cx="24" cy="20" r="5" />
  </svg>,
];

export default function Differentiator() {
  const DIFFERENTIATOR = useContent(DIFFERENTIATOR_I18N);
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

  useGSAP(
    () => {
      const cards = cardRefs.current.filter((el): el is HTMLLIElement => Boolean(el));
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set([headRef.current, ...cards], { clearProps: "all" });
        return;
      }

      gsap.set(headRef.current, { autoAlpha: 0, y: 24 });
      gsap.set(cards, { autoAlpha: 0, y: 32, scale: 0.97 });

      gsap.to(headRef.current, {
        autoAlpha: 1,
        y: 0,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", end: "top 45%", scrub: 1 },
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: gridRef.current, start: "top 88%", end: "top 40%", scrub: 1 },
      });
      cards.forEach((card, i) => {
        tl.to(card, { autoAlpha: 1, y: 0, scale: 1, ease: "power2.out", duration: 0.5 }, i * 0.12);
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-stone/25 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div ref={headRef} className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center">
          <Eyebrow index="03" label={DIFFERENTIATOR.eyebrow} />
          <p className="font-display !font-medium text-lg tracking-subhead text-bone/40 line-through decoration-bone/30 sm:text-xl">
            {DIFFERENTIATOR.lineOld}
          </p>
          <h2 className="text-balance font-display text-3xl tracking-headline text-bone sm:text-4xl lg:text-5xl">
            {DIFFERENTIATOR.lineNew}
          </h2>
        </div>

        <ul
          ref={gridRef}
          className="mt-14 grid grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2"
        >
          {DIFFERENTIATOR.points.map((point, i) => {
            const featured = i === 0;
            return (
              <li
                key={point}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`group relative flex min-h-56 flex-col justify-between gap-10 overflow-hidden rounded-2xl p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-8 ${
                  featured
                    ? "bg-cocoaBark sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:p-10"
                    : "border border-bone/10 bg-bone/[0.04] hover:border-cognac/50"
                }`}
              >
                <span
                  className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[8rem] leading-none text-bone/[0.05]"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="relative text-cognac transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  {ICONS[i]}
                </span>
                <p
                  className={`relative font-display tracking-subhead text-bone ${
                    featured ? "text-2xl sm:text-3xl lg:text-4xl lg:leading-[1.1]" : "text-xl sm:text-2xl"
                  }`}
                >
                  {point}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
