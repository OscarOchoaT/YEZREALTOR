"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import TransitionLink from "@/components/TransitionLink";
import Magnetic from "@/components/Magnetic";
import { NAV_LINKS_I18N } from "@/content/site";
import { HERO_COPY_I18N } from "@/content/hero";
import { UI_I18N } from "@/content/ui";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useContent, useLang } from "@/i18n/LocaleProvider";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const lang = useLang();
  const NAV_LINKS = useContent(NAV_LINKS_I18N);
  const HERO_COPY = useContent(HERO_COPY_I18N);
  const ui = useContent(UI_I18N);
  const isHome = pathname === `/${lang}` || pathname === `/${lang}/`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 96);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-espresso py-3 shadow-sm shadow-black/20" : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <TransitionLink
          href={isHome ? "#hero" : "/"}
          className="flex items-center gap-2"
          aria-label={ui.homeAria}
        >
          {/* Same lockup at rest and scrolled — only its size/the header's padding
              shrink, so nothing swaps or flips. Source PNG is trimmed to its ink
              bounding box (the Canva export had huge transparent margins baked in). */}
          <Image
            src="/logo/logo-inverse.png"
            alt="Yez The Realtor"
            width={194}
            height={100}
            className={`w-auto transition-all duration-300 ${scrolled ? "h-10" : "h-14 sm:h-16"}`}
            priority
          />
        </TransitionLink>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <TransitionLink
              key={link.href}
              href={isHome ? link.href : `/${link.href}`}
              className="font-mono text-xs uppercase tracking-caption text-bone/80 transition-colors hover:text-bone"
            >
              {link.label}
            </TransitionLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
        <LanguageSwitcher />
        <Magnetic strength={0.3}>
          <TransitionLink
            href={isHome ? "#contact" : "/#contact"}
            className="inline-flex items-center justify-center border border-cognac bg-cognac px-5 py-2.5 font-mono text-xs uppercase tracking-caption text-bone transition-colors hover:border-siena hover:bg-siena"
          >
            {HERO_COPY.ctaPrimary}
          </TransitionLink>
        </Magnetic>
        </div>
      </div>
    </header>
  );
}
