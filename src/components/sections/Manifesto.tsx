"use client";

import { motion } from "framer-motion";
import { MANIFESTO } from "@/content/manifesto";
import RadialAperture from "@/components/RadialAperture";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.6 },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

export default function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-espresso px-6 py-28 text-bone sm:py-36">
      <RadialAperture className="left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-12 text-center">
        <motion.h2 {...fadeUp} className="font-display text-3xl tracking-headline text-bone sm:text-4xl">
          {MANIFESTO.title}
        </motion.h2>

        <div className="flex flex-col gap-4">
          {MANIFESTO.body.map((line, i) => (
            <motion.p
              key={line}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="font-body text-lg font-light text-bone/80 sm:text-xl"
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.p
          {...fadeUp}
          className="border-y border-bone/10 py-8 font-display !font-medium text-2xl tracking-subhead text-bone sm:text-3xl"
        >
          {MANIFESTO.statement}
        </motion.p>

        <motion.div {...fadeUp} className="flex flex-col items-center gap-5">
          <p className="font-body text-base font-light text-bone/70">{MANIFESTO.closingStatement}</p>
          <p className="font-display text-4xl tracking-headline text-stone sm:text-6xl">{MANIFESTO.signature}</p>
        </motion.div>
      </div>
    </section>
  );
}
