// Central brand/contact constants. Source: brief/01-brief-raw.md + brief/03-content-copywriting.md

export const site = {
  name: "Yez The Realtor",
  tagline: "Strategic homeownership for the next generation.",
  url: "https://yeztherealtor.com",
  email: "yeztherealtor@gmail.com",
  phoneDisplay: "(737) 341-2406",
  phoneE164: "+17373412406",
  city: "Austin, Texas",
};

export const whatsappHref = `https://wa.me/17373412406?text=${encodeURIComponent(
  "Hi Yez, I'd like to start my Next Move."
)}`;

// Real Typeform (brief/01-brief-raw.md#formulario-de-contacto), embedded
// inline in #profile-selector (brief/08 Fase 3) via @typeform/embed-react,
// which takes the form ID rather than the full URL.
export const typeformFormId = "DaucnE48";
export const typeformBaseUrl = `https://form.typeform.com/to/${typeformFormId}`;

export type Intent = "buy" | "sell" | "rent";

export function typeformHref(intent?: Intent) {
  return intent ? `${typeformBaseUrl}?intent=${intent}` : typeformBaseUrl;
}

export const socials = {
  instagram: { label: "@yeztherealtor", href: "https://www.instagram.com/yeztherealtor" },
  tiktok: { label: "@yeztherealtor", href: "https://www.tiktok.com/@yeztherealtor" },
  facebook: { label: "yez the realtor", href: "https://www.facebook.com/yeztherealtor" },
};

export const navLinks = [
  { label: "Method", href: "#method" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
];
