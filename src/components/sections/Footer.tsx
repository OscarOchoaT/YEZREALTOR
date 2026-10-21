"use client";

import TransitionLink from "@/components/TransitionLink";
import { SITE, NAV_LINKS_I18N } from "@/content/site";
import { FOOTER_I18N } from "@/content/credibility";
import { useContent } from "@/i18n/LocaleProvider";

export default function Footer({ isHome = true }: { isHome?: boolean }) {
  const NAV_LINKS = useContent(NAV_LINKS_I18N);
  const FOOTER = useContent(FOOTER_I18N);
  return (
    <footer className="bg-cocoaBark px-6 py-16 text-bone">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <div className="flex flex-col justify-between gap-10 sm:flex-row">
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {NAV_LINKS.map((link) => (
              <TransitionLink
                key={link.href}
                href={isHome ? link.href : `/${link.href}`}
                className="font-mono text-xs uppercase tracking-caption text-bone/80 hover:text-bone"
              >
                {link.label}
              </TransitionLink>
            ))}
          </nav>

          <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-caption text-bone/70">
            <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
              Instagram {SITE.instagramHandle}
            </a>
            <a href={SITE.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
              TikTok {SITE.tiktokHandle}
            </a>
            <a href={SITE.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
              Facebook {SITE.facebookLabel}
            </a>
            <a href={`mailto:${SITE.email}`} className="mt-3 text-bone/80 hover:text-bone">
              {SITE.email}
            </a>
            <a
              href={`https://wa.me/${SITE.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone/80 hover:text-bone"
            >
              {SITE.phone}
            </a>
          </div>
        </div>

        <div className="grid items-end gap-8 border-t border-bone/10 pt-8 sm:grid-cols-[1fr_auto_1fr]">
          <span aria-hidden="true" className="hidden sm:block" />

          <div className="flex flex-col items-center gap-2 text-center">
            <span aria-label="Yez The Realtor" className="mb-2 font-display text-6xl leading-none text-bone">Y</span>
            <span className="font-display !font-medium text-lg tracking-subhead text-bone">{FOOTER.tagline}</span>
            <div className="flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-caption text-bone/50 sm:flex-col sm:gap-2">
              <span>© {new Date().getFullYear()}</span>
              <span aria-hidden="true" className="sm:hidden">·</span>
              <span>Austin, Texas</span>
            </div>
            <nav aria-label={FOOTER.legalLabel} className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-3">
              {FOOTER.legal.map((doc) => (
                <a
                  key={doc.href}
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] uppercase tracking-caption text-bone/70 underline decoration-cognac decoration-1 underline-offset-4 hover:text-bone"
                >
                  {doc.label}
                </a>
              ))}
            </nav>
          </div>

          <span aria-hidden="true" className="hidden sm:block" />
        </div>
      </div>
    </footer>
  );
}
