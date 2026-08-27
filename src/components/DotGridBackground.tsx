/**
 * Subtle scattered-dot texture for otherwise-flat Bone/Linen sections — pure
 * CSS radial-gradient, no images, no animation. Stone at very low opacity so
 * it reads as paper texture, not UI.
 */
export default function DotGridBackground({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 opacity-[0.07] ${className}`}
      style={{
        backgroundImage: "radial-gradient(circle, #A89B8A 1.4px, transparent 1.4px)",
        backgroundSize: "28px 28px",
      }}
    />
  );
}
