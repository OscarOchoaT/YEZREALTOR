"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { EASE, DURATION, STAGGER } from "@/lib/motion";
import { CTAButton } from "@/components/ui/CTAButton";
import { AuroraField } from "@/components/ui/AuroraField";

// Phase 2's 3D field was tried here and reverted (brief/08 Fase 2 — looked
// bad on desktop). Briefly re-enabled 2026-08-19 at the user's request, then
// rejected on sight ("esas figuritas no me gustan") and reverted again the
// same day. AuroraField is the CSS-only version of the same idea (motion via
// transforms/gradients) — treat 3D here as a proven miss twice now, not a
// default to reach for.
//
// The entrance is a single choreographed timeline (kicker → headline lines
// → subtitle → CTAs), not independent Reveal blocks — this is the one
// section where the composition needs to visibly build itself in a specific
// order, per the 2026-08-19 "cinematic entrance" request. It does NOT reuse
// the generic <SplitLines> component: that component owns its own
// scroll-triggered reveal, which would fight this timeline for control of
// the same split lines.
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Split by lines AND words: the line wrapper still owns the mask
        // (so lines slide up from behind a hard edge, same language as
        // every other SplitLines reveal on the site), but each word inside
        // animates on its own duration (a function-based value keyed to
        // word index) — some arrive faster, some slower — so the headline
        // reads as "constructing itself" rather than one uniform slide.
        const split = SplitText.create(headlineRef.current, {
          type: "lines, words",
          mask: "lines",
          linesClass: "split-line",
        });

        // Timed to start at 1.25s — the exact moment IntroCurtain (see that
        // component) begins sliding away. Both delays are hardcoded rather
        // than event-coordinated; if IntroCurtain's timing ever changes,
        // update this to match so the composition still builds as the
        // curtain clears instead of finishing invisibly behind it.
        const tl = gsap.timeline({ delay: 1.25 });
        tl.from(".hero-kicker", {
          opacity: 0,
          y: 12,
          duration: DURATION.base,
          ease: EASE.out,
        })
          .from(
            split.words,
            {
              yPercent: 130,
              opacity: 0,
              filter: "blur(8px)",
              duration: (i: number) => DURATION.slow + (i % 3) * 0.14,
              stagger: { each: STAGGER.tight, from: "start" },
              ease: EASE.cinematic,
            },
            "-=0.3"
          )
          .from(
            ".hero-subtitle",
            { opacity: 0, y: 16, duration: DURATION.base, ease: EASE.out },
            "-=0.45"
          )
          .from(
            ".hero-ctas > *",
            {
              opacity: 0,
              y: 14,
              scale: 0.96,
              duration: DURATION.base,
              stagger: 0.08,
              ease: EASE.out,
            },
            "-=0.25"
          )
          .to(
            ".hero-ghost-mark",
            { opacity: 1, duration: DURATION.slower, ease: EASE.out },
            "-=0.6"
          );

        // Scroll cue fades out over the first stretch of scroll, independent
        // of the entrance timing above. Runs on every viewport (not just
        // desktop) — the pinned zoom sequence below is additive on top.
        gsap.to(".hero-scroll-cue", {
          opacity: 0,
          y: 12,
          ease: EASE.scrub,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=220",
            scrub: true,
          },
        });

        return () => split.revert();
      });

      // "Passing through" the Hero — the 2026-08-19 request was explicit
      // that the Hero should transform as you scroll, not just fade
      // upward. Desktop-only (matches every other pin in this project —
      // brief/06 established that pinning full sections on mobile is what
      // caused the Fase 1 mobile bugs). Mobile gets the entrance above and
      // then just... scrolls away normally, which is the correct
      // simplification per the client's mobile-priority feedback, not a
      // missing feature.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.getById("hero-pin")?.kill();

        const pinEnd = () => "+=" + window.innerHeight * 1.2;
        // Every layer below scrubs over this identical range — sharing one
        // config object is the standard GSAP pattern for multi-layer
        // parallax tied to a single pin (each gsap.to() call creates its
        // own ScrollTrigger from it; they don't fight each other).
        const scrollCfg = {
          trigger: sectionRef.current,
          start: "top top",
          end: pinEnd,
          scrub: true,
          invalidateOnRefresh: true,
        };

        // Owns the pin. Created via ScrollTrigger.create (not attached to
        // a tween) so it does nothing but hold the section in place —
        // every visible transform below is a separate, independently
        // tuned layer.
        ScrollTrigger.create({ id: "hero-pin", ...scrollCfg, pin: true, pinSpacing: true });

        // Headline: the "camera" layer — scales up and dissolves, as if
        // the viewer is passing through the text.
        gsap.to(headlineRef.current, {
          scale: 2.3,
          opacity: 0,
          filter: "blur(10px)",
          ease: "none",
          scrollTrigger: scrollCfg,
        });
        // Kicker: shallowest depth — clears first, fastest.
        gsap.to(".hero-kicker", {
          opacity: 0,
          yPercent: -70,
          ease: "none",
          scrollTrigger: scrollCfg,
        });
        // Subtitle and CTAs: recede at a slower, different rate than the
        // headline — real depth-layered parallax, not one shared speed.
        gsap.to(".hero-subtitle", {
          opacity: 0,
          yPercent: 45,
          ease: "none",
          scrollTrigger: scrollCfg,
        });
        gsap.to(".hero-ctas", {
          opacity: 0,
          yPercent: 65,
          scale: 0.85,
          ease: "none",
          scrollTrigger: scrollCfg,
        });
        // Background: slowest layer, drifts and swells rather than
        // clearing — it's the "atmosphere" the camera is moving through.
        gsap.to(".hero-aurora", {
          yPercent: 40,
          scale: 1.35,
          ease: "none",
          scrollTrigger: scrollCfg,
        });
        // Ghost wordmark: the deepest layer of all — barely moves, barely
        // grows, so it reads as something the camera is passing *through*
        // rather than past. Echoes IntroCurtain's "Yez." mark, so the brand
        // moment that opened the page keeps a quiet presence as the Hero
        // dissolves into the rest of the scroll.
        gsap.to(".hero-ghost-mark", {
          scale: 1.15,
          opacity: 0,
          ease: "none",
          scrollTrigger: scrollCfg,
        });

        // Cursor-reactive depth: each layer drifts toward the pointer at a
        // different strength — background slowest/furthest, headline
        // subtlest, kicker/CTAs a touch more — so the whole composition
        // reads as layered in physical space rather than flat, before the
        // user even starts scrolling. Pure additive transform (x/y) laid on
        // top of the scroll-scrubbed transforms above; GSAP composes both
        // into one matrix per element, so neither fights the other.
        const layers: Array<[string, number]> = [
          [".hero-ghost-mark", 14],
          [".hero-aurora", 22],
          [".hero-kicker", 8],
          [".hero-content h1", 5],
          [".hero-subtitle", 6],
          [".hero-ctas", 9],
        ];
        const movers = layers.map(([sel, strength]) => {
          const el = sectionRef.current?.querySelector<HTMLElement>(sel);
          if (!el) return null;
          return {
            x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
            y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
            strength,
          };
        });

        function onPointerMove(e: PointerEvent) {
          const rect = sectionRef.current!.getBoundingClientRect();
          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;
          movers.forEach((m) => {
            if (!m) return;
            m.x(relX * m.strength);
            m.y(relY * m.strength);
          });
        }

        sectionRef.current?.addEventListener("pointermove", onPointerMove);

        return () => {
          ScrollTrigger.getById("hero-pin")?.kill();
          sectionRef.current?.removeEventListener("pointermove", onPointerMove);
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".hero-kicker", ".hero-subtitle", ".hero-ctas > *"], {
          opacity: 1,
          y: 0,
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-bone px-6 pt-28 pb-16 sm:px-10"
    >
      <AuroraField variant="light" className="hero-aurora" />

      {/* Deepest background layer — a giant faint wordmark echoing
          IntroCurtain's "Yez." moment, so the brand mark that opened the
          page keeps a physical presence behind the headline instead of
          simply vanishing. Starts invisible; the entrance timeline below
          fades it in once the headline has mostly built itself. */}
      <span
        aria-hidden="true"
        className="hero-ghost-mark pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden font-[family-name:var(--font-display)] text-[28vw] font-black leading-none tracking-[-0.05em] text-cocoa-bark/[0.04] opacity-0 sm:text-[22vw]"
      >
        Yez.
      </span>

      <div className="hero-content relative mx-auto flex w-full max-w-4xl flex-col items-start gap-8">
        <div>
          <span className="hero-kicker inline-block font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-cognac">
            Strategic Homeownership
          </span>

          <h1
            ref={headlineRef}
            className="mt-4 font-[family-name:var(--font-display)] text-4xl font-black leading-[1.05] tracking-[-0.04em] text-cocoa-bark sm:text-6xl md:text-7xl"
          >
            Homeownership, designed for what comes next.
          </h1>
        </div>

        <p className="hero-subtitle max-w-xl font-[family-name:var(--font-body)] text-lg font-light leading-relaxed text-cocoa-bark/80 sm:text-xl">
          I design personalized real estate strategies for professionals ready
          to make their next move in Texas.
        </p>

        <div className="hero-ctas flex flex-wrap items-center gap-4 pt-2">
          <CTAButton href="#profile-selector">Design My Next Move</CTAButton>
          <CTAButton href="#method" variant="secondary">
            Explore the Method
          </CTAButton>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="hero-scroll-cue pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-cocoa-bark/50"
      >
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em]">
          Scroll
        </span>
        <span className="hero-scroll-chevron block h-8 w-px bg-cocoa-bark/30" />
      </div>
    </section>
  );
}
