"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DIFFERENTIATOR_I18N } from "@/content/differentiator";
import { useContent } from "@/i18n/LocaleProvider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Why Yez" — a pinned stage: a pill labelled with the section name and a beam
 * of light that reveals one point at a time as the visitor scrolls.
 */
export default function Differentiator() {
  const DIFFERENTIATOR = useContent(DIFFERENTIATOR_I18N);
  const points = DIFFERENTIATOR.points;
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useGSAP(
    () => {
      const items = itemRefs.current.filter((el): el is HTMLLIElement => Boolean(el));
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setReduced(true);
        return;
      }

      gsap.set(items, { autoAlpha: 0, x: 40, filter: "blur(12px)" });
      gsap.set(items[0], { autoAlpha: 1, x: 0, filter: "blur(0px)" });

      const n = items.length;
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${n * 70}%`,
          pin: true,
          scrub: 1,
          onUpdate: (self) => setActive(Math.min(n - 1, Math.round(self.progress * (n - 1)))),
        },
      });

      // Each step: current point exits left/blurred while the next one enters from the right.
      for (let i = 0; i < n - 1; i++) {
        tl.to(items[i], { autoAlpha: 0, x: -40, filter: "blur(12px)", duration: 0.5 }, i + 0.5)
          .fromTo(
            items[i + 1],
            { autoAlpha: 0, x: 40, filter: "blur(12px)" },
            { autoAlpha: 1, x: 0, filter: "blur(0px)", duration: 0.5 },
            i + 0.5
          );
      }
      tl.to({}, { duration: 0.5 }); // hold the last point
    },
    { scope: sectionRef, dependencies: [points.length] }
  );

  const pad = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-black/30 px-6 py-24"
    >
      {/* grid lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(255 255 255 / 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.12) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-0">
          {/* beam */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-6 top-1/2 h-48 -translate-y-1/2 bg-[radial-gradient(ellipse_70%_60%_at_30%_50%,rgb(255_255_255/0.28),transparent_70%)] blur-2xl lg:left-[14rem]"
          />

          {/* pill */}
          <div className="relative z-10 inline-flex shrink-0 items-center gap-4 self-start rounded-full border border-bone/15 bg-bone/[0.06] px-8 py-5 backdrop-blur-sm sm:px-10 sm:py-6">
            <span aria-hidden="true" className="font-mono text-2xl font-light text-bone/70">
              +
            </span>
            <h2 className="font-display text-3xl tracking-headline text-bone sm:text-4xl">
              {DIFFERENTIATOR.eyebrow}
            </h2>
          </div>

          {/* caret */}
          <span aria-hidden="true" className="relative z-10 mx-5 hidden h-14 w-0.5 shrink-0 bg-bone lg:block" />

          {/* points */}
          {reduced ? (
            <ol className="relative z-10 flex flex-col gap-5 lg:max-w-xl">
              {points.map((point, i) => (
                <li key={point} className="flex gap-4 font-display text-xl text-bone">
                  <span className="font-mono text-xs text-cognac">{pad(i)}</span>
                  {point}
                </li>
              ))}
            </ol>
          ) : (
            <ol className="relative z-10 grid flex-1 [&>li]:col-start-1 [&>li]:row-start-1">
              {points.map((point, i) => (
                <li
                  key={point}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="flex flex-col gap-3 self-center lg:max-w-xl"
                >
                  <span className="font-mono text-sm tracking-caption text-cognac">{pad(i)}</span>
                  <p className="font-display text-2xl tracking-subhead text-bone sm:text-4xl">{point}</p>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* progress numbers */}
        {!reduced && (
          <div className="relative z-10 flex items-center gap-4 font-mono text-xs tracking-caption" aria-hidden="true">
            {points.map((_, i) => (
              <span key={i} className={`transition-colors duration-300 ${i === active ? "text-cognac" : "text-bone/25"}`}>
                {pad(i)}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
