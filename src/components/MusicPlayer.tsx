"use client";

import { useEffect } from "react";
import { SOUND_EVENT, getSoundPref } from "@/lib/soundPref";

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

    let resume: (() => void) | null = null;
    if (getSoundPref()) {
      wanted = true;
      // Already playing (language switch remount): nothing to resume.
      resume = () => {
        if (!audio || audio.paused) start();
      };
      window.addEventListener("pointerdown", resume, { once: true });
      window.addEventListener("keydown", resume, { once: true });
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
      document.removeEventListener("visibilitychange", onVisibility);
      if (resume) {
        window.removeEventListener("pointerdown", resume);
        window.removeEventListener("keydown", resume);
      }
    };
  }, []);

  return null;
}
