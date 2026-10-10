"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import DotGridBackground from "@/components/DotGridBackground";
import Eyebrow from "@/components/Eyebrow";
import { ABOUT_I18N } from "@/content/about";
import { useContent } from "@/i18n/LocaleProvider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function About() {
  const ABOUT = useContent(ABOUT_I18N);
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set([photoRef.current, copyRef.current], { clearProps: "all" });
        return;
      }

      gsap.set(photoRef.current, { autoAlpha: 0, scale: 0.97 });
      gsap.set(copyRef.current, { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          end: "top 30%",
          scrub: 1,
        },
      });

      tl.to(photoRef.current, { autoAlpha: 1, scale: 1, ease: "power2.out", duration: 1 }, 0);
      tl.to(copyRef.current, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 1 }, 0.08);
    },
    { scope: sectionRef }
  );

  return (
    <section id="about" ref={sectionRef} className="relative bg-espresso px-6 py-24 sm:py-32">
      <DotGridBackground />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-20">
        {/* On desktop the photo stretches to the full height of the copy
            column, so its bottom edge lines up with the text and the tag
            line below; on mobile it keeps its 4/5 ratio. */}
        <div ref={photoRef} className="relative aspect-[4/5] overflow-hidden rounded-2xl lg:aspect-auto">
          <Image
            src={ABOUT.photo}
            alt={ABOUT.photoAlt}
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover object-[50%_60%]"
          />
        </div>

        <div ref={copyRef} className="flex flex-col justify-center gap-6">
          <Eyebrow index="02" label={ABOUT.eyebrow} align="left" />
          <h2 className="sr-only">{ABOUT.eyebrow}</h2>

          <div className="flex flex-col gap-4">
            {ABOUT.paragraphs.map((p) => (
              <p key={p} className="text-left font-body text-lg font-light leading-relaxed text-bone/90">
                {p}
              </p>
            ))}
          </div>
        </div>

        <p className="col-span-full -mt-6 text-center font-mono text-[10px] font-normal uppercase tracking-caption text-stone sm:text-xs lg:whitespace-nowrap lg:text-[11px] xl:text-xs">
          {ABOUT.tags.join(" · ")}
        </p>
      </div>
    </section>
  );
}
