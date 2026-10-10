"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { MANIFESTO_I18N } from "@/content/manifesto";
import { useContent } from "@/i18n/LocaleProvider";
import Eyebrow from "@/components/Eyebrow";
import RadialAperture from "@/components/RadialAperture";

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const normalize = (w: string) => w.toLowerCase().replace(/[.,;:!?¿¡"“”]/g, "");

function Word({
  word,
  progress,
  range,
  accent,
  still,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
  still: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={still ? undefined : { opacity }} className={accent ? "text-glow underline decoration-cognac decoration-[0.06em] underline-offset-[0.14em]" : "text-bone"}>
      {word}
    </motion.span>
  );
}

/**
 * Reading order: a large left-aligned headline that lights up word by word as
 * it scrolls into view (the key word in glow), three pillars under a hairline,
 * the core statement held inside the brand circle, then the signature.
 */
export default function Manifesto() {
  const MANIFESTO = useContent(MANIFESTO_I18N);
  const reduceMotion = useReducedMotion() ?? false;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: titleRef, offset: ["start 0.85", "end 0.5"] });

  const words = MANIFESTO.title.split(" ");
  const highlight = normalize(MANIFESTO.highlight);

  return (
    <section className="relative overflow-hidden bg-espresso px-6 py-28 text-bone sm:py-36">
      <div className="relative mx-auto max-w-6xl">
        <Eyebrow index="01" label={MANIFESTO.eyebrow} align="left" />

        <h2
          ref={titleRef}
          className="mt-8 max-w-5xl font-display text-5xl leading-[0.98] tracking-headline sm:text-7xl lg:text-[5.5rem]"
        >
          {words.map((word, i) => {
            const step = 0.8 / words.length;
            return (
              <span key={`${word}-${i}`}>
                <Word
                  word={word}
                  progress={scrollYProgress}
                  range={[i * step, i * step + step * 1.6]}
                  accent={normalize(word) === highlight}
                  still={reduceMotion}
                />
                {i < words.length - 1 && " "}
              </span>
            );
          })}
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:mt-20 sm:grid-cols-3 sm:gap-8">
          {MANIFESTO.body.map((line, i) => (
            <motion.div
              key={line}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.12 }}
              className="flex flex-col gap-4 border-t border-bone/20 pt-5"
            >
              <span className="font-mono text-xs uppercase tracking-caption text-cognac">0{i + 1}</span>
              <p className="max-w-[20rem] font-body text-lg font-normal leading-snug text-bone">{line}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          {...reveal}
          className="relative mx-auto mt-24 flex aspect-square w-full max-w-[22rem] items-center justify-center sm:max-w-[34rem]"
        >
          <RadialAperture tone="cognacSoft" className="inset-0" />
          {/* Sized to the circle's inscribed box: the statement is long, so
              the type stays modest and balanced, never touching the edge. */}
          <p className="relative z-10 max-w-[68%] text-balance text-center font-display !font-medium text-base leading-snug tracking-subhead text-bone sm:text-xl md:text-2xl">
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
