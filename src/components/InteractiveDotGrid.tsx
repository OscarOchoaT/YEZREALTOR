"use client";

import { useEffect, useRef } from "react";

const SPACING = 28; // matches DotGridBackground's tile size, same "paper" language.
const BASE_RADIUS = 1.4;
const HOVER_RADIUS_PX = 130;

/**
 * Canvas variant of DotGridBackground for the two moments on the page meant
 * to feel like the visitor is actually touching the instrument: dots near
 * the cursor quietly brighten from Stone toward Cognac and grow slightly,
 * decaying with distance — no repulsion/physics, just a proximity read-out,
 * so it stays in the same restrained "precision instrument" register as the
 * rest of the site rather than reading as a particle effect. Desktop
 * fine-pointer only; falls back to the same static look as
 * DotGridBackground everywhere else (touch, reduced motion, or before the
 * canvas has measured its container).
 */
export default function InteractiveDotGrid({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!container || !canvas || !ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const interactive = isFinePointer && !prefersReducedMotion;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const target = { x: -9999, y: -9999 };
    const current = { x: -9999, y: -9999, intensity: 0 };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      target.x = -9999;
      target.y = -9999;
    };

    const paint = () => {
      // Smooth both position and overall intensity toward their targets —
      // one lerp for the whole field, not per-dot, so this stays O(n) per
      // frame with no per-dot animation state.
      current.x += (target.x - current.x) * 0.15;
      current.y += (target.y - current.y) * 0.15;
      const wantIntensity = target.x < -1000 ? 0 : 1;
      current.intensity += (wantIntensity - current.intensity) * 0.1;

      ctx.clearRect(0, 0, width, height);
      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * SPACING;
          const y = row * SPACING;
          let boost = 0;
          if (current.intensity > 0.01) {
            const d = Math.hypot(x - current.x, y - current.y);
            if (d < HOVER_RADIUS_PX) boost = (1 - d / HOVER_RADIUS_PX) * current.intensity;
          }
          const radius = BASE_RADIUS + boost * 1.6;
          // Stone (168,155,138) toward Cognac (122,82,57) as boost rises.
          const r = Math.round(168 + (122 - 168) * boost);
          const g = Math.round(155 + (82 - 155) * boost);
          const b = Math.round(138 + (57 - 138) * boost);
          const alpha = 0.16 + boost * 0.55;
          ctx.beginPath();
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const onResize = () => {
      resize();
      paint();
    };
    resize();
    paint();
    window.addEventListener("resize", onResize);

    // Static everywhere the field can't react (touch, reduced motion): one
    // paint on resize, no rAF loop at all — nothing to animate.
    if (!interactive) {
      return () => window.removeEventListener("resize", onResize);
    }

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);

    // Only spend a rAF loop while the section is actually on screen — the
    // hover field itself doesn't need to keep ticking once scrolled away,
    // same spirit as DotFormationCanvas's generation-guarded loop lifecycle.
    let raf = 0;
    const loop = () => {
      paint();
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !raf) {
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(container);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden="true" className={`absolute inset-0 ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
