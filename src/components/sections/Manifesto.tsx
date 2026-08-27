"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MANIFESTO } from "@/content/manifesto";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BODY_COUNT = MANIFESTO.body.length;
const CLOSING_COUNT = MANIFESTO.closing.length;

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lines = lineRefs.current.filter((el): el is HTMLParagraphElement => Boolean(el));
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set(lines, { clearProps: "all" });
        gsap.set(progressRef.current, { scaleX: 1 });
        return;
      }

      gsap.set(lines, { autoAlpha: 0, y: 18 });
      gsap.set(progressRef.current, { scaleX: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 60%",
          scrub: 1,
        },
      });

      // A thin cognac rule draws across the whole scrub, underscoring the
      // manifesto like a read-progress line — the same "precision instrument"
      // language as the connector lines elsewhere on the site.
      tl.to(progressRef.current, { scaleX: 1, ease: "none", duration: 1 }, 0);
      lines.forEach((line, i) => {
        tl.to(line, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, i * 0.11);
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative bg-espresso px-6 py-28 text-bone sm:py-36">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
        <div ref={progressRef} className="mb-6 h-px w-16 origin-left bg-cognac" aria-hidden="true" />

        {MANIFESTO.body.map((line, i) => (
          <p
            key={line}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            className="font-body text-lg font-light text-bone/80 sm:text-xl"
          >
            {line}
          </p>
        ))}

        <div className="h-6" />

        {MANIFESTO.closing.map((line, i) => (
          <p
            key={line}
            ref={(el) => {
              lineRefs.current[BODY_COUNT + i] = el;
            }}
            className="font-display text-2xl tracking-subhead text-bone sm:text-3xl"
          >
            {line}
          </p>
        ))}

        <p
          ref={(el) => {
            lineRefs.current[BODY_COUNT + CLOSING_COUNT] = el;
          }}
          className="mt-6 font-mono text-xs uppercase tracking-caption text-cognac"
        >
          {MANIFESTO.closingStatement}
        </p>
      </div>
    </section>
  );
}
