/**
 * Lightweight analytics stub. Page-view/traffic tracking is already handled by
 * <Analytics /> (@vercel/analytics) in the root layout. This function covers
 * the events that aren't automatic: CTA clicks, scroll depth, Typeform
 * starts/completions, booked calls.
 *
 * TODO(analytics): wire this up to a real provider —
 *   - Vercel Analytics: import { track } from "@vercel/analytics"; track(name, props);
 *   - GA4: window.gtag?.("event", name, props);
 *   - Plausible: window.plausible?.(name, { props });
 * Until then this only logs in development so call sites are easy to find.
 */
export function trackEvent(name: string, props?: Record<string, string | number | boolean>) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", name, props ?? {});
  }
}
