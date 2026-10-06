// The loading screen runs once per browser session, right after the entry
// screen's "Enter" (language + policies). Returning visitors, who skip the
// entry screen, get it on load instead. The flag lives in sessionStorage; the
// events let the entry gate / music player react to the screen starting and
// finishing.

import { Fx } from "@/lib/fx";

export const LOADED_KEY = "yez-loaded";
export const LOADED_EVENT = "yez:loaded";
export const START_EVENT = "yez:preload-start";

let started = false;
let fx: Fx | null = null;

export function readLoaded(): boolean {
  try {
    return window.sessionStorage.getItem(LOADED_KEY) === "1";
  } catch {
    return false;
  }
}

export function readStarted(): boolean {
  return started;
}

/** Called from the "Enter" click: shows the loading screen. `sound` unlocks its click audio. */
export function beginPreload(sound: boolean) {
  if (sound) {
    fx ??= new Fx();
    fx.enable();
  }
  started = true;
  document.documentElement.dataset.preloading = "1";
  window.dispatchEvent(new Event(START_EVENT));
}

export function preloadClick(gain?: number) {
  fx?.click(gain);
}

export function markLoaded() {
  try {
    window.sessionStorage.setItem(LOADED_KEY, "1");
  } catch {
    /* storage unavailable: the screen just shows again next load */
  }
  window.dispatchEvent(new Event(LOADED_EVENT));
  // The click bed is done; release the audio context after its tail.
  const done = fx;
  fx = null;
  if (done) window.setTimeout(() => done.dispose(), 1500);
}

export function subscribeLoaded(onChange: () => void) {
  window.addEventListener(LOADED_EVENT, onChange);
  return () => window.removeEventListener(LOADED_EVENT, onChange);
}

export function subscribeStarted(onChange: () => void) {
  window.addEventListener(START_EVENT, onChange);
  return () => window.removeEventListener(START_EVENT, onChange);
}
