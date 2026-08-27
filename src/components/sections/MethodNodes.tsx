"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { METHOD_DETAILS, type MethodDetail } from "@/content/method";
import TransitionLink from "@/components/TransitionLink";

function titleCase(title: string) {
  return title.charAt(0) + title.slice(1).toLowerCase();
}

type MethodNodesProps = {
  /** Populated with each grid card's DOM node so Method.tsx can drive their
   * scroll-linked entrance (pinned desktop reveal / scrubbed mobile reveal)
   * from the outside — this component still owns all hover/click/modal
   * behavior itself. */
  cardRefs?: React.MutableRefObject<(HTMLButtonElement | null)[]>;
};

export default function MethodNodes({ cardRefs }: MethodNodesProps) {
  const [activeId, setActiveId] = useState<MethodDetail["id"] | null>(null);
  const [hoveredId, setHoveredId] = useState<MethodDetail["id"] | null>(null);
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {METHOD_DETAILS.map((detail, i) => (
          <motion.button
            key={detail.id}
            ref={(el) => {
              if (cardRefs) cardRefs.current[i] = el;
            }}
            layoutId={`method-node-${detail.id}`}
            onClick={() => setActiveId(detail.id)}
            onMouseEnter={() => setHoveredId(detail.id)}
            onMouseLeave={() => setHoveredId(null)}
            whileHover={{ y: -4, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            aria-haspopup="dialog"
            className={`group flex min-h-[13rem] flex-col justify-between gap-4 rounded-2xl border border-cocoaBark/10 bg-linen/40 p-7 text-left transition-shadow duration-300 ${
              hoveredId === detail.id ? "shadow-[0_14px_34px_-14px_rgba(122,82,57,0.45)]" : "shadow-none"
            } ${activeId === detail.id ? "invisible" : ""}`}
          >
            <div>
              <span className="font-mono text-[11px] uppercase tracking-caption text-cognac">0{i + 1}</span>
              <h3 className="mt-1 font-display text-3xl tracking-headline text-cocoaBark">{detail.title}</h3>
            </div>
            <p
              className={`font-body text-sm font-light text-cocoaBark/70 transition-opacity duration-300 ${
                hoveredId === detail.id ? "opacity-100" : "opacity-0"
              }`}
            >
              {detail.microlabel}
            </p>
          </motion.button>
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
            className="fixed inset-0 z-[60] bg-espresso/50 backdrop-blur-sm"
            onClick={() => setActiveId(null)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <motion.div
            layoutId={`method-node-${active.id}`}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${active.title} — The Next Move Method`}
            className="fixed inset-3 z-[70] flex flex-col overflow-y-auto rounded-3xl bg-bone p-8 sm:inset-x-10 sm:inset-y-8 sm:p-14 lg:inset-x-24 lg:inset-y-12"
          >
            <button
              onClick={() => setActiveId(null)}
              aria-label="Close"
              className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-cocoaBark/15 font-body text-cocoaBark/70 transition-colors hover:border-cocoaBark hover:text-cocoaBark"
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
            <h3 className="mt-2 font-display text-4xl tracking-headline text-cocoaBark sm:text-6xl">
              {active.title}
            </h3>
            <p className="mt-3 max-w-xl font-body text-lg font-light text-cocoaBark/75">{active.microlabel}</p>

            <ul className="mt-8 flex max-w-xl flex-col gap-3 border-t border-cocoaBark/10 pt-6">
              {active.items.map((item) => (
                <li key={item} className="flex gap-3 font-body text-base font-light text-cocoaBark/85">
                  <span className="text-cognac">—</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <TransitionLink
                href={`/metodo/${active.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-cocoaBark px-7 py-3.5 font-body text-sm font-medium text-bone transition-colors hover:bg-espresso"
              >
                Explore {titleCase(active.title)} in full
                <span aria-hidden="true">→</span>
              </TransitionLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
