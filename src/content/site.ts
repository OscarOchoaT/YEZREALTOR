// Site-wide constants: contact info, socials, and third-party integration IDs.
// TODO(client): confirm/replace every value flagged below before launch.
import type { Localized } from "@/i18n/config";

export const SITE = {
  name: "Yez The Realtor",
  location: "Austin, TX",

  // TODO(client): confirm the public contact email — not provided in the brief.
  email: "hello@yeztherealtor.com",
  phone: "+1 (737) 341-2406",
  whatsappNumber: "17373412406",

  instagramHandle: "@yeztherealtor",
  instagramUrl: "https://instagram.com/yeztherealtor",
  tiktokHandle: "@yeztherealtor",
  tiktokUrl: "https://tiktok.com/@yeztherealtor",
  facebookLabel: "yez the realtor",
  facebookUrl: "https://facebook.com/yeztherealtor",

  googleReviewsUrl: "https://g.co/kgs/qw51G9x",
  realtorDotComUrl: "https://www.realtor.com/realestateagents/662f5158cb09cc14edd5f023",

  typeformBaseUrl: "https://form.typeform.com/to/DaucnE48",
} as const;

export const WHATSAPP_MESSAGE: Localized<string> = {
  en: "Hi Yez, I'd like to design my next move.",
  es: "Hola Yez, me gustaría diseñar mi próximo paso.",
};

type NavLink = { label: string; href: string };

export const NAV_LINKS_I18N: Localized<NavLink[]> = {
  en: [
    { label: "The Method", href: "#method" },
    { label: "Services", href: "#services" },
    { label: "Meet Yez", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  es: [
    { label: "El Método", href: "#method" },
    { label: "Servicios", href: "#services" },
    { label: "Conoce a Yez", href: "#about" },
    { label: "Contacto", href: "#contact" },
  ],
};
