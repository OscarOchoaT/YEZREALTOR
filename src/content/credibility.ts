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
    subline: "Experiencias reales. Mudanzas reales. Nuevos capítulos reales.",
    facts: ["Realtor con licencia en Texas", "Activa desde 2024", "Conectada con bienes raíces desde 2014"],
    googleReviews: "Reseñas en Google",
    realtorReviews: "Reseñas en Realtor.com",
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
    line1: "La transacción termina.",
    line2: "La relación sigue avanzando.",
    headline: "¿Listo para diseñar tu próximo paso?",
    supporting:
      "Ya sea que estés comprando, vendiendo, mudándote o simplemente tratando de entender qué es posible, empieza con claridad.",
    ctaFinal: "Diseña mi próximo paso",
    whatsappPrompt: "¿Prefieres hablar directamente?",
    whatsappCta: "Escribe a Yez por WhatsApp",
    formTitle: "Formulario de contacto de Yez The Realtor",
  },
};

export const FOOTER_I18N: Localized<{ tagline: string }> = {
  en: { tagline: "Ownership, Designed." },
  es: { tagline: "Propiedad, diseñada." },
};
