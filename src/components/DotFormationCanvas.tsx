"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { sampleWordmarkPoints } from "@/lib/wordmarkPoints";

const DOT_COLORS = ["#7A5239", "#602F10", "#A89B8A"]; // cognac, siena, stone
const MOBILE_BREAKPOINT = 768;
// Performance ceilings, not targets — sampleWordmarkPoints aims for a fixed
// visual dot spacing first and only hits these caps on very large glyphs.
// Canvas easily handles a couple thousand small circles per frame.
const DESKTOP_MAX_POINTS = 1800;
const MOBILE_MAX_POINTS = 900;

type Dot = { x: number; y: number; color: string; size: number };

export type DotFormationHandle = {
  /** Dots fly in from the right edge and assemble into "Yez." Resolves once settled. */
  enter: () => Promise<void>;
  /** Dots disperse toward the left edge and the canvas is cleared. Resolves once empty. */
  exit: () => Promise<void>;
};

/**
 * Single full-viewport <canvas>, driven by a plain array of point objects
 * (not DOM nodes) so a few hundred dots stay cheap even on mid-range mobile.
 * GSAP tweens x/y directly on those objects; a rAF loop just repaints
 * circles from their current values each frame. Shared by the page
 * transition overlay and the initial load screen — same visual system.
 */
const DotFormationCanvas = forwardRef<DotFormationHandle, { className?: string }>(function DotFormationCanvas(
  { className },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number | null>(null);
  // Bumped every time startLoop() actually schedules a frame; a stopLoop()
  // call only cancels the frame for the generation it was asked to stop.
  // Without this, React Strict Mode's dev-only double-invoke of this
  // component's mount effect (setup → cleanup → setup again, all
  // synchronous) can run its cleanup *after* a parent's enter() call has
  // already scheduled a frame in that same commit, silently cancelling the
  // very first frame and leaving the canvas blank forever.
  const loopGenerationRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const dot of dotsRef.current) {
      ctx.beginPath();
      ctx.fillStyle = dot.color;
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const loop = useCallback(() => {
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) return;
    loopGenerationRef.current += 1;
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const stopLoop = useCallback((forGeneration?: number) => {
    if (forGeneration != null && forGeneration !== loopGenerationRef.current) return;
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  // Resize handling only — deliberately does NOT stop the rAF loop on
  // cleanup (see loopGenerationRef comment above). The loop's lifecycle is
  // owned entirely by enter()/exit(): enter() starts it, exit()'s
  // onComplete stops it. That is also what actually runs before this
  // component ever unmounts in normal use (the parent always awaits
  // exit() before it stops rendering this component).
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Safety net for a genuinely abnormal unmount (component removed from the
  // tree mid-animation, without exit() ever completing) — guarded by
  // generation so it can't cancel a frame started by a later mount pass.
  useEffect(() => {
    const generationAtMount = loopGenerationRef.current;
    return () => stopLoop(generationAtMount);
  }, [stopLoop]);

  useImperativeHandle(ref, () => ({
    enter: async () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w < MOBILE_BREAKPOINT;
      // "Yez." at full width reads as a cramped, hard-to-parse mark on a
      // narrow phone screen even after the auto-shrink-to-fit below — just
      // the monogram "Y" instead, large and legible, matches the brand's
      // own monogram lockup (see /public/logo/logo-monogram*.png).
      const { points: targets, recommendedRadius } = await sampleWordmarkPoints(
        w,
        h,
        mobile ? MOBILE_MAX_POINTS : DESKTOP_MAX_POINTS,
        mobile ? "Y" : "Yez."
      );

      dotsRef.current = targets.map(() => ({
        x: w + 40,
        y: Math.random() * h,
        color: DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)],
        size: recommendedRadius,
      }));

      startLoop();

      if (targets.length === 0) return;

      await new Promise<void>((resolve) => {
        const tl = gsap.timeline({ onComplete: resolve });
        dotsRef.current.forEach((dot, i) => {
          const target = targets[i];
          tl.to(
            dot,
            {
              x: target.x,
              y: target.y,
              duration: mobile ? 0.4 + Math.random() * 0.25 : 0.55 + Math.random() * 0.35,
              ease: "power3.out",
            },
            Math.random() * (mobile ? 0.25 : 0.4)
          );
        });
      });
    },

    exit: () =>
      new Promise<void>((resolve) => {
        const mobile = window.innerWidth < MOBILE_BREAKPOINT;
        const dots = dotsRef.current;

        if (dots.length === 0) {
          stopLoop();
          resolve();
          return;
        }

        const tl = gsap.timeline({
          onComplete: () => {
            stopLoop();
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            dotsRef.current = [];
            resolve();
          },
        });
        dots.forEach((dot) => {
          tl.to(
            dot,
            {
              x: -60,
              duration: mobile ? 0.35 + Math.random() * 0.2 : 0.45 + Math.random() * 0.3,
              ease: "power2.in",
            },
            Math.random() * (mobile ? 0.2 : 0.3)
          );
        });
      }),
  }));

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
});

export default DotFormationCanvas;
