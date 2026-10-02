"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PRELOADER_LINE } from "@/content/entry";
import { markLoaded, readLoaded, subscribeLoaded } from "@/lib/preloader";

const EASE = [0.16, 1, 0.3, 1] as const;
const MIN_MS = 2600;
const MAX_MS = 6000;

const WORDS = PRELOADER_LINE.split(" ");

/**
 * Brand loading screen, once per session. It stays up for a minimum beat (so
 * the line can be read) and until the page has finished loading, with a hard
 * cap so a slow asset can never trap the visitor. Hidden before paint for
 * repeat loads via html[data-loaded] (see the layout script + globals.css).
 */
export default function Preloader() {
  const loaded = useSyncExternalStore(subscribeLoaded, readLoaded, () => false);
  const [pageReady, setPageReady] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const onLoad = () => setPageReady(true);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    const min = window.setTimeout(() => setMinElapsed(true), MIN_MS);
    const max = window.setTimeout(() => {
      setPageReady(true);
      setMinElapsed(true);
    }, MAX_MS);
    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(min);
      window.clearTimeout(max);
    };
  }, [loaded]);

  useEffect(() => {
    if (!loaded && pageReady && minElapsed) markLoaded();
  }, [loaded, pageReady, minElapsed]);

  useEffect(() => {
    if (loaded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [loaded]);

  return (
    <AnimatePresence>
      {!loaded && (
        <motion.div
          key="preloader"
          role="status"
          aria-label={PRELOADER_LINE}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
          className="preloader fixed inset-0 z-[120] flex flex-col items-center justify-center gap-8 bg-espresso px-6 text-center"
        >
          <p
            lang="en"
            aria-hidden="true"
            className="max-w-3xl font-display text-3xl leading-tight text-bone sm:text-5xl"
          >
            {WORDS.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className={`inline-block ${w.toLowerCase() === "traditional" ? "text-glow" : ""}`}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: EASE }}
                >
                  {w}
                  {i < WORDS.length - 1 ? " " : ""}
                </motion.span>
              </span>
            ))}
          </p>
          <span aria-hidden="true" className="relative block h-px w-40 overflow-hidden bg-bone/15">
            <motion.span
              className="absolute inset-y-0 left-0 block bg-cognac"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: MIN_MS / 1000, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
