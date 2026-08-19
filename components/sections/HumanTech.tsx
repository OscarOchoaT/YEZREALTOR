"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { AuroraField } from "@/components/ui/AuroraField";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitLines } from "@/components/scroll/SplitLines";

const technology = [
  "Organizes information",
  "Compares scenarios",
  "Reduces noise",
  "Visualizes decisions",
  "Automates follow-up",
  "Improves communication",
];

const yez = [
  "Listens",
  "Interprets",
  "Recommends",
  "Negotiates",
  "Protects",
  "Represents",
  "Understands context",
];

// Phase 2 (brief/06 §Sección 6) explored a 3D node visualization here; that
// stayed 2D-only by design (brief/08 Fase 2 note) — this pass reinforces the
// "human + tech" idea with layered motion instead: a pulsing bridge line and
// staggered list items, no WebGL involved.
export function HumanTech() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>(".human-tech-item", gridRef.current!);
        gsap.from(items, {
          opacity: 0,
          x: (i, target) => (target.closest(".human-tech-col-left") ? -16 : 16),
          duration: 0.6,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".human-tech-item", { opacity: 1, x: 0 });
      });

      return () => mm.revert();
    },
    { scope: gridRef }
  );

  return (
    <section
      id="human-tech"
      className="relative overflow-hidden bg-cocoa-bark px-6 py-24 text-bone sm:px-10 sm:py-32"
    >
      <AuroraField variant="dark" />

      <Reveal className="relative mx-auto max-w-4xl text-center">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
          <SplitLines>
            High-tech where it simplifies.
            <br />
            Deeply human where it matters.
          </SplitLines>
        </h2>
      </Reveal>

      <div
        ref={gridRef}
        className="relative mx-auto mt-16 grid max-w-3xl gap-10 sm:grid-cols-2"
      >
        {/* Bridge line between the two columns — the "human + tech" hinge,
            desktop only where the columns actually sit side by side. */}
        <span
          aria-hidden="true"
          className="pulse-line absolute inset-y-6 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cognac/60 to-transparent sm:block"
        />

        <div className="human-tech-col-left rounded-2xl border border-bone/15 p-8">
          <span className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-stone">
            Technology
          </span>
          <ul className="mt-5 space-y-3 text-base text-bone/80">
            {technology.map((item) => (
              <li key={item} className="human-tech-item">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="human-tech-col-right rounded-2xl border border-bone/15 p-8">
          <span className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-bone">
            Yez
          </span>
          <ul className="mt-5 space-y-3 text-base text-bone/80">
            {yez.map((item) => (
              <li key={item} className="human-tech-item">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Reveal delay={0.2}>
        <p className="relative mx-auto mt-14 max-w-xl text-center font-[family-name:var(--font-display)] text-xl font-medium tracking-[-0.02em] sm:text-2xl">
          Technology for clarity. Human judgment for the decisions that matter.
        </p>
      </Reveal>
    </section>
  );
}
