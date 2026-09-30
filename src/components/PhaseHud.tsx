"use client";

import { forwardRef, useImperativeHandle } from "react";

export type PhaseHudHandle = {
  /** Kept so MethodShowcase's pinned timeline can still call it; the panel
   * is static now (no scores), so there is nothing to play. */
  play: () => void;
};

/**
 * A floating "glass" panel listing a phase's focus areas — labels only.
 * Deliberately no percentages or scores: the Method is a methodology, not a
 * scoring calculator.
 */
const PhaseHud = forwardRef<
  PhaseHudHandle,
  { heading: string; metrics: string[]; className?: string; autoPlay?: boolean }
>(function PhaseHud({ heading, metrics, className = "" }, ref) {
  useImperativeHandle(ref, () => ({ play: () => {} }));

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-bone/20 bg-espresso/95 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.7)] backdrop-blur-sm ${className}`}
    >
      <div className="relative flex items-center gap-2 border-b border-bone/15 px-5 py-3 sm:px-7 sm:py-3.5">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-cognac motion-safe:[animation:dot-pulse_2s_ease-in-out_infinite]"
        />
        <span className="font-mono text-[11px] uppercase tracking-caption text-bone/75">{heading}</span>
      </div>

      <ul className="relative grid grid-cols-2 gap-x-4 gap-y-3 p-5 sm:gap-x-6 sm:p-6">
        {metrics.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-cognac">0{i + 1}</span>
            <span className="font-mono text-[11px] uppercase leading-snug tracking-caption text-bone/85">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default PhaseHud;
