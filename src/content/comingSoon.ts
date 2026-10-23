// While true, the layout renders only the coming-soon screen: nothing else of
// the site (header, sections, entry gate, music) is mounted or reachable.
// Set to false on launch day.
export const COMING_SOON = true;

// Hidden door: visiting /visualizar sets this cookie (see proxy.ts) and the
// layout then renders the full site for that browser even while COMING_SOON.
export const PREVIEW_PATH = "/visualizar";
export const PREVIEW_COOKIE = "site_preview";

// Deliberately English-only, whatever the visitor's language.
export const COMING_SOON_COPY = {
  eyebrow: "Something new is taking shape",
  line: "A different way to experience real estate is almost here",
  when: "Friday · 1:00 PM CT",
};
