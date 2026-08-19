"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { CTAButton } from "@/components/ui/CTAButton";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitLines } from "@/components/scroll/SplitLines";

export function About() {
  const mediaRef = useRef<HTMLDivElement>(null);
  const cinematicRef = useRef<HTMLDivElement>(null);
  const fullImageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Curtain wipe on the portrait placeholder, independent of Reveal's
      // fade/slide on the outer wrapper — the two compose into a more
      // deliberate "unveiling" entrance than a fade alone.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          mediaRef.current,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: mediaRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: mediaRef }
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Fullscreen cinematic capstone, desktop only (2026-08-19 "wow
      // moment" request). Deliberately a dedicated block AFTER the bio
      // content, not a retrofit of the existing image/text grid above:
      // pinning that grid would trap the bio paragraphs off-screen for the
      // whole pin duration since About isn't a single-viewport section.
      // Mobile skips it entirely (`hidden lg:block` below) rather than
      // getting a scaled-down version — same reasoning as every other pin
      // in this project (brief/06 — pinning full sections on mobile is
      // what caused the Fase 1 mobile bugs).
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.getById("about-cinematic")?.kill();

        const scrollCfg = {
          trigger: cinematicRef.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * 1.3,
          scrub: true,
          invalidateOnRefresh: true,
        };

        ScrollTrigger.create({
          id: "about-cinematic",
          ...scrollCfg,
          pin: true,
          pinSpacing: true,
        });

        // "Ken Burns" settle: starts zoomed in like an establishing shot,
        // eases out to rest as the pin progresses.
        gsap.fromTo(
          fullImageRef.current,
          { scale: 1.25 },
          { scale: 1, ease: "none", scrollTrigger: scrollCfg }
        );

        // Oversized typographic echo of the "Meet Yez" heading above —
        // arrives once the image has mostly settled, over the first ~70%
        // of the pin, then holds.
        gsap.fromTo(
          ".meet-yez-big",
          { opacity: 0, scale: 0.85, filter: "blur(6px)" },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              ...scrollCfg,
              end: () => "+=" + window.innerHeight * 0.9,
            },
          }
        );

        return () => ScrollTrigger.getById("about-cinematic")?.kill();
      });

      // Desktop + reduced-motion: the block is still visible (display is a
      // CSS breakpoint concern, not a motion one) but nothing above ever
      // runs for it, so the label needs an explicit static fallback or it
      // would stay invisible forever.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".meet-yez-big", { opacity: 1 });
      });

      return () => mm.revert();
    },
    { scope: cinematicRef }
  );

  return (
    <section id="about" className="bg-bone px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1fr_1.2fr] md:items-center md:gap-16">
        <Reveal y={32}>
          <div ref={mediaRef}>
            <PlaceholderMedia label="Photo pending — editorial portrait of Yez" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Kicker>
            Engineer by training. Entrepreneur by nature. Immigrant by
            experience. Pilot by soul. Realtor by purpose.
          </Kicker>

          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-black tracking-[-0.04em] text-cocoa-bark sm:text-4xl">
            <SplitLines>Meet Yez</SplitLines>
          </h2>

          <div className="mt-6 space-y-4 text-base leading-relaxed text-cocoa-bark/80 sm:text-lg">
            <p>I&apos;m Yez — Venezuelan, immigrant, licensed Realtor in Texas.</p>
            <p>
              Before real estate, I was trained as an electrical engineer, built
              businesses from scratch, and earned my private pilot&apos;s license.
              Every one of those worlds taught me the same lesson: before you
              move, you need to understand exactly where you stand, what the
              conditions are, and where you&apos;re headed.
            </p>
            <p>
              Since 2014 I&apos;ve been connected to real estate. Since 2024,
              I&apos;ve represented buyers and sellers across Texas with a
              license of my own. Along the way I learned that buying a home is
              rarely about the house — it&apos;s a strategic decision that can
              change a family&apos;s financial trajectory.
            </p>
            <p>
              As an immigrant, I know what it means to start over, work for
              stability, and build something that&apos;s truly yours in a new
              country. My work goes beyond opening doors: I help you understand
              your numbers, compare your options, protect your money, and use
              real estate as a real tool to build wealth.
            </p>
          </div>

          <CTAButton href="#method" variant="ghost" className="mt-8">
            Learn how I work →
          </CTAButton>
        </Reveal>
      </div>

      <div
        ref={cinematicRef}
        data-cursor="VIEW"
        className="relative mt-24 hidden min-h-screen overflow-hidden rounded-2xl lg:block"
      >
        <div
          ref={fullImageRef}
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, var(--color-stone) 0%, var(--color-linen) 55%, var(--color-bone) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-cocoa-bark/85 via-cocoa-bark/15 to-transparent"
        />
        <div className="relative flex h-full min-h-screen flex-col items-center justify-end pb-20">
          <span
            aria-hidden="true"
            className="meet-yez-big px-6 text-center font-[family-name:var(--font-display)] text-[4rem] font-black uppercase leading-none tracking-[-0.03em] text-bone opacity-0 sm:text-[7rem] lg:text-[9rem]"
          >
            Meet Yez
          </span>
          <span className="mt-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-bone/70">
            Photo pending — editorial portrait
          </span>
        </div>
      </div>
    </section>
  );
}
