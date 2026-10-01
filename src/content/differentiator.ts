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
    lineNew: "Engineering mindset + technology + human guidance + Austin market knowledge.",
    points: [
      "Homeownership decisions built around your financial picture",
      "Personalized representation, not a transaction queue",
      "Technology built for clearer decisions",
      "Bilingual and culturally aware",
      "Deep knowledge of Austin and Central Texas",
    ],
  },
  es: {
    eyebrow: "Por qué Yez",
    lineOld: "La inmobiliaria tradicional te ayuda a completar una transacción.",
    lineNew: "Mentalidad de ingeniería + tecnología + guía humana + conocimiento del mercado de Austin.",
    points: [
      "Decisiones de propiedad construidas en torno a tu situación financiera",
      "Representación personalizada, no una fila de transacciones",
      "Tecnología creada para tomar decisiones más claras",
      "Bilingüe y culturalmente consciente",
      "Conocimiento profundo de Austin y el centro de Texas",
    ],
  },
};
