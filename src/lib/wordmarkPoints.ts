export type WordmarkPoint = { x: number; y: number };

export type WordmarkSample = {
  points: WordmarkPoint[];
  /** Radius (CSS px) sized so neighboring dots slightly overlap, reading as
   * a solid fill rather than a sparse dotted pattern. */
  recommendedRadius: number;
};

// Target spacing between neighboring dots, in CSS px. Point count is derived
// FROM this (not the other way around) so the letterform always reads as a
// dense, near-solid fill regardless of viewport size or devicePixelRatio.
// Circles read as "touching" around radius ≈ spacing/2; a bit past that
// (0.55-0.6x) gives slight overlap without merging into a blob.
const TARGET_DOT_SPACING_PX = 3.4;
const RADIUS_TO_SPACING_RATIO = 0.58;

/**
 * Samples points across the SOLID FILL of the "Yez." wordmark, rendered in
 * the site's own display font on an offscreen canvas.
 *
 * Why raster fill instead of SVG path outline sampling: we don't have
 * vector outline data for the custom wordmark glyphs, and a thin
 * getPointAtLength() contour wouldn't read as a bold, filled letterform
 * anyway (Coolvetica Black / Rubik Black are heavy weights — an outline
 * alone looks like a wireframe, not a solid word). Filling the text and
 * reading the canvas alpha channel gives points across the entire stroke
 * width, so the assembled dots read as actual letters.
 *
 * Returned points are in CSS-pixel space (viewport coordinates), matching
 * how DotFormationCanvas draws — independent of devicePixelRatio, which is
 * only used internally to make the sampling itself sharper on retina.
 *
 * @param perfCap hard ceiling on returned point count (canvas performance
 * budget) — the function aims for TARGET_DOT_SPACING_PX first and only
 * falls back to this cap (spacing out dots slightly more than ideal) if the
 * glyph is large enough that hitting that spacing would exceed it.
 */
export async function sampleWordmarkPoints(
  viewportW: number,
  viewportH: number,
  perfCap: number
): Promise<WordmarkSample> {
  const empty: WordmarkSample = { points: [], recommendedRadius: 2 };
  if (typeof document === "undefined") return empty;

  // Scale the offscreen canvas by DPR (capped — no need for more than 2x)
  // so the raster mask is sharp on retina screens; draw in CSS-pixel space
  // via ctx.scale and convert sampled pixel coordinates back to CSS px.
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(viewportW * dpr));
  canvas.height = Math.max(1, Math.round(viewportH * dpr));
  const ctx = canvas.getContext("2d");
  if (!ctx) return empty;
  ctx.scale(dpr, dpr);

  // Read whatever font .font-display currently resolves to (Rubik Black now,
  // Coolvetica once the client's file lands — see src/app/fonts.ts TODO).
  const probe = document.createElement("span");
  probe.className = "font-display";
  probe.style.visibility = "hidden";
  probe.style.position = "absolute";
  document.body.appendChild(probe);
  const family = getComputedStyle(probe).fontFamily || "sans-serif";
  document.body.removeChild(probe);

  // Spec target is ~400-500px glyph height on a desktop-sized viewport; on
  // narrow mobile screens that would overflow off-canvas and clip letters,
  // so scale down proportionally to the smaller viewport dimension instead.
  let fontSize = Math.min(500, Math.max(140, Math.min(viewportW, viewportH) * 0.42));

  // Make sure this exact face/weight is actually loaded before we draw with
  // it — otherwise the canvas silently falls back to a generic system font
  // (different metrics entirely), and the sampled mask won't match what
  // ever actually renders on screen once the real font arrives.
  if ("fonts" in document) {
    try {
      await document.fonts.load(`900 ${Math.round(fontSize)}px ${family}`);
    } catch {
      // best-effort — fall back to whatever's already available
    }
  }

  ctx.font = `900 ${fontSize}px ${family}`;
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Guard against the text overflowing the canvas horizontally (unusual
  // aspect ratios, very long fallback fonts, etc.) — shrink to fit with
  // margin rather than letting fillText silently clip letters/the period.
  const measured = ctx.measureText("Yez.");
  const maxTextWidth = viewportW * 0.9;
  if (measured.width > maxTextWidth) {
    fontSize *= maxTextWidth / measured.width;
    ctx.font = `900 ${fontSize}px ${family}`;
  }

  ctx.fillText("Yez.", viewportW / 2, viewportH / 2);

  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // 2px (device-pixel) step keeps thin strokes — the "z" diagonal, the
  // period — from losing density, while still landing in the hundreds of
  // candidates, not tens of thousands.
  const step = 2;
  const candidates: WordmarkPoint[] = [];
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 128) candidates.push({ x: x / dpr, y: y / dpr });
    }
  }
  if (candidates.length === 0) return empty;

  const cssStep = step / dpr;
  // Each raw candidate represents one cssStep x cssStep tile of ink, so this
  // approximates the wordmark's actual filled (inked) area in CSS px².
  const inkArea = candidates.length * cssStep * cssStep;

  const idealCount = Math.max(1, Math.round(inkArea / (TARGET_DOT_SPACING_PX * TARGET_DOT_SPACING_PX)));
  const finalCount = Math.min(idealCount, perfCap, candidates.length);

  let points: WordmarkPoint[];
  if (finalCount >= candidates.length) {
    points = candidates;
  } else {
    // Evenly subsample (not random) so the reduced set still covers the
    // whole letterform uniformly instead of clumping.
    points = [];
    const ratio = candidates.length / finalCount;
    for (let i = 0; i < finalCount; i++) {
      points.push(candidates[Math.floor(i * ratio)]);
    }
  }

  // Derive radius from the spacing actually achieved (not just the target),
  // so if perfCap forced fewer points than ideal, dots grow slightly to
  // compensate rather than leaving visible gaps.
  const achievedSpacing = Math.sqrt(inkArea / points.length);
  const recommendedRadius = achievedSpacing * RADIUS_TO_SPACING_RATIO;

  return { points, recommendedRadius };
}

