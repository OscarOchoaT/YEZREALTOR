"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CREDIBILITY_I18N } from "@/content/credibility";
import { useContent } from "@/i18n/LocaleProvider";
import { SITE } from "@/content/site";
import DotGridBackground from "@/components/DotGridBackground";
import Eyebrow from "@/components/Eyebrow";
import TestimonialCard from "@/components/TestimonialCard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Real, verified reviews only — never fabricate. Add entries (quote, author,
// detail e.g. "Buyer" / "Relocation" / "New construction") copied verbatim from
// Google / Realtor.com and they render as cards below. While empty, the section
// shows just the heading and the two review links.
const TESTIMONIALS: { quote: string; author: string; detail?: string }[] = [];

export default function Credibility() {
  const CREDIBILITY = useContent(CREDIBILITY_I18N);
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

        <h2 className="mt-6 text-center font-display text-3xl tracking-headline text-bone sm:text-4xl">
          {CREDIBILITY.headline}
        </h2>
        <p className="mt-3 text-center font-body text-base font-light text-bone/70">{CREDIBILITY.subline}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
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

        {TESTIMONIALS.length > 0 && (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.author + t.quote} {...t} />
            ))}
          </div>
        )}

        <div className="mt-12 flex items-center justify-center gap-8">
          <a
            href={SITE.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-caption text-bone underline decoration-cognac decoration-1 underline-offset-4 hover:text-cognac"
          >
            {CREDIBILITY.googleReviews}
          </a>
          <a
            href={SITE.realtorDotComUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-caption text-bone underline decoration-cognac decoration-1 underline-offset-4 hover:text-cognac"
          >
            {CREDIBILITY.realtorReviews}
          </a>
        </div>
      </div>
    </section>
  );
}
