"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { METHOD_DETAILS, PHASE_TONE } from "@/content/method";
import PhaseHud, { type PhaseHudHandle } from "@/components/PhaseHud";
import RadialAperture from "@/components/RadialAperture";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Same desktop/mobile split as Hero.tsx's own pinned choreography — a pin
// this long only behaves on a large viewport with real hover; mobile gets
// a plain stacked fallback below instead of fighting the classic mobile
// pin bug (see Hero.tsx's own notes on that).
const DESKTOP_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

const HOLD = 0.16;
const TRANS = 0.09;

/**
 * The homepage's dramatic centerpiece: The Next Move Method™, given the
 * same full-screen weight as the Hero itself instead of a modest card grid.
 * Pins the viewport and lets each of the four phases take over the entire
 * screen in turn — own color, own HUD reading, own light — before releasing
 * into MethodNodes' quick-reference grid below for anyone who wants to jump
 * straight to a specific phase's full page.
 */
export default function MethodShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hudRefs = useRef<(PhaseHudHandle | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ isDesktop: DESKTOP_QUERY }, (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };
        if (!isDesktop) return;

        const stickyEl = stickyRef.current;
        const panels = panelRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
        if (!stickyEl || panels.length === 0) return;

        gsap.set(panels, { autoAlpha: 0, scale: 1.04 });
        gsap.set(panels[0], { autoAlpha: 1, scale: 1 });
        gsap.set(dotRefs.current, { opacity: 0.35, scale: 1 });
        gsap.set(dotRefs.current[0], { opacity: 1, scale: 1.4 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=280%",
            scrub: 1,
            pin: stickyEl,
            anticipatePin: 1,
          },
        });

        // First phase is already on screen at progress 0 — just fire its HUD.
        tl.call(() => hudRefs.current[0]?.play(), [], 0.03);

        let cursor = HOLD;
        for (let i = 1; i < panels.length; i++) {
          const start = cursor;
          tl.to(panels[i - 1], { autoAlpha: 0, scale: 0.96, duration: TRANS, ease: "power2.inOut" }, start);
          tl.to(panels[i], { autoAlpha: 1, scale: 1, duration: TRANS, ease: "power2.out" }, start);
          tl.to(dotRefs.current[i - 1], { opacity: 0.35, scale: 1, duration: TRANS }, start);
          tl.to(dotRefs.current[i], { opacity: 1, scale: 1.4, duration: TRANS }, start);
          tl.call(() => hudRefs.current[i]?.play(), [], start + TRANS * 0.4);
          cursor = start + TRANS + HOLD;
        }

        const onResize = () => ScrollTrigger.refresh();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section id="method" ref={sectionRef} className="relative bg-espresso">
      {/* Desktop: pinned, full-screen phase-by-phase takeover. */}
      <div className="hidden lg:motion-safe:block">
        <div ref={stickyRef} className="relative h-screen w-full overflow-hidden">
          {METHOD_DETAILS.map((phase, i) => (
            <div
              key={phase.id}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              className={`invisible absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-6 will-change-transform ${PHASE_TONE[phase.id]}`}
            >
              <RadialAperture className="left-1/2 top-1/2 h-[120vh] w-[120vh] -translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
                <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-caption text-bone/60">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-cognac motion-safe:[animation:dot-pulse_2s_ease-in-out_infinite]"
                  />
                  The Next Move Method™ · Phase 0{i + 1}
                </span>
                <h2 className="font-display text-7xl leading-[0.9] tracking-headline text-bone sm:text-8xl lg:text-[9rem]">
                  {phase.title}
                </h2>
                <p className="max-w-lg font-accent text-2xl italic text-glow sm:text-3xl">{phase.accentLine}</p>
                <p className="max-w-md font-body text-lg font-light text-bone/80">{phase.microlabel}</p>
                <div className="mt-4 w-full max-w-md">
                  <PhaseHud
                    ref={(el) => {
                      hudRefs.current[i] = el;
                    }}
                    heading={`${phase.title} · Live Read`}
                    metrics={phase.hud}
                    autoPlay={false}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Progress rail — same "precision instrument" numbering language
              as Eyebrow/ScrollCompass elsewhere, here reading the pinned
              sequence's own position instead of the page's. */}
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
            {METHOD_DETAILS.map((phase, i) => (
              <span
                key={phase.id}
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-bone"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile, and desktop under reduced motion: a plain stacked fallback —
          each phase is a full-width block in normal document flow; PhaseHud
          still animates itself in via its own default scroll trigger. */}
      <div className="block lg:motion-safe:hidden">
        <div className="mx-auto flex max-w-xl flex-col gap-16 px-6 py-20 sm:py-28">
          {METHOD_DETAILS.map((phase, i) => (
            <div
              key={phase.id}
              className={`relative flex flex-col items-center gap-5 overflow-hidden rounded-3xl border border-bone/10 px-6 py-14 text-center ${PHASE_TONE[phase.id]}`}
            >
              <RadialAperture className="left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2" />
              <span className="relative z-10 flex items-center gap-2 font-mono text-xs uppercase tracking-caption text-bone/60">
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-cognac" />
                The Next Move Method™ · Phase 0{i + 1}
              </span>
              <h2 className="relative z-10 font-display text-5xl leading-[0.9] tracking-headline text-bone sm:text-6xl">
                {phase.title}
              </h2>
              <p className="relative z-10 max-w-sm font-accent text-xl italic text-glow">{phase.accentLine}</p>
              <p className="relative z-10 max-w-sm font-body text-base font-light text-bone/80">{phase.microlabel}</p>
              <div className="relative z-10 mt-2 w-full">
                <PhaseHud heading={`${phase.title} · Live Read`} metrics={phase.hud} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
