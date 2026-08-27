"use client";

import { motion } from "framer-motion";
import Footer from "@/components/sections/Footer";
import TransitionLink from "@/components/TransitionLink";
import { METHOD_DETAILS, type MethodDetail } from "@/content/method";

// Each phase gets one of the Brand Guide's approved solid-color combos —
// Cocoa Bark, Siena, Espresso, Cognac, all paired with Bone text.
const PHASE_TONE: Record<MethodDetail["id"], string> = {
  decode: "bg-cocoaBark",
  design: "bg-siena",
  execute: "bg-espresso",
  advance: "bg-cognac",
};

export default function MethodPhasePage({ phaseId }: { phaseId: MethodDetail["id"] }) {
  const index = METHOD_DETAILS.findIndex((d) => d.id === phaseId);
  const phase = METHOD_DETAILS[index];
  const next = METHOD_DETAILS[(index + 1) % METHOD_DETAILS.length];

  return (
    <main className="flex flex-1 flex-col" id="hero">
      <section className={`${PHASE_TONE[phase.id]} px-6 pb-20 pt-40 text-bone sm:pt-48`}>
        <div className="mx-auto max-w-3xl">
          <nav className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-caption">
            {METHOD_DETAILS.map((d, i) => (
              <span key={d.id} className="flex items-center gap-2">
                <TransitionLink
                  href={`/metodo/${d.id}`}
                  className={d.id === phase.id ? "text-bone" : "text-bone/50 transition-colors hover:text-bone/80"}
                >
                  {d.title}
                </TransitionLink>
                {i < METHOD_DETAILS.length - 1 && <span className="text-bone/30">·</span>}
              </span>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="font-mono text-xs uppercase tracking-caption text-bone/60">
              The Next Move Method™ · Phase 0{index + 1}
            </span>
            <h1 className="mt-3 font-display text-5xl tracking-headline sm:text-7xl">{phase.title}</h1>
            <p className="mt-4 max-w-lg font-body text-lg font-light text-bone/85">{phase.microlabel}</p>
          </motion.div>
        </div>
      </section>

      <section className="bg-bone px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <ul className="flex flex-col gap-4">
            {phase.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 border-b border-cocoaBark/10 pb-4 font-body text-lg font-light text-cocoaBark/85"
              >
                <span className="text-cognac">—</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-16 flex flex-col items-start justify-between gap-8 border-t border-cocoaBark/10 pt-10 sm:flex-row sm:items-center">
            <TransitionLink href={`/metodo/${next.id}`} className="group flex flex-col gap-1">
              <span className="font-mono text-[11px] uppercase tracking-caption text-stone">Next phase</span>
              <span className="font-display text-2xl tracking-headline text-cocoaBark transition-colors group-hover:text-cognac">
                {next.title} →
              </span>
            </TransitionLink>

            <TransitionLink
              href="/#services"
              className="inline-flex items-center justify-center rounded-full bg-cocoaBark px-7 py-3.5 font-body text-sm font-medium text-bone transition-colors hover:bg-espresso"
            >
              Design My Next Move
            </TransitionLink>
          </div>
        </div>
      </section>

      <Footer isHome={false} />
    </main>
  );
}
