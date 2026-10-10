import type { Localized } from "@/i18n/config";

export const ABOUT_I18N: Localized<{
  eyebrow: string;
  paragraphs: string[];
  tags: string[];
  photo: string;
  photoAlt: string;
}> = {
  en: {
    eyebrow: "THE MIND BEHIND THE METHOD",
    paragraphs: [
      "Before real estate, there was engineering. The instinct to break a complex problem into its real parts, understand how everything connects, and build something that works. That instinct never left. It simply found a new application: homeownership.",
      "Yez has been connected to the real estate industry since 2014 and became a licensed Texas Realtor in 2024. Through those years, one thing became increasingly clear: the hardest part of buying a home is rarely finding the house. It’s understanding the decision behind it.",
      "Today, Yez combines real estate strategy, technology, market knowledge, and a deeply personal approach to help clients make ownership decisions around the life they’re actually building.",
      "Bilingual and based in Austin, she works especially closely with professionals navigating career growth, relocation, financial decisions, and major life transitions.",
    ],
    tags: [
      "Engineer by training",
      "Entrepreneur by nature",
      "Immigrant by experience",
      "Pilot by soul",
      "Realtor by purpose",
    ],
    photo: "/images/yez-about.jpg",
    photoAlt: "Yez, Austin Realtor, seated in a black leather chair",
  },
  es: {
    eyebrow: "CONOCE A YEZ",
    paragraphs: [
      "Antes de los bienes raíces, hubo ingeniería. El instinto de descomponer un problema complejo en sus partes reales, entender cómo todo se conecta y construir algo que funcione. Ese instinto nunca se fue. Simplemente encontró una nueva aplicación: la propiedad de vivienda.",
      "Yez está conectada con la industria de bienes raíces desde 2014 y se convirtió en Realtor con licencia en Texas en 2024. A lo largo de esos años, una cosa se hizo cada vez más clara: lo más difícil de comprar una casa rara vez es encontrarla. Es entender la decisión que hay detrás.",
      "Hoy, Yez combina estrategia inmobiliaria, tecnología, conocimiento del mercado y un enfoque profundamente personal para ayudar a sus clientes a tomar decisiones de propiedad en torno a la vida que realmente están construyendo.",
      "Bilingüe y radicada en Austin, trabaja especialmente de cerca con profesionales que atraviesan crecimiento profesional, mudanzas, decisiones financieras y grandes transiciones de vida.",
    ],
    tags: [
      "Ingeniera de formación",
      "Emprendedora por naturaleza",
      "Inmigrante por experiencia",
      "Piloto de alma",
      "Realtor por propósito",
    ],
    photo: "/images/yez-about.jpg",
    photoAlt: "Yez, Realtor en Austin, sentada en una silla de cuero negro",
  },
};
