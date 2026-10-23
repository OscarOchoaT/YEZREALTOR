"use client";

import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import { SITE, NAV_LINKS_I18N } from "@/content/site";
import { FOOTER_I18N } from "@/content/credibility";
import { useContent } from "@/i18n/LocaleProvider";

export default function Footer({ isHome = true }: { isHome?: boolean }) {
  const NAV_LINKS = useContent(NAV_LINKS_I18N);
  const FOOTER = useContent(FOOTER_I18N);
  return (
    <footer className="bg-cocoaBark px-6 py-12 text-bone sm:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:gap-12">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:gap-10">
          <nav className="grid grid-cols-2 gap-x-6 gap-y-1 border-b border-bone/10 pb-8 text-center sm:flex sm:flex-wrap sm:gap-x-8 sm:gap-y-3 sm:border-0 sm:pb-0 sm:text-left">
            {NAV_LINKS.map((link) => (
              <TransitionLink
                key={link.href}
                href={isHome ? link.href : `/${link.href}`}
                className="py-2.5 font-mono text-xs uppercase tracking-caption text-bone/80 hover:text-bone sm:py-0"
              >
                {link.label}
              </TransitionLink>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-1 border-b border-bone/10 pb-8 text-center font-mono text-xs uppercase tracking-caption text-bone/70 sm:items-start sm:gap-2 sm:border-0 sm:pb-0 sm:text-left">
            <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="py-1.5 hover:text-bone sm:py-0">
              Instagram {SITE.instagramHandle}
            </a>
            <a href={SITE.tiktokUrl} target="_blank" rel="noopener noreferrer" className="py-1.5 hover:text-bone sm:py-0">
              TikTok {SITE.tiktokHandle}
            </a>
            <a href={SITE.facebookUrl} target="_blank" rel="noopener noreferrer" className="py-1.5 hover:text-bone sm:py-0">
              Facebook {SITE.facebookLabel}
            </a>
            <a href={`mailto:${SITE.email}`} className="mt-3 py-1.5 text-bone/80 hover:text-bone sm:py-0">
              {SITE.email}
            </a>
            <a
              href={`https://wa.me/${SITE.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 text-bone/80 hover:text-bone sm:py-0"
            >
              {SITE.phone}
            </a>
          </div>
        </div>

        <div className="grid items-end gap-8 sm:border-t sm:border-bone/10 sm:pt-8 sm:grid-cols-[1fr_auto_1fr]">
          <span aria-hidden="true" className="hidden sm:block" />

          <div className="flex flex-col items-center gap-2 text-center">
            <Image
              src="/logo/logo-monogram-bone.png"
              alt="Yez The Realtor"
              width={327}
              height={368}
              className="mb-2 h-10 w-auto"
            />
            <span className="font-display !font-medium text-lg tracking-subhead text-bone">{FOOTER.tagline}</span>
            <div className="flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-caption text-bone/50">
              <span>© {new Date().getFullYear()}</span>
              <span aria-hidden="true">·</span>
              <span>Austin, Texas</span>
            </div>
            <nav aria-label={FOOTER.legalLabel} className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 sm:gap-x-8 sm:gap-y-3">
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
