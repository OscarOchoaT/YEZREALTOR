"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SERVICES } from "@/content/services";
import { useSource } from "@/components/SourceContext";
import { trackEvent } from "@/lib/analytics";
import { ConnectorOverlay, ConnectorLine } from "@/components/NodeConnector";
import DotGridBackground from "@/components/DotGridBackground";
import Eyebrow from "@/components/Eyebrow";
import type { ServiceId } from "@/content/services";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Aligned to the 3-column card grid below (thirds of the row).
const CARD_X: Record<ServiceId, number> = { buy: 16.67, sell: 50, rent: 83.33 };
const SOURCE_POINT = { x: 50, y: 0 };

export default function Services() {
  const { setSource } = useSource();
  const [hovered, setHovered] = useState<ServiceId | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useGSAP(
    () => {
      const cards = cardRefs.current.filter((el): el is HTMLAnchorElement => Boolean(el));
      const lines = lineRefs.current.filter((el): el is SVGLineElement => Boolean(el));
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set(cards, { clearProps: "all" });
        gsap.set(dotRef.current, { clearProps: "all" });
        gsap.set(lines, { strokeDasharray: "none" });
        return;
      }

      gsap.set(cards, { autoAlpha: 0, y: 24 });
      gsap.set(dotRef.current, { autoAlpha: 0, scale: 0 });
      lines.forEach((line) => {
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 30%",
          scrub: 1,
        },
      });

      tl.to(dotRef.current, { autoAlpha: 1, scale: 1, ease: "power2.out", duration: 0.3 }, 0);
      lines.forEach((line, i) => {
        tl.to(line, { strokeDashoffset: 0, ease: "none", duration: 0.6 }, 0.1 + i * 0.06);
      });
      tl.to(cards, { autoAlpha: 1, y: 0, ease: "power2.out", stagger: 0.08, duration: 0.7 }, 0.25);
    },
    { scope: sectionRef }
  );

  return (
    <section id="services" ref={sectionRef} className="relative bg-espresso px-6 py-24 sm:py-32">
      <DotGridBackground />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-4 text-center">
          <Eyebrow index="04" label="Strategy" />
        </div>
        <h2 className="mx-auto max-w-xl text-center font-display text-3xl tracking-headline text-bone sm:text-4xl">
          {SERVICES.headline}
        </h2>

        {/* Fan connector: all three strategies branch from the same method. */}
        <div className="relative mx-auto mt-14 hidden h-14 max-w-3xl sm:block">
          <ConnectorOverlay>
            {SERVICES.cards.map((card, i) => (
              <ConnectorLine
                key={card.id}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                from={SOURCE_POINT}
                to={{ x: CARD_X[card.id], y: 100 }}
                tone={hovered === card.id ? "cognac" : "stone"}
                strokeWidth={hovered === card.id ? 1.5 : 1}
                className={`transition-[stroke,opacity] duration-300 ${
                  hovered === card.id ? "opacity-70" : "opacity-30"
                }`}
              />
            ))}
          </ConnectorOverlay>
          <div ref={dotRef} className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cognac" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-2 sm:grid-cols-3">
          {SERVICES.cards.map((card, i) => (
            <a
              key={card.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              href="#contact"
              onClick={() => {
                setSource(card.id);
                trackEvent("service_card_click", { service: card.id });
              }}
              onMouseEnter={() => setHovered(card.id)}
              onMouseLeave={() => setHovered(null)}
              className={`group flex flex-col justify-between gap-10 rounded-2xl p-8 transition-transform hover:-translate-y-1 ${
                card.featured
                  ? "bg-cocoaBark text-bone sm:scale-105 sm:py-10"
                  : "border border-bone/10 bg-bone/[0.04] text-bone"
              }`}
            >
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[11px] uppercase tracking-caption text-cognac">0{i + 1}</span>
                <h3 className="font-display text-4xl tracking-headline">{card.label}</h3>
                <p className={`font-body text-sm font-light ${card.featured ? "text-bone/80" : "text-bone/70"}`}>
                  {card.description}
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-caption transition-colors ${
                  card.featured ? "text-bone group-hover:text-cognac" : "text-bone group-hover:text-cognac"
                }`}
              >
                {card.cta} <span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
