"use client";

import { motion } from "framer-motion";
import TypeformEmbed from "@/components/TypeformEmbed";
import { useSource } from "@/components/SourceContext";
import Eyebrow from "@/components/Eyebrow";
import InteractiveDotGrid from "@/components/InteractiveDotGrid";
import { CONTACT } from "@/content/credibility";
import { SITE } from "@/content/site";
import { trackEvent } from "@/lib/analytics";

export default function Contact() {
  const { source } = useSource();

  return (
    <section id="contact" className="relative bg-cocoaBark/15 px-6 py-24 sm:py-32">
      <InteractiveDotGrid />
      <div className="relative mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-14 flex flex-col items-center gap-3 text-center"
        >
          <Eyebrow index="07" label={CONTACT.eyebrow} />
          <p className="font-display !font-medium text-2xl tracking-subhead text-bone/50 sm:text-3xl">{CONTACT.line1}</p>
          <p className="font-display text-3xl tracking-headline text-bone sm:text-4xl">{CONTACT.line2}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div id="contact-form" className="scroll-mt-24">
            <TypeformEmbed source={source} />
          </div>
        </motion.div>

        <div className="mt-10 flex flex-col items-center gap-6">
          <h2 className="text-center font-display text-3xl tracking-headline text-bone sm:text-4xl">
            {CONTACT.headline}
          </h2>
          <p className="max-w-lg text-center font-body text-base font-light text-bone/75">{CONTACT.supporting}</p>
          <a
            href="#contact-form"
            className="inline-flex items-center justify-center rounded-full bg-glow px-8 py-4 font-body text-sm font-medium text-espresso transition-colors hover:bg-bone"
          >
            {CONTACT.ctaFinal}
          </a>
          <p className="mt-2 font-body text-sm font-light text-bone/70">{CONTACT.whatsappPrompt}</p>
          <a
            href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(SITE.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click")}
            className="font-mono text-xs uppercase tracking-caption text-bone underline decoration-cognac decoration-1 underline-offset-4 hover:text-cognac"
          >
            {CONTACT.whatsappCta} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
