# Plan técnico — 3D + Scrollytelling

> Objetivo: una landing "brutal" a la altura de `50-jahre-hitparade.ch` / `itsnotviolent.com`, pero que nunca deje de ser clara, humana y orientada a conversión (restricción explícita del brief). Este documento define stack, arquitectura y el guion de scroll sección por sección.

## 0. Antes de escribir código

Este repo corre **Next.js 16** con React 19 y Tailwind v4 — versiones más nuevas que el training data del modelo, con cambios de API respecto a lo "clásico". `AGENTS.md` en la raíz del proyecto ya lo advierte: **leer `node_modules/next/dist/docs/` antes de escribir código**, especialmente lo relacionado a App Router, layouts, metadata API y cualquier convención de archivos. No asumir sintaxis de Next 13/14 por defecto.

## 1. Stack recomendado

| Capa | Elección | Por qué |
|---|---|---|
| Framework | Next.js 16 (App Router, ya scaffolded) | Ya está en el repo |
| Estilos | Tailwind v4 (ya en `devDependencies`) + CSS variables para el design system de [05](./05-visual-design-system.md) | Ya está en el repo; v4 usa `@theme` en CSS en vez de `tailwind.config.js` clásico — confirmar sintaxis en la doc local antes de configurar tokens |
| Scroll suave | **Lenis** (`lenis`) | Estándar actual para smooth-scroll performante, se integra limpio con ScrollTrigger y con R3F |
| Animación 2D / timeline / scroll | **GSAP + ScrollTrigger** (skills `gsap-core`, `gsap-scrolltrigger`, `gsap-react` ya disponibles en este entorno) | Es la herramienta correcta para pinning, scrubbing y timelines complejas — usar las skills `gsap-*` cargadas en este proyecto en vez de reinventar con `IntersectionObserver` a mano |
| 3D | **React Three Fiber (`@react-three/fiber`) + `@react-three/drei` + `three`** | R3F es el estándar de facto para 3D declarativo en React; drei da helpers (`useScroll`, `ScrollControls`, `Environment`, `Float`, etc.) |
| Sincronía scroll ↔ 3D | GSAP ScrollTrigger controlando uniforms/props de Three.js vía refs, **o** `@react-three/drei`'s `ScrollControls` para tramos puramente 3D | Elegir por sección — ver guion abajo, no forzar una sola técnica en todo el sitio |
| Texto kinético | GSAP `SplitText` (plugin, vía skill `gsap-plugins`) | Para el manifiesto y headline animados palabra/carácter |
| Formulario | Typeform embed SDK (`@typeform/embed-react`) | Integración nativa, no iframe crudo — ver [07](./07-integrations-conversion-funnel.md) |
| Fonts | `next/font` con las tipografías del design system | Next 16 — confirmar API vigente de `next/font` en la doc local antes de usar |

**No usar** (evitar sobre-ingeniería para una landing de una página): Three.js "vanilla" fuera de R3F, librerías de scroll paralelas a Lenis (locomotive-scroll, etc.), Framer Motion como motor principal de scroll (GSAP ScrollTrigger es más apto para pinning/scrub complejo y ya está disponible como skill en este entorno).

## 2. Arquitectura de componentes (propuesta)

```
app/
  layout.tsx              → fonts, <SmoothScrollProvider>, metadata SEO
  page.tsx                → orquesta las <Section /> en orden (ver 04-information-architecture.md)
  globals.css              → @theme tokens (colores, tipografía) del design system

components/
  scroll/
    SmoothScrollProvider.tsx   → wrapper Lenis + sincronización con ScrollTrigger.scrollerProxy
    ScrollProgress.tsx         → indicador de progreso global (opcional, sutil)
  three/
    SceneCanvas.tsx             → <Canvas> único, montado una vez, compartido si varias secciones usan 3D
    scenes/
      HeroScene.tsx
      MethodScene.tsx
      HumanTechScene.tsx
    lib/
      useResponsive3D.ts        → degrada calidad/geometría en mobile
      useReducedMotion.ts        → hook que lee prefers-reduced-motion
  sections/
    Hero.tsx
    Differentiation.tsx
    Manifesto.tsx
    About.tsx
    Method.tsx
    HumanTech.tsx
    Services.tsx
    WhyYez.tsx
    Credibility.tsx
    ProfileSelector.tsx
    Contact.tsx
  ui/
    NavPill.tsx
    CTAButton.tsx
    WhatsAppFAB.tsx
```

