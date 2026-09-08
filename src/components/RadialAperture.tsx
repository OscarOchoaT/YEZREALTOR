"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * The site's signature cinematic motif: a warm light bloom inside concentric
 * rings, echoing two things at once — the brand monogram's circle, and the
 * glowing round window from the client's own "Next Move Method" mood
 * reference (a warm room, a circular aperture, daylight pouring through it).
 * Two small dots orbit the rings like a live instrument reading — same
 * restrained "precision instrument" language used elsewhere on the site,
 * never a generic particle effect.
 *
 * The light itself drifts a few pixels toward the cursor (desktop fine-
 * pointer only, off under reduced motion) — the same "the room reacts to
 * you" idea as CursorGlow, but as a literal light source instead of an
 * ambient wash, reinforcing the mood reference it's translating.
 *
 * Purely decorative and absolutely positioned — the caller sizes and centers
 * it via `className` (e.g. "left-1/2 top-1/2 h-[700px] w-[700px]
 * -translate-x-1/2 -translate-y-1/2") against a `relative` ancestor.
 */

const GLOW = {
  bone: "rgba(244,240,232,0.85)",
  cognac: "rgba(122,82,57,0.8)",
  cognacSoft: "rgba(122,82,57,0.16)",
} as const;

const RING_CLASS = {
  dark: "border-bone/20",
  light: "border-cocoaBark/12",
} as const;

const DOT_CLASS = {
  dark: "bg-bone/70",
  light: "bg-cognac/70",
} as const;

export default function RadialAperture({
  className = "",
  tone = "bone",
  variant = "dark",
}: {
  className?: string;
  tone?: keyof typeof GLOW;
  variant?: keyof typeof RING_CLASS;
}) {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const light = lightRef.current;
    if (!light) return;

    const quickX = gsap.quickTo(light, "x", { duration: 1.1, ease: "power2.out" });
    const quickY = gsap.quickTo(light, "y", { duration: 1.1, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      quickX((e.clientX / window.innerWidth - 0.5) * 24);
      quickY((e.clientY / window.innerHeight - 0.5) * 24);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      {/* The light itself — the thing the rings and markers orbit. Parallax
          (gsap, translate) lives on this outer wrapper and the CSS breathe
          animation (scale/opacity) on the inner div — same "separate
          transform per layer" trick as the orbit dots below, since one
          element can't cleanly combine a CSS keyframe transform with a
          GSAP-driven one. */}
      <div ref={lightRef} className="absolute inset-[18%] will-change-transform">
        <div
          className="absolute inset-0 rounded-full blur-3xl motion-safe:[animation:aperture-breathe_7s_ease-in-out_infinite]"
          style={{ background: `radial-gradient(circle, ${GLOW[tone]} 0%, transparent 72%)` }}
        />
      </div>

      {/* Concentric structure rings. */}
      {[1, 0.74, 0.5].map((scale) => (
        <div
          key={scale}
          className={`absolute inset-0 rounded-full border ${RING_CLASS[variant]}`}
          style={{ transform: `scale(${scale})` }}
        />
      ))}

      {/* Two slow satellites, opposite directions/speeds, on separate
          non-animated (scale) / animated (rotate) wrapper pairs so neither
          transform clobbers the other. */}
      <div className="absolute inset-0" style={{ transform: "scale(1)" }}>
        <div className="absolute inset-0 origin-center motion-safe:[animation:aperture-orbit_22s_linear_infinite]">
          <span className={`absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${DOT_CLASS[variant]}`} />
        </div>
      </div>
      <div className="absolute inset-0" style={{ transform: "scale(0.74)" }}>
        <div className="absolute inset-0 origin-center motion-safe:[animation:aperture-orbit-reverse_34s_linear_infinite]">
          <span className={`absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 rounded-full opacity-70 ${DOT_CLASS[variant]}`} />
        </div>
      </div>
    </div>
  );
}
