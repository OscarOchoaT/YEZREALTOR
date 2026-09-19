"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Eyebrow from "@/components/Eyebrow";
import { DIFFERENTIATOR } from "@/content/differentiator";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Differentiator() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useGSAP(
    () => {
      const items = itemRefs.current.filter((el): el is HTMLLIElement => Boolean(el));
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set([copyRef.current, ...items], { clearProps: "all" });
        return;
      }

      gsap.set(copyRef.current, { autoAlpha: 0, y: 24 });
      gsap.set(items, { autoAlpha: 0, x: 16 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          end: "top 30%",
          scrub: 1,
        },
      });

      tl.to(copyRef.current, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 1 }, 0);
      items.forEach((item, i) => {
        tl.to(item, { autoAlpha: 1, x: 0, ease: "power2.out", duration: 0.4 }, 0.15 + i * 0.1);
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-stone/25 px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
        <div ref={copyRef} className="flex flex-col gap-6">
          <Eyebrow index="05" label={DIFFERENTIATOR.eyebrow} align="left" />
          <p className="font-display !font-medium text-2xl tracking-subhead text-bone/40 line-through decoration-bone/30 sm:text-3xl">
            {DIFFERENTIATOR.lineOld}
          </p>
          <p className="font-display text-3xl tracking-headline text-bone sm:text-4xl">
            {DIFFERENTIATOR.lineNew}
          </p>
        </div>

        <ul ref={listRef} className="flex flex-col justify-center gap-4">
          {DIFFERENTIATOR.points.map((point, i) => (
            <li
              key={point}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="flex items-start gap-3 border-b border-bone/10 pb-4 font-body text-base font-light text-bone/85"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cognac" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
