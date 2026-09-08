"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import DotFormationCanvas, { type DotFormationHandle } from "@/components/DotFormationCanvas";

const SESSION_KEY = "yez_loaded";
const MIN_DELAY_MS = 1000;
// How long the wrapper (leftover bone background, dots already cleared) takes
// to fade away before unmounting — turns the old "instant cut to the page"
// into a soft dissolve.
const REVEAL_FADE_DURATION = 0.5;

function fontsReady() {
  if (typeof document === "undefined" || !("fonts" in document)) return Promise.resolve();
  return document.fonts.ready;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function markShown() {
  try {
    sessionStorage.setItem(SESSION_KEY, "true");
  } catch {
    // sessionStorage unavailable (private browsing, etc.) — worst case the
    // loader can show again next time.
  }
}

/**
 * Wraps the whole app. On the first load of a session, shows the same
 * dot-formation system used for page transitions (DotFormationCanvas, also
 * used by PageTransitionOverlay) — dots assemble into "Yez.", hold while
 * fonts finish loading (plus a minimum display time so it never flashes),
 * disperse off-screen, then the leftover overlay fades away rather than
 * cutting to the page instantly. sessionStorage["yez_loaded"] keeps it to
 * once per session; navigating between routes afterward uses the separate,
 * shorter PageTransitionOverlay effect instead.
 *
 * The overlay is rendered UNCONDITIONALLY from the very first render (the
 * `done` state below only ever removes it, never adds it) — deliberately
 * the opposite of a "start hidden, reveal via an effect" flag. Gating its
 * presence on client-only state (e.g. a `visible` flag that starts false)
 * means the server-rendered HTML — which already contains the fully built
 * Hero underneath — paints for real before that effect has a chance to run,
 * so the visitor sees a flash of the (not-yet-GSAP-animated, so mostly
 * empty) Hero, then the loader mounts on top of it, then it fades away to
 * reveal the same Hero again. Rendering the overlay by default avoids that
 * entirely: it's already covering the page in the first paint, no JS
 * required. Returning visitors (sessionStorage already set) still see zero
 * loader flash — that's handled by the blocking inline script in
 * layout.tsx, which adds `skip-initial-loader` to <html> before the browser
 * paints anything, and the matching CSS rule in globals.css that hides
 * `.initial-loader-overlay` under that class. This component's own effect
 * only has to notice that class and unmount the (already CSS-hidden)
 * overlay; it can't be the thing preventing the flash, since by the time any
 * React effect runs, the first paint has already happened.
 *
 * (An earlier version tried redistributing the dots into the Hero's
 * scattered-word positions before revealing it, to make the loader feel
 * like it "became" the page. In practice that read as two unrelated things
 * swapping rather than one thing turning into the other, so it was dropped
 * — a loose dot clump and crisp text never look like the same object no
 * matter how the opacity is timed.)
 */
export default function InitialLoader({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  const canvasHandleRef = useRef<DotFormationHandle>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sequenceStartedRef = useRef(false);

  // sequenceStartedRef keeps React Strict Mode's dev-only double-invoke of
  // this effect from starting the sequence twice.
  useEffect(() => {
    if (sequenceStartedRef.current) return;
    sequenceStartedRef.current = true;

    let alreadyShown = document.documentElement.classList.contains("skip-initial-loader");
    if (!alreadyShown) {
      try {
        alreadyShown = sessionStorage.getItem(SESSION_KEY) === "true";
      } catch {
        // sessionStorage unavailable — just skip the loader.
      }
    }
    if (alreadyShown) {
      setDone(true);
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      Promise.all([fontsReady(), wait(400)]).then(() => {
        markShown();
        if (wrapperRef.current) {
          gsap.to(wrapperRef.current, {
            autoAlpha: 0,
            duration: 0.45,
            ease: "power1.out",
            onComplete: () => setDone(true),
          });
        } else {
          setDone(true);
        }
      });
      return;
    }

    (async () => {
      const enterPromise = canvasHandleRef.current?.enter();
      // Fonts ready + a minimum display time (the brief's condition) — also
      // waited alongside the entrance animation itself finishing, so the
      // dots never start dispersing mid-flight before the word has settled.
      await Promise.all([fontsReady(), wait(MIN_DELAY_MS), enterPromise]);

      await canvasHandleRef.current?.exit();

      markShown();

      await new Promise<void>((resolve) => {
        if (!wrapperRef.current) {
          resolve();
          return;
        }
        gsap.to(wrapperRef.current, {
          autoAlpha: 0,
          duration: REVEAL_FADE_DURATION,
          ease: "power1.out",
          onComplete: resolve,
        });
      });

      setDone(true);
    })();
  }, []);

  return (
    <>
      {children}
      {!done && (
        <div
          ref={wrapperRef}
          className="initial-loader-overlay fixed inset-0 z-[100] bg-espresso"
          aria-hidden="true"
        >
          <DotFormationCanvas ref={canvasHandleRef} className="h-full w-full" />
        </div>
      )}
    </>
  );
}
