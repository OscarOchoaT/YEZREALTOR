// Filmic noise texture over the whole viewport — cheap (one SVG data-URI tile,
// no canvas/JS), applied via mix-blend-mode so it reads as texture rather than
// a visible layer. Static content, no interactivity, so no "use client" needed.
// The drift keyframe is automatically frozen by the global
// `@media (prefers-reduced-motion: reduce)` rule in app/globals.css.
const NOISE_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch' />
        <feColorMatrix type='saturate' values='0' />
      </filter>
      <rect width='100%' height='100%' filter='url(#n)' />
    </svg>`
  );

export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="grain-overlay pointer-events-none fixed inset-0 z-40 opacity-[0.05] mix-blend-overlay"
      style={{ backgroundImage: `url("${NOISE_SVG}")` }}
    />
  );
}
