export const METHOD_INTRO = {
  eyebrow: "The Next Move Method™",
  headline: "Decode. Design. Execute. Advance.",
  accentLine: "Not simply the buying process. The methodology Yez uses to help you make and execute the right ownership decision.",
};


export type MethodDetail = {
  id: "decode" | "design" | "execute" | "advance";
  title: string;
  microlabel: string;
  /** One cinematic line, set in the site's italic accent face — the same
   * register as the gold captions in the client's own mood reference. */
  accentLine: string;
  /** The phase's key focus areas, shown in the HUD panel — labels only,
   * never scores or percentages. */
  hud: string[];
  items: string[];
};

// Each phase gets one of the Brand Guide's approved solid-color combos —
// Cocoa Bark, Siena, Espresso, Cognac, all paired with Bone text. Shared
// between MethodShowcase (homepage) and MethodPhasePage (the full phase
// routes) so the same phase always reads as the same color everywhere.
export const PHASE_TONE: Record<MethodDetail["id"], string> = {
  decode: "bg-cocoaBark",
  design: "bg-siena",
  execute: "bg-espresso",
  advance: "bg-cognac",
};

export const METHOD_DETAILS: MethodDetail[] = [
  {
    id: "decode",
    title: "DECODE",
    microlabel: "Before looking at properties, we understand your financial position, timeline, lifestyle, and future objectives.",
    accentLine: "We decode the story your finances are already telling.",
    hud: ["Financial Position", "Timing", "Lifestyle", "Future Objectives"],
    items: [
      "Not just what home you want",
      "Your real financial position",
      "Buying and investing capacity",
      "Timing: now, or when it makes sense",
      "Lifestyle and priorities",
      "Where this move fits your future",
    ],
  },
  {
    id: "design",
    title: "DESIGN",
    microlabel: "We turn what we learned into your Personalized Ownership Strategy, defining your budget, scenarios, priorities, lifestyle, and next steps.",
    accentLine: "A strategy built around your life, never a generic search.",
    hud: ["Budget Alignment", "Scenario Planning", "Search Strategy", "Lifestyle Fit"],
    items: [
      "What we're looking for, and why",
      "How we evaluate opportunities against your goals",
      "A strategy built around your life, not a generic search",
    ],
  },
  {
    id: "execute",
    title: "EXECUTE",
    microlabel: "From property analysis and offer preparation to inspections, negotiation, financing coordination, and closing, we manage the process with intention.",
    accentLine: "Every step, represented, nothing left to chance.",
    hud: ["Property Analysis", "Offer Strategy", "Negotiation", "Timeline Control", "Risk Management"],
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
    microlabel: "Ownership doesn’t stop at closing. We continue the plan around equity, market changes, future moves, investment opportunities, and the next chapter of your real estate strategy.",
    accentLine: "The relationship keeps moving long after closing day.",
    hud: ["Equity", "Network", "Market Position", "Portfolio", "Future Moves"],
    items: [
      "Equity and market position, reviewed as they change",
      "Ongoing guidance after you own",
      "Investment opportunities and future moves",
      "The next chapter of your real estate strategy",
    ],
  },
];

export const TECH_VS_YEZ = {
  eyebrow: "Human + Technology",
  columns: {
    technology: {
      label: "Technology",
      items: ["Organizes information", "Compares scenarios", "Simplifies complex decisions", "Visualizes the numbers", "Keeps the process moving"],
    },
    yez: {
      label: "Human",
      items: ["Listens", "Interprets", "Advises", "Negotiates", "Protects", "Represents", "Understands context"],
    },
  },
  closingLine: "High-tech where it simplifies. Deeply human where it matters.",
};
