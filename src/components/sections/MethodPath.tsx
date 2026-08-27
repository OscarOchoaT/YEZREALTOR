"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { ConnectorOverlay, buildSmoothPath, type ConnectorPoint } from "@/components/NodeConnector";
import { HERO_NODES } from "@/content/hero";

// A gentle hand-drawn wave through the 4 phases — literally the client's path.
export const PATH_POINTS: ConnectorPoint[] = [
  { x: 6, y: 62 },
  { x: 37, y: 20 },
  { x: 63, y: 62 },
  { x: 94, y: 20 },
];

export type MethodPathHandle = {
  pathEl: SVGPathElement | null;
  dotEls: (HTMLDivElement | null)[];
  /** The container the percentage coordinates above are relative to — needed
   * to correct for its non-square aspect ratio when computing the travel
   * marker's visual heading (see Method.tsx). */
  wrapEl: HTMLDivElement | null;
  /** "Current position" marker — the pilot's own path, traveled live. */
  markerEl: HTMLDivElement | null;
  markerRotateEl: HTMLDivElement | null;
};

/**
 * Presentational only — draws the DECODE -> DESIGN -> EXECUTE -> ADVANCE
 * journey line + its 4 node dots, but owns no scroll animation itself.
 * `Method.tsx` drives the reveal (pinned on desktop, scrubbed on mobile) via
 * the exposed path/dot refs, since that timeline also has to choreograph
 * the method cards uncollapsing from these same dot positions.
 */
const MethodPath = forwardRef<MethodPathHandle>(function MethodPath(_props, ref) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const markerRef = useRef<HTMLDivElement>(null);
  const markerRotateRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    pathEl: pathRef.current,
    dotEls: dotRefs.current,
    wrapEl: wrapRef.current,
    markerEl: markerRef.current,
    markerRotateEl: markerRotateRef.current,
  }));

  const d = buildSmoothPath(PATH_POINTS);

  return (
    <div ref={wrapRef} className="relative mx-auto mb-20 h-40 max-w-4xl sm:h-32">
      <ConnectorOverlay>
        <path ref={pathRef} d={d} fill="none" className="stroke-stone" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </ConnectorOverlay>

      {/* Current-position marker — a small heading chevron that travels the
          journey line in step with the same scrub that draws it (see
          Method.tsx), a quiet nod to "pilot by soul" (About.tsx tags). */}
      <div
        ref={markerRef}
        aria-hidden="true"
        className="absolute left-0 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{ left: `${PATH_POINTS[0].x}%`, top: `${PATH_POINTS[0].y}%` }}
      >
        <div ref={markerRotateRef} className="h-full w-full">
          <svg viewBox="0 0 16 16" className="h-full w-full overflow-visible">
            <polygon points="1,3 15,8 1,13 4.5,8" fill="#7A5239" />
          </svg>
        </div>
      </div>

      {HERO_NODES.map((n, i) => (
        <div
          key={n.id}
          ref={(el) => {
            dotRefs.current[i] = el;
          }}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
          style={{ left: `${PATH_POINTS[i].x}%`, top: `${PATH_POINTS[i].y}%` }}
        >
          <div className="h-3 w-3 rounded-full bg-cognac" />
          <span className="font-mono text-[10px] uppercase tracking-caption text-cocoaBark whitespace-nowrap">
            {n.title}
          </span>
        </div>
      ))}
    </div>
  );
});

export default MethodPath;
