"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useTransitionNavigate } from "@/components/PageTransitionOverlay";
import { useLang } from "@/i18n/LocaleProvider";
import { localizePath } from "@/i18n/config";

type Props = ComponentProps<typeof Link>;

/**
 * Drop-in replacement for next/link's <Link> that runs the dot-formation
 * page transition before navigating. Hash-only hrefs ("#section") and
 * modified clicks (cmd/ctrl/shift/middle-click) fall through to Link's
 * normal behavior untouched. Internal paths ("/", "/#contact", "/metodo/x")
 * are prefixed with the current locale automatically.
 */
export default function TransitionLink({ href: rawHref, onClick, ...rest }: Props) {
  const { navigate } = useTransitionNavigate();
  const lang = useLang();
  const href = typeof rawHref === "string" ? localizePath(lang, rawHref) : rawHref;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    const hrefStr = typeof href === "string" ? href : (href.pathname ?? "");
    const isInternalRoute = hrefStr.startsWith("/") && !hrefStr.startsWith("//");
    const isPlainClick = e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

    if (isInternalRoute && isPlainClick) {
      e.preventDefault();
      navigate(hrefStr);
    }
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
