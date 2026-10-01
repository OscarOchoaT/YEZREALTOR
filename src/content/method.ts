import type { Localized } from "@/i18n/config";

export const METHOD_INTRO_I18N: Localized<{ eyebrow: string; headline: string; accentLine: string }> = {
  en: {
    eyebrow: "The Next Move Method™",
    headline: "Decode. Design. Execute. Advance.",
    accentLine:
      "Not simply the buying process. The methodology Yez uses to help you make and execute the right ownership decision.",
  },
  es: {
    eyebrow: "The Next Move Method™",
    headline: "Decode. Design. Execute. Advance.",
    accentLine:
      "No es solo el proceso de compra. Es la metodología que Yez usa para ayudarte a tomar y ejecutar la decisión de propiedad correcta.",
  },
};

export type PhaseId = "decode" | "design" | "execute" | "advance";

export type MethodDetail = {
  id: PhaseId;
  title: string;
  microlabel: string;
  /** One cinematic line, set in the site's italic accent face — the same
   * register as the gold captions in the client's own mood reference. */
  accentLine: string;
  /** The phase's key focus areas, shown in the HUD panel — labels only,
   * never scores or percentages. */
  hud: string[];
  items: string[];
};

// Each phase gets one of the Brand Guide's approved solid-color combos —
// Cocoa Bark, Siena, Espresso, Cognac, all paired with Bone text. Shared
// between MethodShowcase (homepage) and MethodPhasePage (the full phase
// routes) so the same phase always reads as the same color everywhere.
export const PHASE_TONE: Record<PhaseId, string> = {
  decode: "bg-cocoaBark",
  design: "bg-siena",
  execute: "bg-espresso",
  advance: "bg-cognac",
};

export const METHOD_DETAILS_I18N: Localized<MethodDetail[]> = {
  en: [
    {
      id: "decode",
      title: "DECODE",
      microlabel: "Before looking at properties, we understand your financial position, timeline, lifestyle, and future objectives.",
      accentLine: "We decode the story your finances are already telling.",
      hud: ["Financial Position", "Timing", "Lifestyle", "Future Objectives"],
      items: [
        "Not just what home you want",
        "Your real financial position",
        "Buying and investing capacity",
        "Timing: now, or when it makes sense",
        "Lifestyle and priorities",
        "Where this move fits your future",
      ],
    },
    {
      id: "design",
      title: "DESIGN",
      microlabel: "We turn what we learned into your Personalized Ownership Strategy, defining your budget, scenarios, priorities, lifestyle, and next steps.",
      accentLine: "A strategy built around your life, never a generic search.",
      hud: ["Budget Alignment", "Scenario Planning", "Search Strategy", "Lifestyle Fit"],
      items: [
        "What we're looking for, and why",
        "How we evaluate opportunities against your goals",
        "A strategy built around your life, not a generic search",
      ],
    },
    {
      id: "execute",
      title: "EXECUTE",
      microlabel: "From property analysis and offer preparation to inspections, negotiation, financing coordination, and closing, we manage the process with intention.",
      accentLine: "Every step, represented, nothing left to chance.",
      hud: ["Property Analysis", "Offer Strategy", "Negotiation", "Timeline Control", "Risk Management"],
      items: [
        "Search, tours, and property analysis",
        "Offer strategy and negotiation",
        "Contract and inspections",
        "Financing coordination",
        "Appraisal and title",
        "Closing",
      ],
    },
    {
      id: "advance",
      title: "ADVANCE",
      microlabel: "Ownership doesn’t stop at closing. We continue the plan around equity, market changes, future moves, investment opportunities, and the next chapter of your real estate strategy.",
      accentLine: "The relationship keeps moving long after closing day.",
      hud: ["Equity", "Network", "Market Position", "Portfolio", "Future Moves"],
      items: [
        "Equity and market position, reviewed as they change",
        "Ongoing guidance after you own",
        "Investment opportunities and future moves",
        "The next chapter of your real estate strategy",
      ],
    },
  ],
  es: [
    {
      id: "decode",
      title: "DECODE",
      microlabel: "Antes de mirar propiedades, entendemos tu posición financiera, tus tiempos, tu estilo de vida y tus objetivos a futuro.",
      accentLine: "Desciframos la historia que tus finanzas ya están contando.",
      hud: ["Posición financiera", "Tiempos", "Estilo de vida", "Objetivos a futuro"],
      items: [
        "No solo qué casa quieres",
        "Tu posición financiera real",
        "Capacidad de compra e inversión",
        "Tiempos: ahora, o cuando tenga sentido",
        "Estilo de vida y prioridades",
        "Dónde encaja esta mudanza en tu futuro",
      ],
    },
    {
      id: "design",
      title: "DESIGN",
      microlabel: "Convertimos lo que aprendimos en tu Estrategia de Propiedad Personalizada, definiendo tu presupuesto, escenarios, prioridades, estilo de vida y próximos pasos.",
      accentLine: "Una estrategia construida en torno a tu vida, nunca una búsqueda genérica.",
      hud: ["Alineación de presupuesto", "Planeación de escenarios", "Estrategia de búsqueda", "Ajuste al estilo de vida"],
      items: [
        "Qué buscamos, y por qué",
        "Cómo evaluamos las oportunidades frente a tus metas",
        "Una estrategia construida en torno a tu vida, no una búsqueda genérica",
      ],
    },
    {
      id: "execute",
      title: "EXECUTE",
      microlabel: "Desde el análisis de propiedades y la preparación de ofertas hasta las inspecciones, la negociación, la coordinación del financiamiento y el cierre, gestionamos el proceso con intención.",
      accentLine: "Cada paso, representado; nada se deja al azar.",
      hud: ["Análisis de propiedades", "Estrategia de oferta", "Negociación", "Control de tiempos", "Gestión de riesgos"],
      items: [
        "Búsqueda, visitas y análisis de propiedades",
        "Estrategia de oferta y negociación",
        "Contrato e inspecciones",
        "Coordinación del financiamiento",
        "Avalúo y título de propiedad",
        "Cierre",
      ],
    },
    {
      id: "advance",
      title: "ADVANCE",
      microlabel: "La propiedad no termina en el cierre. Continuamos el plan en torno al capital, los cambios del mercado, futuras mudanzas, oportunidades de inversión y el siguiente capítulo de tu estrategia inmobiliaria.",
      accentLine: "La relación sigue avanzando mucho después del día del cierre.",
      hud: ["Capital", "Red de contactos", "Posición de mercado", "Portafolio", "Futuras mudanzas"],
      items: [
        "Capital y posición de mercado, revisados a medida que cambian",
        "Guía continua después de ser propietario",
        "Oportunidades de inversión y futuras mudanzas",
        "El siguiente capítulo de tu estrategia inmobiliaria",
      ],
    },
  ],
};

