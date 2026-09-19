"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Footer from "@/components/sections/Footer";
import TransitionLink from "@/components/TransitionLink";
import Magnetic from "@/components/Magnetic";
import RadialAperture from "@/components/RadialAperture";
import PhaseHud from "@/components/PhaseHud";
import DotGridBackground from "@/components/DotGridBackground";
import { METHOD_DETAILS, PHASE_TONE, type MethodDetail } from "@/content/method";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const heroStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function MethodPhasePage({ phaseId }: { phaseId: MethodDetail["id"] }) {
  const index = METHOD_DETAILS.findIndex((d) => d.id === phaseId);
  const phase = METHOD_DETAILS[index];
  const next = METHOD_DETAILS[(index + 1) % METHOD_DETAILS.length];

  const listSectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useGSAP(
    () => {
      const items = itemRefs.current.filter((el): el is HTMLLIElement => Boolean(el));
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set(items, { clearProps: "all" });
        gsap.set(railRef.current, { scaleY: 1 });
        return;
      }

      gsap.set(items, { autoAlpha: 0, x: 18 });
      gsap.set(railRef.current, { scaleY: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: listSectionRef.current,
          start: "top 75%",
          end: "top 25%",
          scrub: 1,
        },
      });

      tl.to(railRef.current, { scaleY: 1, ease: "none", duration: 1 }, 0);
      items.forEach((item, i) => {
        tl.to(item, { autoAlpha: 1, x: 0, ease: "power2.out", duration: 0.35 }, i * 0.09);
      });
    },
    { scope: listSectionRef, dependencies: [phaseId] }
  );

  return (
    <main className="flex flex-1 flex-col" id="hero">
      <section
        className={`relative flex min-h-[100svh] flex-col justify-center overflow-hidden ${PHASE_TONE[phase.id]} px-6 pb-20 pt-32 text-bone sm:pt-40`}
      >
        <RadialAperture
          className="left-1/2 top-[38%] h-[130vw] w-[130vw] max-h-[880px] max-w-[880px] -translate-x-1/2 -translate-y-1/2 sm:h-[760px] sm:w-[760px]"
        />
        <DotGridBackground className="opacity-40" />

        <div className="relative mx-auto w-full max-w-3xl">
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

          <motion.div variants={heroStagger} initial="hidden" animate="show">
            <motion.span
              variants={heroItem}
              className="flex items-center gap-2 font-mono text-sm uppercase tracking-caption text-bone sm:text-base"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full bg-cognac motion-safe:[animation:dot-pulse_2s_ease-in-out_infinite]"
              />
              The Next Move Method™ <span className="text-bone/60">· Phase 0{index + 1}</span>
            </motion.span>

            <motion.h1
              variants={heroItem}
              className="mt-4 font-display text-6xl leading-[0.94] tracking-headline sm:text-8xl"
            >
              {phase.title}
            </motion.h1>

            <motion.p variants={heroItem} className="mt-6 max-w-xl font-accent text-2xl italic text-glow sm:text-3xl">
              {phase.accentLine}
            </motion.p>

            <motion.p variants={heroItem} className="mt-5 max-w-lg font-body text-lg font-light text-bone/80">
              {phase.microlabel}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 max-w-xl sm:mt-14"
          >
            <PhaseHud heading={`${phase.title} · Live Read`} metrics={phase.hud} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          aria-hidden="true"
          className="relative mx-auto mt-14 flex flex-col items-center gap-2 text-bone/40"
        >
          <span className="font-mono text-[10px] uppercase tracking-caption">Scroll</span>
          <span className="h-8 w-px animate-bounce bg-bone/40" />
        </motion.div>
      </section>

      <section ref={listSectionRef} className="relative bg-espresso px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="relative pl-6">
            <div
              ref={railRef}
              aria-hidden="true"
              className="absolute left-0 top-1 h-full w-px origin-top bg-cognac/60"
            />
            <ul className="flex flex-col gap-5">
              {phase.items.map((item, i) => (
                <li
                  key={item}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="flex gap-4 border-b border-bone/10 pb-5 font-body text-lg font-light text-bone/85"
                >
                  <span className="shrink-0 font-mono text-xs text-cognac">0{i + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-8 border-t border-bone/10 pt-10 sm:flex-row sm:items-center">
            <TransitionLink href={`/metodo/${next.id}`} className="group flex flex-col gap-1">
              <span className="font-mono text-[11px] uppercase tracking-caption text-stone">Next phase</span>
              <span className="font-display text-2xl tracking-headline text-bone transition-colors group-hover:text-cognac">
                {next.title} →
              </span>
            </TransitionLink>

            <Magnetic strength={0.3}>
              <TransitionLink
                href="/#services"
                className="inline-flex items-center justify-center rounded-full bg-glow px-7 py-3.5 font-body text-sm font-medium text-espresso transition-colors hover:bg-bone"
              >
                Design My Next Move
              </TransitionLink>
            </Magnetic>
          </div>
        </div>
      </section>

      <Footer isHome={false} />
    </main>
  );
}
