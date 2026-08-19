"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { Reveal } from "@/components/scroll/Reveal";

// Typography-as-experience moment (2026-08-19 "second iteration" — the #5/#7
// "TRANSFORMATIONS" + "TYPOGRAPHY AS VISUAL ELEMENT" asks). Every word in the
// statement is scroll-scrubbed individually — unblurring and settling into
// place word by word as the section crosses the viewport, exactly 1:1 with
// scroll position, not a one-time play-on-enter tween — while the statement
// as a whole overshoots past full size and settles back, so it physically
// "arrives" rather than fades in. Replaces the previous
// SplitLines-wrapped, single blur/scale-on-enter version.
export function Differentiation() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".differentiation-statement", {
          type: "words",
        });

        gsap.set(split.words, { opacity: 0.1, filter: "blur(7px)", yPercent: 35 });
        gsap.to(split.words, {
          opacity: 1,
          filter: "blur(0px)",
          yPercent: 0,
          stagger: 0.025,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 88%",
            end: "top 25%",
            scrub: true,
          },
        });

        // Scale overshoots past 1 then settles — a two-stage scrub timeline
        // so the "overshoot and rest" feel comes purely from scroll
        // position (a real easing curve can't drive a scrubbed tween
        // without fighting the 1:1 scroll mapping — see lib/motion.ts).
        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 88%",
              end: "center 45%",
              scrub: true,
            },
          })
          .fromTo(
            ".differentiation-statement",
            { scale: 0.82 },
            { scale: 1.08, ease: "none" }
          )
          .to(".differentiation-statement", { scale: 1, ease: "none" });

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="differentiation"
      className="border-y border-stone/30 bg-linen px-6 py-24 sm:px-10 sm:py-32"
    >
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="differentiation-statement font-[family-name:var(--font-display)] text-3xl font-black leading-tight tracking-[-0.04em] text-cocoa-bark sm:text-5xl">
          You do not need more listings.
          <br />
          You need a better way to decide.
        </p>
        <p className="mx-auto mt-6 max-w-xl text-base text-cocoa-bark/70 sm:text-lg">
          Traditional real estate helps you complete a transaction. Yez helps you
          design your next chapter through ownership.
        </p>
      </Reveal>
    </section>
  );
}
