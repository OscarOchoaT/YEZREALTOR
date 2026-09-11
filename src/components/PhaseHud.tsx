"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type HudMetric = { label: string; value: number };

export type PhaseHudHandle = {
  /** Plays the ring/counter fill once (idempotent — a second call is a
   * no-op). Only meaningful when `autoPlay={false}` — see below. */
  play: () => void;
};

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * A floating "glass" instrument panel — a direct, restrained translation of
 * the client's mood reference: a holographic dashboard of animated
 * percentage rings, laid over a scene. Here it's real data about the
 * client's move (readiness, alignment, leverage — reframed per phase in
 * content/method.ts), on the same glass regardless of which phase color
 * sits behind it, so it always reads as one instrument.
 *
 * By default (`autoPlay`, the phase route pages) it fills itself in via its
 * own ScrollTrigger the first time it scrolls into view. Pass
 * `autoPlay={false}` and a ref (MethodShowcase, the homepage's pinned phase
 * sequence) to instead trigger the fill imperatively via `.play()` from an
 * outer timeline — necessary there because the HUD sits inside a *pinned*
 * panel that never actually moves through "top 78% of viewport", so its own
 * ScrollTrigger would never fire.
 */
const PhaseHud = forwardRef<PhaseHudHandle, { heading: string; metrics: HudMetric[]; className?: string; autoPlay?: boolean }>(
  function PhaseHud({ heading, metrics, className = "", autoPlay = true }, ref) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const ringRefs = useRef<(SVGCircleElement | null)[]>([]);
    const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const scanRef = useRef<HTMLDivElement>(null);
    const playedRef = useRef(false);

    const play = () => {
      if (playedRef.current) return;
      playedRef.current = true;
      const rings = ringRefs.current.filter((el): el is SVGCircleElement => Boolean(el));
      const numbers = numberRefs.current.filter((el): el is HTMLSpanElement => Boolean(el));

      gsap.fromTo(scanRef.current, { yPercent: -120 }, { yPercent: 220, duration: 1.1, ease: "power2.inOut" });
      rings.forEach((ring, i) => {
        gsap.to(ring, {
          strokeDashoffset: CIRCUMFERENCE * (1 - metrics[i].value / 100),
          duration: 1.3,
          delay: i * 0.12,
          ease: "power3.out",
        });
      });
      numbers.forEach((n, i) => {
        const counter = { v: 0 };
        gsap.to(counter, {
          v: metrics[i].value,
          duration: 1.3,
          delay: i * 0.12,
          ease: "power3.out",
          onUpdate: () => {
            n.textContent = String(Math.round(counter.v));
          },
        });
      });
    };

    useImperativeHandle(ref, () => ({ play }));

    useGSAP(
      () => {
        const rings = ringRefs.current.filter((el): el is SVGCircleElement => Boolean(el));
        const numbers = numberRefs.current.filter((el): el is HTMLSpanElement => Boolean(el));
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        gsap.set(rings, { strokeDasharray: CIRCUMFERENCE, strokeDashoffset: CIRCUMFERENCE });

        if (prefersReducedMotion) {
          rings.forEach((ring, i) => {
            gsap.set(ring, { strokeDashoffset: CIRCUMFERENCE * (1 - metrics[i].value / 100) });
          });
          numbers.forEach((n, i) => {
            n.textContent = String(metrics[i].value);
          });
          gsap.set(scanRef.current, { autoAlpha: 0 });
          playedRef.current = true; // static final state already set — .play()/onEnter must not re-animate over it
          return;
        }

        if (!autoPlay) return; // caller drives .play() itself (see PhaseHudHandle doc above)

        // A visitor landing directly on a phase route (a shared link, search
        // result) sees this HUD already sitting inside the fold — no scroll
        // ever happens to fire "top 78%", so it would otherwise stay frozen
        // at 0% forever. Play immediately if it's already past that
        // threshold at mount; only fall back to the ScrollTrigger for the
        // (normal) case where it's still below the fold.
        const el = wrapRef.current;
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.78) {
          play();
          return;
        }

        ScrollTrigger.create({
          trigger: wrapRef.current,
          start: "top 78%",
          once: true,
          onEnter: play,
        });
      },
      { scope: wrapRef, dependencies: [metrics] }
    );

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden rounded-3xl border border-bone/20 bg-espresso/95 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.7)] backdrop-blur-sm ${className}`}
    >
      <div
        ref={scanRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-transparent via-bone/10 to-transparent"
      />

      <div className="relative flex items-center gap-2 border-b border-bone/15 px-5 py-3 sm:px-7 sm:py-3.5">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-cognac motion-safe:[animation:dot-pulse_2s_ease-in-out_infinite]"
        />
        <span className="font-mono text-[11px] uppercase tracking-caption text-bone/75">{heading}</span>
      </div>

      <div className="relative grid grid-cols-2 gap-x-4 gap-y-4 p-5 sm:gap-x-6 sm:p-6">
        {metrics.map((m, i) => (
          <div key={m.label} className="flex items-center gap-3">
            <svg viewBox="0 0 64 64" className="h-11 w-11 shrink-0 -rotate-90 sm:h-12 sm:w-12" aria-hidden="true">
              <circle cx="32" cy="32" r={RADIUS} fill="none" strokeWidth="4" className="stroke-bone/15" />
              <circle
                ref={(el) => {
                  ringRefs.current[i] = el;
                }}
                cx="32"
                cy="32"
                r={RADIUS}
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                className="stroke-bone"
                style={{ filter: "drop-shadow(0 0 6px rgba(244,240,232,0.55))" }}
              />
            </svg>
            <div className="flex flex-col">
              <span className="font-mono text-xl text-bone sm:text-2xl">
                <span
                  ref={(el) => {
                    numberRefs.current[i] = el;
                  }}
                >
                  0
                </span>
                %
              </span>
              <span className="font-mono text-[10px] uppercase leading-snug tracking-caption text-bone/65">
                {m.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  }
);

export default PhaseHud;
