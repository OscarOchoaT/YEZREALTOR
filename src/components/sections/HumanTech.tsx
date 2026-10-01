"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { TECH_VS_YEZ_I18N } from "@/content/method";
import { useContent } from "@/i18n/LocaleProvider";
import { SOUND_EVENT, getSoundPref } from "@/lib/soundPref";
import { Fx } from "@/lib/fx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Left hemisphere silhouette; the right one is the same path mirrored.
const HEMISPHERE =
  "M196 44 C160 30 112 38 84 70 C56 100 54 140 66 166 C58 196 82 226 116 228 C132 252 176 258 196 246 Z";

const GYRI = [
  "M120 80 C140 70 160 80 170 96",
  "M96 110 C118 100 136 116 150 112 C164 108 172 120 178 132",
  "M80 150 C102 140 120 158 140 150 C156 144 168 156 174 172",
  "M108 190 C124 180 142 194 158 190 C170 187 178 198 182 212",
  "M140 226 C152 220 166 226 176 236",
];

// Each trace ends on the node at the same index.
const TRACES = [
  "M262 126 V96 H232",
  "M274 126 V84 H292",
  "M298 138 H328",
  "M298 162 H320 V188 H302",
  "M262 174 V208 H232",
  "M286 174 V220 H298",
  "M250 138 H228",
  "M250 162 H236",
];

const NODES: [number, number][] = [
  [232, 96],
  [292, 84],
  [328, 138],
  [302, 188],
  [232, 208],
  [298, 220],
  [228, 138],
  [236, 162],
];

// Depth of each layer, in px, for the tilt parallax.
const Z = { glow: -60, human: 0, tech: 26, chip: 64 };

const GLYPHS = "01<>/\\{}[]#$%&*+=ABCDEFGHJKLMNPQRSTUVWXYZ";
const scrambled = (text: string) => text.replace(/\S/g, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);

/** Left-to-right "decode": unresolved characters churn until the word lands. */
function decode(el: HTMLElement, text: string, duration: number, onTick?: () => void) {
  const state = { p: 0 };
  let lastLocked = -1;
  return gsap.to(state, {
    p: 1,
    duration,
    ease: "none",
    onUpdate: () => {
      const locked = Math.floor(state.p * text.length);
      if (locked !== lastLocked) {
        lastLocked = locked;
        onTick?.();
      }
      el.textContent = text.slice(0, locked) + scrambled(text.slice(locked));
    },
    onComplete: () => {
      el.textContent = text;
    },
  });
}

