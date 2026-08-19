"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { CTAButton } from "@/components/ui/CTAButton";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitLines } from "@/components/scroll/SplitLines";
import { useIntent } from "@/lib/intent-context";

const services = [
  {
    key: "buy" as const,
    title: "Buy",
    body: "Strategic representation for buyers — first-time, repeat, new construction, resale, relocation, or a second property. For anyone ready to start or expand their real estate portfolio.",
    cta: "Start My Buyer Strategy",
  },
  {
    key: "sell" as const,
    title: "Sell",
    body: "Strategic representation for owners ready to sell — competitive analysis, pricing, preparation, positioning, marketing, negotiation, and full transaction management.",
    cta: "Start My Seller Strategy",
  },
  {
    key: "rent" as const,
    title: "Rent",
    body: "Representation to find the right property for your next chapter — relocation, new to Austin, temporary transitions, or preparing to buy later.",
    cta: "Start My Rental Strategy",
  },
];

export function Services() {
  const { intent: active, setIntent: setActive } = useIntent();
  const current = services.find((s) => s.key === active)!;

  const tabsRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);

  // Underline slides to whichever tab button is active, measured directly
  // off the DOM so it works regardless of label length/font metrics.
  useGSAP(
    () => {
      const container = tabsRef.current;
      const indicator = indicatorRef.current;
      if (!container || !indicator) return;

      const button = container.querySelector<HTMLButtonElement>(
        `[data-tab="${active}"]`
      );
      if (!button) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(indicator, {
        x: button.offsetLeft,
        width: button.offsetWidth,
        duration: reduced ? 0 : 0.4,
        ease: "power3.out",
      });
    },
    { dependencies: [active], scope: tabsRef }
  );

  // Content crossfade on tab change only — skipped on first mount so it
  // doesn't fight Reveal's own entrance animation for the section.
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
    );
  }, [active]);

  return (
    <section id="services" className="bg-bone px-6 py-24 sm:px-10 sm:py-32">
      <Reveal className="mx-auto max-w-4xl">
        <Kicker>Your next move deserves a strategy.</Kicker>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-black tracking-[-0.04em] text-cocoa-bark sm:text-5xl">
          <SplitLines>Buy. Sell. Rent. One method behind all three.</SplitLines>
        </h2>

        <div ref={tabsRef} className="relative mt-10 flex gap-2 border-b border-stone/30">
          {services.map((s) => (
            <button
              key={s.key}
              type="button"
              data-tab={s.key}
              onClick={() => setActive(s.key)}
              aria-pressed={active === s.key}
              className={`rounded-t-lg px-5 py-3 font-[family-name:var(--font-body)] text-sm font-medium tracking-wide transition-colors ${
                active === s.key
                  ? "text-cocoa-bark"
                  : "text-cocoa-bark/70 hover:text-cocoa-bark/80"
              }`}
            >
              {s.title}
            </button>
          ))}
          <span
            ref={indicatorRef}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-cognac"
          />
        </div>

        <div ref={panelRef} className="mt-8 max-w-2xl">
          <p className="text-base leading-relaxed text-cocoa-bark/80 sm:text-lg">
            {current.body}
          </p>
          <CTAButton href="#profile-selector" className="mt-6">
            {current.cta}
          </CTAButton>
        </div>

        <p className="mt-14 max-w-2xl text-sm text-cocoa-bark/75">
          Also guiding professionals and families relocating to Texas —
          especially Austin — and advising high-net-worth international
          investors in luxury property.
        </p>
      </Reveal>
    </section>
  );
}
