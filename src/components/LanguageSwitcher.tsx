"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContent, useLang } from "@/i18n/LocaleProvider";
import { LOCALES, saveLocale, switchLocalePath, type Locale } from "@/i18n/config";
import { UI_I18N } from "@/content/ui";

const NAMES: Record<Locale, string> = { en: "English", es: "Español" };

/**
 * EN | ES toggle. Each option links to the same page in the other language
 * and remembers the choice in a cookie so the proxy stops guessing from
 * Accept-Language on the visitor's next arrival.
 */
export default function LanguageSwitcher() {
  const lang = useLang();
  const pathname = usePathname();
  const ui = useContent(UI_I18N);

  return (
    <div role="group" aria-label={ui.languageLabel} className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-caption">
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden="true" className="text-bone/30">
              |
            </span>
          )}
          {l === lang ? (
            <span aria-current="true" className="text-bone">
              {l}
            </span>
          ) : (
            <Link
              href={switchLocalePath(pathname, l)}
              hrefLang={l}
              lang={l}
              aria-label={NAMES[l]}
              onClick={() => saveLocale(l)}
              className="text-bone/60 transition-colors hover:text-bone"
            >
              {l}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