export const TECH_VS_YEZ_I18N: Localized<{
  heading: [string, string] | [string];
  columns: {
    technology: { label: string; items: string[] };
    yez: { label: string; items: string[] };
  };
  closingLine: string;
  ariaLabel: string;
  statusHuman: string;
  statusTech: string;
  statusDone: string;
}> = {
  en: {
    heading: ["Human", "Technology"],
    columns: {
      technology: {
        label: "Technology",
        items: ["Organizes information", "Compares scenarios", "Simplifies complex decisions", "Visualizes the numbers", "Keeps the process moving"],
      },
      yez: {
        label: "Human",
        items: ["Listens & Interprets", "Advises", "Negotiates & Protects", "Represents", "Understands context"],
      },
    },
    closingLine: "High-tech where it simplifies. Deeply human where it matters.",
    ariaLabel: "A brain whose right half is a circuit: human plus technology",
    statusHuman: "Decoding human…",
    statusTech: "Building technology…",
    statusDone: "Human + Technology",
  },
  es: {
    heading: ["Factor Humano"],
    columns: {
      technology: {
        label: "Tecnología",
        items: ["Organiza la información", "Compara escenarios", "Simplifica decisiones complejas", "Visualiza los números", "Mantiene el proceso en marcha"],
      },
      yez: {
        label: "Humano",
        items: ["Escucha e interpreta", "Aconseja", "Negocia y protege", "Representa", "Entiende el contexto"],
      },
    },
    closingLine: "Alta tecnología donde simplifica. Profundamente humano donde importa.",
    ariaLabel: "Un cerebro cuya mitad derecha es un circuito: humano más tecnología",
    statusHuman: "Descifrando lo humano…",
    statusTech: "Construyendo tecnología…",
    statusDone: "Factor Humano",
  },
};
