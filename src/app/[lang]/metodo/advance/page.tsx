import type { Metadata } from "next";
import MethodPhasePage from "@/components/MethodPhasePage";
import { PHASE_META } from "@/content/meta";
import { hasLocale } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/metodo/advance">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { title, description } = PHASE_META[lang].advance;
  return {
    title,
    description,
    alternates: { canonical: `/${lang}/metodo/advance`, languages: { en: "/en/metodo/advance", es: "/es/metodo/advance" } },
  };
}

export default function Page() {
  return <MethodPhasePage phaseId="advance" />;
}
