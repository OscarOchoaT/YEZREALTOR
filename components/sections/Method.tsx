"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Kicker } from "@/components/ui/Kicker";
import { SplitLines } from "@/components/scroll/SplitLines";

const steps = [
  {
    label: "01 / Decode",
    title: "We decode your full picture.",
    body: "Not just what home you want — your financial position, your buying or investing power, your ideal monthly payment, your career, your lifestyle, your timing, your priorities, and where you want to be years from now.",
  },
  {
    label: "02 / Design",
    title: "We design your ownership strategy.",
    body: "Everything we learn becomes a Personalized Ownership Strategy — what we're looking for, why it makes sense, and how we'll evaluate every opportunity against it.",
  },
  {
    label: "03 / Execute",
    title: "We execute, together, at every step.",
    body: "Search. Tours. Property analysis. Offer strategy. Negotiation. Contract. Inspections. Financing coordination. Appraisal. Title. Closing. You're represented through all of it.",
  },
  {
    label: "04 / Advance",
    title: "The relationship keeps moving.",
    body: "The transaction ends. The strategy doesn't. Advance is where ownership starts paying off — and where your next move already begins to take shape.",
  },
];

// Pinned scroll sequence, desktop-only (1024px+) — brief/06 §Sección 5. A 3D
// version of this was tried in Phase 2 and reverted (see brief/08 Fase 2 —
// looked bad, and didn't reach mobile anyway since mobile can't run the pin
// safely, see the note below). Mobile/tablet just gets the static grid.
export function Method() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const railRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLLIElement[];
      const rails = railRefs.current.filter(Boolean) as HTMLSpanElement[];
      const mm = gsap.matchMedia();

      // The pin+crossfade sequence only works where all 4 cards fit
      // side-by-side within one viewport height (the `lg:grid-cols-4`
      // breakpoint, 1024px+). Below that the grid stacks into 1-2 columns
      // and is much taller than the screen — pinning the section to 100vh
      // then trapped cards 3/4 below the fold, invisible until the pin
      // released (the "stuck until 04" bug). Mobile/tablet gets a plain
      // scroll reveal instead (brief/06 — heavy scroll effects degrade to a
      // simpler technique on mobile; content/order never changes).
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(cards, { opacity: 0.35, scale: 0.94, rotateX: 0 });
          gsap.set(cards[0], { opacity: 1, scale: 1 });
          gsap.set(rails, { scaleX: 0 });
          if (rails[0]) gsap.set(rails[0], { scaleX: 1 });
          if (counterRef.current) counterRef.current.textContent = "01";

          // Defensive: kill any prior instance with this id before creating
          // a new one (guards against duplicate pins/spacers stacking up
          // from Fast Refresh re-running this effect without a full reload).
          ScrollTrigger.getById("method-pin")?.kill();

          // Background technical grid drifts at its own slow depth for the
          // duration of the pin — the one static decorative layer in this
          // section now moves too, reinforcing that the whole composition
          // occupies real depth, not just the cards up front.
          if (gridRef.current) {
            gsap.to(gridRef.current, {
              yPercent: 15,
              scale: 1.08,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: () => "+=" + window.innerHeight * 2.5,
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
          }

          // One timeline, scrub tied directly to it — GSAP interpolates card
          // state deterministically from scroll position.
          const tl = gsap.timeline({
            scrollTrigger: {
              id: "method-pin",
              trigger: sectionRef.current,
              start: "top top",
              end: () => "+=" + window.innerHeight * 2.5,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (!counterRef.current) return;
                const idx = Math.min(
                  cards.length - 1,
                  Math.floor(self.progress * cards.length)
                );
                counterRef.current.textContent = String(idx + 1).padStart(2, "0");
              },
            },
          });

          const step = 1 / cards.length;
          const crossfade = step * 0.4;
          cards.forEach((card, i) => {
            if (i === 0) return;
            const at = i * step;
            tl.to(
              cards[i - 1],
              {
                opacity: 0.35,
                scale: 0.94,
                rotateX: -6,
                duration: crossfade,
                ease: "power1.inOut",
              },
              at
            )
              .fromTo(
                card,
                { rotateX: 6 },
                { opacity: 1, scale: 1, rotateX: 0, duration: crossfade, ease: "power1.inOut" },
                at
              )
              .to(rails[i], { scaleX: 1, duration: crossfade, ease: "none" }, at);
          });
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="method"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-linen px-6 py-24 sm:px-10 sm:py-32"
    >
      {/* Faint technical grid — reinforces "method" without competing with
          content; static (no JS), respects reduced-motion since it never moves. */}
      <div
        ref={gridRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--color-cocoa-bark) 0, var(--color-cocoa-bark) 1px, transparent 1px, transparent 96px), repeating-linear-gradient(0deg, var(--color-cocoa-bark) 0, var(--color-cocoa-bark) 1px, transparent 1px, transparent 96px)",
        }}
      />

      <div className="relative mx-auto w-full max-w-5xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <Kicker>The Next Move Method™</Kicker>
            <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-black tracking-[-0.04em] text-cocoa-bark sm:text-5xl">
              <SplitLines>Direction. Strategy. Action. Ownership.</SplitLines>
            </h2>
            <p className="mt-4 max-w-xl text-base text-cocoa-bark/70 sm:text-lg">
              Every client goes through the same four-step process — not a sales
              funnel, a strategic one.
            </p>
          </div>

          {/* Live step readout, desktop-pin only (hidden below lg to match
              where the pin/scrub sequence is actually active). */}
          <div
            aria-hidden="true"
            className="hidden shrink-0 flex-col items-end lg:flex"
          >
            <span
              ref={counterRef}
              className="font-[family-name:var(--font-display)] text-5xl font-black leading-none tracking-[-0.04em] text-cognac"
            >
              01
            </span>
            <span className="mt-1 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-cocoa-bark/50">
              / 04
            </span>
          </div>
        </div>

        {/* Progress rail — one segment per step, fills as the pinned
            sequence advances. Desktop-pin only. */}
        <div
          aria-hidden="true"
          className="mt-10 hidden gap-2 lg:grid lg:grid-cols-4"
        >
          {steps.map((step, i) => (
            <span
              key={step.label}
              className="h-[3px] overflow-hidden rounded-full bg-cocoa-bark/10"
            >
              <span
                ref={(el) => {
                  railRefs.current[i] = el;
                }}
                className="block h-full origin-left scale-x-0 rounded-full bg-cognac"
              />
            </span>
          ))}
        </div>

        <ol
          className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          style={{ perspective: "1400px" }}
        >
          {steps.map((step, i) => (
            <li
              key={step.label}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              data-cursor="EXPLORE"
              className="flex flex-col rounded-2xl border border-stone/30 bg-bone p-6 transition-colors duration-300 hover:border-cognac/50"
              style={{ transformStyle: "preserve-3d" }}
            >
              <span className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-siena">
                {step.label}
              </span>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-black tracking-[-0.02em] text-cocoa-bark">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-cocoa-bark/75">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-14 text-center font-[family-name:var(--font-display)] text-xl font-medium tracking-[-0.02em] text-cocoa-bark sm:text-2xl">
          Technology organizes the information. I bring the judgment.
        </p>
      </div>
    </section>
  );
}
