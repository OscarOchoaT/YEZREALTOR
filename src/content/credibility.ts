import type { Localized } from "@/i18n/config";

export const CREDIBILITY_I18N: Localized<{
  eyebrow: string;
  headline: string;
  subline: string;
  facts: string[];
  googleReviews: string;
  realtorReviews: string;
}> = {
  en: {
    eyebrow: "What Clients Say",
    headline: "What clients say",
    subline: "Real experiences. Real moves. Real next chapters.",
    facts: ["Licensed Realtor in Texas", "Active since 2024", "Connected to real estate since 2014"],
    googleReviews: "Google Reviews",
    realtorReviews: "Realtor.com Reviews",
  },
  es: {
    eyebrow: "Lo que dicen los clientes",
    headline: "Lo que dicen los clientes",
    subline: "Experiencias reales. Nuevos capítulos reales.",
    facts: [],
    googleReviews: "Google Reviews",
    realtorReviews: "Realtor.com Reviews",
  },
};

export const CONTACT_I18N: Localized<{
  eyebrow: string;
  line1: string;
  line2: string;
  headline: string;
  supporting: string;
  ctaFinal: string;
  whatsappPrompt: string;
  whatsappCta: string;
  formTitle: string;
}> = {
  en: {
    eyebrow: "Let's Talk",
    line1: "The transaction ends.",
    line2: "The relationship keeps moving.",
    headline: "Ready to design your next move?",
    supporting:
      "Whether you’re buying, selling, relocating, or simply trying to understand what’s possible, start with clarity.",
    ctaFinal: "Design My Next Move",
    whatsappPrompt: "Prefer to talk directly?",
    whatsappCta: "WhatsApp Yez",
    formTitle: "Yez The Realtor contact form",
  },
  es: {
    eyebrow: "Hablemos",
    line1: "",
    line2: "A un paso de diseñar tu estrategia.",
    headline: "¿Listo para diseñar tu próximo paso?",
    supporting: "",
    ctaFinal: "Diseña mi próximo paso",
    whatsappPrompt: "¿Prefieres hablar directamente?",
    whatsappCta: "Escribe a Yez por WhatsApp",
    formTitle: "Formulario de contacto de Yez The Realtor",
  },
};

export const FOOTER_I18N: Localized<{ tagline: string; legalLabel: string; legal: { label: string; href: string }[] }> = {
  en: {
    tagline: "Ownership, Designed.",
    legalLabel: "Legal documents",
    legal: [
      { label: "Information About Brokerage Services", href: "/legal/information-about-brokerage-services.pdf" },
      { label: "Consumer Protection Notice", href: "/legal/consumer-protection-notice.pdf" },
      { label: "TREC Information", href: "/legal/trec-information.pdf" },
    ],
  },
  es: {
    tagline: "Ownership, Designed.",
    legalLabel: "Documentos legales",
    legal: [
      { label: "Information About Brokerage Services", href: "/legal/information-about-brokerage-services.pdf" },
      { label: "Consumer Protection Notice", href: "/legal/consumer-protection-notice.pdf" },
      { label: "TREC Information", href: "/legal/trec-information.pdf" },
    ],
  },
};
