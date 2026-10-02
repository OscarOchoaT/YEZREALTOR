"use client";

import HumanTech from "@/components/sections/HumanTech";
import MethodShowcase from "@/components/sections/MethodShowcase";
import InteractiveDotGrid from "@/components/InteractiveDotGrid";
import RadialAperture from "@/components/RadialAperture";

/**
 * The Next Move Method's full presence: MethodShowcase carries the drama
 * (a full-screen, pinned phase-by-phase takeover — see that file), and this
 * component follows it with the human-vs-tech piece closing the case for the
 * method itself.
 */
export default function Method() {
  return (
    <>
      <MethodShowcase />

      <section className="relative overflow-hidden bg-espresso px-6 pb-20 pt-4 sm:pb-28">
        <InteractiveDotGrid />
        <RadialAperture
          variant="dark"
          tone="cognac"
          className="left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2"
        />
        {/* Solid-to-transparent bridge across the handoff from MethodShowcase
            above — guarantees the seam reads as one continuous espresso
            surface no matter how the pinned section's own fade lands. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-espresso to-transparent sm:h-32"
        />
        <div className="relative z-[2]">
          <HumanTech />
        </div>
      </section>
    </>
  );
}
