# Arquitectura de información y estructura de scroll

## 1. Alcance: landing de una sola página (v1)

El brief pide una **landing page**, no un sitio multi-página. Todo el contenido vive en `/` como un scroll continuo de secciones ancladas. El Typeform externo es la única salida del flujo principal (se puede embeber vía `iframe`/Typeform embed SDK en vez de redirigir — ver [07](./07-integrations-conversion-funnel.md)).

No hay blog, no hay MLS/IDX search, no hay listado de propiedades individuales en v1 — el brief es explícito en que esto **no** es "MLS search + featured listings" como la competencia.

## 2. Mapa de secciones (orden final)

```
1.  Hero                     #hero
2.  Differentiation statement #differentiation
3.  Manifesto                #manifesto
4.  About Yez                #about
5.  The Next Move Method™    #method        (Decode / Design / Execute / Advance)
6.  Human + Technology        #human-tech
7.  Services (Buy/Sell/Rent)  #services
8.  Why Yez (diferenciador)   #why-yez
9.  Credibility / Testimonios #credibility
10. Client Profile / Typeform #profile-selector
11. Contact / Footer          #contact
```

Justificación del orden — sigue exactamente el arco narrativo pedido en el brief:

> *La persona entra con preguntas + información + posibilidades. Durante el recorrido esas variables se organizan y se convierten en Direction → Strategy → Action → Ownership.*

| Bloque narrativo | Secciones | Emoción objetivo |
|---|---|---|
| **Ruido / promesa** | Hero, Differentiation, Manifesto | "Esto no es un realtor más." |
| **Confianza / quién** | About Yez | "Entiendo por qué ella." |
| **Dirección** | The Next Move Method | "Existe un proceso, no es al azar." |
| **Cómo lo hace posible** | Human + Technology | "Tiene sentido cómo combina tech y criterio humano." |
| **Qué puedo hacer aquí** | Services | "Esto aplica a mi caso (buy/sell/rent)." |
| **Por qué ella y no otro** | Why Yez / Credibility | "Está calificada y es real." |
| **Acción** | Profile / Contact | "Quiero empezar." |

## 3. Navegación

Nav pill flotante (no navbar tradicional de realtor con logo+menú+botón). Enlaces ancla mínimos, siempre con el CTA principal fijo y visualmente distinto:

`Method` · `Services` · `About` · **`Design My Next Move`** (CTA, siempre visible)

En mobile: colapsa a un ícono geométrico (no hamburguesa genérica de 3 líneas si el sistema de diseño define algo más propio) + el CTA permanece visible.

## 4. Funnel de conversión mapeado a la IA

```
Landing (#hero)
   │
   ▼
Explora / entiende (#about, #method, #human-tech, #services)
   │
   ▼
Selecciona intención  (#profile-selector: Buy / Sell / Rent)
   │
   ▼
Typeform embebido  →  completion
   │
   ▼
Positioning Call (si califica)  →  Decode → Design → Execute → Advance
```

Puntos de entrada al CTA principal (`Design My Next Move` / variantes por intención) deben repetirse en al menos: hero, cierre de `#method`, `#services` (por cada tab), y `#profile-selector`. Regla del brief: "sin convertir la website en una colección de botones" — máximo 1 CTA primario visible por viewport, WhatsApp como acción secundaria persistente (ej. floating button discreto, no intrusivo).

## 5. Responsive / mobile-first para scrollytelling y 3D

El motion/3D pesado (ver [06](./06-3d-scrollytelling-tech-plan.md)) se degrada en mobile a transiciones 2D con CSS/GSAP — el contenido y el orden de secciones **no cambian** entre breakpoints, solo la técnica de presentación. Esto es una restricción de arquitectura, no solo de diseño: cada sección debe poder renderizar su mensaje completo sin depender de WebGL.

## 6. Estados y accesibilidad de la IA

- `prefers-reduced-motion`: toda la narrativa debe seguir siendo legible con animaciones mínimas — texto y jerarquía primero, motion como refuerzo.
- Cada sección es un `<section id="...">` navegable directamente por URL hash (para compartir enlaces a `#method`, útil para marketing/Instagram bio links a secciones específicas).
- Orden de foco de teclado sigue el orden visual/DOM — el scrollytelling no debe reordenar el DOM, solo animar transformaciones (posición, opacidad, escala).

## 7. Futuro (fuera de v1, no construir ahora)

Mencionado en el brief como "FUTURO" — dejar hooks de contenido (una línea, un teaser) pero no secciones completas ni funcionalidad:

- **The Ownership Circle** — comunidad post-cierre.
- **OWNSemble** — plataforma futura.

Sugerencia: una línea tipo *"What's next: The Ownership Circle — coming soon."* en el footer o cierre de `#method`, sin CTA ni formulario propio.
