/**
 * Not a v1 priority per the brief. Swap for a real Calendly inline embed
 * (or <CalendlyEmbed url="..." />) once the client wants post-Typeform
 * call booking wired up.
 */
export default function CalendlyPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-bone/20 px-6 py-8 text-center">
      <span className="font-mono text-[10px] uppercase tracking-caption text-stone">
        [Coming soon]
      </span>
      <p className="font-body text-sm font-light text-bone/70">
        Prefer to talk it through first? Call booking is on its way.
      </p>
    </div>
  );
}
