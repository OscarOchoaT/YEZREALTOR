"use client";

import { useRef } from "react";
import { CREDIBILITY_I18N } from "@/content/credibility";
import { useContent } from "@/i18n/LocaleProvider";
import { SITE } from "@/content/site";
import DotGridBackground from "@/components/DotGridBackground";
import Eyebrow from "@/components/Eyebrow";
import TestimonialCard from "@/components/TestimonialCard";

// Real, verified reviews only — never fabricate. Add entries (quote, author,
// detail e.g. "Buyer" / "Relocation" / "New construction") copied verbatim from
// Google / Realtor.com and they render as cards below. While empty, the section
// shows just the heading and the two review links.
const TESTIMONIALS: { quote: string; author: string; detail?: string }[] = [];

export default function Credibility() {
  const CREDIBILITY = useContent(CREDIBILITY_I18N);
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="credibility" ref={sectionRef} className="relative bg-espresso px-6 py-24 sm:py-32">
      <DotGridBackground />
      <div className="relative mx-auto max-w-4xl">
        <div className="text-center">
          <Eyebrow index="04" label={CREDIBILITY.eyebrow} />
        </div>

        <h2 className="mt-6 text-center font-display text-3xl tracking-headline text-bone sm:text-4xl">
          {CREDIBILITY.headline}
        </h2>
        <p className="mt-3 text-center font-body text-base font-light text-bone/70">{CREDIBILITY.subline}</p>

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
