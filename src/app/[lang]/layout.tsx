import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { hankenGrotesk, jetBrainsMono, coolvetica } from "../fonts";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import CustomCursor from "@/components/CustomCursor";
import CursorGlow from "@/components/CursorGlow";
import PageTransitionOverlay from "@/components/PageTransitionOverlay";
import GrainOverlay from "@/components/GrainOverlay";
import { SourceProvider } from "@/components/SourceContext";
import { SITE } from "@/content/site";
import { SITE_META, SITE_URL } from "@/content/meta";
import EntryGate from "@/components/EntryGate";
import MusicPlayer from "@/components/MusicPlayer";
import Preloader from "@/components/Preloader";
import { ENTRY_KEY } from "@/content/entry";
import { LOADED_KEY } from "@/lib/preloader";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { LOCALES, hasLocale, type Locale } from "@/i18n/config";
import "../globals.css";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = SITE_META[lang];

  return {
    metadataBase: new URL(SITE_URL),
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    alternates: {
      canonical: `/${lang}`,
      languages: { en: "/en", es: "/es", "x-default": "/en" },
    },
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      url: `${SITE_URL}/${lang}`,
      siteName: "Yez The Realtor",
      locale: m.ogLocale,
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => SITE_META[l].ogLocale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: m.ogTitle,
      description: m.twitterDescription,
    },
  };
}

// TODO(analytics): this JSON-LD covers baseline local-SEO; update once the
// client confirms domain, review counts, and service area boundaries.
const buildJsonLd = (lang: Locale) => ({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: SITE.name,
  description: SITE_META[lang].schemaDescription,
  areaServed: "Austin, TX",
  knowsLanguage: ["en", "es"],
  address: { "@type": "PostalAddress", addressLocality: "Austin", addressRegion: "TX", addressCountry: "US" },
  telephone: SITE.phone,
  email: SITE.email,
  sameAs: [SITE.instagramUrl, SITE.tiktokUrl, SITE.facebookUrl, SITE.googleReviewsUrl, SITE.realtorDotComUrl],
});

// Runs before first paint: visitors who already passed the entry screen get
// data-entered on <html>, which globals.css uses to hide the gate (no flash).
// Same for data-loaded (loading screen already shown this session).
const ENTRY_SCRIPT = `try{if(localStorage.getItem("${ENTRY_KEY}")==="1")document.documentElement.dataset.entered="1"}catch(e){}try{if(sessionStorage.getItem("${LOADED_KEY}")==="1")document.documentElement.dataset.loaded="1"}catch(e){}`;

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      className={`${hankenGrotesk.variable} ${jetBrainsMono.variable} ${coolvetica.variable} h-full antialiased`}
      // The blocking script below mutates this element's classList before
      // React hydrates (see SKIP_LOADER_SCRIPT) — without this, React flags
      // that as a hydration mismatch and bails out of reconciling <html>
      // entirely, which is worse than the one attribute it's warning about.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-espresso font-body font-light text-bone">
        <script dangerouslySetInnerHTML={{ __html: ENTRY_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(lang)) }} />
        <LocaleProvider lang={lang}>
          <PageTransitionOverlay>
            <SourceProvider>
              <SmoothScroll>
                <Header />
                {children}
                <WhatsAppButton />
                <CustomCursor />
              </SmoothScroll>
              <EntryGate />
              <Preloader />
              <MusicPlayer />
            </SourceProvider>
          </PageTransitionOverlay>
        </LocaleProvider>
        <CursorGlow />
        <GrainOverlay />
        <Analytics />
      </body>
    </html>
  );
}
