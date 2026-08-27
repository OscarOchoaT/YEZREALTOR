// Site-wide constants: contact info, socials, and third-party integration IDs.
// TODO(client): confirm/replace every value flagged below before launch.

export const SITE = {
  name: "Yez The Realtor",
  masterIdea: "Ownership, Designed.",
  location: "Austin, TX",

  // TODO(client): confirm the public contact email — not provided in the brief.
  email: "hello@yeztherealtor.com",
  phone: "+1 (737) 341-2406",
  whatsappNumber: "17373412406",
  whatsappMessage: "Hi Yez, I'd like to design my next move.",

  instagramHandle: "@yeztherealtor",
  instagramUrl: "https://instagram.com/yeztherealtor",
  tiktokHandle: "@yeztherealtor",
  tiktokUrl: "https://tiktok.com/@yeztherealtor",
  facebookLabel: "yez the realtor",
  facebookUrl: "https://facebook.com/yeztherealtor",

  // TODO(client): paste the real, live profile URLs once available.
  googleReviewsUrl: "#",
  realtorDotComUrl: "#",

  typeformBaseUrl: "https://form.typeform.com/to/DaucnE48",
} as const;

export const NAV_LINKS = [
  { label: "The Method", href: "#method" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;
