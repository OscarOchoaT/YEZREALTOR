export type ServiceId = "buy" | "sell" | "rent";

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
    {
      id: "rent" as ServiceId,
      label: "Rent",
      description: "For finding solid ground before you build on it.",
      cta: "Start My Rental Strategy",
      featured: false,
    },
  ],
};
