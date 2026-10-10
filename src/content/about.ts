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
      "Todo empezó con la ingeniería.",
      "La forma de pensar nunca cambió: descomponer lo complejo, entender cómo se conectan las piezas y construir soluciones que realmente funcionen.",
      "Con el tiempo, esa forma de ver el mundo encontró una nueva aplicación: el Real Estate. Yez ha estado conectada con la industria inmobiliaria desde 2014 y obtuvo su licencia como Realtor en Texas en 2024.",
      "Con los años, algo se volvió cada vez más claro: lo más difícil de comprar una casa no es encontrarla, es entender la decisión que hay detrás.",
      "Hoy, Yez combina estrategia inmobiliaria, tecnología, conocimiento del mercado y una forma muy personal de trabajar para ayudar a sus clientes a tomar decisiones que tengan sentido con la vida que están construyendo.",
      "Así mismo, crea una experiencia que se sienta tan bien pensada como la decisión misma.",
      "Bilingüe y basada en Austin, trabaja especialmente con profesionales en movimiento: creciendo en sus carreras, mudándose, tomando decisiones financieras importantes o entrando en una nueva etapa de vida.",
    ],
    tags: [
      "Ingeniera de formación",
      "Emprendedora por naturaleza",
      "Inmigrante por historia",
      "Piloto por pasion",
      "Realtor por propósito",
    ],
    photo: "/images/yez-about.jpg",
    photoAlt: "Yez, Realtor en Austin, sentada en una silla de cuero negro",
  },
};
