import { Hanken_Grotesk, JetBrains_Mono, Rubik } from "next/font/google";

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

// TODO(brand): Coolvetica (Regular 400 / Medium 500 / Black 900) is Yez's real
// display typeface but is not distributed on Google Fonts and the client has not
// delivered the licensed file yet (fontdownloader.net/coolvetica-font/ — do not
// auto-download third-party font files). Rubik Black stands in as a structural
// fallback (geometric grotesque, 900 weight available) until the real file lands
// in /public/fonts and this is swapped for a local @font-face / next/font/local load.
export const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "900"],
  variable: "--font-display",
  display: "swap",
});
