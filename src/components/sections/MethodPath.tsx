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
};

/**
 * Presentational only — draws the DECODE -> DESIGN -> EXECUTE -> ADVANCE
 * journey line + its 4 node dots, but owns no scroll animation itself.
 * `Method.tsx` drives the reveal (pinned on desktop, scrubbed on mobile) via
 * the exposed path/dot refs, since that timeline also has to choreograph
 * the method cards uncollapsing from these same dot positions.
 */
const MethodPath = forwardRef<MethodPathHandle>(function MethodPath(_props, ref) {
  const pathRef = useRef<SVGPathElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    pathEl: pathRef.current,
    dotEls: dotRefs.current,
  }));

  const d = buildSmoothPath(PATH_POINTS);

  return (
    <div className="relative mx-auto mb-20 h-40 max-w-4xl sm:h-32">
      <ConnectorOverlay>
        <path ref={pathRef} d={d} fill="none" className="stroke-stone" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </ConnectorOverlay>

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