const PATH_PROPS = { fill: "none", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export default function HumanTech() {
  const TECH_VS_YEZ = useContent(TECH_VS_YEZ_I18N);
  const human = TECH_VS_YEZ.columns.yez;
  const technology = TECH_VS_YEZ.columns.technology;

  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const humanOutlineRef = useRef<SVGPathElement>(null);
  const gyriRefs = useRef<(SVGPathElement | null)[]>([]);
  const techOutlineRef = useRef<SVGPathElement>(null);
  const traceRefs = useRef<(SVGPathElement | null)[]>([]);
  const pulseRefs = useRef<(SVGPathElement | null)[]>([]);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const chipRef = useRef<SVGGElement>(null);
  const centerRef = useRef<SVGCircleElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const headRefs = useRef<(HTMLElement | null)[]>([]);
  const humanItemRefs = useRef<(HTMLElement | null)[]>([]);
  const techItemRefs = useRef<(HTMLElement | null)[]>([]);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const pulseTlRef = useRef<gsap.core.Timeline | null>(null);
  const fxRef = useRef<Fx | null>(null);
  const soundRef = useRef(false);

  useEffect(() => {
    const fx = new Fx();
    fxRef.current = fx;

    const turnOn = () => {
      if (!fx.enable()) return;
      soundRef.current = true;
    };

    // Sound was chosen on the entry screen: the click on "Enter" dispatches
    // this event (a real gesture, so audio can start now).
    const onChoice = (e: Event) => {
      if ((e as CustomEvent<boolean>).detail) turnOn();
    };
    window.addEventListener(SOUND_EVENT, onChoice);

    // Returning visitor who opted in earlier: restore it, and resume the
    // (initially suspended) audio context on their first interaction.
    let resume: (() => void) | null = null;
    if (getSoundPref()) {
      turnOn();
      resume = () => void fx.enable();
      window.addEventListener("pointerdown", resume, { once: true });
      window.addEventListener("keydown", resume, { once: true });
    }

    return () => {
      window.removeEventListener(SOUND_EVENT, onChoice);
      if (resume) {
        window.removeEventListener("pointerdown", resume);
        window.removeEventListener("keydown", resume);
      }
      fx.dispose();
    };
  }, []);

  useGSAP(
    () => {
      const gyri = gyriRefs.current.filter((el): el is SVGPathElement => Boolean(el));
      const traces = traceRefs.current.filter((el): el is SVGPathElement => Boolean(el));
      const pulses = pulseRefs.current.filter((el): el is SVGPathElement => Boolean(el));
      const nodes = nodeRefs.current.filter((el): el is SVGCircleElement => Boolean(el));
      const humanItems = humanItemRefs.current.filter((el): el is HTMLElement => Boolean(el));
      const techItems = techItemRefs.current.filter((el): el is HTMLElement => Boolean(el));
      const heads = headRefs.current.filter((el): el is HTMLElement => Boolean(el));
      const outlines = [humanOutlineRef.current, techOutlineRef.current].filter((el): el is SVGPathElement =>
        Boolean(el)
      );
      const status = statusRef.current;
      const chip = chipRef.current;
      const center = centerRef.current;
      const glow = glowRef.current;
      const tilt = tiltRef.current;
      if (!status || !chip || !center || !glow || !tilt || heads.length < 2) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const fx = () => (soundRef.current ? fxRef.current : null);

      if (prefersReducedMotion) {
        gsap.set(pulses, { autoAlpha: 0 });
        status.textContent = TECH_VS_YEZ.statusDone;
        return;
      }

      // ---- starting state: nothing built, all text still "encrypted" ----
      const drawables = [...outlines, ...gyri, ...traces];
      drawables.forEach((el) => {
        const len = el.getTotalLength();
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(nodes, { scale: 0, transformBox: "fill-box", transformOrigin: "center" });
      gsap.set(chip, { autoAlpha: 0, scale: 0.6, transformBox: "fill-box", transformOrigin: "center" });
      gsap.set(center, { scale: 0, transformBox: "fill-box", transformOrigin: "center" });
      gsap.set(glow, { autoAlpha: 0, scale: 0.7 });
      pulses.forEach((el) => {
        const len = el.getTotalLength();
        gsap.set(el, { strokeDasharray: `10 ${len + 20}`, strokeDashoffset: 10, autoAlpha: 0 });
      });

      const headText: [HTMLElement, string][] = [
        [heads[0], human.label],
        [heads[1], technology.label],
      ];
      const humanText: [HTMLElement, string][] = humanItems.map((el, i) => [el, human.items[i]]);
      const techText: [HTMLElement, string][] = techItems.map((el, i) => [el, technology.items[i]]);
      [...headText, ...humanText, ...techText].forEach(([el, text]) => {
        el.textContent = scrambled(text);
        gsap.set(el, { opacity: 0.3 });
      });
      status.textContent = "";

      // ---- the build ----
      const tl = gsap.timeline({ paused: true });
      const draw = (el: SVGPathElement, at: number, dur: number) =>
        tl.to(el, { strokeDashoffset: 0, duration: dur, ease: "power1.inOut" }, at);
      const say = (msg: string, at: number) => tl.add(decode(status, msg, 0.7), at);
      const reveal = (list: [HTMLElement, string][], at: number, step: number) =>
        list.forEach(([el, text], i) => {
          tl.to(el, { opacity: 1, duration: 0.3 }, at + i * step);
          tl.add(decode(el, text, 0.55, () => fx()?.tick()), at + i * step);
        });

      // 1. Human hemisphere
      say(TECH_VS_YEZ.statusHuman, 0);
      tl.to(glow, { autoAlpha: 1, scale: 1, duration: 2.4, ease: "power2.out" }, 0);
      draw(outlines[0], 0.1, 1.8);
      gyri.forEach((el, i) => {
        draw(el, 0.6 + i * 0.22, 1.1);
        tl.call(() => fx()?.blip(i), [], 0.6 + i * 0.22);
      });
      reveal([headText[0], ...humanText], 1.0, 0.22);

      // 2. Technology hemisphere and chip
      const T2 = 3.2;
      say(TECH_VS_YEZ.statusTech, T2);
      draw(outlines[1], T2, 1.6);
      tl.call(() => fx()?.powerUp(), [], T2 + 0.6);
      tl.to(chip, { autoAlpha: 1, scale: 1, duration: 0.9, ease: "back.out(1.6)" }, T2 + 0.6);
      traces.forEach((el, i) => {
        const at = T2 + 1.3 + i * 0.16;
        draw(el, at, 0.7);
        tl.to(nodes[i], { scale: 1, duration: 0.3, ease: "back.out(3)" }, at + 0.6);
        tl.call(() => fx()?.blip(5 + (i % 6)), [], at + 0.6);
      });
      reveal([headText[1], ...techText], T2 + 1.0, 0.22);

      // 3. They connect
      const T3 = T2 + 3.4;
      say("Connecting…", T3 - 0.4);
      tl.to(center, { scale: 1, duration: 0.5, ease: "back.out(3)" }, T3);
      tl.call(() => fx()?.resolve(), [], T3);
      tl.to(outlines, { strokeWidth: 2.5, duration: 0.4, yoyo: true, repeat: 1 }, T3);
      say("Human + Technology", T3 + 0.5);

      // Idle: data pulses running along the circuit once it's built.
      const pulseTl = gsap.timeline({ paused: true });
      pulses.forEach((el, i) => {
        const len = el.getTotalLength();
        pulseTl.fromTo(
          el,
          { strokeDashoffset: 10, autoAlpha: 1 },
          { strokeDashoffset: -(len + 10), duration: 1.6, ease: "none", repeat: -1, repeatDelay: 1.2 + (i % 3) * 0.4 },
          i * 0.25
        );
      });
      tl.call(() => void pulseTl.play(0), [], T3 + 0.4);

      tlRef.current = tl;
      pulseTlRef.current = pulseTl;

      // ---- 3D tilt: layers sit at different depths, so moving the pointer
      // shears them against each other. A slow idle drift keeps it alive. ----
      const rotY = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power3.out" });
      const rotX = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power3.out" });
      const drift = gsap.to(tilt, {
        rotationY: 8,
        rotationX: -3,
        duration: 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      const root = rootRef.current;
      const onMove = (e: PointerEvent) => {
        const r = tilt.getBoundingClientRect();
        const nx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const ny = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        drift.pause();
        rotY(gsap.utils.clamp(-22, 22, nx * 60));
        rotX(gsap.utils.clamp(-16, 16, -ny * 40));
      };
      const onLeave = () => {
        rotY(0);
        rotX(0);
        gsap.delayedCall(0.9, () => void drift.resume());
      };
      root?.addEventListener("pointermove", onMove);
      root?.addEventListener("pointerleave", onLeave);

      ScrollTrigger.create({
        trigger: root,
        start: "top 65%",
        once: true,
        onEnter: () => void tl.play(0),
      });

      return () => {
        root?.removeEventListener("pointermove", onMove);
        root?.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: rootRef }
  );

  const layer = "pointer-events-none absolute inset-0 h-full w-full overflow-visible";

  return (
    <div ref={rootRef} className="relative mx-auto mt-24 max-w-6xl">
      <h2 className="text-center font-display text-3xl tracking-headline text-bone sm:text-4xl">
        <span className="text-stone">{TECH_VS_YEZ.heading[0]}</span> <span className="text-cognac">+</span> {TECH_VS_YEZ.heading[1]}
      </h2>

      <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_minmax(0,28rem)_1fr] lg:gap-8">
        {/* Human */}
        <div className="order-2 flex flex-col items-center gap-4 text-center lg:order-none lg:items-end lg:text-right">
          <h3
            ref={(el) => {
              headRefs.current[0] = el;
            }}
            className="font-mono text-sm uppercase tracking-caption text-stone"
          >
            {human.label}
          </h3>
          <ul className="flex flex-col gap-2.5">
            {human.items.map((item, i) => (
              <li
                key={item}
                ref={(el) => {
                  humanItemRefs.current[i] = el;
                }}
                className="font-mono text-xs uppercase tracking-caption text-bone sm:text-[13px]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Brain + chip, built in layers for depth */}
        <div className="order-1 mx-auto w-full max-w-sm lg:order-none lg:max-w-none" style={{ perspective: "1000px" }}>
          <div
            ref={tiltRef}
            className="relative aspect-[4/3] w-full"
            style={{ transformStyle: "preserve-3d" }}
            role="img"
            aria-label={TECH_VS_YEZ.ariaLabel}
          >
            <div
              ref={glowRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-[8%] rounded-full blur-3xl"
              style={{
                transform: `translateZ(${Z.glow}px)`,
                background: "radial-gradient(circle, rgba(122,82,57,0.55) 0%, transparent 70%)",
              }}
            />

            <svg viewBox="0 0 400 300" className={layer} style={{ transform: `translateZ(${Z.human}px)` }} aria-hidden="true">
              <path ref={humanOutlineRef} d={HEMISPHERE} {...PATH_PROPS} className="stroke-stone" />
              {GYRI.map((d, i) => (
                <path
                  key={d}
                  ref={(el) => {
                    gyriRefs.current[i] = el;
                  }}
                  d={d}
                  {...PATH_PROPS}
                  className="stroke-stone/80"
                />
              ))}
            </svg>

            <svg viewBox="0 0 400 300" className={layer} style={{ transform: `translateZ(${Z.tech}px)` }} aria-hidden="true">
              <g transform="translate(400 0) scale(-1 1)">
                <path ref={techOutlineRef} d={HEMISPHERE} {...PATH_PROPS} className="stroke-bone" />
              </g>
              {TRACES.map((d, i) => (
                <path
                  key={d}
                  ref={(el) => {
                    traceRefs.current[i] = el;
                  }}
                  d={d}
                  {...PATH_PROPS}
                  className="stroke-bone/80"
                />
              ))}
              {TRACES.map((d, i) => (
                <path
                  key={`pulse-${d}`}
                  ref={(el) => {
                    pulseRefs.current[i] = el;
                  }}
                  d={d}
                  {...PATH_PROPS}
                  strokeWidth={3}
                  className="stroke-cognac"
                />
              ))}
              {NODES.map(([cx, cy], i) => (
                <circle
                  key={`${cx}-${cy}`}
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                  cx={cx}
                  cy={cy}
                  r={3.5}
                  className="fill-bone"
                />
              ))}
            </svg>

            <svg viewBox="0 0 400 300" className={layer} style={{ transform: `translateZ(${Z.chip}px)` }} aria-hidden="true">
              <g ref={chipRef}>
                <rect x={250} y={126} width={48} height={48} rx={5} className="fill-cocoaBark stroke-bone" strokeWidth={1.5} />
                <rect x={262} y={138} width={24} height={24} rx={2} className="fill-none stroke-bone/60" strokeWidth={1} />
              </g>
              <circle ref={centerRef} cx={200} cy={150} r={5} className="fill-cognac" />
            </svg>
          </div>

          <div className="mt-6 flex justify-center font-mono text-[11px] uppercase tracking-caption text-bone/80">
            <span className="min-h-[1.25rem] min-w-[14ch] text-center" aria-live="polite">
              <span ref={statusRef} />
            </span>
          </div>
        </div>

        {/* Technology */}
        <div className="order-3 flex flex-col items-center gap-4 text-center lg:order-none lg:items-start lg:text-left">
          <h3
            ref={(el) => {
              headRefs.current[1] = el;
            }}
            className="font-mono text-sm uppercase tracking-caption text-bone"
          >
            {technology.label}
          </h3>
          <ul className="flex flex-col gap-2.5">
            {technology.items.map((item, i) => (
              <li
                key={item}
                ref={(el) => {
                  techItemRefs.current[i] = el;
                }}
                className="font-mono text-xs uppercase tracking-caption text-bone sm:text-[13px]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mt-16 text-center font-display !font-medium text-xl tracking-subhead text-bone sm:text-2xl"
      >
        {TECH_VS_YEZ.closingLine}
      </motion.p>
    </div>
  );
}
