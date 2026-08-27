/**
 * Subtle scattered-dot texture for otherwise-flat Bone/Linen sections — pure
 * CSS radial-gradient, no images. Stone at very low opacity so it reads as
 * paper texture, not UI. Drifts very slowly and continuously (one tile's
 * width over 50s) — not scroll-driven, so the site feels quietly "alive"
 * even before the user does anything; motion-safe: turns it off under
 * prefers-reduced-motion.
 */
export default function DotGridBackground({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 opacity-[0.07] motion-safe:[animation:grid-drift_50s_linear_infinite] ${className}`}
      style={{
        backgroundImage: "radial-gradient(circle, #A89B8A 1.4px, transparent 1.4px)",
        backgroundSize: "28px 28px",
      }}
    />
  );
}
