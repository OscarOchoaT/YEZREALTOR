"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MANIFESTO } from "@/content/manifesto";
import RadialAperture from "@/components/RadialAperture";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// All manifesto lines render stacked in the same spot (absolutely
// positioned on top of one another) and the timeline crossfades between
// them one at a time, instead of the old stack-and-stay reveal — so the
// section reads as one line at a time speaking, not a growing list.
const ALL_LINES = [
  ...MANIFESTO.body.map((line) => ({ text: line, kind: "body" as const })),
  ...MANIFESTO.closing.map((line) => ({ text: line, kind: "closing" as const })),
  { text: MANIFESTO.closingStatement, kind: "statement" as const },
];

const LINE_CLASS: Record<(typeof ALL_LINES)[number]["kind"], string> = {
  body: "font-body text-lg font-light text-bone/80 sm:text-xl",
  closing: "font-display !font-medium text-2xl tracking-subhead text-bone sm:text-3xl",
  statement: "font-accent text-2xl italic text-glow sm:text-3xl",
};

const HOLD_DURATION = 1.1;
const FADE_DURATION = 0.5;
const GAP_DURATION = 0.35;

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lines = lineRefs.current.filter((el): el is HTMLParagraphElement => Boolean(el));
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set(lines, { clearProps: "all", position: "static" });
        gsap.set(progressRef.current, { scaleX: 1 });
        return;
      }

      gsap.set(lines, { autoAlpha: 0, y: 12 });
      gsap.set(progressRef.current, { scaleX: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
      });

      // A thin cognac rule draws across the whole scrub, underscoring the
      // manifesto like a read-progress line — the same "precision instrument"
      // language as the connector lines elsewhere on the site.
      tl.to(progressRef.current, { scaleX: 1, ease: "none", duration: lines.length }, 0);

      let cursor = 0;
      lines.forEach((line, i) => {
        tl.to(line, { autoAlpha: 1, y: 0, duration: FADE_DURATION, ease: "power2.out" }, cursor);
        cursor += FADE_DURATION + HOLD_DURATION;
        if (i < lines.length - 1) {
          tl.to(line, { autoAlpha: 0, y: -12, duration: FADE_DURATION, ease: "power2.in" }, cursor);
        }
        cursor += FADE_DURATION + GAP_DURATION;
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-espresso px-6 py-28 text-bone sm:py-36">
      <RadialAperture className="left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative mx-auto flex min-h-[14rem] max-w-2xl flex-col items-center justify-center gap-3 text-center sm:min-h-[16rem]">
        <div ref={progressRef} className="absolute top-0 mb-6 h-px w-16 origin-left bg-cognac" aria-hidden="true" />

        {ALL_LINES.map((line, i) => (
          <p
            key={line.text}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            className={`absolute inset-x-0 px-2 ${LINE_CLASS[line.kind]}`}
          >
            {line.text}
          </p>
        ))}
      </div>
    </section>
  );
}
