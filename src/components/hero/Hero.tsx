"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { HERO_WORDS, HERO_NODES, HERO_COPY } from "@/content/hero";
import Magnetic from "@/components/Magnetic";
import HeroCanvas, { type HeroCanvasHandle } from "@/components/hero/HeroCanvas";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Tailwind's `lg` breakpoint (1024px) is the desktop/mobile split for the hero
// choreography — keep in sync with the `lg:` classes used in the JSX below.
const DESKTOP_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const MOBILE_QUERY = "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)";
const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// Sparse, hand-picked word pairs — a constellation, not a dense web. Visible
// only briefly while words are still scattered, before Phase A migration.
const CONNECTOR_PAIRS: [string, string][] = [
  ["budget", "down-payment"],
  ["career", "timing"],
  ["location", "lifestyle"],
  ["family", "next-chapter"],
  ["priorities", "future-plans"],
  ["risk", "growth"],
];

// Same four colors HeroCanvas's WebGL particles use, so this reads as one
// consistent network rather than two unrelated systems.
const ANCHOR_DOT_CLASSES = ["bg-cognac", "bg-siena", "bg-stone", "bg-cocoaBark"];
const ANCHOR_DIST = 30; // px

/** A short tether + square dot from a word's own center, styled to match
 * HeroCanvas's WebGL particles — each floating word reads as a labeled node
 * in that background network instead of a separate layer glued on top.
 * Placed as a sibling of the word's text inside the SAME GSAP-animated
 * wrapper div, so it inherits that div's position/scale/opacity for free —
 * no extra scroll-timeline work needed to keep it in sync with the word. */
