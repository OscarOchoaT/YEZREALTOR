// Shared motion vocabulary for the whole site — the "motion system" the
// project runs on. New animation code should reference these instead of
// hardcoding one-off duration/ease numbers, so unrelated components still
// feel like one coherent hand wrote them.
//
// Deliberately sticks to GSAP's built-in named eases rather than a
// hand-rolled CustomEase bezier curve: this file gets imported by animation
// code across the whole site, and a malformed CustomEase string throws at
// registration time with no way to catch it from a Node-only build/SSR
// check (CustomEase only ever runs in a real browser) — not a risk worth
// taking for a cosmetic curve when the built-in eases already read as
// premium when used with intent.
export const EASE = {
  // Confident, no-overshoot deceleration — the default for anything
  // entering the viewport (Reveal, SplitLines, TiltIn, card grids).
  out: "power3.out",
  // Snappier — for things the user directly triggers (hover, click, tab
  // switches), where a slower entrance ease would feel laggy.
  outFast: "power2.out",
  // Scroll-scrubbed motion (tied 1:1 to scroll position, e.g. the Method
  // pin, parallax) always uses "none": GSAP just interpolates linearly with
  // scroll position, so any eased curve here fights the 1:1 mapping and
  // reads as rubbery/laggy instead of scroll-locked.
  scrub: "none",
  // Symmetric transitions — crossfades, sliding tab indicators, curtain
  // wipes — where the motion isn't purely an entrance.
  inOut: "power2.inOut",
  // Reserved for the rare full-cinematic moment (the Hero headline reveal,
  // the intro curtain) — bigger, slower, more dramatic than the default.
  cinematic: "expo.out",
  // Slight overshoot-and-settle — reserved for the handful of typographic
  // "transformation" moments (Differentiation, Manifesto fullscreen swap)
  // that want to feel like the text physically arrives, not just fades.
  overshoot: "back.out(1.6)",
} as const;

export const DURATION = {
  fast: 0.25, // hover/click feedback
  base: 0.5, // default entrance
  slow: 0.9, // headline/section-heading reveals
  slower: 1.2, // curtain wipes, full-bleed transitions
} as const;

export const STAGGER = {
  tight: 0.04, // word-by-word kinetic text
  base: 0.08, // line-by-line headings, small card grids
  loose: 0.12, // large card grids, few items, more weight per item
} as const;

// Consistent ScrollTrigger start point for "play once as it scrolls into
// view" reveals (Reveal, SplitLines, TiltIn all use this).
export const SCROLL_ENTER = "top 85%";
