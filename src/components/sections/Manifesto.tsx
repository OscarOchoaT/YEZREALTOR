"use client";

import { motion } from "framer-motion";
import { MANIFESTO } from "@/content/manifesto";
import RadialAperture from "@/components/RadialAperture";
import { ConnectorOverlay, ConnectorLine } from "@/components/NodeConnector";

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

// Branch targets line up with the three pillar columns (sixths of the row).
const PILLAR_X = [16.67, 50, 83.33];

/**
 * One clear reading order: title, then three equal pillars that branch out of
 * a single point under it (same connector language as the Services fan), then
 * the core statement held inside the brand circle, then the signature.
 */
export default function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-espresso px-6 py-28 text-bone sm:py-36">
      <div className="relative mx-auto max-w-5xl">
        <motion.h2
          {...reveal}
          className="mx-auto max-w-2xl text-center font-display text-4xl tracking-headline text-bone sm:text-5xl"
        >
          {MANIFESTO.title}
        </motion.h2>

        <div className="relative mx-auto mt-12 hidden h-14 sm:block">
          <ConnectorOverlay>
            {PILLAR_X.map((x) => (
              <ConnectorLine
                key={x}
                from={{ x: 50, y: 0 }}
                to={{ x, y: 100 }}
                className="opacity-40"
              />
            ))}
          </ConnectorOverlay>
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cognac" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:mt-2 sm:grid-cols-3 sm:gap-8">
          {MANIFESTO.body.map((line, i) => (
            <motion.div
              key={line}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.12 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <span className="font-mono text-xs uppercase tracking-caption text-stone">0{i + 1}</span>
              <p className="max-w-[18rem] font-body text-lg font-normal leading-snug text-bone">{line}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          {...reveal}
          className="relative mx-auto mt-20 flex aspect-square w-full max-w-[22rem] items-center justify-center sm:max-w-[30rem]"
        >
          <RadialAperture tone="cognacSoft" className="inset-0" />
          <p className="relative z-10 max-w-[70%] text-center font-display !font-medium text-xl tracking-subhead text-bone sm:text-3xl">
            {MANIFESTO.statement}
          </p>
        </motion.div>

        <motion.div {...reveal} className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="font-mono text-xs uppercase tracking-caption text-bone/70">{MANIFESTO.closingStatement}</p>
          <p className="font-display text-4xl tracking-headline text-stone sm:text-6xl">{MANIFESTO.signature}</p>
        </motion.div>
      </div>
    </section>
  );
}
