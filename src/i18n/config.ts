export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export type Localized<T> = Record<Locale, T>;

export const hasLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

/** Prefixes an internal path ("/", "/#contact", "/metodo/decode") with the locale. */
export function localizePath(lang: Locale, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const [first] = href.slice(1).split(/[/?#]/);
  if (hasLocale(first)) return href;
  return href === "/" ? `/${lang}` : `/${lang}${href}`;
}

/** Same page, other language: swaps the leading locale segment of a pathname. */
export function switchLocalePath(pathname: string, lang: Locale): string {
  const [, first, ...rest] = pathname.split("/");
  return `/${[lang, ...(hasLocale(first) ? rest : [first, ...rest].filter(Boolean))].join("/")}`;
}

/** Remembers the visitor's explicit choice so the proxy stops guessing from Accept-Language. */
export function saveLocale(lang: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
}
