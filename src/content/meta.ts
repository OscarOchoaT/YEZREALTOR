import type { Localized } from "@/i18n/config";
import type { PhaseId } from "@/content/method";

export const SITE_URL = "https://www.yeztherealtor.com"; // TODO(client): confirm production domain

export const SITE_META: Localized<{
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  twitterDescription: string;
  ogLocale: string;
  schemaDescription: string;
}> = {
  en: {
    title: "Yez The Realtor | Austin Realtor & Strategic Homeownership",
    description:
      "Yez is a bilingual real estate advisor and homeownership strategist licensed in Austin, Texas, helping first-time buyers, relocators, and investors design their next move with The Next Move Method. Realtor en Español, Austin.",
    keywords: [
      "Austin realtor",
      "bilingual realtor Austin Texas",
      "real estate advisor Austin Texas",
      "first time home buyer Austin Texas",
      "relocation realtor Austin",
      "realtor en español Austin",
      "homeownership strategy Texas",
    ],
    ogTitle: "Yez The Realtor | Homeownership, designed with purpose.",
    ogDescription:
      "Strategic homeownership for the next generation of professionals. Bilingual Realtor and homeownership strategist based in Austin, Texas.",
    twitterDescription: "Strategic homeownership for the next generation of professionals. Bilingual Realtor based in Austin, Texas.",
    ogLocale: "en_US",
    schemaDescription: "Bilingual real estate advisor and homeownership strategist licensed in Austin, Texas.",
  },
  es: {
    title: "Yez The Realtor | Realtor en Austin y Propiedad de Vivienda Estratégica",
    description:
      "Yez es asesora inmobiliaria bilingüe y estratega de propiedad de vivienda con licencia en Austin, Texas, y ayuda a compradores primerizos, personas que se mudan e inversionistas a diseñar su próximo paso con The Next Move Method. Realtor en español, Austin.",
    keywords: [
      "realtor en español Austin",
      "agente inmobiliario bilingüe Austin Texas",
      "asesora de bienes raíces Austin Texas",
      "comprar casa por primera vez Austin Texas",
      "mudanza a Austin Texas",
      "bienes raíces en español Texas",
      "estrategia de propiedad de vivienda Texas",
    ],
    ogTitle: "Yez The Realtor | Tu hogar propio, diseñado con propósito.",
    ogDescription:
      "Propiedad de vivienda estratégica para la próxima generación de profesionales. Realtor bilingüe y estratega de propiedad con sede en Austin, Texas.",
    twitterDescription:
      "Propiedad de vivienda estratégica para la próxima generación de profesionales. Realtor bilingüe con sede en Austin, Texas.",
    ogLocale: "es_US",
    schemaDescription: "Asesora inmobiliaria bilingüe y estratega de propiedad de vivienda con licencia en Austin, Texas.",
  },
};

export const PHASE_META: Localized<Record<PhaseId, { title: string; description: string }>> = {
  en: {
    decode: {
      title: "Decode | The Next Move Method | Yez The Realtor",
      description:
        "The first phase of The Next Move Method: understanding your full situation: financial position, timing, lifestyle, and where this move fits your future.",
    },
    design: {
      title: "Design | The Next Move Method | Yez The Realtor",
      description:
        "The second phase of The Next Move Method: building your Personalized Ownership Strategy, including what we're looking for, why it makes sense, and how we evaluate opportunities.",
    },
    execute: {
      title: "Execute | The Next Move Method | Yez The Realtor",
      description:
        "The third phase of The Next Move Method: direct representation through search, tours, offer strategy, negotiation, inspections, financing, appraisal, title, and closing.",
    },
    advance: {
      title: "Advance | The Next Move Method | Yez The Realtor",
      description:
        "The fourth phase of The Next Move Method: the relationship keeps moving after closing, with ongoing guidance on equity, market position, and future moves.",
    },
  },
  es: {
    decode: {
      title: "Decode | The Next Move Method | Yez The Realtor",
      description:
        "La primera fase de The Next Move Method: entender tu situación completa: posición financiera, tiempos, estilo de vida y dónde encaja esta mudanza en tu futuro.",
    },
    design: {
      title: "Design | The Next Move Method | Yez The Realtor",
      description:
        "La segunda fase de The Next Move Method: convertir lo que aprendimos en una Estrategia de Propiedad Personalizada, construida en torno a tu presupuesto, escenarios y prioridades.",
    },
    execute: {
      title: "Execute | The Next Move Method | Yez The Realtor",
      description:
        "La tercera fase de The Next Move Method: análisis de propiedades, ofertas, negociación, inspecciones, coordinación del financiamiento y cierre, gestionados con intención.",
    },
    advance: {
      title: "Advance | The Next Move Method | Yez The Realtor",
      description:
        "La cuarta fase de The Next Move Method: continuar el plan después del cierre en torno al capital, los cambios del mercado, futuras mudanzas y oportunidades de inversión.",
    },
  },
};
