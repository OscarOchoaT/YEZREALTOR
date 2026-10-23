"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PRELOADER_I18N } from "@/content/entry";
import { ENTRY_KEY } from "@/content/entry";
import { useContent, useLang } from "@/i18n/LocaleProvider";
import { markLoaded, preloadClick, readLoaded, readStarted, subscribeLoaded, subscribeStarted } from "@/lib/preloader";
import { MUSIC_EVENT, getSoundPref } from "@/lib/soundPref";

const EASE = [0.16, 1, 0.3, 1] as const;
const MIN_MS = 2600;
const MAX_MS = 6000;

// Accent words that get struck through ("traditional") instead of underlined.
const STRIKE = new Set(["traditional", "tradicional"]);

const subscribeNever = () => () => {};
const readEntered = () => {
  try {
    return window.localStorage.getItem(ENTRY_KEY) === "1";
  } catch {
    return false;
  }
};

/**
 * Brand loading screen, once per session. First-time visitors see it right
 * after the entry screen's "Enter"; returning visitors on load. It stays up for
 * a minimum beat (so the line can be read) and until the page has finished
 * loading, with a hard cap so a slow asset can never trap the visitor. While
 * it runs, soft clicks play with each word; when it ends the music comes in.
 * Hidden before paint via CSS (see the layout script + globals.css).
 */
export default function Preloader() {
  const { line, accent } = useContent(PRELOADER_I18N);
  const lang = useLang();
  const words = line.split(" ");
  const loaded = useSyncExternalStore(subscribeLoaded, readLoaded, () => false);
  const entered = useSyncExternalStore(subscribeNever, readEntered, () => false);
  const started = useSyncExternalStore(subscribeStarted, readStarted, () => false);
  const active = entered || started;
  const [pageReady, setPageReady] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    if (loaded || !active) return;
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
  }, [loaded, active]);

  useEffect(() => {
    if (loaded || !active || !pageReady || !minElapsed) return;
    markLoaded();
    // Music comes in once the loading screen is done.
    if (getSoundPref()) window.dispatchEvent(new CustomEvent(MUSIC_EVENT, { detail: true }));
  }, [loaded, active, pageReady, minElapsed]);

  // Immersive click bed: one click per word, then a faster tick to the end.
  useEffect(() => {
    if (loaded || !active) return;
    const ids: number[] = [];
    const words = line.split(" ");
    words.forEach((_, i) => ids.push(window.setTimeout(() => preloadClick(0.08 + i * 0.01), 200 + i * 90)));
    ids.push(window.setTimeout(() => preloadClick(0.12), 200 + words.length * 90 + 250));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [loaded, active, line]);

  useEffect(() => {
    if (loaded || !active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [loaded, active]);

  return (
    <AnimatePresence>
      {!loaded && (
        <motion.div
          key="preloader"
          role="status"
          aria-label={line}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
          className="preloader fixed inset-0 z-[120] flex flex-col items-center justify-center gap-10 bg-espresso px-6 text-center"
        >
          {active && (<>
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgb(255_255_255/0.09),transparent_70%)] blur-2xl"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: EASE }}
          />
          <motion.p
            lang={lang}
            aria-hidden="true"
            className="relative max-w-4xl font-display text-3xl uppercase leading-tight text-bone sm:text-5xl"
            initial={{ letterSpacing: "0.12em" }}
            animate={{ letterSpacing: "0em" }}
            transition={{ duration: 2.2, ease: EASE }}
          >
            {words.map((w, i) => {
              const isAccent = w.toLowerCase() === accent.toLowerCase();
              const wordDelay = 0.2 + i * 0.09;
              const chars = Array.from(w);
              const revealed = wordDelay + chars.length * 0.025 + 0.7;
              return (
                <span key={i}>
                  <span className="relative inline-block overflow-hidden whitespace-nowrap py-[0.12em] align-bottom">
                    {chars.map((c, j) => (
                      <motion.span
                        key={j}
                        className={`inline-block ${isAccent ? "text-glow" : ""}`}
                        initial={{ y: "110%", opacity: 0, rotate: 6, filter: "blur(6px)" }}
                        animate={{
                          y: 0,
                          opacity: isAccent && STRIKE.has(w.toLowerCase()) ? [0, 1, 1, 0.35] : 1,
                          rotate: 0,
                          filter: "blur(0px)",
                        }}
                        transition={{
                          duration: 0.8,
                          delay: wordDelay + j * 0.025,
                          ease: EASE,
                          opacity: isAccent && STRIKE.has(w.toLowerCase())
                            ? { duration: 2.2, delay: wordDelay + j * 0.025, times: [0, 0.25, 0.65, 1] }
                            : undefined,
                        }}
                      >
                        {c}
                      </motion.span>
                    ))}
                    {isAccent && (
                      <motion.span
                        aria-hidden="true"
                        className={`absolute left-0 right-0 block origin-left bg-cognac ${
                          STRIKE.has(w.toLowerCase()) ? "top-1/2 h-[3px]" : "bottom-[0.05em] h-[2px]"
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.7, delay: revealed, ease: EASE }}
                      />
                    )}
                  </span>
                  {i < words.length - 1 ? " " : ""}
                </span>
              );
            })}
          </motion.p>
          <span aria-hidden="true" className="relative block h-px w-40 overflow-hidden bg-bone/15">
            <motion.span
              className="absolute inset-y-0 left-0 block bg-cognac"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: MIN_MS / 1000, ease: "easeInOut" }}
            />
          </span>
          </>)}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
