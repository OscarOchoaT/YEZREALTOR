import type { ReactNode } from "react";

// Infinite horizontal ticker — pure CSS (see .marquee-track in
// app/globals.css), so no "use client" needed. Content is duplicated once so
// the -50% loop is seamless; the duplicate is aria-hidden since it repeats
// the same information.
export function Marquee({
  items,
  className = "",
}: {
  items: ReactNode[];
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="marquee-track flex w-max items-center gap-10">
        {[items, items].map((group, groupIndex) => (
          <div
            key={groupIndex}
            aria-hidden={groupIndex === 1}
            className="flex shrink-0 items-center gap-10"
          >
            {group.map((item, i) => (
              <span
                key={i}
                className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-cocoa-bark/50"
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
