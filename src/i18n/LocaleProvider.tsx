"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, type Locale, type Localized } from "./config";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={lang}>{children}</LocaleContext.Provider>;
}

export function useLang(): Locale {
  return useContext(LocaleContext);
}

/** Picks the current language's copy out of a `{ en, es }` content table. */
export function useContent<T>(table: Localized<T>): T {
  return table[useLang()];
}
