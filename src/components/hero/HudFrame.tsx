/**
 * Four corner brackets framing the Hero stage — a viewfinder/targeting-
 * reticle read, leaning into the "precision instrument" language the rest
 * of the site already uses (PhaseHud's rings, the survey-marker coordinates
 * in the corner, MethodPath's travel chevron). Pure CSS borders, one
 * reused keyframe for the tick pulse — no JS, no extra paint cost worth
 * mentioning, but it's what turns a plain full-bleed canvas into something
 * that reads as an "instrument", not just a background image.
 */
export default function HudFrame() {
  const corner = "absolute h-10 w-10 border-bone/20 sm:h-14 sm:w-14";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-6 sm:inset-10">
      <div className={`${corner} left-0 top-0 border-l border-t`} />
      <div className={`${corner} right-0 top-0 border-r border-t`} />
      <div className={`${corner} left-0 bottom-0 border-l border-b`} />
      <div className={`${corner} right-0 bottom-0 border-r border-b`} />

      <span
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cognac motion-safe:[animation:dot-pulse_3s_ease-in-out_infinite]"
      />
      <span
        className="absolute right-0 bottom-0 h-1.5 w-1.5 translate-x-1/2 translate-y-1/2 rounded-full bg-cognac motion-safe:[animation:dot-pulse_3s_ease-in-out_infinite]"
        style={{ animationDelay: "1.5s" }}
      />
    </div>
  );
}
