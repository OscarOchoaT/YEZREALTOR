"use client";

import { motion } from "framer-motion";
import TypeformEmbed from "@/components/TypeformEmbed";
import CalendlyPlaceholder from "@/components/CalendlyPlaceholder";
import { useSource } from "@/components/SourceContext";
import Eyebrow from "@/components/Eyebrow";
import InteractiveDotGrid from "@/components/InteractiveDotGrid";
import { CONTACT } from "@/content/credibility";

export default function Contact() {
  const { source } = useSource();

  return (
    <section id="contact" className="relative bg-linen/40 px-6 py-24 sm:py-32">
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
          <p className="font-display text-2xl tracking-subhead text-cocoaBark/50 sm:text-3xl">{CONTACT.line1}</p>
          <h2 className="font-display text-3xl tracking-headline text-cocoaBark sm:text-4xl">{CONTACT.line2}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <TypeformEmbed source={source} />
        </motion.div>

        <div className="mt-10 flex flex-col items-center gap-6">
          <span className="font-display text-xl tracking-subhead text-cocoaBark">{CONTACT.ctaFinal}</span>
          <CalendlyPlaceholder />
        </div>
      </div>
    </section>
  );
}
