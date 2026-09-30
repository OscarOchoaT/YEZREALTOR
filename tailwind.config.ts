import type { Config } from "tailwindcss";

// Yez The Realtor — Brand Guide 2026 design tokens.
// Colors: 60% dominant (espresso / cocoaBark / bone) — 30% support (stone / linen) — 10% accent (cognac / siena).
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        espresso: "#1A120B",
        cocoaBark: "#3D2A20",
        bone: "#F4F0E8",
        stone: "#A89B8A",
        linen: "#E8E2D5",
        cognac: "#7A5239",
        siena: "#602F10",
        // Not in the Brand Guide's palette proper — reserved exclusively for
        // the accent line on dark phase heroes, where
        // cognac itself doesn't carry enough contrast to read as the warm
        // "gold caption" beat from the client's mood reference.
        glow: "#E3B27C",
      },
      fontFamily: {
        // Coolvetica is the brand display face — see src/app/fonts.ts.
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Hanken Grotesk", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        headline: "-0.015em",
        subhead: "-0.005em",
        caption: "0.2em",
        tagline: "0.22em",
      },
    },
  },
  plugins: [],
};

export default config;
