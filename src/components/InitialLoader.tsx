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
 * (An earlier version tried redistributing the dots into the Hero's
 * scattered-word positions before revealing it, to make the loader feel
 * like it "became" the page. In practice that read as two unrelated things
 * swapping rather than one thing turning into the other, so it was dropped
 * — a loose dot clump and crisp text never look like the same object no
 * matter how the opacity is timed.)
 */
export default function InitialLoader({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const canvasHandleRef = useRef<DotFormationHandle>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const decidedRef = useRef(false);
  const sequenceStartedRef = useRef(false);

  // First render (client-only): decide once whether to show it at all.
  useEffect(() => {
    if (decidedRef.current) return;
    decidedRef.current = true;

    let alreadyShown = true;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === "true";
    } catch {
      // sessionStorage unavailable — just skip the loader.
    }
    if (alreadyShown) return;

    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setVisible(true);
  }, []);

  // Runs once the overlay + canvas have actually mounted (i.e. after the
  // `visible` state change has committed) — driving this from an effect
  // rather than "setVisible then await requestAnimationFrame" guarantees
  // canvasHandleRef.current is populated before .enter() is called on it,
  // and sequenceStartedRef keeps React Strict Mode's dev-only double-invoke
  // of this effect from starting the sequence twice.
  useEffect(() => {
    if (!visible || sequenceStartedRef.current) return;
    sequenceStartedRef.current = true;

    if (reducedMotion) {
      Promise.all([fontsReady(), wait(400)]).then(() => {
        markShown();
        if (wrapperRef.current) {
          gsap.to(wrapperRef.current, {
            autoAlpha: 0,
            duration: 0.45,
            ease: "power1.out",
            onComplete: () => setVisible(false),
          });
        } else {
          setVisible(false);
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

      setVisible(false);
    })();
  }, [visible, reducedMotion]);

  return (
    <>
      {children}
      {visible && (
        <div ref={wrapperRef} className="fixed inset-0 z-[100] bg-bone" aria-hidden="true">
          <DotFormationCanvas ref={canvasHandleRef} className="h-full w-full" />
        </div>
      )}
    </>
  );
}
