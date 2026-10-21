"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { COMING_SOON_COPY } from "@/content/comingSoon";
import { ENTRY_TAGLINE } from "@/content/entry";

const EASE = [0.16, 1, 0.3, 1] as const;

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease: EASE },
});

/** Full-screen placeholder shown instead of the whole site until launch. */
export default function ComingSoon() {
  const copy = COMING_SOON_COPY;

  return (
    <main
      lang="en"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-between overflow-y-auto bg-espresso px-6 py-12 text-center text-bone sm:py-16"
    >
      <span aria-hidden="true" />

      <div className="flex max-w-3xl flex-col items-center gap-8">
        <motion.p
          {...reveal(0.2)}
          className="font-mono text-xs uppercase tracking-caption text-bone/60 sm:text-sm"
        >
          {copy.eyebrow}
        </motion.p>
        <motion.h1
          {...reveal(0.5)}
          className="font-display text-4xl leading-tight tracking-headline text-bone sm:text-6xl"
        >
          {copy.line}
        </motion.h1>
        <motion.p {...reveal(0.8)} className="font-mono text-sm uppercase tracking-caption text-glow sm:text-base">
          {copy.when}
        </motion.p>
      </div>

      <motion.div {...reveal(1.1)} className="mt-12 flex flex-col items-center gap-4">
        <Image src="/logo/logo-primary-bone.png" alt="Yez The Realtor" width={200} height={103} className="h-14 w-auto sm:h-16" />
        <span className="font-display !font-medium text-lg tracking-subhead text-bone">{ENTRY_TAGLINE}</span>
      </motion.div>
    </main>
  );
}
