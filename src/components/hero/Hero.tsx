"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { HERO_COPY } from "@/content/hero";
import { METHOD_DETAILS } from "@/content/method";
import Magnetic from "@/components/Magnetic";
import HeroCanvas, { type HeroCanvasHandle } from "@/components/hero/HeroCanvas";
import HudFrame from "@/components/hero/HudFrame";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Tailwind's `lg` breakpoint (1024px) is the desktop/mobile split for the hero
// choreography — keep in sync with the `lg:` classes used in the JSX below.
const DESKTOP_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const MOBILE_QUERY = "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)";
const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// Timing for one phase's turn at center stage: grows in from the depths,
// holds long enough to actually read, then keeps growing past legible size
// as it fades — reads as flying through toward the viewer, not just
// vanishing. GAP is dead air between one phase's exit and the next phase's
// entrance, so consecutive phases never visually overlap mid-scroll.
const ENTER = 0.07;
const HOLD = 0.05;
const EXIT = 0.06;
const GAP = 0.03;
const BLOCK = ENTER + HOLD + EXIT + GAP;

// Order of the hero: 1) THE NEXT MOVE METHOD™ alone, 2) the four phases one
// at a time, 3) the main statement (headline, copy, CTAs), which is where the
// pinned hero ends.
const HEADLINE_HOLD = 0.08;
const PHASES_START = HEADLINE_HOLD + EXIT + GAP;

/**
 * Builds the sequence onto an existing GSAP timeline — shared verbatim by
 * desktop (pinned) and mobile (scrubbed-in-place) setups below, since the
 * choreography itself doesn't depend on how the timeline is triggered, only
 * what drives its progress. Everything is centered by CSS, so this is pure
 * timing, no layout.
 *
 * The headline block is visible on first paint (a one-time mount tween gives
 * it an entrance, independent of the scrub) so the page never opens blank or
 * on anything but the main text.
 */
function buildPhaseSequence(
  tl: gsap.core.Timeline,
  wordRefs: (HTMLDivElement | null)[],
  labelRefs: (HTMLDivElement | null)[],
  headlineRef: HTMLDivElement | null,
  introRef: HTMLDivElement | null
) {
  gsap.set(wordRefs, { autoAlpha: 0, scale: 0.15 });
  gsap.set(labelRefs, { autoAlpha: 0 });

  gsap.set(headlineRef, { autoAlpha: 0, y: 24 });

  // The intro wrapper is owned by the scrubbed timeline alone (visible at
  // progress 0, hidden after). The load-in entrance plays on its inner text
  // instead: a separate element, so a reload with restored scroll can never
  // fight the scrub over the same properties and leave words stacked.
  gsap.set(introRef, { autoAlpha: 1 });
  gsap.fromTo(
    introRef?.firstElementChild ?? null,
    { autoAlpha: 0, scale: 0.92 },
    { autoAlpha: 1, scale: 1, duration: 1.2, delay: 0.2, ease: "power2.out" }
  );

  tl.to(introRef, { autoAlpha: 0, scale: 1.08, duration: EXIT, ease: "power1.in" }, HEADLINE_HOLD);

  for (let i = 0; i < METHOD_DETAILS.length; i++) {
    const start = PHASES_START + i * BLOCK;
    const holdEnd = start + ENTER + HOLD;

    tl.to(wordRefs[i], { autoAlpha: 1, scale: 1, duration: ENTER, ease: "power2.out" }, start);
    tl.to(labelRefs[i], { autoAlpha: 1, duration: ENTER * 0.6 }, start + ENTER * 0.5);
    tl.to(labelRefs[i], { autoAlpha: 0, duration: EXIT * 0.5 }, holdEnd);
    tl.to(wordRefs[i], { autoAlpha: 0, scale: 1.5, duration: EXIT, ease: "power1.in" }, holdEnd);
  }

  const finalStart = PHASES_START + (METHOD_DETAILS.length - 1) * BLOCK + ENTER + HOLD + EXIT;
  tl.to(headlineRef, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.12 }, finalStart + GAP);
}

const CTA_CLASS =
  "inline-flex min-w-[15rem] items-center justify-center border px-8 py-4 font-mono text-xs uppercase tracking-caption transition-colors";

function CTAs() {
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row">
      <Magnetic strength={0.35}>
        <a href="#contact" className={`${CTA_CLASS} border-bone/40 text-bone hover:border-bone hover:bg-bone/10`}>
          {HERO_COPY.ctaPrimary}
        </a>
      </Magnetic>
      <a href="#method" className={`${CTA_CLASS} border-bone/40 text-bone hover:border-bone hover:bg-bone/10`}>
        {HERO_COPY.ctaSecondary}
      </a>
    </div>
  );
}

