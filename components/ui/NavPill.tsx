"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { navLinks } from "@/lib/site-config";

export function NavPill() {
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="fixed left-6 top-5 z-50">
        <Logo />
      </div>

      <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <nav
          className={`flex items-center gap-1 rounded-full border border-stone/30 bg-bone/90 px-2 py-2 shadow-[0_1px_0_rgba(0,0,0,0.03)] backdrop-blur transition-[box-shadow,background-color] duration-300 ${
            scrolled ? "bg-bone/95 shadow-md backdrop-blur-md" : ""
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hidden rounded-full px-4 py-2 font-[family-name:var(--font-body)] text-sm font-medium transition-colors sm:block ${
                activeHref === link.href
                  ? "bg-cocoa-bark/5 text-cocoa-bark"
                  : "text-cocoa-bark/80 hover:bg-cocoa-bark/5 hover:text-cocoa-bark"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#profile-selector"
            className="rounded-full bg-cognac px-4 py-2 font-[family-name:var(--font-body)] text-sm font-medium text-bone transition-colors hover:bg-siena sm:px-5"
          >
            Design My Next Move
          </Link>
        </nav>
      </div>
    </>
  );
}
