"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitLines } from "@/components/scroll/SplitLines";

const capabilities = [
  "Understandable real estate + financial strategy",
  "Human, highly personalized guidance",
  "Technology that simplifies decisions and visualizes scenarios",
  "Curation of properties, experiences, and professionals",
  "Full representation through the transaction",
  "A relationship that continues after closing",
  "A cultural identity built around modern homeownership",
];

const strengths = [
  {
    title: "Strategic thinking",
    body: "I analyze systems, variables, risk, and scenarios before recommending a direction.",
  },
  {
    title: "Simplifying complexity",
    body: "Financing, property taxes, incentives, market conditions, comparisons, appreciation, costs — turned into decisions you can actually understand.",
  },
  {
    title: "Personalized representation",
    body: "Not a high-volume, impersonal experience. Direct guidance, every step.",
  },
  {
    title: "Negotiation",
    body: "Active representation of your interests at every key decision.",
  },
  {
    title: "Technology",
    body: "Used as a tool for clarity, organization, tracking, and comparison.",
  },
  {
    title: "Bilingual",
    body: "Fluent in English and Spanish.",
  },
  {
    title: "Cross-cultural understanding",
    body: "As an immigrant, I understand the financial and emotional complexity of building stability in the U.S.",
  },
  {
    title: "Austin & Central Texas expertise",
    body: "New construction, incentives, builders, growth corridors, relocation, submarkets.",
  },
];

// Sticky storytelling section (2026-08-19 "second iteration" — the
// "STICKY/PINNED ELEMENTS" ask: a fixed visual pane while content advances
// past it). Uses plain CSS `position: sticky` rather than a GSAP
// ScrollTrigger pin — cheaper, can't scroll-jack, and degrades to a normal
// stacked list on mobile/tablet for free (sticky just never activates below
// the grid breakpoint). Desktop: the left pane holds whichever strength is
// nearest the viewport center — big index, title, body — while the right
// column is a tall scrollable list of index+title only; each list item
// dims/scales down when it's not the active one, so scrolling through the
// list reads as advancing a story, not just triggering entrances one by one.
export function WhyYez() {
  const storyRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const items = itemRefs.current.filter(Boolean) as HTMLLIElement[];
        gsap.set(items, { opacity: 0.32, scale: 0.94 });
        gsap.set(items[0], { opacity: 1, scale: 1 });

        function setActive(i: number) {
          const s = strengths[i];
          if (counterRef.current) counterRef.current.textContent = String(i + 1).padStart(2, "0");
          if (titleRef.current) titleRef.current.textContent = s.title;
          if (bodyRef.current) bodyRef.current.textContent = s.body;
          gsap.fromTo(
            [titleRef.current, bodyRef.current],
            { opacity: 0.3, y: 6 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
          );
        }

        const triggers = items.map((item, i) =>
          ScrollTrigger.create({
            trigger: item,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => {
              gsap.to(item, {
                opacity: self.isActive ? 1 : 0.32,
                scale: self.isActive ? 1 : 0.94,
                duration: 0.45,
                ease: "power2.out",
              });
              if (self.isActive) setActive(i);
            },
          })
        );

        return () => triggers.forEach((t) => t.kill());
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(itemRefs.current.filter(Boolean), { opacity: 1, scale: 1 });
      });

      return () => mm.revert();
    },
    { scope: storyRef }
  );

  return (
    <section id="why-yez" className="bg-linen px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <Kicker>Why Yez</Kicker>
          <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-black tracking-[-0.04em] text-cocoa-bark sm:text-5xl">
            <SplitLines>
              It&apos;s not that the service is &ldquo;better.&rdquo; It&apos;s
              that these capabilities rarely live in one place.
            </SplitLines>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="mt-12 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {capabilities.map((item, i) => (
              <li
                key={item}
                className="flex gap-4 border-t border-stone/30 pt-4 text-base text-cocoa-bark/80"
              >
                <span className="font-[family-name:var(--font-display)] font-black text-cognac">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-12 max-w-2xl font-[family-name:var(--font-display)] text-xl font-medium tracking-[-0.02em] text-cocoa-bark sm:text-2xl">
            My job is to translate your life, your finances, and your future
            goals into a real estate strategy.
          </p>
        </Reveal>

        <div ref={storyRef} className="mt-20 lg:grid lg:grid-cols-[0.85fr_1.3fr] lg:gap-16">
          {/* Sticky detail pane — desktop only. Mobile gets nothing here;
              each list item below carries its own full title+body instead. */}
          <div className="hidden lg:block">
            <div className="lg:sticky lg:top-32">
              <div className="flex items-baseline gap-3">
                <span
                  ref={counterRef}
                  className="font-[family-name:var(--font-display)] text-6xl font-black leading-none tracking-[-0.04em] text-cognac"
                >
                  01
                </span>
                <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-cocoa-bark/50">
                  / {String(strengths.length).padStart(2, "0")}
                </span>
              </div>
              <h3
                ref={titleRef}
                className="mt-6 font-[family-name:var(--font-display)] text-2xl font-black tracking-[-0.02em] text-cocoa-bark"
              >
                {strengths[0].title}
              </h3>
              <p ref={bodyRef} className="mt-4 max-w-sm text-base leading-relaxed text-cocoa-bark/75">
                {strengths[0].body}
              </p>
            </div>
          </div>

          <ul className="mt-10 flex flex-col gap-6 sm:grid sm:grid-cols-2 sm:gap-8 lg:mt-0 lg:flex lg:gap-0">
            {strengths.map((s, i) => (
              <li
                key={s.title}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                data-cursor="EXPLORE"
                className="lg:flex lg:min-h-[26vh] lg:items-center lg:border-t lg:border-stone/25 lg:py-8 lg:first:border-t-0"
              >
                <div>
                  <span className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-siena lg:hidden">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg font-medium tracking-[-0.02em] text-cocoa-bark lg:text-3xl lg:font-black lg:tracking-[-0.03em]">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cocoa-bark/75 lg:hidden">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
