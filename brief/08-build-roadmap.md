# Roadmap de construcción

## Fase 0 — Fundación (sin motion) ✅ completada

- [x] Configurar design tokens en `app/globals.css` con Tailwind v4 (`@theme`) — inicialmente con paleta/tipografía placeholder, **actualizado a la paleta y tipografía oficiales** de [05-visual-design-system.md](./05-visual-design-system.md) apenas llegó `brief/BRAND.pdf`.
- [x] `next/font` para tipografía display + body (+ mono para microcopy).
- [x] Estructura de carpetas `components/sections`, `components/ui`, `components/scroll` (ver [06](./06-3d-scrollytelling-tech-plan.md#2-arquitectura-de-componentes-propuesta)). `components/three` se crea en Fase 2.
- [x] Maquetar las 11 secciones de [04-information-architecture.md](./04-information-architecture.md) en HTML/Tailwind con el copy final de [03-content-copywriting.md](./03-content-copywriting.md).
- [x] Nav pill + WhatsApp FAB + CTA principal, funcionales (anclas de scroll). Nav pill ahora incluye el wordmark `Yez.` (`components/ui/Logo.tsx`).
- [x] Responsive base (mobile / tablet / desktop) para las 11 secciones.
- [x] Metadata SEO (`title`, `description`, OpenGraph) según [03-content-copywriting.md](./03-content-copywriting.md#seo--metadata-sugerida).

## Fase 1 — Motion 2D ✅ completada

- [x] Instalar y configurar Lenis (smooth scroll) + sincronización con GSAP ScrollTrigger (`components/scroll/SmoothScrollProvider.tsx`, registro central en `lib/gsap.ts`).
- [x] Reveals de texto/imagen por sección (fade/slide, `components/scroll/Reveal.tsx`) en todas las secciones excepto Manifesto/Method (tienen su propio motion, ver abajo).
- [x] Texto kinético del manifiesto (`SplitText`, palabra por palabra, scrubbed al scroll).
- [x] Pinning del `#method` con 4 sub-estados vía `ScrollTrigger.create({ pin: true, scrub: 1 })` — placeholder 2D (opacity/scale) en vez de 3D real, tal como estaba planeado; la transformación 3D real es Fase 2.
- [x] `prefers-reduced-motion` respetado vía `gsap.matchMedia()` en `Reveal`, `Manifesto` y `Method` — sin motion, contenido estático visible.

**Nota de assets:** con `brief/BRAND.pdf` ya no faltan colores ni tipografías (ver tabla actualizada abajo) — solo sigue pendiente el archivo vectorial del logo y las fotos/videos.

## Fase 2 — 3D ⏸️ pausada / revertida (segundo intento, 2026-08-19)

Se implementó originalmente (Hero + Method con React Three Fiber, gating a desktop 1024px+, canvas por sección en vez de global) pero **el resultado visual en desktop no funcionó** ("se ve horrible") y, como el 3D estaba gateado a desktop, no aportaba nada en mobile — que es la prioridad del proyecto. Se revirtió entonces: `Hero.tsx` y `Method.tsx` volvieron a su versión CSS-only de Fase 1.

**2026-08-19, segundo round:** el usuario pidió explícitamente traer el 3D de vuelta como parte del pase de inmersión (Fase 5). Se re-habilitó reusando el mismo código (código-splitting con `next/dynamic(..., {ssr:false})` + gate por `useDesktopMotion()`, para que mobile nunca descargue el chunk de three.js). El usuario lo vio y **rechazó ambas escenas, una por una, el mismo día**:
- Escena de Method (widget 80×80px junto al contador de paso): "ese circulo de ahi de la derecha quitalo" → removida.
- Escena de Hero (formas geométricas flotando de fondo): "esas figuritas no me gustan" → removida.

**Conclusión con dos intentos fallidos en el mismo proyecto: el 3D con React Three Fiber no encaja con la dirección visual que el usuario quiere para este sitio.** No es un problema de implementación (el código en sí no tuvo bugs, ambas veces se rechazó por gusto visual) — es una señal de dirección de arte. `Hero.tsx` y `Method.tsx` están otra vez en su versión 100% CSS/GSAP (la de la Fase 5). El código de `components/three/*` queda en el repo sin usarse desde ninguna sección; no volver a proponerlo por defecto — si en algún futuro se retoma 3D, que sea porque el usuario lo pide de nuevo explícitamente, no porque parezca "lo más inmersivo posible".

- [x] `@react-three/fiber`, `@react-three/drei`, `three`, `@types/three` — instalados, sin usar (segunda vez que quedan sin uso).
- [x] Infraestructura de Canvas (`SceneCanvas`, `useDesktopMotion`, `CanvasErrorBoundary`) — construida, probada dos veces, sin uso activo.
- [x] Escena Hero y escena Method — construidas, **rechazadas visualmente las dos, revertidas 2026-08-19**.
- [x] Decidido: `#human-tech` se queda en 2D reforzado (no 3D) — nunca se tocó, sigue así.
- [x] QA de performance — ya no aplica, no hay 3D activo.

**Próximo foco, según feedback directo del cliente: mobile es la prioridad.** Antes de retomar 3D, priorizar Fase 3 (conversión/integraciones) y pulido general de la experiencia mobile.

## Fase 3 — Conversión e integraciones ✅ mayormente completada

- [x] Embed de Typeform (`@typeform/embed-react`) en `#profile-selector` (`components/ui/TypeformEmbed.tsx`) — ya no se abre en pestaña externa. Segmentación de intención vía **hidden field** (`hidden={{ intent }}`): los 3 tabs Buy/Sell/Rent de `#profile-selector` cambian el hidden field y remontan el widget (`key={active}`).
- [x] Todos los CTAs que antes abrían Typeform en pestaña externa (nav pill, Hero, Services) ahora anclan a `#profile-selector` — la experiencia se queda dentro del sitio, como pedía el brief ("no debe parecer un recurso externo desconectado de la marca").
- [x] WhatsApp FAB — ya tenía deep link con mensaje precargado desde Fase 0; se le agregó tracking de click.
- [x] Analytics — scaffold agnóstico de proveedor (`lib/analytics.ts`, `track()` → `window.dataLayer`, la convención que leen tanto GA4 como GTM). Empieza a funcionar solo con agregar el snippet de GA4/GTM en `app/layout.tsx`, sin tocar este código. Eventos ya instrumentados: `cta_click` (todos los `CTAButton`), `whatsapp_click`, `scroll_depth` (25/50/75/100%), `section_view` (una vez por sección), `typeform_start`/`typeform_complete`/`typeform_ready`.
- [x] Sección de reviews con placeholders — ya estaba desde Fase 0 (`#credibility`).
- [x] El intent elegido en `#services` viaja automáticamente al tab de `#profile-selector` — resuelto con un `IntentContext` compartido (`lib/intent-context.tsx`, `IntentProvider` envolviendo la página en `app/page.tsx`), en vez de `useSearchParams` + `Suspense` (se evitó esa ruta a propósito: sin URL/history surface, sin riesgo de hidratación). `Services.tsx` y `ProfileSelector.tsx` leen/escriben el mismo estado vía `useIntent()`.
- [ ] Confirmar con el cliente la herramienta de analytics real (GA4 vs GTM vs otra) para pegar el snippet correspondiente.
- [ ] Confirmar con el cliente el plan/cuenta de Typeform — el hidden field `intent` requiere que exista un campo oculto con ese nombre configurado en el formulario real para que el dato se guarde en las respuestas.

## Fase 4 — Pulido y QA final 🚧 en curso

- [x] **Auditoría de contraste (WCAG AA)** — se calculó la relación de contraste exacta (fórmula WCAG) de cada combinación color de texto / fondo realmente usada en el sitio contra los hex reales de `brief/BRAND.pdf`. Se encontraron y corrigieron fallas reales:
  - Labels en fondo oscuro (`text-cognac`/`text-siena` sobre `bg-cocoa-bark`) dabann ~1.2–1.9:1 (necesitan 4.5:1) — en `HumanTech.tsx` y `Contact.tsx` se cambiaron a `text-stone` / `text-bone` (~5:1–12:1).
  - Varios textos pequeños con opacidad baja (`/50`, `/60`, incluyendo el disclaimer legal del footer) daban 2.85–4.19:1 — se subieron a `/70`–`/80` en `Services.tsx`, `ProfileSelector.tsx`, `Credibility.tsx`, `WhyYez.tsx`, `PlaceholderMedia.tsx`, `Contact.tsx`. Todo el texto del sitio pasa AA (4.5:1 para texto normal) ahora.
  - Nota para [05-visual-design-system.md](./05-visual-design-system.md#3-paleta-oficial-fuente-briefbrandpdf-p19-21): Cognac/Siena como texto **solo funcionan sobre fondos claros** (Bone/Linen) — sobre Cocoa Bark hay que usar Stone o Bone.
- [x] **Foco de teclado** — no había nada removiéndolo (ningún `outline-none`); se agregó un anillo de foco de marca (`:focus-visible` en cognac) en `app/globals.css` en vez del azul por defecto del navegador.
- [x] `prefers-reduced-motion` — ya cubierto desde Fase 1/2 (`gsap.matchMedia()` en `Reveal`, `Manifesto`, `Method`).
- [x] "Texto real en el DOM fuera de canvas" — no aplica: el 3D quedó revertido (Fase 2), no hay canvas activo.
- [x] Auditoría de las 12 reglas de "qué evitar visualmente" ([02](./02-brand-strategy.md#10-qué-no-hacer-nunca-checklist-de-veto-visual-y-de-contenido)) — revisado el copy y los componentes: sin emojis, sin frases tipo "Your trusted realtor"/"Dream home"/"Buy·Sell·Invest", sin dorado/neones/gradientes tech genéricos, máximo un CTA primario por sección (nav pill + WhatsApp FAB son las únicas piezas persistentes, explícitamente permitidas por el brief). Los puntos sobre fotos/llaves/handshakes no aplican todavía — no hay fotografía real cargada.
- [x] Journey estructural verificado por código: todos los `href="#..."` del sitio (`#hero`, `#method`, `#services`, `#about`, `#profile-selector`) resuelven a un `id` real en la página (confirmado vía build de producción + inspección del HTML). La confirmación real del Typeform (submit → thank you screen) requiere una prueba manual tuya — no puedo simular un envío real sin crear un lead falso en tu cuenta.
- [ ] **Cross-browser, especialmente Safari** — no verificable desde este entorno (sin navegador disponible esta sesión). Ya no es crítico por WebGL (3D revertido), pero sigue aplicando a Lenis/ScrollTrigger/`backdrop-blur`/el iframe de Typeform, y ahora también a `mix-blend-mode` (grain overlay) y `clip-path` (About). Pedirte que lo prueves en Safari (iPhone y/o Mac) es el siguiente paso real aquí.

## Fase 5 — Pase de inmersión ("otro planeta") 🚧 hecho localmente, sin verificar visualmente

Pedido explícito del usuario (no del cliente): llevar el motion mucho más lejos, "ultra inmersivo". Primera pasada (más abajo) se quedó en 2D/CSS/GSAP a propósito, evitando la ruta 3D que se había revertido en Fase 2. El usuario preguntó explícitamente por el 3D después, así que se re-habilitó también — ver Fase 2 arriba para el detalle de qué cambió respecto al intento original. Todo construido y validado solo con `npm run build` + `npm run lint` (limpios) — **sin navegador disponible esta sesión**, así que nada de esto está confirmado visualmente todavía. Revisar en el navegador antes de darlo por bueno, y el 3D de Hero/Method en particular ya se equivocó una vez por esto mismo.

Piezas nuevas (`components/ui/`, `components/scroll/`):
- `GrainOverlay` — textura de grano de película fija sobre todo el viewport (SVG feTurbulence, `mix-blend-mode: overlay`, `pointer-events-none`).
- `ScrollProgress` — barra de 3px arriba de todo, progreso del documento completo vía ScrollTrigger.
- `CustomCursor` — anillo + punto que siguen el mouse, solo en `hover:hover and pointer:fine` + sin `prefers-reduced-motion`. Deliberadamente aditivo: nunca esconde el cursor nativo (`cursor:none`), así que si algo falla el puntero real sigue funcionando.
- `AuroraField` — blobs de gradiente animados (transforms + blur, sin WebGL) en variante `light`/`dark`; reemplaza los círculos estáticos del Hero y se reusa en Manifesto, HumanTech y Contact para cohesión visual.
- `IntroCurtain` — cortina de marca en la primera carga que se abre para revelar el Hero. **Decisión importante:** no bloquea el scroll (`overflow:hidden`) a propósito — Lenis sigue corriendo por debajo y un lock hubiera podido causar un salto de scroll al liberarse (el scroll virtual de Lenis sigue acumulando input mientras el real está bloqueado). Se aceptó el riesgo cosmético menor de que alguien scrollee en los ~1.3s de la intro.
- `TiltIn` (`components/scroll/`) — como `Reveal` pero con flip 3D (`rotateX` + `perspective`) en vez de fade plano; usado en las tarjetas de `WhyYez`.
- `Marquee` (`components/ui/`) — ticker infinito en CSS puro, usado en `Credibility` con datos que ya existían en el sitio (licencia, bilingüe, desde 2014, etc. — **no** testimonios inventados, sigue la regla de veto del brief).

Por sección:
- **Hero**: `AuroraField` reemplaza los círculos estáticos; parallax de contenido/aurora a distinta velocidad; scroll cue animado que se desvanece.
- **Manifesto**: el reveal palabra-por-palabra pasó de solo-opacidad a opacidad+blur (4px→0); `AuroraField dark` de fondo.
- **Method**: el pin desktop-only ahora tiene tarjetas con flip 3D real (`perspective` en el `<ol>`, `preserve-3d` en cada `<li>`), un riel de progreso de 4 segmentos, un contador de paso en vivo (número grande, actualizado vía `onUpdate` del ScrollTrigger existente, sin re-renders de React), y una grilla técnica de fondo muy sutil.
- **WhyYez**: las 8 tarjetas de "strengths" usan `TiltIn` en vez de fade plano.
- **Differentiation**: scrub de escala+blur ("entra en foco") sobre el fade existente de `Reveal`.
- **Services**: el subrayado de tabs ahora es un indicador que se desliza (medido con `offsetLeft/offsetWidth`, no CSS estático) + crossfade del panel de contenido al cambiar de tab.
- **ProfileSelector**: pulso de escala al tocar un tab de intención; fade del wrapper del embed de Typeform al remontar (ya remontaba por `key={active}`, ahora esa transición es más suave).
- **Credibility**: `Marquee` con datos reales del sitio, debajo del placeholder de testimonios.
- **HumanTech**: `AuroraField dark`, línea "puente" pulsante entre las columnas Technology/Yez, stagger de entrada por ítem de lista.
- **About**: el placeholder de foto ahora tiene un "curtain wipe" (`clip-path: inset()`) además del fade/slide de `Reveal`.
- **Contact**: `AuroraField dark` como cierre visual, haciendo eco del Hero.
- **NavPill**: ahora es client component — se encoge/oscurece al hacer scroll, y resalta el link de la sección activa vía `IntersectionObserver`.
- **WhatsAppFAB**: anillo tipo "sonar" pulsante alrededor del botón.

Todo sigue el mismo patrón ya establecido en el proyecto: `gsap.matchMedia()` con rama explícita `prefers-reduced-motion: reduce` (sin motion, no solo "más lento"), nada de pines nuevos fuera de `lg:` (1024px+), y transforms/opacity/filter en vez de propiedades que disparan layout. `CustomCursor` y el drift del grain están gateados a desktop con mouse real para no costar nada en mobile — que sigue siendo la prioridad del cliente.

**Pendiente real:** verificar todo esto en un navegador de verdad (no hubo herramienta de navegador disponible esta sesión). Antes de considerar esta fase "terminada", revisar especialmente: contraste de texto sobre las zonas donde pasan los blobs de `AuroraField`, que el `IntroCurtain` no deje un flash raro en la primera carga, y que el cursor personalizado no se sienta desfasado del puntero real.

## Fase 6 — Motion system + microinteracciones dirigidas (2026-08-19, tarde)

Brief explícito del usuario: **no rediseñar, no tocar estructura/contenido/branding**, solo llevar el motion existente a nivel "estudio creativo premium" con un sistema coherente en vez de números sueltos por componente. Sin cambios de layout — todo lo de abajo es motion sobre los mismos elementos/copy que ya existían.

- [x] **`lib/motion.ts`** — vocabulario de motion compartido: `EASE` (out/outFast/scrub/inOut/cinematic), `DURATION` (fast/base/slow/slower), `STAGGER` (tight/base/loose), `SCROLL_ENTER`. Usa únicamente eases nativos de GSAP (`power3.out`, `expo.out`, etc.), no un `CustomEase` a medida — un bezier mal formado en un `CustomEase.create()` de `lib/gsap.ts` tiraría toda la web abajo al registrarse, y ese archivo se importa desde todas partes; no vale la pena el riesgo por una curva cosmética, sobre todo sin navegador para probarla. `Reveal` y `TiltIn` ya usan estos tokens (mismo comportamiento visual, solo formalizado).
- [x] **`components/scroll/SplitLines.tsx`** — reveal cinético línea por línea (`SplitText` con `mask:"lines"`, cada línea entra desde detrás de una máscara) para headings de sección. Aplicado a los `<h2>` principales de Differentiation, Method, WhyYez, Services, ProfileSelector, Credibility, HumanTech, Contact y About — Manifesto se dejó con su propio tratamiento palabra-por-palabra (Fase 1/5), no se dobló.
- [x] **Hero — entrada cinematográfica reconstruida**: en vez de 3 bloques `Reveal` independientes con delays sueltos, ahora es un único timeline coreografiado (kicker → headline por líneas vía `SplitText` directo, no `SplitLines` — necesitaba integrarse al timeline maestro, no tener su propio ScrollTrigger compitiendo → subtítulo → CTAs con stagger). **Timing acoplado a `IntroCurtain`**: el timeline del Hero arranca a 1.25s, el momento exacto en que la cortina de marca empieza a deslizarse hacia arriba — así la composición se ve construyéndose mientras la cortina se retira, no ya terminada detrás de ella. Ambos archivos tienen comentarios cruzados documentando este acople; si se cambia el timing de uno hay que actualizar el otro.
- [x] **`lib/useMagnetic.ts`** — hover magnético sutil (el elemento sigue levemente al cursor) gateado a `hover:hover and pointer:fine` + sin `prefers-reduced-motion` — cero listeners en touch/reduced-motion, no solo desactivado visualmente. Aplicado a `CTAButton` variantes `primary`/`secondary` (no `ghost`, que es un link de texto inline — el magnetismo ahí se sentiría como un bug).
- [x] **`CTAButton`** — `primary`/`secondary` suman magnetic pull + `hover:scale-[1.03]`/`active:scale-[0.97]`; `ghost` cambió su `underline` estático por `.link-underline` (barrido animado, ver `app/globals.css`).
- [x] **`.link-underline`** (`app/globals.css`) — utilidad CSS para el barrido de subrayado en hover/focus, aplicada también a los links del footer (`Contact.tsx`) y "Read more on..." (`Credibility.tsx`).
- [x] Hover adicional de bajo riesgo: `Method` cards suman `hover:border-cognac/50` (solo color, sin transform — las cards ya reciben transforms de GSAP durante el pin, así que un hover con transform podría pelear con el scrub); botones de intención en `ProfileSelector` suman `hover:scale-[1.04]`. **Bug real encontrado y corregido en el camino**: el pulso de click en `ProfileSelector` dejaba un `transform: scale(1)` inline que silenciaba el `hover:scale` de Tailwind para siempre después del primer click — se arregló con `clearProps: "scale"` al terminar el tween.
- [x] `TiltIn` (usado en `WhyYez`) suma `hover:-translate-y-1` — las cards ya no dependen solo del reveal de entrada.

**Deliberadamente NO tocado / fuera de alcance esta vez:**
- Transiciones de "continuidad" tipo mask/clip-path *entre* secciones (una imagen que cruza el límite, un fondo que se transforma de una sección a la siguiente) — el brief pidió explícitamente no tocar estructura salvo que fuera estrictamente necesario, y ese tipo de efecto casi siempre requiere solaparse/reposicionar secciones. La continuidad visual que sí existe es más suave: `AuroraField` reaparece en Hero/Manifesto/HumanTech/Contact con la misma paleta, dando un hilo conductor sin tocar layout.
- No se introdujo Framer Motion — GSAP ya cubre todo lo pedido (ScrollTrigger, SplitText, timelines) y ya es la única librería de motion en el proyecto; sumar una segunda hubiera violado el "no dependencias innecesarias" del brief.
- 3D: sigue fuera (ver Fase 2) — dos rechazos visuales en el mismo día no se revisan por defecto.

**Pendiente real (igual que siempre en este proyecto):** nada de esto se vio en un navegador real esta sesión — sí se armó y se corrió `npm run build` + `npm run lint` limpios, y se hizo un sanity check por SSR (curl a un dev server local, sin errores en el HTML). Mientras trabajaba se detectó un `npm run dev` ya corriendo con actividad real de navegador en el log — probablemente el usuario viéndolo en vivo — y se detuvo sin querer al hacer la verificación propia; avisado en el chat.

---

## Assets pendientes del cliente

`brief/BRAND.pdf` (recibido) resolvió paleta y tipografía. Lo que queda pendiente:

| Asset | Estado | Bloquea |
|---|---|---|
| Logotipo (archivo vectorial) | Brand book define su construcción, pero **no se adjuntó el .svg/.ai** | Hoy el wordmark se renderiza en texto (`components/ui/Logo.tsx`) siguiendo la especificación — reemplazar por el vector real en Nav, footer, favicon, OG image |
| Coolvetica (tipografía display real) | Brand book la especifica pero no es embebible vía Google Fonts; hoy corre el fallback oficial (Rubik Black 900) | `--font-display` en `app/globals.css` / `app/layout.tsx` — swap a `next/font/local` cuando llegue el archivo con licencia |
| ✅ Paleta de colores | Recibida en `brief/BRAND.pdf` — ya aplicada | — |
| ✅ Tipografías (Hanken Grotesk, JetBrains Mono) | Recibidas — ya aplicadas vía `next/font/google` | — |
| Fotografías profesionales | "Sí, disponibles" según brief original — no adjuntas todavía | Hero, About, transiciones editoriales |
| Videos profesionales | "Sí, disponibles" según brief original — no adjuntos todavía | B-roll de fondo, posible sección About |
| Testimonios (texto real) | Pendiente — se quiere pull de Google Reviews / Realtor.com | Sección `#credibility` — lanzar con placeholder marcado mientras tanto |
| Nombre de brokerage + # de licencia | No mencionado en el brief | Disclaimer legal del footer |
| Herramienta de Calendar/Scheduling | No especificada | Fase 3, no bloquea v1 |
| Herramienta de Analytics | No especificada (GA4 asumido como default razonable) | Fase 3 |
| Plan/cuenta de Typeform (para hidden fields / estilos) | Typeform existe, pero no se confirmó nivel de plan | Nivel de personalización del embed |

**Nota de proceso:** cuando lleguen más archivos, actualizar directamente [05-visual-design-system.md](./05-visual-design-system.md) y esta tabla — no crear documentos nuevos duplicados.

---

## Checklist de fidelidad al brief (usar antes de dar cualquier sección por "terminada")

Por cada sección construida, verificar:

1. ¿El copy es el aprobado en [03-content-copywriting.md](./03-content-copywriting.md), o una variación menor justificada?
2. ¿Refuerza al menos uno de los 5 conceptos del territorio verbal (Design, Intention, Clarity, Ownership, Belonging)?
3. ¿Evita los 12 elementos vetados visualmente ([02](./02-brand-strategy.md#10-qué-no-hacer-nunca-checklist-de-veto-visual-y-de-contenido))?
4. ¿El motion, si existe, comunica algo del método (orden, claridad, transformación) y no es decorativo?
5. ¿Funciona igual de bien — mismo mensaje, sin 3D — en mobile y con `prefers-reduced-motion`?
6. ¿Hay como máximo un CTA primario visible por viewport?
