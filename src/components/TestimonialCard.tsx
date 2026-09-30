/** Reusable testimonial card — only ever fed real, verified review text. */
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
    <figure className="flex flex-col justify-between gap-6 rounded-2xl border border-bone/10 bg-bone/[0.04] p-8">
      <blockquote className="font-body text-lg font-light leading-relaxed text-bone/90">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="font-mono text-xs uppercase tracking-caption text-stone">
        {author}
        {detail ? ` · ${detail}` : ""}
      </figcaption>
    </figure>
  );
}
