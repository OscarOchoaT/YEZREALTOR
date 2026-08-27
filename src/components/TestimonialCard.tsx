/**
 * Reusable testimonial card. Real testimonials are not written yet — do not
 * fabricate quotes. Pass `quote`/`author` once the client shares real ones;
 * until then <Credibility /> renders the empty state below instead of this.
 */
export default function TestimonialCard({
  quote,
  author,
  detail,
}: {
  quote: string;
  author: string;
  detail?: string;
}) {
  return (
    <figure className="flex flex-col justify-between gap-6 rounded-2xl bg-linen/50 p-8">
      <blockquote className="font-body text-lg font-light leading-relaxed text-cocoaBark/90">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="font-mono text-xs uppercase tracking-caption text-stone">
        {author}
        {detail ? ` · ${detail}` : ""}
      </figcaption>
    </figure>
  );
}
