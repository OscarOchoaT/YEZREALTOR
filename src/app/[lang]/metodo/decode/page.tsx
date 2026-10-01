import type { Metadata } from "next";
import MethodPhasePage from "@/components/MethodPhasePage";
import { PHASE_META } from "@/content/meta";
import { hasLocale } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/metodo/decode">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { title, description } = PHASE_META[lang].decode;
  return {
    title,
    description,
    alternates: { canonical: `/${lang}/metodo/decode`, languages: { en: "/en/metodo/decode", es: "/es/metodo/decode" } },
  };
}

export default function Page() {
  return <MethodPhasePage phaseId="decode" />;
}
