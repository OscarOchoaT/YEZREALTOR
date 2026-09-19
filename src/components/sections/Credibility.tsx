"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CREDIBILITY } from "@/content/credibility";
import { SITE } from "@/content/site";
import DotGridBackground from "@/components/DotGridBackground";
import Eyebrow from "@/components/Eyebrow";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Real testimonials go here once the client shares them — pass an array of
// <TestimonialCard /> props instead of leaving this empty. See
// src/components/TestimonialCard.tsx.
const TESTIMONIALS: { quote: string; author: string; detail?: string }[] = [];

export default function Credibility() {
  const sectionRef = useRef<HTMLElement>(null);
  const factRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const facts = factRefs.current.filter((el): el is HTMLSpanElement => Boolean(el));
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set(facts, { clearProps: "all" });
        return;
      }

      gsap.set(facts, { autoAlpha: 0, y: 12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 45%",
          scrub: 1,
        },
      });

      facts.forEach((fact, i) => {
        tl.to(fact, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.4 }, i * 0.1);
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="credibility" ref={sectionRef} className="relative bg-espresso px-6 py-24 sm:py-32">
      <DotGridBackground />
      <div className="relative mx-auto max-w-4xl">
        <div className="text-center">
          <Eyebrow index="06" label={CREDIBILITY.eyebrow} />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {CREDIBILITY.facts.map((fact, i) => (
            <span
              key={fact}
              ref={(el) => {
                factRefs.current[i] = el;
              }}
              className="font-body text-sm font-medium text-bone/80"
            >
              {fact}
            </span>
          ))}
        </div>

        <div className="mt-16">
          {TESTIMONIALS.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Map real testimonials into <TestimonialCard /> here once available. */}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-bone/20 px-8 py-16 text-center">
              <p className="font-display !font-medium text-xl tracking-subhead text-bone">
                {CREDIBILITY.testimonialsPlaceholder}
              </p>
              <p className="font-body text-sm font-light text-bone/70">{CREDIBILITY.testimonialsSubline}</p>
              <div className="mt-2 flex items-center gap-6">
                <a
                  href={SITE.googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-caption text-bone underline decoration-cognac decoration-1 underline-offset-4 hover:text-cognac"
                >
                  Google Reviews
                </a>
                <a
                  href={SITE.realtorDotComUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-caption text-bone underline decoration-cognac decoration-1 underline-offset-4 hover:text-cognac"
                >
                  Realtor.com
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
