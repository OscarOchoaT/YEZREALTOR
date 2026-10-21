import type { Localized } from "@/i18n/config";

// While true, the layout renders only the coming-soon screen: nothing else of
// the site (header, sections, entry gate, music) is mounted or reachable.
// Set to false on launch day.
export const COMING_SOON = true;

export const COMING_SOON_I18N: Localized<{ eyebrow: string; line: string; when: string }> = {
  en: {
    eyebrow: "Something new is taking shape",
    line: "A different way to experience real estate is almost here",
    when: "Friday · 1:00 PM CT",
  },
  es: {
    eyebrow: "Algo nuevo está tomando forma",
    line: "Una forma distinta de vivir el real estate está por llegar",
    when: "Viernes · 1:00 PM CT",
  },
};
