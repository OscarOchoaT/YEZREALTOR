"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { AuroraField } from "@/components/ui/AuroraField";

// Mobile/tablet: kinetic word-by-word reveal scrubbed to scroll, unpinned —
// brief/06 §Sección 3 (Manifesto), referencing 50-jahre-hitparade.ch's
// precise scroll-tied text motion. Desktop gets a second, additive layer:
// a pinned fullscreen sequence (2026-08-19 "second iteration" fullscreen-
// moment request) where each of the three statements takes over the entire
// viewport in turn — scaling up and dissolving as the next one arrives — so
// the manifesto is *crossed through*, not scrolled past. Same pin-desktop-
// only / static-mobile split as every other pinned section in this project
// (brief/06 — mobile can't run pins safely).
export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Word-level blur reveal is the mobile/tablet treatment only — on
      // desktop the pinned fullscreen sequence below already gives each
      // line its own blur/scale arrival, and running both against the same
      // trigger element (one pinned, one not) would fight over timing.
      mm.add("(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".manifesto-line", { type: "words" });

        gsap.set(split.words, { opacity: 0.15, filter: "blur(4px)" });
        gsap.to(split.words, {
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 55%",
            // true = no lag (see components/sections/Method.tsx for why a
            // numeric scrub causes a "stuck then jumps" feel on mobile flicks).
            scrub: true,
          },
        });

        return () => split.revert();
      });

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.getById("manifesto-pin")?.kill();

        const lines = gsap.utils.toArray<HTMLElement>(".manifesto-line");
        const scrollCfg = {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * 2.2,
          scrub: true,
          invalidateOnRefresh: true,
        };

        ScrollTrigger.create({ id: "manifesto-pin", ...scrollCfg, pin: true, pinSpacing: true });

        gsap.set(lines[1], { opacity: 0, scale: 0.85 });
        gsap.set(lines[2], { opacity: 0, scale: 0.85 });

        gsap
          .timeline({ scrollTrigger: scrollCfg })
          .to(lines[0], { opacity: 0, scale: 1.3, filter: "blur(6px)", duration: 1, ease: "none" })
          .fromTo(
            lines[1],
            { opacity: 0, scale: 0.85 },
            { opacity: 1, scale: 1, duration: 1, ease: "none" },
            "<"
          )
          .to(lines[1], { opacity: 0, scale: 1.3, filter: "blur(6px)", duration: 1, ease: "none" }, "+=0.3")
          .fromTo(
            lines[2],
            { opacity: 0, scale: 0.85 },
            { opacity: 1, scale: 1, duration: 1, ease: "none" },
            "<"
          );

        return () => ScrollTrigger.getById("manifesto-pin")?.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative overflow-hidden bg-cocoa-bark px-6 py-28 text-bone sm:px-10 sm:py-36 lg:min-h-screen"
    >
      <AuroraField variant="dark" />

      <div className="relative mx-auto max-w-3xl lg:flex lg:h-screen lg:max-w-4xl lg:items-center lg:justify-center lg:overflow-hidden">
        <p className="manifesto-line font-[family-name:var(--font-display)] text-2xl font-black leading-snug tracking-[-0.04em] sm:text-4xl lg:absolute lg:inset-x-0 lg:text-center lg:text-6xl">
          The next generation does not need another realtor.
        </p>
        <p className="manifesto-line mt-6 text-base leading-relaxed text-bone/75 sm:text-lg lg:absolute lg:inset-x-0 lg:mt-0 lg:max-w-2xl lg:text-center lg:text-2xl lg:mx-auto">
          It needs a clearer path to ownership. A strategy built around real life.
          Technology that makes decisions easier. Human guidance when the stakes
          are high. And an experience worthy of the moment.
        </p>
        <p className="manifesto-line mt-10 font-[family-name:var(--font-display)] text-2xl font-black tracking-[-0.04em] sm:text-4xl lg:absolute lg:inset-x-0 lg:mt-0 lg:text-center lg:text-6xl">
          This is not real estate as usual.
          <br />
          This is homeownership by design.
        </p>
      </div>
    </section>
  );
}
