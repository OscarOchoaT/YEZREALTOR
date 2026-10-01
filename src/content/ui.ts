// Small, shared interface strings (labels, aria text, button captions).
import type { Localized } from "@/i18n/config";

export const BRAND_METHOD = "The Next Move Method™";

type Ui = {
  homeAria: string;
  whatsappAria: string;
  phase: string;
  focus: string;
  scroll: string;
  nextPhase: string;
  fullBreakdown: string;
  exploreInFull: string;
  exploreTitle: (title: string) => string;
  close: string;
  heroAria: (headline: string) => string;
  languageLabel: string;
};

const titleCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

export const UI_I18N: Localized<Ui> = {
  en: {
    homeAria: "Yez The Realtor, home",
    whatsappAria: "Message Yez on WhatsApp",
    phase: "Phase",
    focus: "Focus",
    scroll: "Scroll",
    nextPhase: "Next phase",
    fullBreakdown: "Full Breakdown",
    exploreInFull: "Explore in full",
    exploreTitle: (t) => `Explore ${titleCase(t)} in full`,
    close: "Close",
    heroAria: (h) => `Yez The Realtor: ${h}`,
    languageLabel: "Language",
  },
  es: {
    homeAria: "Yez The Realtor, inicio",
    whatsappAria: "Escribe a Yez por WhatsApp",
    phase: "Fase",
    focus: "Enfoque",
    scroll: "Desliza",
    nextPhase: "Siguiente fase",
    fullBreakdown: "Desglose completo",
    exploreInFull: "Explorar a fondo",
    exploreTitle: (t) => `Explorar ${titleCase(t)} a fondo`,
    close: "Cerrar",
    heroAria: (h) => `Yez The Realtor: ${h}`,
    languageLabel: "Idioma",
  },
};
