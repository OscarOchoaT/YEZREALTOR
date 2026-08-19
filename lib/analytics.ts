// Provider-agnostic event tracking — brief/07-integrations-conversion-funnel.md §6.
// No analytics vendor is confirmed yet ("herramienta a confirmar con
// cliente"), so this pushes to window.dataLayer — the convention both GA4
// and Google Tag Manager read from — so events start flowing the moment
// either snippet is added to app/layout.tsx, with zero changes here.
type TrackProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function track(event: string, props: TrackProps = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...props });

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, props);
  }
}
