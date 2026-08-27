export const METHOD_INTRO = {
  eyebrow: "The Next Move Method™",
  headline: "Decode. Design. Execute. Advance.",
};

export type MethodDetail = {
  id: "decode" | "design" | "execute" | "advance";
  title: string;
  microlabel: string;
  items: string[];
};

export const METHOD_DETAILS: MethodDetail[] = [
  {
    id: "decode",
    title: "DECODE",
    microlabel: "We understand your full situation.",
    items: [
      "Not just what home you want",
      "Your real financial position",
      "Buying and investing capacity",
      "Timing — now, or when it makes sense",
      "Lifestyle and priorities",
      "Where this move fits your future",
    ],
  },
  {
    id: "design",
    title: "DESIGN",
    microlabel: "We build your Personalized Ownership Strategy.",
    items: [
      "What we're looking for, and why",
      "How we evaluate opportunities against your goals",
      "A strategy built around your life, not a generic search",
    ],
  },
  {
    id: "execute",
    title: "EXECUTE",
    microlabel: "We represent you through every step.",
    items: [
      "Search, tours, and property analysis",
      "Offer strategy and negotiation",
      "Contract and inspections",
      "Financing coordination",
      "Appraisal and title",
      "Closing",
    ],
  },
  {
    id: "advance",
    title: "ADVANCE",
    microlabel: "The relationship keeps moving after closing.",
    items: [
      "Ongoing guidance after you own",
      "A first look at The Arrival Experience — part of the Yez ecosystem, coming soon",
    ],
  },
];

export const TECH_VS_YEZ = {
  eyebrow: "Human + Technology",
  columns: {
    technology: {
      label: "Technology",
      items: ["Organizes information", "Compares scenarios", "Reduces noise", "Visualizes decisions", "Automates follow-up"],
    },
    yez: {
      label: "Yez",
      items: ["Listens", "Interprets", "Recommends", "Negotiates", "Protects", "Represents", "Understands context"],
    },
  },
  closingLine: "High-tech where it simplifies. Deeply human where it matters.",
};
