"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import InteractiveDotGrid from "@/components/InteractiveDotGrid";
import RadialAperture from "@/components/RadialAperture";
import { ENTRY_I18N, ENTRY_KEY, ENTRY_STEP_KEY, ENTRY_TAGLINE } from "@/content/entry";
import { useContent, useLang } from "@/i18n/LocaleProvider";
import { LOCALES, saveLocale, switchLocalePath, type Locale } from "@/i18n/config";
import { readLoaded, subscribeLoaded } from "@/lib/preloader";
import { MUSIC_EVENT, SOUND_EVENT, setSoundPref } from "@/lib/soundPref";

const NAMES: Record<Locale, string> = { en: "English", es: "Español" };
const EASE = [0.16, 1, 0.3, 1] as const;

const subscribeNever = () => () => {};

function readFlag(storage: "local" | "session", key: string) {
  try {
    return (storage === "local" ? window.localStorage : window.sessionStorage).getItem(key) === "1";
  } catch {
    return false;
  }
}

const readEntered = () => readFlag("local", ENTRY_KEY);
const readLanguagePicked = () => readFlag("session", ENTRY_STEP_KEY);

/**
 * First-visit entry screen, in two steps:
 *   1. The logo arrives and the visitor picks a language (nothing else).
 *   2. Policies + sound, then Enter.
 * Returning visitors never see it (a blocking script in the layout sets
 * data-entered on <html> before paint, and globals.css hides the gate).
 * Picking a different language navigates to it straight away, which remounts
 * the page; a session flag carries the visitor straight on to step 2. "Enter"
 * is the user gesture that unlocks audio for the Human + Technology section.
 */
