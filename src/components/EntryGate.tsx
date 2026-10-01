"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import InteractiveDotGrid from "@/components/InteractiveDotGrid";
import RadialAperture from "@/components/RadialAperture";
import { ENTRY_I18N, ENTRY_KEY } from "@/content/entry";
import { FOOTER_I18N } from "@/content/credibility";
import { useContent, useLang } from "@/i18n/LocaleProvider";
import { LOCALES, saveLocale, switchLocalePath, type Locale } from "@/i18n/config";
import { SOUND_EVENT, setSoundPref } from "@/lib/soundPref";

const NAMES: Record<Locale, string> = { en: "English", es: "Español" };

const subscribeNever = () => () => {};

function readEntered() {
  try {
    return window.localStorage.getItem(ENTRY_KEY) === "1";
  } catch {
    return false;
  }
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

/**
 * First-visit entry screen: brand, language, policy acceptance and sound.
 * Returning visitors never see it (a blocking script in the layout sets
 * data-entered on <html> before paint, and globals.css hides the gate).
 * Picking the other language navigates to it right away, so the rest of the
 * screen (and the whole site) switches too. "Enter" is the user gesture that
 * unlocks audio for the Human + Technology section.
 */
export default function EntryGate() {
  const lang = useLang();
  const copy = useContent(ENTRY_I18N);
  const { tagline } = useContent(FOOTER_I18N);
  const router = useRouter();
  const pathname = usePathname();

  const alreadyEntered = useSyncExternalStore(subscribeNever, readEntered, () => false);
  const [dismissed, setDismissed] = useState(false);
  const open = !alreadyEntered && !dismissed;
  const [accepted, setAccepted] = useState(false);
  const [sound, setSound] = useState(true);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const chooseLanguage = (l: Locale) => {
    if (l === lang) return;
    saveLocale(l);
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
      {open && (
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
          <RadialAperture
            tone="cognac"
            className="left-1/2 top-1/2 h-[140vw] w-[140vw] max-h-[1000px] max-w-[1000px] -translate-x-1/2 -translate-y-1/2"
          />

          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
            className="relative mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center gap-8 px-6 py-12 text-center"
          >
            <motion.div variants={item} className="flex flex-col items-center gap-4">
              <Image src="/logo/logo-inverse.png" alt="Yez The Realtor" width={194} height={100} priority className="h-24 w-auto sm:h-28" />
              <span className="font-mono text-[11px] uppercase tracking-caption text-stone">{tagline}</span>
            </motion.div>

            <motion.div variants={item} className="flex w-full flex-col gap-3">
              <span className="font-mono text-[11px] uppercase tracking-caption text-bone/70">{copy.languageHeading}</span>
              <div role="group" aria-label={copy.languageHeading} className="grid grid-cols-2 gap-3">
                {LOCALES.map((l) => {
                  const active = l === lang;
                  return (
                    <button
                      key={l}
                      type="button"
                      lang={l}
                      aria-pressed={active}
                      onClick={() => chooseLanguage(l)}
                      className={`border px-4 py-4 font-mono text-xs uppercase tracking-caption transition-colors ${
                        active
                          ? "border-glow bg-glow text-espresso"
                          : "border-bone/40 text-bone hover:border-bone hover:bg-bone/10"
                      }`}
                    >
                      {NAMES[l]}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div variants={item} className="flex w-full flex-col gap-4 text-left">
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
                  onChange={(e) => setSound(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#7A5239]"
                />
                <span>
                  {copy.sound}
                  <span className="block text-xs text-bone/55">{copy.soundHint}</span>
                </span>
              </label>
            </motion.div>

            <motion.div variants={item} className="flex w-full flex-col items-center gap-2">
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
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
