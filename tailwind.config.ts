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
      },
      fontFamily: {
        // Coolvetica is the brand display face; the client has not delivered the
        // licensed font file yet. Rubik Black is a close-enough structural fallback
        // (geometric grotesque, very heavy weight). TODO: swap for Coolvetica once
        // the .otf/.woff2 files are provided — see src/app/fonts.ts.
        display: ["var(--font-display)", "Rubik", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Hanken Grotesk", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        headline: "-0.04em",
        subhead: "-0.02em",
        caption: "0.2em",
        tagline: "0.22em",
      },
    },
  },
  plugins: [],
};

export default config;
