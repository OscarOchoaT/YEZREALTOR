import { Fraunces, Hanken_Grotesk, JetBrains_Mono, Rubik } from "next/font/google";

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

// The site's one moment of voice: an italic serif reserved for a single
// cinematic line per dramatic beat (Method phase pages, the homepage Method
// intro, the Manifesto close) — the same register as the gold italic
// captions in the client's own "Next Move Method" mood reference. Never used
// for body copy or UI labels, so it stays a flourish, not a second display face.
export const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500"],
  variable: "--font-accent",
  display: "swap",
});
