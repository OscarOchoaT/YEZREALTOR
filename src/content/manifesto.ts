import type { Localized } from "@/i18n/config";

export const MANIFESTO_I18N: Localized<{
  eyebrow: string;
  title: string;
  highlight: string;
  body: string[];
  statement: string;
  closingStatement: string;
  signature: string;
}> = {
  en: {
    eyebrow: "",
    title: "A better way to approach ownership.",
    highlight: "ownership",
    body: [
      "Technology that makes decisions clearer.",
      "Human guidance when the stakes are high.",
      "An experience designed around where you’re going, not just what you’re buying.",
    ],
    statement: "The next generation doesn’t need another Realtor. It needs a better way to think about ownership.",
    closingStatement: "This is Strategic Homeownership.",
    signature: "Ownership, Designed.",
  },
  es: {
    eyebrow: "",
    title: "La forma más inteligente y estratégica de comprar tu propiedad.",
    highlight: "propiedad",
    body: [
      "Tecnología pensada para darle claridad a tu proceso.",
      "Respaldo en las decisiones que marcan tu futuro.",
      "Una experiencia centrada en tus metas, no solo en la transacción.",
    ],
    statement: "La próxima generación no necesita otro agente inmobiliario. Necesita una mejor forma de pensar la propiedad.",
    closingStatement: "Esto es Homeownership estratégico.",
    signature: "Ownership, Designed.",
  },
};
