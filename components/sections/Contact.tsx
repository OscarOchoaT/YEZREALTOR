import { Logo } from "@/components/ui/Logo";
import { AuroraField } from "@/components/ui/AuroraField";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitLines } from "@/components/scroll/SplitLines";
import { site, socials, whatsappHref } from "@/lib/site-config";

export function Contact() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-cocoa-bark px-6 py-20 text-bone sm:px-10"
    >
      <AuroraField variant="dark" />

      <Reveal className="relative mx-auto max-w-5xl">
        <Logo tone="light" />

        <h2 className="mt-8 font-[family-name:var(--font-display)] text-3xl font-black tracking-[-0.04em] sm:text-5xl">
          <SplitLines>Design My Next Move</SplitLines>
        </h2>

        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          <div>
            <span className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-stone">
              Reach out
            </span>
            <ul className="mt-4 space-y-2 text-base text-bone/80">
              <li>
                <a href={whatsappHref} className="link-underline hover:text-bone">
                  Message Yez on WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="link-underline hover:text-bone">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-stone">
              Follow
            </span>
            <ul className="mt-4 space-y-2 text-base text-bone/80">
              <li>
                <a href={socials.instagram.href} className="link-underline hover:text-bone">
                  Instagram — {socials.instagram.label}
                </a>
              </li>
              <li>
                <a href={socials.tiktok.href} className="link-underline hover:text-bone">
                  TikTok — {socials.tiktok.label}
                </a>
              </li>
              <li>
                <a href={socials.facebook.href} className="link-underline hover:text-bone">
                  Facebook — {socials.facebook.label}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-stone">
              Based in
            </span>
            <p className="mt-4 text-base text-bone/80">{site.city}</p>
          </div>
        </div>

        <div className="mt-16 border-t border-bone/15 pt-8">
          <p className="font-[family-name:var(--font-display)] text-xl font-medium tracking-[-0.02em] text-bone">
            The transaction ends. The relationship keeps moving.
          </p>
          <p className="mt-3 text-xs text-bone/75">
            What&apos;s next: The Ownership Circle — coming soon.
          </p>
          <p className="mt-6 text-xs text-bone/80">
            Licensed Real Estate Agent in the State of Texas. Brokerage name and
            license number pending client confirmation.
          </p>
        </div>
      </Reveal>
    </footer>
  );
}
