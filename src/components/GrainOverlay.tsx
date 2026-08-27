/**
 * Fixed, site-wide fine-grain texture — an SVG feTurbulence filter painted
 * once over a full-viewport rect, extremely low opacity. Static, not
 * re-seeded per frame: the goal is a printed/paper tactility that matches
 * the Bone/Linen palette (same intent as DotGridBackground's "reads as
 * paper texture, not UI"), not a moving film-grain effect, so there is
 * nothing here to gate behind prefers-reduced-motion. Pure CSS/SVG, no
 * images, negligible paint cost since it never repaints after first frame.
 */
export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 opacity-[0.035] mix-blend-overlay"
    >
      <svg className="h-full w-full">
        <filter id="yez-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#yez-grain)" />
      </svg>
    </div>
  );
}
