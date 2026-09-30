import localFont from "next/font/local";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// Coolvetica is Yez's display typeface (licensed files delivered in /FONTS).
// The family ships Regular and Heavy but no Medium/Black, so the Brand Guide's
// Subheadline (Medium 500) maps to Regular and the Primary Headline (Black 900)
// maps to Heavy.
export const coolvetica = localFont({
  src: [
    { path: "../fonts/Coolvetica-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Coolvetica-Regular.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Coolvetica-Heavy-Regular.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});
