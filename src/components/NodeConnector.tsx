"use client";

import { forwardRef } from "react";

/**
 * Shared visual language for "data organizing itself" moments across the
 * site (hero word-map, method path, services fan-out): thin hand-drawn-style
 * SVG lines and solid dots — Stone/Cocoa Bark strokes, Cognac/Siena dots, on
 * Bone/Linen. No glow, no blue/cyan, no circuit-board aesthetic. SVG + GSAP
 * only — no Canvas/WebGL/particle libraries.
 */

export type ConnectorPoint = { x: number; y: number };

/**
 * Percentage-space overlay: a 0-100 x 0-100 viewBox stretched to fill its
 * container (preserveAspectRatio="none"), so child coordinates are plain
 * percentages of the container's width/height — matching the same x/y
 * percentages already used to position content (e.g. HERO_WORDS, HERO_NODES).
 * Use for straight connector lines; for true circles use a CSS dot, not an
 * SVG <circle> here (this viewBox is intentionally non-uniform).
 */
export function ConnectorOverlay({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const STROKE_TONE = {
  stone: "stroke-stone",
  cocoaBark: "stroke-cocoaBark",
  cognac: "stroke-cognac",
  siena: "stroke-siena",
} as const;

export const ConnectorLine = forwardRef<
  SVGLineElement,
  {
    from: ConnectorPoint;
    to: ConnectorPoint;
    tone?: keyof typeof STROKE_TONE;
    className?: string;
    strokeWidth?: number;
  }
>(function ConnectorLine({ from, to, tone = "stone", className = "", strokeWidth = 1 }, ref) {
  return (
    <line
      ref={ref}
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      vectorEffect="non-scaling-stroke"
      strokeLinecap="round"
      strokeWidth={strokeWidth}
      className={`${STROKE_TONE[tone]} ${className}`}
    />
  );
});

/**
 * A gentle hand-drawn wave through an ordered set of points — used for the
 * Method section's "client journey" path. Symmetric horizontal control
 * points keep it smooth without needing a charting library.
 */
export function buildSmoothPath(points: ConnectorPoint[]): string {
  if (points.length === 0) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = (p0.x + p1.x) / 2;
    d += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}
