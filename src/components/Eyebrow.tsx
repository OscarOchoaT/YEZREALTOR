/**
 * Shared "NN · LABEL" eyebrow tag used at the top of every major section.
 * The two-digit index matches ScrollCompass's stop numbers (see
 * ScrollCompass.tsx STOPS) — small deliberate cohesion detail so a visitor
 * scrolling past the fixed instrument on the right and the section eyebrow
 * on the left are reading the same numbering system, not two unrelated ones.
 */
export default function Eyebrow({
  index,
  label,
  align = "center",
}: {
  index: string;
  label: string;
  align?: "center" | "left";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-caption ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      <span className="text-stone">{index}</span>
      <span className="text-bone/25" aria-hidden="true">
        /
      </span>
      <span className="text-cognac">{label}</span>
    </span>
  );
}
