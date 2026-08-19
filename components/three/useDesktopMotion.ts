"use client";

import { useSyncExternalStore } from "react";

// Same tier used for the #method pin (brief/06 §4 — mobile gets a simpler
// treatment, not a scaled-down 3D scene). Server snapshot is false so
// server/first-client render agree (no hydration mismatch) and 3D only ever
// mounts as a progressive enhancement after we know the viewport/motion
// preference.
const QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useDesktopMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
