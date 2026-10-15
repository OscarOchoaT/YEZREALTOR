import type { Localized } from "@/i18n/config";

export const DIFFERENTIATOR_I18N: Localized<{
  eyebrow: string;
  lineOld: string;
  lineNew: string;
  points: string[];
}> = {
  en: {
    eyebrow: "Why Yez",
    lineOld: "Traditional real estate helps you complete a transaction.",
    lineNew: "Engineering mindset, technology, human guidance, Austin market knowledge.",
    points: [
      "Homeownership decisions built around your financial picture",
      "Personalized representation, not a transaction queue",
      "Technology built for clearer decisions",
      "Bilingual and culturally aware",
      "Deep knowledge of Austin and Central Texas",
    ],
  },
  es: {
    eyebrow: "¿Por qué Yez?",
    lineOld: "La inmobiliaria tradicional te ayuda a completar una transacción.",
    lineNew: "Mentalidad de ingeniería, tecnología, criterio humano y conocimiento profundo del mercado de Austin.",
    points: [
      "Decisiones inmobiliarias alineadas con tu realidad financiera.",
      "Representación personal, no un proceso en serie.",
      "Tecnología que simplifica la información y mejora cada decisión.",
      "Bilingüe, con contexto cultural y una forma de trabajar cercana.",
      "Conocimiento real y profundo del mercado de Austin, Texas.",
    ],
  },
};
