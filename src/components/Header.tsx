"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import TransitionLink from "@/components/TransitionLink";
import Magnetic from "@/components/Magnetic";
import { NAV_LINKS } from "@/content/site";
import { HERO_COPY } from "@/content/hero";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

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
          aria-label="Yez The Realtor — home"
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
              className="font-body text-sm font-medium text-bone/80 transition-colors hover:text-bone"
            >
              {link.label}
            </TransitionLink>
          ))}
        </nav>

        <Magnetic strength={0.3}>
          <TransitionLink
            href={isHome ? "#contact" : "/#contact"}
            className="inline-flex items-center justify-center rounded-full bg-glow px-5 py-2.5 font-body text-sm font-medium text-espresso transition-colors hover:bg-bone"
          >
            {HERO_COPY.ctaPrimary}
          </TransitionLink>
        </Magnetic>
      </div>
    </header>
  );
}
