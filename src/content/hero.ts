// Central copy + layout data for the Hero ("El Brainstorm") section.
// Edit this file to change hero wording or word/node placement — no component
// changes required for copy tweaks.

export type HeroWord = {
  id: string;
  label: string;
  /** Initial scattered position, percent of the hero viewport (0-100). */
  x: number;
  y: number;
  rotate: number;
  /** Tailwind text-size class for the "post-it" look. */
  size: string;
  /** Which of the 4 method phases this word belongs to (0=Decode..3=Advance). */
  cluster: 0 | 1 | 2 | 3;
};

export const HERO_WORDS: HeroWord[] = [
  { id: "location", label: "Location", x: 14, y: 22, rotate: -6, size: "text-2xl md:text-3xl", cluster: 0 },
  { id: "timing", label: "Timing", x: 62, y: 12, rotate: 4, size: "text-xl md:text-2xl", cluster: 0 },
  { id: "lifestyle", label: "Lifestyle", x: 38, y: 8, rotate: -3, size: "text-3xl md:text-4xl", cluster: 0 },
  { id: "budget", label: "Budget", x: 84, y: 28, rotate: 6, size: "text-2xl md:text-3xl", cluster: 1 },
  { id: "priorities", label: "Priorities", x: 70, y: 58, rotate: -5, size: "text-xl md:text-2xl", cluster: 1 },
  { id: "future-plans", label: "Future Plans", x: 90, y: 74, rotate: 3, size: "text-2xl md:text-3xl", cluster: 1 },
  { id: "career", label: "Career", x: 18, y: 82, rotate: -4, size: "text-2xl md:text-3xl", cluster: 2 },
  { id: "down-payment", label: "Down Payment", x: 46, y: 92, rotate: 5, size: "text-xl md:text-2xl", cluster: 2 },
  { id: "risk", label: "Risk", x: 8, y: 58, rotate: -7, size: "text-3xl md:text-4xl", cluster: 2 },
  { id: "growth", label: "Growth", x: 56, y: 40, rotate: 2, size: "text-xl md:text-2xl", cluster: 3 },
  { id: "family", label: "Family", x: 26, y: 46, rotate: -2, size: "text-2xl md:text-3xl", cluster: 3 },
  { id: "next-chapter", label: "Next Chapter", x: 74, y: 90, rotate: 4, size: "text-xl md:text-2xl", cluster: 3 },
];

export type HeroNode = {
  id: "decode" | "design" | "execute" | "advance";
  title: string;
  microlabel: string;
  /** Final grid position, percent of the hero viewport (0-100). */
  x: number;
  y: number;
};

export const HERO_NODES: HeroNode[] = [
  {
    id: "decode",
    title: "DECODE",
    microlabel: "We understand your full situation.",
    x: 20,
    y: 18,
  },
  {
    id: "design",
    title: "DESIGN",
    microlabel: "We build your Personalized Ownership Strategy.",
    x: 80,
    y: 18,
  },
  {
    id: "execute",
    title: "EXECUTE",
    microlabel: "We represent you through every step.",
    x: 20,
    y: 85,
  },
  {
    id: "advance",
    title: "ADVANCE",
    microlabel: "The relationship keeps moving after closing.",
    x: 80,
    y: 85,
  },
];

export const HERO_COPY = {
  headline: "Homeownership, designed for what comes next.",
  subheadline: "Strategic homeownership for the next generation.",
  ctaPrimary: "Design My Next Move",
  ctaSecondary: "Explore the Method",
};
