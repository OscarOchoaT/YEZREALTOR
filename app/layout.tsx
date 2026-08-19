import type { Metadata } from "next";
import { Rubik, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { SmoothScrollProvider } from "@/components/scroll/SmoothScrollProvider";
import "./globals.css";

// Real brand typefaces — brief/BRAND.pdf p.16 "Type Families".
// Display is Coolvetica in the brand guide, which isn't freely embeddable via
// next/font/google; the guide itself names Rubik Black 900 as the fallback,
// so that's what's wired up here. Swap in a self-hosted Coolvetica file via
// next/font/local once the client provides it — keep the --font-display role.
const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "500", "900"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["300", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Yez The Realtor | Strategic Homeownership Advisor — Austin, TX",
  description:
    "Bilingual real estate strategist in Austin, Texas. Yez helps professionals decode, design, and execute their next move through The Next Move Method™ — buy, sell, or rent with real strategy, not guesswork.",
  openGraph: {
    title: "Yez The Realtor | Strategic Homeownership Advisor — Austin, TX",
    description: "Homeownership, designed for what comes next.",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${rubik.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bone text-cocoa-bark">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
