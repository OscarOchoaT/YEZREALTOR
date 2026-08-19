// Stand-in for the professional photography/video confirmed in the brief but not
// yet delivered (brief/08-build-roadmap.md#assets-pendientes-del-cliente).
// Uses the mid-century arch motif (brief/05-visual-design-system.md#5) instead of
// a generic gray box, and is clearly labeled so it's never mistaken for final art.
export function PlaceholderMedia({
  label,
  arch = true,
  className = "",
  cursor = "VIEW",
}: {
  label: string;
  arch?: boolean;
  className?: string;
  /** Word shown in the custom cursor pill on hover (see CustomCursor.tsx). Pass null to opt out. */
  cursor?: string | null;
}) {
  return (
    <div
      data-cursor={cursor ?? undefined}
      className={`relative flex aspect-[4/5] items-end justify-center overflow-hidden border border-stone/30 bg-linen ${
        arch ? "rounded-t-[999px]" : "rounded-2xl"
      } ${className}`}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "linear-gradient(160deg, var(--color-stone) 0%, var(--color-linen) 55%, var(--color-bone) 100%)",
        }}
      />
      <span className="relative mb-6 rounded-full border border-stone/30 bg-bone/80 px-3 py-1 text-center font-[family-name:var(--font-mono)] text-[11px] tracking-wide text-cocoa-bark/75">
        {label}
      </span>
    </div>
  );
}
