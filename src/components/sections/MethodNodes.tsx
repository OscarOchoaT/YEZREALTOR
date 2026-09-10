"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { METHOD_DETAILS, PHASE_TONE, type MethodDetail } from "@/content/method";
import TransitionLink from "@/components/TransitionLink";
import Magnetic from "@/components/Magnetic";

function titleCase(title: string) {
  return title.charAt(0) + title.slice(1).toLowerCase();
}

type MethodNodesProps = {
  /** Populated with each desktop panel's DOM node so Method.tsx can drive
   * their scroll-linked entrance from the outside — this component still
   * owns all hover/focus/click/modal behavior itself. Mobile's stacked
   * fallback below isn't wired in here (it just appears; no scrub). */
  cardRefs?: React.MutableRefObject<(HTMLButtonElement | null)[]>;
};

export default function MethodNodes({ cardRefs }: MethodNodesProps) {
  const [activeId, setActiveId] = useState<MethodDetail["id"] | null>(null);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const active = METHOD_DETAILS.find((d) => d.id === activeId) ?? null;

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeId]);

  return (
    <>
      {/* Desktop: a gallery wall of four phase rooms, each claiming its own
          brand color — the same tones the pinned showcase above just gave
          each phase a full screen of. Resting state opens on Decode; hover
          or focus swaps which room is open, collapsing the rest to slim
          vertical placards. Replaces the old flat 01–04 card grid with the
          same "each phase is its own space" idea, just compressed. */}
      <div
        className="hidden h-[34rem] gap-3 lg:flex"
        onMouseLeave={() => setExpandedIndex(0)}
      >
        {METHOD_DETAILS.map((detail, i) => {
          const isExpanded = expandedIndex === i;
          return (
            <motion.button
              key={detail.id}
              ref={(el) => {
                if (cardRefs) cardRefs.current[i] = el;
              }}
              layoutId={`method-node-${detail.id}`}
              onMouseEnter={() => setExpandedIndex(i)}
              onFocus={() => setExpandedIndex(i)}
              onClick={() => setActiveId(detail.id)}
              animate={{ flexGrow: isExpanded ? 3.6 : 1 }}
              transition={{ type: "spring", stiffness: 210, damping: 28 }}
              aria-haspopup="dialog"
              aria-expanded={isExpanded}
              className={`group relative flex min-w-0 flex-col justify-end overflow-hidden rounded-[2rem] border border-bone/15 p-7 text-left shadow-[0_30px_60px_-30px_rgba(0,0,0,0.55)] ${PHASE_TONE[detail.id]} ${
                activeId === detail.id ? "invisible" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -top-10 select-none font-display text-[10rem] leading-none text-bone opacity-[0.06]"
              >
                0{i + 1}
              </span>

              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-500 ${
                  isExpanded ? "opacity-100" : "opacity-70"
                }`}
              />

              {/* Collapsed: a vertical placard — numeral over a top-to-bottom
                  title, the room's door left just barely open. */}
              <div
                aria-hidden={isExpanded}
                className={`absolute inset-0 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 ${
                  isExpanded ? "pointer-events-none opacity-0" : "opacity-100 delay-150"
                }`}
              >
                <span className="font-mono text-xs tracking-caption text-bone/50">0{i + 1}</span>
                <span
                  className="font-display text-2xl tracking-headline text-bone/85"
                  style={{ writingMode: "vertical-rl" }}
                >
                  {detail.title}
                </span>
              </div>

              {/* Expanded: the full story for this phase. */}
              <div
                aria-hidden={!isExpanded}
                className={`relative flex flex-col gap-4 transition-all duration-500 ${
                  isExpanded ? "translate-y-0 opacity-100 delay-150" : "pointer-events-none translate-y-3 opacity-0"
                }`}
              >
                <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-caption text-bone/60">
                  <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-glow" />
                  Phase 0{i + 1}
                </span>
                <h3 className="font-display text-4xl leading-[0.95] tracking-headline text-bone xl:text-5xl">
                  {detail.title}
                </h3>
                <p className="max-w-[26ch] font-accent text-lg italic text-glow">{detail.accentLine}</p>
                <p className="max-w-[24ch] font-body text-sm font-light text-bone/75">{detail.microlabel}</p>
                <span className="mt-2 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-caption text-bone/70 transition-colors group-hover:text-bone">
                  Explore in full
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile / tablet: hover-to-expand doesn't translate to touch, so this
          stays a simple stacked set of full-width cards, colored the same
          as their desktop room. Tap opens the same detail modal. */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:hidden">
        {METHOD_DETAILS.map((detail, i) => (
          <button
            key={detail.id}
            onClick={() => setActiveId(detail.id)}
            aria-haspopup="dialog"
            className={`group relative flex min-h-[13rem] flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-bone/15 p-7 text-left ${PHASE_TONE[detail.id]} ${
              activeId === detail.id ? "invisible" : ""
            }`}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -top-6 select-none font-display text-8xl leading-none text-bone opacity-[0.08]"
            >
              0{i + 1}
            </span>
            <div className="relative">
              <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-caption text-bone/60">
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-glow" />
                0{i + 1}
              </span>
              <h3 className="mt-1 font-display text-3xl tracking-headline text-bone">{detail.title}</h3>
            </div>
            <p className="relative font-body text-sm font-light text-bone/70">{detail.microlabel}</p>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            key="method-node-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveId(null)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <motion.div
            layoutId={`method-node-${active.id}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${active.title} — The Next Move Method`}
            className="fixed inset-3 z-[70] flex flex-col overflow-y-auto rounded-3xl bg-cocoaBark p-8 sm:inset-x-10 sm:inset-y-8 sm:p-14 lg:inset-x-24 lg:inset-y-12"
          >
            <button
              onClick={() => setActiveId(null)}
              aria-label="Close"
              className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-bone/15 font-body text-bone/70 transition-colors hover:border-bone hover:text-bone"
            >
              ✕
            </button>

            <nav className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 pr-12 font-mono text-[11px] uppercase tracking-caption">
              {METHOD_DETAILS.map((d, i) => (
                <span key={d.id} className="flex items-center gap-2">
                  <span className={d.id === active.id ? "text-cognac" : "text-stone"}>{d.title}</span>
                  {i < METHOD_DETAILS.length - 1 && <span className="text-stone/50">·</span>}
                </span>
              ))}
            </nav>

            <span className="font-mono text-xs uppercase tracking-caption text-cognac">
              0{METHOD_DETAILS.findIndex((d) => d.id === active.id) + 1}
            </span>
            <h3 className="mt-2 font-display text-4xl tracking-headline text-bone sm:text-6xl">
              {active.title}
            </h3>
            <p className="mt-3 max-w-xl font-body text-lg font-light text-bone/75">{active.microlabel}</p>

            <ul className="mt-8 flex max-w-xl flex-col gap-3 border-t border-bone/10 pt-6">
              {active.items.map((item) => (
                <li key={item} className="flex gap-3 font-body text-base font-light text-bone/85">
                  <span className="text-cognac">—</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Magnetic strength={0.3}>
                <TransitionLink
                  href={`/metodo/${active.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-glow px-7 py-3.5 font-body text-sm font-medium text-espresso transition-colors hover:bg-bone"
                >
                  Explore {titleCase(active.title)} in full
                  <span aria-hidden="true">→</span>
                </TransitionLink>
              </Magnetic>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
