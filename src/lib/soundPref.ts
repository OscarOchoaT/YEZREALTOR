// Visitor's sound choice, set on the entry screen and kept in localStorage.
// The Human + Technology section reads it on mount and listens for the live
// event so the click on "Enter" (a real user gesture) can unlock audio.

export const SOUND_KEY = "yez-sound";
export const SOUND_EVENT = "yez:sound";

export function getSoundPref(): boolean {
  try {
    return window.localStorage.getItem(SOUND_KEY) === "1";
  } catch {
    return false;
  }
}

export function setSoundPref(on: boolean) {
  try {
    window.localStorage.setItem(SOUND_KEY, on ? "1" : "0");
  } catch {
    /* storage unavailable: the preference just won't persist */
  }
}
