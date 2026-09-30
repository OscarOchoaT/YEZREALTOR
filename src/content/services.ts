export type ServiceId = "buy" | "sell" | "relocate";

export const SERVICES = {
  headline: "Your next move deserves a strategy.",
  cards: [
    {
      id: "buy" as ServiceId,
      label: "Buy",
      headline: "Buy with clarity.",
      description: "Understand the numbers, the market, and the decision before choosing the property.",
      cta: "Explore Buying",
      featured: true,
    },
    {
      id: "sell" as ServiceId,
      label: "Sell",
      headline: "Sell with intention.",
      description: "Position your property and your next move around the outcome you’re actually trying to create.",
      cta: "Explore Selling",
      featured: false,
    },
    {
      id: "relocate" as ServiceId,
      label: "Relocate",
      headline: "Relocating to Texas?",
      description: "A move isn’t just about finding a house. It’s about understanding where your life works best.",
      cta: "Plan My Move",
      featured: false,
    },
  ],
};
