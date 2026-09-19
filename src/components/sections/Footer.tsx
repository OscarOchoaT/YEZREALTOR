import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import { SITE, NAV_LINKS } from "@/content/site";
import { FOOTER } from "@/content/credibility";

export default function Footer({ isHome = true }: { isHome?: boolean }) {
  return (
    <footer className="bg-cocoaBark px-6 py-16 text-bone">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <div className="flex flex-col justify-between gap-10 sm:flex-row">
          <div className="flex flex-col gap-4">
            <Image src="/logo/logo-inverse.png" alt="Yez The Realtor" width={194} height={100} className="h-11 w-auto" />
            <p className="max-w-xs font-body text-sm font-light text-bone/70">{SITE.location}</p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {NAV_LINKS.map((link) => (
              <TransitionLink
                key={link.href}
                href={isHome ? link.href : `/${link.href}`}
                className="font-body text-sm font-medium text-bone/80 hover:text-bone"
              >
                {link.label}
              </TransitionLink>
            ))}
          </nav>

          <div className="flex flex-col gap-2 font-body text-sm font-medium text-bone/80">
            <a href={`mailto:${SITE.email}`} className="hover:text-bone">
              {SITE.email}
            </a>
            <a href={`https://wa.me/${SITE.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
              WhatsApp · {SITE.phone}
            </a>
          </div>

          <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-caption text-bone/70">
            <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
              Instagram {SITE.instagramHandle}
            </a>
            <a href={SITE.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
              TikTok {SITE.tiktokHandle}
            </a>
            <a href={SITE.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
              Facebook {SITE.facebookLabel}
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 border-t border-bone/10 pt-8 text-center">
          <span className="font-display !font-medium text-lg tracking-subhead text-bone">{FOOTER.tagline}</span>
          <span className="font-mono text-[10px] uppercase tracking-caption text-bone/50">
            © {new Date().getFullYear()} {SITE.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
