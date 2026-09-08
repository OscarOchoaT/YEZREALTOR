import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { fraunces, hankenGrotesk, jetBrainsMono, rubik } from "./fonts";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import CustomCursor from "@/components/CustomCursor";
import CursorGlow from "@/components/CursorGlow";
import PageTransitionOverlay from "@/components/PageTransitionOverlay";
import InitialLoader from "@/components/InitialLoader";
import GrainOverlay from "@/components/GrainOverlay";
import { SourceProvider } from "@/components/SourceContext";
import { SITE } from "@/content/site";
import "./globals.css";

const SITE_URL = "https://www.yeztherealtor.com"; // TODO(client): confirm production domain

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Yez The Realtor | Bilingual Austin Realtor & Homeownership Strategist",
  description:
    "Yez is a bilingual real estate advisor and homeownership strategist licensed in Austin, Texas — helping first-time buyers, relocators, and investors design their next move with The Next Move Method. Realtor en Español, Austin.",
  keywords: [
    "Austin realtor",
    "bilingual realtor Austin Texas",
    "real estate advisor Austin Texas",
    "first time home buyer Austin Texas",
    "relocation realtor Austin",
    "realtor en español Austin",
    "homeownership strategy Texas",
  ],
  openGraph: {
    title: "Yez The Realtor | Homeownership, designed for what comes next.",
    description:
      "Strategic homeownership for the next generation. Bilingual Realtor and homeownership strategist based in Austin, Texas.",
    url: SITE_URL,
    siteName: "Yez The Realtor",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yez The Realtor | Homeownership, designed for what comes next.",
    description: "Strategic homeownership for the next generation. Bilingual Realtor based in Austin, Texas.",
  },
};

// TODO(analytics): this JSON-LD covers baseline local-SEO; update once the
// client confirms domain, review counts, and service area boundaries.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: SITE.name,
  description: "Bilingual real estate advisor and homeownership strategist licensed in Austin, Texas.",
  areaServed: "Austin, TX",
  address: { "@type": "PostalAddress", addressLocality: "Austin", addressRegion: "TX", addressCountry: "US" },
  telephone: SITE.phone,
  email: SITE.email,
  sameAs: [SITE.instagramUrl, SITE.tiktokUrl, SITE.facebookUrl],
};

// Runs before the browser's first paint (blocking, no defer/async, placed
// first in <body>) — same technique as a dark-mode flash-prevention script.
// Flags <html> synchronously if this session already saw InitialLoader, so
// its CSS rule (globals.css) can hide the loader overlay before anything
// renders. A React effect can't do this job: by the time any effect runs,
// the server-rendered page underneath has already been painted once.
const SKIP_LOADER_SCRIPT = `try{if(sessionStorage.getItem('yez_loaded')==='true'){document.documentElement.classList.add('skip-initial-loader')}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${jetBrainsMono.variable} ${rubik.variable} ${fraunces.variable} h-full antialiased`}
      // The blocking script below mutates this element's classList before
      // React hydrates (see SKIP_LOADER_SCRIPT) — without this, React flags
      // that as a hydration mismatch and bails out of reconciling <html>
      // entirely, which is worse than the one attribute it's warning about.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-espresso font-body font-light text-bone">
        <script dangerouslySetInnerHTML={{ __html: SKIP_LOADER_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <InitialLoader>
          <PageTransitionOverlay>
            <SourceProvider>
              <SmoothScroll>
                <Header />
                {children}
                <WhatsAppButton />
                <CustomCursor />
              </SmoothScroll>
            </SourceProvider>
          </PageTransitionOverlay>
        </InitialLoader>
        <CursorGlow />
        <GrainOverlay />
        <Analytics />
      </body>
    </html>
  );
}
