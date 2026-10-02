"use client";

import { useEffect } from "react";
import { MUSIC_EVENT, SOUND_EVENT, getSoundPref } from "@/lib/soundPref";

const SRC = "/audio/music.mp3";
const VOLUME = 0.45;
const FADE_MS = 2500;

// Module-level so it survives the layout remount when the language changes.
let audio: HTMLAudioElement | null = null;
let wanted = false;
let raf = 0;

function getAudio() {
  if (!audio) {
    audio = new Audio();
    audio.preload = "none";
    audio.loop = true;
    audio.volume = 0;
    audio.src = SRC;
  }
  return audio;
}

function fadeTo(el: HTMLAudioElement, target: number, done?: () => void) {
  cancelAnimationFrame(raf);
  const from = el.volume;
  const t0 = performance.now();
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / FADE_MS);
    el.volume = from + (target - from) * k;
    if (k < 1) raf = requestAnimationFrame(step);
    else done?.();
  };
  raf = requestAnimationFrame(step);
}

function start() {
  const el = getAudio();
  wanted = true;
  el.play()
    .then(() => fadeTo(el, VOLUME))
    .catch(() => {
      /* blocked or failed: stay silent, a later gesture retries */
    });
}

function stop() {
  wanted = false;
  const el = getAudio();
  fadeTo(el, 0, () => el.pause());
}

/**
 * Background music, driven by the sound choice on the entry screen.
 * The file is long, so it is streamed (preload="none" until play) instead of
 * downloaded up front: playback starts as soon as the first chunk arrives.
 * "Enter" dispatches SOUND_EVENT inside a real click, which is what lets the
 * browser allow playback. Returning visitors who opted in resume on their
 * first interaction, since browsers block autoplay before one.
 */
export default function MusicPlayer() {
  useEffect(() => {
    const onChoice = (e: Event) => {
      if ((e as CustomEvent<boolean>).detail) start();
      else stop();
    };
    window.addEventListener(SOUND_EVENT, onChoice);
    window.addEventListener(MUSIC_EVENT, onChoice);

    // Returning visitor who opted in: try to autoplay right away. Browsers
    // allow that only for sites with enough prior engagement; otherwise the
    // attempt is rejected and the first real gesture starts it instead.
    const GESTURES = ["pointerdown", "keydown", "touchend", "click"] as const;
    const unarm = () => GESTURES.forEach((g) => window.removeEventListener(g, onGesture));
    function onGesture() {
      if (audio && !audio.paused) return unarm();
      start();
    }
    const playing = () => {
      unarm();
    };
    if (getSoundPref()) {
      wanted = true;
      const el = getAudio();
      if (!el.paused) {
        // Already playing (language switch remount): nothing to do.
      } else {
        el.addEventListener("playing", playing, { once: true });
        GESTURES.forEach((g) => window.addEventListener(g, onGesture));
        start();
      }
    }

    // Don't keep playing in a background tab.
    const onVisibility = () => {
      if (!audio) return;
      if (document.hidden) audio.pause();
      else if (wanted && audio.volume > 0) void audio.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener(SOUND_EVENT, onChoice);
      window.removeEventListener(MUSIC_EVENT, onChoice);
      document.removeEventListener("visibilitychange", onVisibility);
      unarm();
    };
  }, []);

  return null;
}