/** The four phase words + a headline, both centered — shared markup between
 * the desktop and mobile stages (only the outer wrapper/pin differs). */
function PhaseStage({
  wordRefs,
  labelRefs,
  headlineRef,
  introRef,
}: {
  wordRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  labelRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  headlineRef: React.RefObject<HTMLDivElement | null>;
  introRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <>
      {/* A quiet, always-on pulse at the exact center — a heartbeat behind
          the phase reveal, same "precision instrument" language as the
          dot-pulse markers elsewhere, purely CSS so it costs nothing. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cognac/60 motion-safe:[animation:dot-pulse_2.4s_ease-in-out_infinite]"
      />

      {/* First beat: the brand name alone, centered, before anything else. */}
      <div
        ref={introRef}
        className="invisible pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
      >
        <span className="font-display text-5xl uppercase tracking-[0.02em] text-bone drop-shadow-[0_4px_20px_rgba(0,0,0,0.55)] sm:text-7xl lg:text-8xl">
          The Next Move Method<span className="align-super text-xl sm:text-3xl">™</span>
        </span>
      </div>

      {METHOD_DETAILS.map((phase, i) => (
        <div
          key={phase.id}
          ref={(el) => {
            wordRefs.current[i] = el;
          }}
          className="invisible pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 will-change-transform"
        >
          <span className="font-mono text-sm uppercase tracking-caption text-bone sm:text-base">0{i + 1}</span>
          <span className="whitespace-nowrap font-display text-6xl tracking-[0.02em] text-bone sm:text-7xl lg:text-8xl">
            {phase.title}
          </span>
          <div
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className="invisible max-w-xs text-center font-mono text-[11px] uppercase tracking-caption text-bone/55"
          >
            {phase.microlabel}
          </div>
        </div>
      ))}

      <div
        ref={headlineRef}
        className="invisible pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center will-change-transform"
      >
        <div className="pointer-events-auto flex max-w-xl flex-col items-center gap-4">
          <span className="font-mono text-sm uppercase tracking-caption text-stone sm:text-base">
            The Next Move Method™
          </span>
          <p aria-hidden="true" className="font-display text-3xl tracking-headline text-bone xl:text-4xl">
            {HERO_COPY.headline}
          </p>
          <p className="font-body font-light text-base text-bone tracking-subhead xl:text-lg">
            {HERO_COPY.subheadline}
          </p>
          <p className="max-w-md font-body text-sm font-light text-bone/70">{HERO_COPY.supporting}</p>
          <CTAs />
        </div>
      </div>
    </>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroCanvasRef = useRef<HeroCanvasHandle>(null);

  // Desktop refs.
  const stickyRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headlineWrapRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  // Mobile refs — a single un-pinned stage, scrubbed by the section's own
  // natural scroll position (see setupMobile below).
  const mobileStageRef = useRef<HTMLDivElement>(null);
  const mobileHeroCanvasRef = useRef<HeroCanvasHandle>(null);
  const mobileWordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileLabelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileHeadlineRef = useRef<HTMLDivElement>(null);
  const mobileIntroRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: DESKTOP_QUERY, isMobile: MOBILE_QUERY, reduceMotion: REDUCE_MOTION_QUERY },
        (context) => {
          const conditions = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };

          if (conditions.reduceMotion) {
            gsap.set([headlineWrapRef.current, mobileHeadlineRef.current], { clearProps: "all" });
            return;
          }

          if (conditions.isDesktop) {
            return setupDesktop();
          }

          if (conditions.isMobile) {
            return setupMobile();
          }
        }
      );

      function setupDesktop() {
        const stickyEl = stickyRef.current;
        if (!stickyEl) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=220%",
            scrub: 1,
            pin: stickyEl,
            anticipatePin: 1,
            // Feeds the WebGL backdrop's camera dolly — reads this same
            // trigger's own progress rather than creating a second
            // ScrollTrigger on this section.
            onUpdate: (self) => heroCanvasRef.current?.setProgress(self.progress),
          },
        });

        buildPhaseSequence(tl, wordRefs.current, labelRefs.current, headlineWrapRef.current, introRef.current);
      }

      /**
       * Mobile: NO pin. A single scrubbed timeline tied to the stage's own
       * scroll position (trigger = the stage itself, "top top" -> "bottom
       * top"), so the section scrolls natively — nothing stays glued to the
       * viewport. This sidesteps the classic mobile ScrollTrigger pin bug
       * (address bar show/hide changes the visual viewport height mid-scroll,
       * which desyncs a pinned spacer's height). Same phase-by-phase timing
       * as desktop (buildPhaseSequence) — only the trigger differs.
       */
      function setupMobile() {
        const stageEl = mobileStageRef.current;
        if (!stageEl) return;

        // scrub 1.4 (vs. desktop's 1) — mobile scroll is native fling/momentum,
        // not Lenis-smoothed, so a bit more lag between scroll position and
        // tween position reads as smoother rather than snapping to match
        // every raw scroll-frame jump.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stageEl,
            start: "top top",
            end: "bottom top",
            scrub: 1.4,
            onUpdate: (self) => mobileHeroCanvasRef.current?.setProgress(self.progress),
          },
        });

        buildPhaseSequence(
          tl,
          mobileWordRefs.current,
          mobileLabelRefs.current,
          mobileHeadlineRef.current,
          mobileIntroRef.current
        );
      }

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="hero" aria-label={`Yez The Realtor: ${HERO_COPY.headline}`}>
      <h1 className="sr-only">
        The Next Move Method™. {HERO_COPY.headline}
      </h1>
      {/* Desktop: pinned scroll-driven phase reveal (lg and up, motion-safe). */}
      <div className="hidden lg:motion-safe:block">
        <div ref={stickyRef} className="relative h-screen w-full overflow-hidden bg-espresso">
          {/* WebGL backdrop — a child of the pinned element itself (not a
              section-level sibling) so it pins/scrolls with it automatically;
              a sibling of the pin would be positioned relative to this
              non-pinned, ever-growing section (the pin-spacer inflates it to
              the whole scroll duration) and would scroll away mid-pin while
              the foreground stayed fixed. */}
          <HeroCanvas ref={heroCanvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
          {/* Cinematic vignette — darkens the frame edges so the particle
              field reads as a lit scene with depth, not a flat sprite sheet;
              same "warm light, dark room" mood as RadialAperture elsewhere. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(26,18,11,0.78) 100%)",
            }}
          />
          <HudFrame />

          <PhaseStage wordRefs={wordRefs} labelRefs={labelRefs} headlineRef={headlineWrapRef} introRef={introRef} />

          {/* A quiet technical flourish, not a data point anyone needs —
              the same "precision instrument" register as the mono/caption
              labels elsewhere, here reading like a survey marker. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-10 left-20 font-mono text-[10px] uppercase tracking-caption text-bone/35 sm:bottom-14 sm:left-28"
          >
            Austin, TX
            <br />
            30.2672°N · 97.7431°W
          </div>
        </div>
      </div>

      {/* Mobile / tablet: un-pinned scrub over the stage's natural scroll position. */}
      <div className="hidden bg-espresso motion-safe:block motion-safe:lg:hidden">
        {/* h-dvh, not h-screen (100vh) — 100vh on mobile Safari/Chrome is the
            viewport height with the address bar collapsed, so it doesn't
            match the ACTUAL visible height most of the time the page is at
            rest (bar expanded); the stage read as taller than the real
            viewport. 100dvh tracks the real visible height live. */}
        <div ref={mobileStageRef} className="relative h-dvh w-full overflow-hidden">
          <HeroCanvas
            ref={mobileHeroCanvasRef}
            mobile
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(26,18,11,0.78) 100%)",
            }}
          />
          <HudFrame />

          <PhaseStage
            wordRefs={mobileWordRefs}
            labelRefs={mobileLabelRefs}
            headlineRef={mobileHeadlineRef}
            introRef={mobileIntroRef}
          />
        </div>
      </div>

      {/* Reduced motion: static, single fade-in, no scroll choreography. */}
      <div className="hidden motion-reduce:block bg-espresso px-6 py-24">
        <div className="mx-auto mb-14 flex max-w-xl flex-col items-center gap-1 text-center">
          <span className="font-display text-2xl uppercase tracking-[0.02em] text-bone sm:text-3xl">
            The Next Move Method<span className="align-super text-xs sm:text-sm">™</span>
          </span>
        </div>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-12 pb-20 sm:grid-cols-2">
          {METHOD_DETAILS.map((phase, i) => (
            <div key={phase.id} className="flex flex-col items-center gap-3 text-center">
              <span className="font-mono text-xs uppercase tracking-caption text-bone">0{i + 1}</span>
              <span className="font-display text-3xl tracking-[0.02em] text-bone">{phase.title}</span>
              <span className="max-w-xs font-mono text-[10px] uppercase tracking-caption text-stone">
                {phase.microlabel}
              </span>
            </div>
          ))}
        </div>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <span className="font-mono text-sm uppercase tracking-caption text-stone sm:text-base">
            The Next Move Method™
          </span>
          <p aria-hidden="true" className="font-display text-4xl tracking-headline text-bone">{HERO_COPY.headline}</p>
          <p className="font-body font-light text-lg text-bone tracking-subhead">{HERO_COPY.subheadline}</p>
          <p className="max-w-md font-body text-sm font-light text-bone/70">{HERO_COPY.supporting}</p>
          <CTAs />
        </div>
      </div>
    </section>
  );
}
