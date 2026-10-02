// The loading screen shows once per browser session. The flag lives in
// sessionStorage; the event lets the entry gate wait for the screen to finish
// so its intro animation isn't played behind it.

export const LOADED_KEY = "yez-loaded";
export const LOADED_EVENT = "yez:loaded";

export function readLoaded(): boolean {
  try {
    return window.sessionStorage.getItem(LOADED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markLoaded() {
  try {
    window.sessionStorage.setItem(LOADED_KEY, "1");
  } catch {
    /* storage unavailable: the screen just shows again next load */
  }
  window.dispatchEvent(new Event(LOADED_EVENT));
}

export function subscribeLoaded(onChange: () => void) {
  window.addEventListener(LOADED_EVENT, onChange);
  return () => window.removeEventListener(LOADED_EVENT, onChange);
}
