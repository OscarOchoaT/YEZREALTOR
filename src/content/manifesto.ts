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
    eyebrow: "Manifesto",
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
    eyebrow: "Manifiesto",
    title: "Una mejor forma de abordar la propiedad.",
    highlight: "propiedad",
    body: [
      "Tecnología que hace las decisiones más claras.",
      "Guía humana cuando hay mucho en juego.",
      "Una experiencia diseñada en torno a hacia dónde vas, no solo a lo que compras.",
    ],
    statement: "La próxima generación no necesita otro agente inmobiliario. Necesita una mejor forma de pensar la propiedad.",
    closingStatement: "Esto es la Propiedad de Vivienda Estratégica.",
    signature: "Ownership, Designed.",
  },
};
