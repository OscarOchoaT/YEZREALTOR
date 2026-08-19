# Integraciones y funnel de conversión

## 1. Journey completo (del brief, textual)

```
Website → Buyer / Seller / Rental (el usuario elige)
       → Llenan el formulario (Typeform)
       → Positioning Call si califican
       → Decode → Design → Execute → Advance
         (este método es el centro de la idea y el punto focal desde el que se inicia la relación)
```

El Typeform **no es un formulario de contacto genérico** — es el mecanismo de calificación que decide si alguien pasa a una Positioning Call. Debe presentarse con ese peso ("tu Client Profile"), nunca como "Contact Us".

## 2. Typeform

- **Typeform existente:** `https://form.typeform.com/to/DaucnE48` — no se reemplaza en v1, se integra.
- **Integración visual, no salida externa:** usar `@typeform/embed-react` (embed inline o slider/popup, a decidir en prototipo) dentro de `#profile-selector`, respetando la paleta y tipografía del sitio en lo que Typeform permita personalizar (colores de marca, fuente si el plan de Typeform lo soporta).
- **Segmentación de intención:** si el plan de Typeform lo permite, usar "hidden fields" o distintas URLs con querystring (`?intent=buy|sell|rent`) para que la primera pregunta del formulario ya sepa qué seleccionó el usuario en `#services` / `#profile-selector` — evita que el usuario repita la elección.
- **Nunca embeber como iframe crudo sin estilizar** — el brief es explícito: *"no debe parecer un recurso externo desconectado de la marca."*

## 3. WhatsApp

- **Canal de conversión principal** (declarado explícitamente en el brief, junto con Typeform).
- Número: `+1 (737) 341-2406`.
- Implementación sugerida: floating action button discreto (no intrusivo, coherente con el veto a "colección de botones") con `wa.me` link + mensaje pre-cargado contextual, ej.: `https://wa.me/17373412406?text=Hi%20Yez%2C%20I%27d%20like%20to%20start%20my%20Next%20Move.`
- Aparece de forma persistente pero visualmente ligera (icon-only, expande on hover/tap) — no compite con el CTA principal `Design My Next Move`.

## 4. Calendar / Scheduling

- Uso: agendar la **Positioning Call** *después* de que el Typeform califique al lead — no es un botón de "book a call" suelto en el hero.
- Herramienta no especificada en el brief — recomendación: Calendly o Cal.com embebido, estilizado, disparado desde la pantalla de "thank you" del Typeform o desde un correo/WhatsApp de seguimiento (fuera del scope de la landing en sí, pero la landing debe dejar el hook listo).
- **Pendiente de confirmación del cliente:** herramienta específica y disponibilidad — no bloquea el desarrollo de la landing, se puede lanzar v1 solo con Typeform + WhatsApp y agregar el embed de calendario después.

## 5. Reviews (Google Reviews / Realtor.com)

- Mostrar testimonios reales de forma editorial en `#credibility`, con enlace "Read more on Google →" / "Read more on Realtor.com →" hacia los perfiles reales.
- **No inventar ni parafrasear testimonios** — el contenido textual de las reseñas está pendiente de que el cliente lo comparta (ver [08-build-roadmap.md](./08-build-roadmap.md)). Mientras tanto, dejar la sección con placeholders claramente marcados como tal en el código (comentario o data mockeada obvia), nunca con reseñas inventadas que parezcan reales.

## 6. Analytics

Eventos mínimos a instrumentar (del brief, textual): **traffic, scroll depth, CTA clicks, Typeform starts, Typeform completion, booked calls, conversion rate.**

Propuesta de implementación (a validar herramienta con el cliente — GA4, Plausible, o similar; no especificado en el brief):

| Evento | Trigger | Notas |
|---|---|---|
| `page_view` | Carga de página | Estándar |
| `scroll_depth` | 25% / 50% / 75% / 100% del alto total | Útil para medir si el scrollytelling retiene atención |
| `cta_click` | Cualquier click en CTA primario/secundario | Incluir `label` y `section_id` como parámetros (ej. `hero`, `method`, `profile-selector`) |
| `whatsapp_click` | Click en FAB de WhatsApp | |
| `typeform_start` | Primera interacción con el embed | Typeform expone este evento vía su SDK/webhooks |
| `typeform_complete` | Submit exitoso | Idealmente con el `intent` (buy/sell/rent) como parámetro |
| `booked_call` | Confirmación en el calendario (si se integra) | Depende de la herramienta elegida |
| `section_view` | Sección entra en viewport (IntersectionObserver) | Para entender en qué punto del guion narrativo se pierde a la gente |

`conversion_rate` no es un evento — se calcula (typeform_complete / page_view, booked_call / typeform_complete) en el dashboard de analytics, no en el código.

## 7. Resumen de integraciones por prioridad

| Integración | Prioridad v1 | Bloqueante para lanzar |
|---|---|---|
| Typeform embebido | Crítica | Sí — es el corazón del funnel |
| WhatsApp FAB | Crítica | Sí — canal principal declarado |
| Analytics básico (page_view, cta_click, scroll_depth, typeform events) | Alta | No, pero fuertemente recomendado antes de lanzar |
| Reviews (Google/Realtor.com) | Media | No — puede lanzar con sección oculta o placeholder hasta tener el contenido real |
| Calendar/Scheduling embebido | Baja para v1 | No — puede resolverse post-Typeform por fuera de la landing inicialmente |