export default function EntryGate() {
  const lang = useLang();
  const copy = useContent(ENTRY_I18N);
  const router = useRouter();
  const pathname = usePathname();

  const alreadyEntered = useSyncExternalStore(subscribeNever, readEntered, () => false);
  const pickedBefore = useSyncExternalStore(subscribeNever, readLanguagePicked, () => false);
  const [pickedNow, setPickedNow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [sound, setSound] = useState(true);

  // Hold the gate (and its intro animation) until the loading screen is done.
  const loaded = useSyncExternalStore(subscribeLoaded, readLoaded, () => false);

  const open = !alreadyEntered && !dismissed;
  const step = pickedBefore || pickedNow ? 2 : 1;
  // After a language-change remount the intro has already played.
  const skipIntro = pickedBefore;

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const setMusic = (on: boolean) => window.dispatchEvent(new CustomEvent(MUSIC_EVENT, { detail: on }));

  const chooseLanguage = (l: Locale) => {
    saveLocale(l);
    // The first click is the earliest gesture browsers accept for audio, so
    // the music starts here (sound is on by default); step 2 can turn it off.
    setMusic(true);
    if (l === lang) {
      setPickedNow(true);
      return;
    }
    try {
      window.sessionStorage.setItem(ENTRY_STEP_KEY, "1");
    } catch {
      /* ignore: step 2 simply won't be restored after the remount */
    }
    router.replace(switchLocalePath(pathname, l));
  };

  const enter = () => {
    if (!accepted) return;
    try {
      window.localStorage.setItem(ENTRY_KEY, "1");
    } catch {
      /* ignore */
    }
    setSoundPref(sound);
    // Dispatched synchronously inside the click, so audio may start here.
    window.dispatchEvent(new CustomEvent(SOUND_EVENT, { detail: sound }));
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {open && loaded && (
        <motion.div
          key="entry-gate"
          role="dialog"
          aria-modal="true"
          aria-label="Yez The Realtor"
          data-lenis-prevent
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="entry-gate fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-espresso"
        >
          <InteractiveDotGrid />
          <motion.div
            aria-hidden="true"
            initial={skipIntro ? false : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.2, ease: EASE }}
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <RadialAperture
              tone="cognac"
              className="left-1/2 top-1/2 h-[140vw] w-[140vw] max-h-[1000px] max-w-[1000px] -translate-x-1/2 -translate-y-1/2"
            />
          </motion.div>

          <div className="relative mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center gap-8 px-6 py-12 text-center">
            <motion.div layout transition={{ duration: 0.7, ease: EASE }} className="flex flex-col items-center gap-4">
              <motion.div
                layout
                initial={skipIntro ? false : { opacity: 0, scale: 1.25, filter: "blur(18px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.5, delay: 0.25, ease: EASE }}
              >
                <Image
                  src="/logo/logo-inverse.png"
                  alt="Yez The Realtor"
                  width={194}
                  height={100}
                  priority
                  className={`w-auto transition-[height] duration-700 ${step === 1 ? "h-28 sm:h-36" : "h-20 sm:h-24"}`}
                />
              </motion.div>

              <motion.span
                aria-hidden="true"
                initial={skipIntro ? false : { width: 0, opacity: 0 }}
                animate={{ width: "6rem", opacity: 1 }}
                transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
                className="block h-px bg-cognac"
              />

              <motion.span
                lang="en"
                initial={skipIntro ? false : { opacity: 0, letterSpacing: "0.7em" }}
                animate={{ opacity: 1, letterSpacing: "0.2em" }}
                transition={{ duration: 1.4, delay: 1.2, ease: EASE }}
                className="font-mono text-[11px] uppercase text-stone"
              >
                {ENTRY_TAGLINE}
              </motion.span>
            </motion.div>

            <AnimatePresence mode="wait" initial={false}>
              {step === 1 ? (
                <motion.div
                  key="step-language"
                  initial={skipIntro ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.8, delay: 2.1, ease: EASE }}
                  role="group"
                  aria-label="Language / Idioma"
                  className="grid w-full grid-cols-2 gap-3"
                >
                  {LOCALES.map((l) => (
                    <button
                      key={l}
                      type="button"
                      lang={l}
                      onClick={() => chooseLanguage(l)}
                      className="border border-bone/40 px-4 py-4 font-mono text-xs uppercase tracking-caption text-bone transition-colors hover:border-bone hover:bg-bone/10"
                    >
                      {NAMES[l]}
                    </button>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="step-consent"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: skipIntro ? 0.3 : 0.15, ease: EASE }}
                  className="flex w-full flex-col gap-8"
                >
                  <div className="flex w-full flex-col gap-4 text-left">
                    <label className="flex cursor-pointer items-start gap-3 font-body text-sm font-light text-bone/85">
                      <input
                        type="checkbox"
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#7A5239]"
                      />
                      {copy.accept}
                    </label>
                    <label className="flex cursor-pointer items-start gap-3 font-body text-sm font-light text-bone/85">
                      <input
                        type="checkbox"
                        checked={sound}
                        onChange={(e) => {
                          setSound(e.target.checked);
                          setMusic(e.target.checked);
                        }}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#7A5239]"
                      />
                      <span>
                        {copy.sound}
                        <span className="block text-xs text-bone/55">{copy.soundHint}</span>
                      </span>
                    </label>
                  </div>

                  <div className="flex w-full flex-col items-center gap-2">
                    <button
                      type="button"
                      onClick={enter}
                      disabled={!accepted}
                      className="inline-flex w-full items-center justify-center border border-glow bg-glow px-8 py-4 font-mono text-xs uppercase tracking-caption text-espresso transition-colors hover:border-bone hover:bg-bone disabled:cursor-not-allowed disabled:border-bone/20 disabled:bg-transparent disabled:text-bone/40"
                    >
                      {copy.enter} <span aria-hidden="true">&nbsp;→</span>
                    </button>
                    <span aria-live="polite" className="min-h-4 font-mono text-[10px] uppercase tracking-caption text-bone/50">
                      {accepted ? "" : copy.needAccept}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
