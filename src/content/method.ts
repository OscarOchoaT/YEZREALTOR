export const METHOD_INTRO = {
  eyebrow: "The Next Move Method™",
  headline: "Decode. Design. Execute. Advance.",
  accentLine: "Real strategy, decoded before day one.",
};

export type MethodHudMetric = { label: string; value: number };

export type MethodDetail = {
  id: "decode" | "design" | "execute" | "advance";
  title: string;
  microlabel: string;
  /** One cinematic line, set in the site's italic accent face — the same
   * register as the gold captions in the client's own mood reference. */
  accentLine: string;
  /** Powers each phase page's HUD instrument — a restrained, on-brand
   * translation of that reference's holographic percentage-ring dashboard. */
  hud: MethodHudMetric[];
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
    microlabel: "We understand your full situation.",
    accentLine: "We decode the story your finances are already telling.",
    hud: [
      { label: "Financial Position", value: 87 },
      { label: "Timing Readiness", value: 64 },
      { label: "Investment Capacity", value: 91 },
      { label: "Lifestyle Fit", value: 78 },
    ],
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
    accentLine: "A strategy built around your life — never a generic search.",
    hud: [
      { label: "Search Precision", value: 93 },
      { label: "Budget Alignment", value: 88 },
      { label: "Scenario Coverage", value: 76 },
      { label: "Fit Score", value: 95 },
    ],
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
    accentLine: "Every step, represented — nothing left to chance.",
    hud: [
      { label: "Offer Strength", value: 90 },
      { label: "Negotiation Leverage", value: 82 },
      { label: "Timeline Control", value: 97 },
      { label: "Risk Mitigation", value: 89 },
    ],
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
    accentLine: "The relationship keeps moving long after closing day.",
    hud: [
      { label: "Equity Growth", value: 71 },
      { label: "Portfolio Health", value: 94 },
      { label: "Market Position", value: 85 },
      { label: "Relationship Continuity", value: 100 },
    ],
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
      label: "Human",
      items: ["Listens", "Interprets", "Recommends", "Negotiates", "Protects", "Represents", "Understands context"],
    },
  },
  closingLine: "High-tech where it simplifies. Deeply human where it matters.",
};
