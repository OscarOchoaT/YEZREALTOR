export type ServiceId = "buy" | "sell";

export const SERVICES = {
  headline: "Your next move deserves a strategy.",
  cards: [
    {
      id: "buy" as ServiceId,
      label: "Buy",
      description: "For the next chapter you're ready to own.",
      cta: "Start My Buyer Strategy",
      featured: true,
    },
    {
      id: "sell" as ServiceId,
      label: "Sell",
      description: "For a move that starts with the right exit.",
      cta: "Start My Seller Strategy",
      featured: false,
    },
  ],
};