**Decisión de arquitectura (actualizada en Fase 2):** se implementó lo contrario de lo planteado originalmente aquí. En vez de un único `<Canvas>` global `fixed`, **cada sección con 3D monta su propio `<Canvas>` pequeño** (`components/three/SceneCanvas.tsx`) como hijo normal/absoluto de esa sección. Motivo: los bugs de mobile de Fase 1 salieron precisamente de coordinar elementos `fixed` con Lenis y con el pin de ScrollTrigger; un canvas global `fixed` habría tenido que resolver ese mismo problema para el 3D. Un canvas por sección se pinea/escrollea automáticamente junto con su sección padre (es un hijo del DOM normal), sin necesidad de sincronizar manualmente con `scrollY`. El costo es reinicializar el contexto WebGL por sección — aceptable con solo 2-3 canvases en la página. Se pierde la posibilidad de que un objeto "viaje" entre secciones sin cortes; si eso se vuelve un requisito fuerte más adelante, se puede reconsiderar el canvas único con más cuidado en la sincronización.

## 3. Guion de scroll — sección por sección

Principio rector (de [02-brand-strategy.md](./02-brand-strategy.md#8-el-mensaje-que-no-se-debe-comunicar)): el scroll en sí mismo debe sentirse como el método — **entra con ruido, sale con claridad**.

### Sección 1 — Hero (`#hero`)

- **3D:** un campo de formas geométricas dispersas (arcos, trapecios, esferas — vocabulario mid-century en 3D) flotando con leve parallax de mouse/scroll. Representan "ruido/posibilidades" (preguntas del cliente ideal, ver [02](./02-brand-strategy.md#4-cliente-ideal-resumen-operativo)).
- **Texto:** headline revelado con GSAP (palabra por palabra o máscara de opacidad), sincronizado a los primeros ~20% del scroll de la sección.
- **Transición de salida:** las formas empiezan a moverse hacia un eje/orden al acercarse a `#differentiation` — primer indicio visual de "esto se está organizando".

### Sección 2 — Differentiation statement (`#differentiation`)

- Tratamiento tipográfico puro, sin 3D o con el campo de formas ya casi alineado en una sola línea horizontal detrás del texto (metáfora: de caos a orden empieza aquí).
- Scroll corto, alto impacto — no pinning largo.

### Sección 3 — Manifesto (`#manifesto`)

- Texto kinético grande (referencia directa `50-jahre-hitparade.ch`), scrub 1:1 con el scroll (ScrollTrigger `scrub: true`), fondo oscuro (Ink) para contraste editorial.
- Las formas 3D del hero pueden desvanecerse aquí o consolidarse en un único objeto simple que "sobrevive" hacia la siguiente sección (hilo visual de continuidad).

### Sección 4 — About Yez (`#about`)

- Predominancia de foto/video editorial sobre 3D — este es un momento **humano**, no tecnológico (regla de la filosofía Human+Tech: la humanidad aparece donde importa).
- Motion: parallax sutil de imagen + reveal de texto, sin 3D complejo. Mantener el Canvas de fondo casi inerte o apagado en este tramo.

### Sección 5 — The Next Move Method™ (`#method`)

- **Pieza central del sitio.** 3D con pinning: 4 objetos/estados geométricos correspondientes a Decode → Design → Execute → Advance, controlados con `ScrollControls` de drei o un `ScrollTrigger` con `pin: true` y 4 sub-tramos (`scrub` mapeado a progreso 0–1 dividido en 4).
- Cada paso: el objeto 3D se transforma visiblemente (ej. de una nube de puntos dispersos → una estructura ordenada → una forma "en construcción" → una forma final estable), coherente con la metáfora decode→design→execute→advance.
- Label activo (`01 / Decode`, etc.) resaltado en Signal Teal (color reservado para "capa tecnología", ver [05](./05-visual-design-system.md#3-paleta-placeholder)).
- Salida de la sección: liberar el pin, la forma final del método se mantiene como hilo hacia Human+Tech.

### Sección 6 — Human + Technology (`#human-tech`)

- Visualización de datos/nodos: dos columnas (Technology / Yez) con conexiones animadas — literalmente mostrar "inputs desordenados → filtrados por tecnología → interpretados por Yez → output claro". Puede ser 3D (nodos en `Canvas`) o un tratamiento 2D con GSAP si el presupuesto de performance no alcanza para otra escena 3D — **decisión a validar en fase de prototipo**, no comprometerse de antemano.
- Este es el punto exacto donde el copy "Technology for clarity. Human judgment for the decisions that matter." debe aparecer con máximo peso visual.

### Sección 7 — Services (`#services`)

- Selector Buy/Sell/Rent como tabs o cards — motion 2D (GSAP), 3D opcional muy ligero (ej. un ícono geométrico por servicio que rota/cambia al hacer hover/tap), pero **no** otro pinning largo — el brief pide que el usuario pueda actuar rápido aquí.

### Sección 8 — Why Yez / Strengths (`#why-yez`)

- Lista de 7 diferenciadores + fortalezas — tratamiento editorial (grid asimétrico, ver [05](./05-visual-design-system.md#5-vocabulario-de-forma)), motion de entrada por scroll (stagger GSAP), sin 3D dedicado — es un tramo de "lectura", no de espectáculo.

### Sección 9 — Credibility / Testimonios (`#credibility`)

- Editorial, tipografía + citas — mínimo motion, máxima confianza/legibilidad. Ningún elemento 3D — coherente con "la humanidad aparece donde importa" y con la seriedad de mostrar prueba social.

### Sección 10 — Profile Selector / Typeform (`#profile-selector`)

- Aquí el 3D/motion baja al mínimo — es el momento de conversión, no de espectáculo. Transición suave desde la sección anterior, Typeform embebido con estilo del design system (ver [07](./07-integrations-conversion-funnel.md)).

### Sección 11 — Contact / Footer (`#contact`)

- Cierre con la línea de marca ("The transaction ends. The relationship keeps moving.") con un último gesto de motion — opcionalmente el objeto 3D del método reaparece una última vez, quieto, como símbolo de resolución.

## 4. Performance y presupuesto técnico

- **Un solo WebGL context** (ver arquitectura arriba) — nunca montar/desmontar `<Canvas>` por sección.
- **Lazy/defer 3D:** cargar R3F y las escenas con `next/dynamic` (`ssr: false`) — Three.js no debe bloquear el first paint ni el LCP del hero textual.
- **Degradación mobile:** geometría reducida (menos polígonos/instancias), desactivar post-procesado pesado (bloom, DOF) en viewport < 768px o en GPUs de gama baja (detectar vía `navigator.hardwareConcurrency`/`deviceMemory` como heurística, con fallback conservador).
- **Reduced motion:** si `prefers-reduced-motion: reduce`, el Canvas 3D puede seguir montado pero estático (sin scroll-scrub), y todas las transiciones GSAP caen a fades cortos. Nunca ocultar contenido, solo el movimiento.
- **Presupuesto de FPS:** objetivo 60fps en desktop de gama media, degradación aceptable a 30fps en mobile gama media — monitorear con el panel de stats de three.js durante desarrollo, quitar antes de producción.
- **Accesibilidad:** todo el contenido narrativo debe existir en el DOM como texto real (no solo dentro de canvas/WebGL) para lectores de pantalla y SEO — el 3D es refuerzo visual, nunca el único portador del mensaje.

## 5. Orden de implementación sugerido (detalle en [08-build-roadmap.md](./08-build-roadmap.md))

1. Maquetar todas las secciones en HTML/Tailwind puro, sin motion — validar contenido, jerarquía, responsive.
2. Agregar Lenis + GSAP ScrollTrigger para motion 2D (reveals, parallax simple, pinning de `#method` sin 3D todavía — usar placeholders de color/forma en CSS).
3. Introducir R3F y sustituir los placeholders CSS por las escenas 3D reales, sección por sección, empezando por Hero y Method (las de mayor impacto).
4. Optimizar performance y mobile al final, con datos reales de Lighthouse/WebPageTest.
