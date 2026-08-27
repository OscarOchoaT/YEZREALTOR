"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import DotGridBackground from "@/components/DotGridBackground";
import Eyebrow from "@/components/Eyebrow";
import { ABOUT } from "@/content/about";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set([photoRef.current, copyRef.current], { clearProps: "all" });
        return;
      }

      gsap.set(photoRef.current, { autoAlpha: 0, scale: 0.97 });
      gsap.set(copyRef.current, { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          end: "top 30%",
          scrub: 1,
        },
      });

      tl.to(photoRef.current, { autoAlpha: 1, scale: 1, ease: "power2.out", duration: 1 }, 0);
      tl.to(copyRef.current, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 1 }, 0.08);
    },
    { scope: sectionRef }
  );

  return (
    <section id="about" ref={sectionRef} className="relative bg-bone px-6 py-24 sm:py-32">
      <DotGridBackground />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div ref={photoRef}>
          <PhotoPlaceholder
            label={ABOUT.photoPlaceholder}
            tone="stone"
            className="aspect-[4/5] w-full rounded-2xl"
          />
        </div>

        <div ref={copyRef} className="flex flex-col gap-6">
          <Eyebrow index="02" label={ABOUT.eyebrow} align="left" />

          <div className="flex flex-col gap-4">
            {ABOUT.paragraphs.map((p) => (
              <p key={p} className="font-body text-lg font-light leading-relaxed text-cocoaBark/90">
                {p}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-2 gap-y-2 pt-2">
            {ABOUT.tags.map((tag, i) => (
              <span key={tag} className="flex items-center font-mono text-[11px] uppercase tracking-caption text-cocoaBark/60">
                {tag}
                {i < ABOUT.tags.length - 1 && <span className="ml-2 text-cognac">·</span>}
              </span>
            ))}
          </div>

          <p className="border-t border-cocoaBark/10 pt-5 font-mono text-xs uppercase tracking-caption text-stone">
            {ABOUT.credibilityLine}
          </p>
        </div>
      </div>
    </section>
  );
}