function WordAnchor({ index, rotate }: { index: number; rotate: number }) {
  // Angle loosely follows the word's own tilt (so the tether reads as
  // "attached", not arbitrary) with enough per-word variation that they
  // don't all point the same direction.
  const angle = (rotate * 3 + index * 53) % 360;
  // Math.cos/sin aren't guaranteed bit-identical between Node's V8 (SSR) and
  // the browser's — a last-bit difference is enough for React to flag a
  // hydration mismatch on the serialized transform string. Rounding to 2
  // decimals (irrelevant at this visual scale) reliably collapses both to
  // the same string.
  const dx = Math.round(Math.cos((angle * Math.PI) / 180) * ANCHOR_DIST * 100) / 100;
  const dy = Math.round(Math.sin((angle * Math.PI) / 180) * ANCHOR_DIST * 100) / 100;
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-px origin-left bg-stone/45"
        style={{ width: ANCHOR_DIST, transform: `rotate(${angle}deg)` }}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 h-1.5 w-1.5 ${ANCHOR_DOT_CLASSES[index % ANCHOR_DOT_CLASSES.length]}`}
        style={{ transform: `translate(${dx}px, ${dy}px) translate(-50%, -50%)` }}
      />
    </>
  );
}

function CTAs() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <Magnetic strength={0.35}>
        <a
          href="#contact"
          className="inline-flex items-center justify-center rounded-full bg-cocoaBark px-8 py-4 font-body text-sm font-medium tracking-normal text-bone transition-colors hover:bg-espresso"
        >
          {HERO_COPY.ctaPrimary}
        </a>
      </Magnetic>
      <a
        href="#method"
        className="font-mono text-xs uppercase tracking-caption text-cocoaBark/70 underline decoration-cognac decoration-1 underline-offset-4 transition-colors hover:text-cocoaBark"
      >
        {HERO_COPY.ctaSecondary}
      </a>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroCanvasRef = useRef<HeroCanvasHandle>(null);

  // Desktop refs.
  const stickyRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRef = useRef<HTMLDivElement>(null);
  const headlineWrapRef = useRef<HTMLDivElement>(null);
  const connectorLineRefs = useRef<(SVGLineElement | null)[]>([]);

  // Mobile refs — a single un-pinned stage, scrubbed by the section's own
  // natural scroll position (see setupMobile below).
  const mobileStageRef = useRef<HTMLDivElement>(null);
  const mobileHeroCanvasRef = useRef<HeroCanvasHandle>(null);
  const mobileWordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileNodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileHeadlineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: DESKTOP_QUERY, isMobile: MOBILE_QUERY, reduceMotion: REDUCE_MOTION_QUERY },
        (context) => {
          const conditions = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };

          if (conditions.reduceMotion) {
            gsap.set([headlineWrapRef.current, mobileHeadlineRef.current], { clearProps: "all" });
            return;
          }

          if (conditions.isDesktop) {
            return setupDesktop();
          }

          if (conditions.isMobile) {
            return setupMobile();
          }
        }
      );

      function setupDesktop() {
        const stickyEl = stickyRef.current;
        if (!stickyEl) return;

        const dims = () => stickyEl.getBoundingClientRect();
        const px = (xPercent: number, yPercent: number) => {
          const r = dims();
          return { x: (xPercent / 100) * r.width, y: (yPercent / 100) * r.height };
        };
        const centerPx = () => {
          const r = dims();
          return { x: r.width / 2, y: r.height / 2 };
        };

        // Initial scattered positions for every word.
        HERO_WORDS.forEach((w, i) => {
          const el = wordRefs.current[i];
          if (!el) return;
          const p = px(w.x, w.y);
          gsap.set(el, { x: p.x, y: p.y, autoAlpha: 1 });
        });

        // Faint constellation lines between related words — set once from
        // their scattered positions (raw pixel coordinates, no viewBox scaling
        // needed since these words aren't moving yet when the lines are visible).
        CONNECTOR_PAIRS.forEach(([aId, bId], i) => {
          const line = connectorLineRefs.current[i];
          const a = HERO_WORDS.find((w) => w.id === aId);
          const b = HERO_WORDS.find((w) => w.id === bId);
          if (!line || !a || !b) return;
          const pa = px(a.x, a.y);
          const pb = px(b.x, b.y);
          line.setAttribute("x1", String(pa.x));
          line.setAttribute("y1", String(pa.y));
          line.setAttribute("x2", String(pb.x));
          line.setAttribute("y2", String(pb.y));
        });
        gsap.set(connectorLineRefs.current, { opacity: 0 });

        // Nodes + center dot start hidden, collapsed at the center point.
        gsap.set(nodeRefs.current, () => {
          const c = centerPx();
          return { x: c.x, y: c.y, scale: 0, autoAlpha: 0 };
        });
        gsap.set(dotRef.current, () => {
          const c = centerPx();
          return { x: c.x, y: c.y, scale: 1, autoAlpha: 1 };
        });
        gsap.set(headlineWrapRef.current, { autoAlpha: 0, y: 24 });

        // Idle float, purely decorative, independent of scroll position.
        wordRefs.current.forEach((el, i) => {
          const inner = el?.firstElementChild as HTMLElement | null;
          if (!inner) return;
          gsap.to(inner, {
            y: i % 2 === 0 ? "+=12" : "-=12",
            duration: 2.4 + (i % 5) * 0.35,
            delay: (i % 7) * 0.18,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            // Was +=280% — same choreography, same relative beat timing
            // (Phase A/B/C/D are positions within the timeline, not tied to
            // pixel distance), just compressed into less scroll so the rest
            // of the page — Method in particular — doesn't sit several
            // screens below the fold before a visitor ever reaches it.
            end: "+=200%",
            scrub: 1,
            pin: stickyEl,
            anticipatePin: 1,
            // Feeds the WebGL backdrop's camera dolly — reads this same
            // trigger's own progress rather than creating a second
            // ScrollTrigger on this section (see the module comment above
            // setupMobile for why that previously corrupted both timelines).
            onUpdate: (self) => heroCanvasRef.current?.setProgress(self.progress),
          },
        });

        // Constellation lines: a brief flash while words are still scattered,
        // gone well before Phase A migration progresses enough to notice the
        // endpoints no longer tracking the (now-moving) words.
        tl.to(connectorLineRefs.current, { opacity: 0.22, duration: 0.14, stagger: 0.025, ease: "power1.out" }, 0.02);
        tl.to(connectorLineRefs.current, { opacity: 0, duration: 0.14, ease: "power1.in" }, 0.32);

        // Phase A (0 -> ~0.6): words migrate toward their method-phase node.
        for (let cluster = 0; cluster < 4; cluster++) {
          const node = HERO_NODES[cluster];
          const targets = HERO_WORDS.map((w, i) => (w.cluster === cluster ? wordRefs.current[i] : null)).filter(
            (el): el is HTMLDivElement => Boolean(el)
          );
          tl.to(
            targets,
            {
              x: () => px(node.x, node.y).x,
              y: () => px(node.x, node.y).y,
              scale: 0.55,
              stagger: 0.04,
              ease: "power2.inOut",
              duration: 0.5,
            },
            0
          );
        }

        // Phase B (~0.62 -> ~0.85): everything collapses into the logo's
        // point — deliberately starts only once Phase A's last word has
        // actually arrived, so nothing is still visibly mid-migration while
        // it collapses (that overlap used to read as the whole thing being
        // stuck/broken mid-scroll).
        const allWords = wordRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
        tl.to(
          allWords,
          {
            x: () => centerPx().x,
            y: () => centerPx().y,
            scale: 0,
            autoAlpha: 0,
            stagger: 0.01,
            ease: "power1.in",
            duration: 0.12,
          },
          0.62
        );
        tl.to(dotRef.current, { scale: 2.8, duration: 0.08, ease: "power1.out" }, 0.64);
        tl.to(dotRef.current, { scale: 1.5, autoAlpha: 0, duration: 0.12, ease: "power1.in" }, 0.78);

        // Phase C (~0.9 -> ~1.5): the four method nodes emerge from that
        // point — starts only once Phase B has fully finished collapsing.
        tl.to(
          nodeRefs.current,
          {
            x: (i: number) => px(HERO_NODES[i].x, HERO_NODES[i].y).x,
            y: (i: number) => px(HERO_NODES[i].x, HERO_NODES[i].y).y,
            scale: 1,
            autoAlpha: 1,
            stagger: 0.05,
            ease: "back.out(1.6)",
            duration: 0.45,
          },
          0.9
        );

        // Phase D: headline, subheadline, CTAs settle in as the nodes finish landing.
        tl.to(headlineWrapRef.current, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.5 }, 1.35);

        const onResize = () => ScrollTrigger.refresh();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
      }

      /**
       * Mobile: NO pin. A single scrubbed timeline tied to the stage's own
       * scroll position (trigger = the stage itself, "top bottom" -> "bottom
       * top"), so the section scrolls natively — nothing stays glued to the
       * viewport. This sidesteps the classic mobile ScrollTrigger pin bug
       * (address bar show/hide changes the visual viewport height mid-scroll,
       * which desyncs a pinned spacer's height). Words fade/scale in, then
       * cross-fade into the four method nodes, then the headline settles in —
       * three short beats instead of desktop's free-form migration.
       */
      function setupMobile() {
        const stageEl = mobileStageRef.current;
        if (!stageEl) return;

        const dims = () => stageEl.getBoundingClientRect();
        const px = (xPercent: number, yPercent: number) => {
          const r = dims();
          return { x: (xPercent / 100) * r.width, y: (yPercent / 100) * r.height };
        };

        const setWordPositions = () => {
          HERO_WORDS.forEach((w, i) => {
            const el = mobileWordRefs.current[i];
            if (!el) return;
            const p = px(w.x, w.y);
            gsap.set(el, { x: p.x, y: p.y });
          });
        };

        setWordPositions();
        gsap.set(mobileWordRefs.current, { autoAlpha: 0, scale: 0.7 });
        gsap.set(mobileNodeRefs.current, { autoAlpha: 0, scale: 0.85, y: 8 });
        gsap.set(mobileHeadlineRef.current, { autoAlpha: 0, y: 16 });

        const wordEls = mobileWordRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
        const nodeEls = mobileNodeRefs.current.filter((el): el is HTMLDivElement => Boolean(el));

        // start/end are "top top" -> "bottom top", NOT the more common "top
        // bottom" -> "bottom top": this stage is the very first thing on the
        // page, already fully in view at scrollY 0 with nothing above it to
        // scroll past first. "top bottom" measures progress as if the stage
        // were being scrolled UP INTO view from below (the usual case for
        // sections further down the page) — for a section that starts the
        // page, that put the scrub roughly half-played before the visitor
        // ever scrolled at all, so the words were already fading out (or the
        // nodes already mid-arrival) on first paint instead of showing the
        // scattered "brainstorm" state. "top top" makes progress 0 exactly
        // at scrollY 0, so the choreography actually starts from the start.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stageEl,
            start: "top top",
            end: "bottom top",
            scrub: 1,
            onUpdate: (self) => mobileHeroCanvasRef.current?.setProgress(self.progress),
          },
        });

        // Beat 1 (0.05 -> 0.34): words settle in with a subtle stagger.
        tl.to(wordEls, { autoAlpha: 1, scale: 1, stagger: 0.04, duration: 0.3, ease: "power2.out" }, 0.05);
        // Beat 2 (0.34 -> ~0.68): words recede while the four nodes arrive.
        tl.to(wordEls, { autoAlpha: 0, scale: 0.85, stagger: 0.02, duration: 0.18, ease: "power1.in" }, 0.34);
        tl.to(nodeEls, { autoAlpha: 1, scale: 1, y: 0, stagger: 0.08, duration: 0.3, ease: "power2.out" }, 0.38);
        // Beat 3 (0.74 -> 1): nodes step back, headline + CTA close the section.
        tl.to(nodeEls, { autoAlpha: 0, scale: 0.94, duration: 0.2, ease: "power1.in" }, 0.74);
        tl.to(mobileHeadlineRef.current, { autoAlpha: 1, y: 0, duration: 0.26, ease: "power2.out" }, 0.8);

        const onResize = () => {
          setWordPositions();
          ScrollTrigger.refresh();
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
      }

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="hero" aria-label="Yez The Realtor — Homeownership, designed for what comes next.">
      {/* Desktop: pinned scroll-driven "brainstorm" choreography (lg and up, motion-safe). */}
      <div className="hidden lg:motion-safe:block">
        <div ref={stickyRef} className="relative h-screen w-full overflow-hidden bg-bone">
          {/* WebGL backdrop — a child of the pinned element itself (not a
              section-level sibling) so it pins/scrolls with it automatically;
              a sibling of the pin would be positioned relative to this
              non-pinned, ever-growing section (the pin-spacer inflates it to
              the whole scroll duration) and would scroll away mid-pin while
              the foreground stayed fixed. */}
          <HeroCanvas ref={heroCanvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            {CONNECTOR_PAIRS.map((pair, i) => (
              <line
                key={pair.join("-")}
                ref={(el) => {
                  connectorLineRefs.current[i] = el;
                }}
                stroke="#A89B8A"
                strokeWidth={1}
                strokeLinecap="round"
              />
            ))}
          </svg>

          {HERO_WORDS.map((w, i) => (
            <div
              key={w.id}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              className="invisible absolute left-0 top-0 will-change-transform"
            >
              <div>
                <span
                  className={`inline-block whitespace-nowrap font-display text-cocoaBark/80 ${w.size}`}
                  style={{ transform: `translate(-50%, -50%) rotate(${w.rotate}deg)` }}
                >
                  {w.label}
                </span>
              </div>
              <WordAnchor index={i} rotate={w.rotate} />
            </div>
          ))}

          <div ref={dotRef} className="invisible absolute left-0 top-0 will-change-transform">
            <div className="h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cognac" />
          </div>

          {HERO_NODES.map((n, i) => (
            <div
              key={n.id}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              className="invisible absolute left-0 top-0 will-change-transform"
            >
              <div className="flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center">
                <span className="font-display text-3xl tracking-headline text-cocoaBark xl:text-5xl">
                  {n.title}
                </span>
                <span className="max-w-[13rem] font-mono text-[10px] uppercase tracking-caption text-cognac xl:text-xs">
                  {n.microlabel}
                </span>
              </div>
            </div>
          ))}

          <div
            ref={headlineWrapRef}
            className="invisible pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform"
          >
            <div className="pointer-events-auto flex max-w-xl flex-col items-center gap-4 px-6 text-center">
              <h1 className="font-display text-3xl tracking-headline text-cocoaBark xl:text-4xl">
                {HERO_COPY.headline}
              </h1>
              <p className="font-body font-light text-base text-cocoaBark/80 tracking-subhead xl:text-lg">
                {HERO_COPY.subheadline}
              </p>
              <CTAs />
            </div>
          </div>

          {/* A quiet technical flourish, not a data point anyone needs —
              the same "precision instrument" register as the mono/caption
              labels elsewhere, here reading like a survey marker. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-caption text-cocoaBark/35"
          >
            Austin, TX
            <br />
            30.2672°N · 97.7431°W
          </div>
        </div>
      </div>

      {/* Mobile / tablet: un-pinned scrub over the stage's natural scroll position. */}
      <div className="hidden bg-bone motion-safe:block motion-safe:lg:hidden">
        <div ref={mobileStageRef} className="relative h-screen w-full overflow-hidden">
          <HeroCanvas
            ref={mobileHeroCanvasRef}
            mobile
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
          {HERO_WORDS.map((w, i) => (
            <div
              key={w.id}
              ref={(el) => {
                mobileWordRefs.current[i] = el;
              }}
              className="invisible absolute left-0 top-0 will-change-transform"
            >
              <span
                className={`inline-block whitespace-nowrap font-display text-cocoaBark/80 ${w.size}`}
                style={{ transform: `translate(-50%, -50%) rotate(${w.rotate}deg)` }}
              >
                {w.label}
              </span>
              <WordAnchor index={i} rotate={w.rotate} />
            </div>
          ))}

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
              {HERO_NODES.map((n, i) => (
                <div
                  key={n.id}
                  ref={(el) => {
                    mobileNodeRefs.current[i] = el;
                  }}
                  className="invisible flex flex-col items-center gap-2 text-center will-change-transform"
                >
                  <span className="font-mono text-[10px] uppercase tracking-caption text-cognac">0{i + 1}</span>
                  <span className="font-display text-2xl tracking-headline text-cocoaBark">{n.title}</span>
                  <span className="max-w-[9rem] font-mono text-[9px] uppercase tracking-caption text-stone">
                    {n.microlabel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={mobileHeadlineRef}
            className="invisible pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5 px-8 text-center will-change-transform"
          >
            <div className="pointer-events-auto flex flex-col items-center gap-5">
              <h1 className="font-display text-3xl tracking-headline text-cocoaBark">{HERO_COPY.headline}</h1>
              <p className="font-body font-light text-cocoaBark/80 tracking-subhead">{HERO_COPY.subheadline}</p>
              <CTAs />
            </div>
          </div>
        </div>
      </div>

      {/* Reduced motion: static, single fade-in, no scroll choreography. */}
      <div className="hidden motion-reduce:block bg-bone px-6 py-24">
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-12 pb-20 sm:grid-cols-2">
          {HERO_NODES.map((n, i) => (
            <div key={n.id} className="flex flex-col items-center gap-3 text-center">
              <span className="font-mono text-xs uppercase tracking-caption text-cognac">0{i + 1}</span>
              <span className="font-display text-3xl tracking-headline text-cocoaBark">{n.title}</span>
              <span className="max-w-xs font-mono text-[10px] uppercase tracking-caption text-stone">
                {n.microlabel}
              </span>
            </div>
          ))}
        </div>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h1 className="font-display text-4xl tracking-headline text-cocoaBark">{HERO_COPY.headline}</h1>
          <p className="font-body font-light text-lg text-cocoaBark/80 tracking-subhead">
            {HERO_COPY.subheadline}
          </p>
          <CTAs />
        </div>
      </div>
    </section>
  );
}
