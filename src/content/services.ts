import type { Localized } from "@/i18n/config";

export type ServiceId = "buy" | "sell" | "relocate";

type ServiceCard = {
  id: ServiceId;
  label: string;
  headline: string;
  description: string;
  cta: string;
  featured: boolean;
};

export const SERVICES_I18N: Localized<{ eyebrow: string; headline: string; cards: ServiceCard[] }> = {
  en: {
    eyebrow: "Strategy",
    headline: "Your next move deserves a strategy.",
    cards: [
      {
        id: "buy",
        label: "Buy",
        headline: "Buy with clarity.",
        description: "Understand the numbers, the market, and the decision before choosing the property.",
        cta: "Explore Buying",
        featured: false,
      },
      {
        id: "sell",
        label: "Sell",
        headline: "Sell with intention.",
        description: "Position your property and your next move around the outcome you’re actually trying to create.",
        cta: "Explore Selling",
        featured: true,
      },
      {
        id: "relocate",
        label: "Relocate",
        headline: "Relocating to Texas?",
        description: "A move isn’t just about finding a house. It’s about understanding where your life works best.",
        cta: "Plan My Move",
        featured: false,
      },
    ],
  },
  es: {
    eyebrow: "Enfoque",
    headline: "No todos los movimientos se diseñan igual.",
    cards: [
      {
        id: "buy",
        label: "Comprar",
        headline: "Compra con claridad.",
        description: "Entiende los números, el mercado y la decisión antes de elegir la propiedad.",
        cta: "Explorar compra",
        featured: false,
      },
      {
        id: "sell",
        label: "Vender",
        headline: "Vende con intención.",
        description: "Posiciona tu propiedad y tu próximo movimiento alrededor del resultado que realmente quieres crear.",
        cta: "Explorar venta",
        featured: true,
      },
      {
        id: "relocate",
        label: "Relocation",
        headline: "¿Te mueves a Texas?",
        description: "Moverte no es solo encontrar una casa. Es entender dónde encaja mejor tu vida.",
        cta: "Explorar relocation",
        featured: false,
      },
    ],
  },
};
