# Sistema de diseño visual

> Traduce la dirección de estilo del brief en decisiones utilizables. **Actualizado con `brief/BRAND.pdf`** (Yez. Brand Guidelines 2026, entregado por el cliente) — la paleta y la tipografía de las secciones 3 y 4 ya no son placeholder, son las oficiales de marca. Sigue pendiente el archivo vectorial del logo (ver [08-build-roadmap.md](./08-build-roadmap.md#assets-pendientes-del-cliente)) — hoy se renderiza en texto siguiendo la especificación de construcción del PDF.

## 1. Adjetivos de estilo (del brief, literal)

Mid-century modern · Editorial · Moderno · Minimalista · Cálido · Arquitectónico · Tecnológico · Auténtico · Sofisticado sin pretensión · Friendly · Limpio · Inesperado · Ligeramente excéntrico · Disruptivo · Visualmente intencional.

**Fórmula de síntesis:** *revista de arquitectura de los años 60 rediseñada por un estudio de producto tecnológico de 2026.* Piensa en tipografía editorial con mucho aire, formas geométricas (arcos, semicírculos, trapecios — vocabulario mid-century), paletas cálidas terrosas combinadas con un acento tecnológico frío/neutro, y movimiento que se siente como una interfaz inteligente, no como un sitio "creativo" con animaciones porque sí.

## 2. Qué evitar (veto absoluto — repetido de [02](./02-brand-strategy.md), crítico para diseño)

Trajes/handshakes/llaves · casas de stock genéricas · skylines decorativos · dorado en exceso / "luxury realtor" · neones · gradientes tech genéricos (glassmorphism morado-azul de SaaS 2021) · interfaces sci-fi · look corporativo · emojis decorativos · template de realtor.

**Uso del logo** (`brief/BRAND.pdf` p.14): nunca distorsionar/comprimir el wordmark, nunca rotarlo fuera de la línea base horizontal, nunca recolorearlo fuera de la paleta de marca, nunca agregarle sombras/glow/efectos 3D, nunca sustituir la tipografía (Coolvetica/Rubik, sin serifs ni itálicas). Clearspace mínimo = altura de la "e" minúscula del wordmark.

## 3. Paleta oficial (fuente: `brief/BRAND.pdf` p.19-21)

Jerárquica, no decorativa: dominante 60%, soporte 30%, acento 10% — la proporción nunca se invierte.

| Rol | Nombre | Hex | Uso |
|---|---|---|---|
| Dominante — oscuro | Espresso | `#1A120B` | Texto de máximo contraste, near-black puntual |
| Dominante — oscuro | Cocoa Bark | `#3D2A20` | Secciones de contraste (Manifesto, Human+Tech, footer), texto principal sobre fondo claro |
| Dominante — claro | Bone | `#F4F0E8` | Fondo principal, texto claro sobre secciones oscuras |
| Soporte | Linen | `#E8E2D5` | Superficie secundaria — cards, secciones alternas dentro del flujo claro |
| Soporte | Stone | `#A89B8A` | Bordes/hairlines (`stone/30`), detalles secundarios |
| Acento (10%, nunca dominante) | Cognac | `#7A5239` | CTA principal, cifras/números destacados, labels de método (Method steps) — **solo sobre fondo claro** |
| Acento (10%, nunca dominante) | Siena | `#602F10` | Hover de CTA — **solo sobre fondo claro** |

Reglas de uso (del PDF):
- Ratio 60/30/10 como base; puede variar levemente por layout pero nunca se invierte la jerarquía.
- Cognac y Siena son **acentos**, reservados para precios, callouts clave y highlights cálidos — nunca como color dominante de una sección completa.
- Combinaciones aprobadas: Bone+Cocoa, Cocoa+Bone, Espresso+Bone, Siena+Bone, Cognac+Bone, Stone+Cocoa, Linen+Cocoa, Bone+Siena.

**Regla de contraste verificada en Fase 4 (`brief/08-build-roadmap.md`):** Cognac y Siena como color de **texto** solo pasan WCAG AA sobre fondos claros (Bone/Linen, ~5.5–9:1) — sobre Cocoa Bark caen a ~1.2–1.9:1, ilegible. Esto coincide con las combinaciones aprobadas del PDF (ninguna pone Cognac/Siena de texto sobre Cocoa Bark). En Human+Tech, sobre fondo Cocoa Bark, la columna "Technology" usa **Stone** (~5:1) y la columna "Yez" usa **Bone** (~12:1) — se diferencian por brillo/peso en vez de matiz, ya que ningún tono cálido de la paleta pasa contraste ahí.

## 4. Tipografía oficial (fuente: `brief/BRAND.pdf` p.16-17)

Tres familias, jerarquía por peso y caja — nunca mezclando familias dentro de un mismo nivel.

| Rol | Familia | Pesos | Tracking | Notas |
|---|---|---|---|---|
| Display / Headlines | **Coolvetica** (fallback: Rubik Black 900) | Regular 400 · Medium 500 · Black 900 | Headline −4% · Subheadline −2% | Coolvetica no está en Google Fonts / no es libremente embebible vía `next/font` — el propio brand book especifica Rubik Black 900 como fallback, así está implementado hoy (`next/font/google` → Rubik). Sustituir por Coolvetica real (self-hosted) cuando el cliente entregue el archivo con licencia. |
| Cuerpo / UI | **Hanken Grotesk** | Light 300 · Medium 500 · Bold 700 | 0% | Body copy en Light 300; UI/utility text en Medium 500. Vía `next/font/google`. |
| Caption / Microcopy | **JetBrains Mono** | Light 300 · Regular 400 · Medium 500 | +20% | Kickers, labels de método, footer labels — siempre mayúsculas. Vía `next/font/google`. |

**Pendiente:** archivo real de Coolvetica (o confirmación de licencia) para reemplazar el fallback Rubik en `--font-display` (`app/layout.tsx`).

## 5. Vocabulario de forma (mid-century → sistema de componentes)

- Arcos y semicírculos como elementos de sección (dividers, contenedores de imagen, marcos de citas).
- Grid asimétrico editorial — evitar grid de 12 columnas perfectamente centrado tipo SaaS; usar composición con offset, como maquetación de revista.
- Iconografía lineal geométrica propia (no Font Awesome / Heroicons genéricos) para los 4 pasos del método y los íconos de servicios.
- Espaciado generoso — "aire" es parte del lenguaje de lujo silencioso (quiet luxury), no el dorado.
- Bordes: preferir esquinas suaves/orgánicas puntuales (arcos) combinadas con bloques rectos — no todo redondeado tipo app móvil, no todo recto tipo corporate.

## 6. Fotografía / video

- Editorial, natural light, composición arquitectónica — Yez en contexto real (Austin, propiedades, movimiento), nunca posando tipo headshot de agencia.
- Si se usan fotos de propiedades: siempre con intención compositiva (líneas, luz, materialidad) — nunca como "featured listing" de MLS.
- Video: usar los videos profesionales existentes como B-roll de movimiento/textura de fondo en hero o transiciones, no como testimonial forzado (no hay video de presentación dedicado todavía).

## 7. Principios de motion (sistema, se detalla técnicamente en 06)

1. **El motion siempre comunica el método** — algo se ordena, se filtra, se enfoca. Nunca motion decorativo sin relación con "decode → design → execute → advance".
2. **Scroll = tiempo narrativo**, no scroll = "cosas que se mueven". Cada tramo de scroll corresponde a un beat del guion (ver [06](./06-3d-scrollytelling-tech-plan.md#guion-de-scroll)).
3. **Ease editorial**, no ease "gamer": curvas suaves, sin bounce/elastic exagerado. Referencia de sensación: `50-jahre-hitparade.ch` (fluidez precisa) e `itsnotviolent.com` (inmersión narrativa), no landings de producto SaaS con confetti.
4. **Reduced motion siempre respetado** — fallback a fade/slide simple, contenido 100% legible sin JS de scroll.

## 8. Moodboard de referencia (del brief)

- Movimiento / transición tecnológica: [50-jahre-hitparade.ch](https://50-jahre-hitparade.ch/)
- Mid-century / retro agency: [Behance — Retro Agency Landing Page](https://www.behance.net/gallery/230061537/Retro-Agency-Marketing-Agency-Landing-Page)
- Inmersión / scrollytelling: [itsnotviolent.com](https://itsnotviolent.com/)
- Moodboard general: [Pinterest board](https://pin.it/pVLsLBCET)

Extraer de cada una **solo** lo que el brief pide explícitamente (ver [01-brief-raw.md](./01-brief-raw.md#inspiración)) — no clonar layouts completos.
