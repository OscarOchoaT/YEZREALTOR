import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitLines } from "@/components/scroll/SplitLines";
import { Marquee } from "@/components/ui/Marquee";

// Testimonial copy is pending real content from Google Reviews / Realtor.com
// (brief/08-build-roadmap.md#assets-pendientes-del-cliente) — never invent quotes.
const reviewSources = [
  { label: "Google Reviews", href: "#" },
  { label: "Realtor.com", href: "#" },
];

// Facts already stated elsewhere on the site (About, Hero, footer), not new
// claims — the marquee just resurfaces them as a ticker. No invented
// testimonials, per the brand veto checklist (brief/02 §10).
const trustMarks = [
  "Licensed in Texas",
  "Bilingual — English / Español",
  "Connected to real estate since 2014",
  "Austin & Central Texas",
  "Full transaction representation",
  "The Next Move Method™",
];

export function Credibility() {
  return (
    <section id="credibility" className="bg-bone px-6 py-24 sm:px-10 sm:py-32">
      <Reveal className="mx-auto max-w-3xl text-center">
        <Kicker>Licensed. Active. Trusted.</Kicker>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-black tracking-[-0.04em] text-cocoa-bark sm:text-4xl">
          <SplitLines>Licensed Real Estate Agent, Texas.</SplitLines>
        </h2>
        <p className="mt-4 text-base text-cocoa-bark/70 sm:text-lg">
          Connected to real estate since 2014. Actively representing clients
          across Texas since 2024.
        </p>

        <div className="mt-14 rounded-2xl border border-dashed border-stone/30 bg-linen/60 p-8 text-sm text-cocoa-bark/75">
          Client testimonials pending — will be pulled editorially from Google
          Reviews and Realtor.com.
        </div>

        <Marquee
          items={trustMarks}
          className="mt-10 border-y border-stone/20 py-4 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
        />

        <div className="mt-8 flex justify-center gap-6 text-sm font-medium text-cocoa-bark/75">
          {reviewSources.map((r) => (
            <a
              key={r.label}
              href={r.href}
              className="link-underline hover:text-cocoa-bark"
            >
              Read more on {r.label} →
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
