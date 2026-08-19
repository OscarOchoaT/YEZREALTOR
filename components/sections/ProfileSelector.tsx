"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitLines } from "@/components/scroll/SplitLines";
import { TypeformEmbed } from "@/components/ui/TypeformEmbed";
import { useIntent } from "@/lib/intent-context";
import type { Intent } from "@/lib/site-config";

const intents: Array<{ key: Intent; label: string }> = [
  { key: "buy", label: "I want to buy" },
  { key: "sell", label: "I want to sell" },
  { key: "rent", label: "I want to rent" },
];

export function ProfileSelector() {
  const { intent: active, setIntent: setActive } = useIntent();
  const embedWrapRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);

  // Embed remounts on `key={active}` (fresh hidden-field value per intent) —
  // a wrapper fade softens that swap instead of it just popping in. Skipped
  // on first mount so it doesn't fight the section's own Reveal entrance.
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!embedWrapRef.current) return;
    gsap.fromTo(
      embedWrapRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
    );
  }, [active]);

  function selectIntent(intent: Intent, target: HTMLButtonElement) {
    setActive(intent);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      target,
      { scale: 0.94 },
      {
        scale: 1,
        duration: 0.35,
        ease: "back.out(2)",
        // Removes the inline transform once the bounce settles, so the CSS
        // hover:scale utility (which inline styles would otherwise
        // permanently outrank) keeps working after the first click.
        clearProps: "scale",
      }
    );
  }

  return (
    <section
      id="profile-selector"
      className="bg-linen px-6 py-24 sm:px-10 sm:py-32"
    >
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-black tracking-[-0.04em] text-cocoa-bark sm:text-5xl">
          <SplitLines>Start your Client Profile.</SplitLines>
        </h2>
        <p className="mt-4 text-base text-cocoa-bark/70 sm:text-lg">
          Three minutes. Then a real strategy — not an auto-generated estimate.
        </p>

        <div className="mt-10 flex justify-center gap-2">
          {intents.map((intent) => (
            <button
              key={intent.key}
              type="button"
              onClick={(e) => selectIntent(intent.key, e.currentTarget)}
              aria-pressed={active === intent.key}
              className={`rounded-full px-5 py-2.5 font-[family-name:var(--font-body)] text-sm font-medium tracking-wide transition duration-200 hover:scale-[1.04] active:scale-[0.96] ${
                active === intent.key
                  ? "bg-cognac text-bone"
                  : "border border-stone/30 bg-bone text-cocoa-bark/75 hover:text-cocoa-bark"
              }`}
            >
              {intent.label}
            </button>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-sm text-cocoa-bark/75">
          Your profile becomes the starting point for your Decode. If it&apos;s a
          fit, we&apos;ll schedule a Positioning Call — the first real step of
          your Next Move Method.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-12 max-w-2xl">
        <div
          ref={embedWrapRef}
          className="overflow-hidden rounded-2xl border border-stone/30 bg-bone shadow-sm"
        >
          <TypeformEmbed key={active} intent={active} />
        </div>
      </Reveal>
    </section>
  );
}
