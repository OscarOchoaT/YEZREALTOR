import type { Metadata } from "next";
import MethodPhasePage from "@/components/MethodPhasePage";
import { PHASE_META } from "@/content/meta";
import { hasLocale } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/metodo/design">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { title, description } = PHASE_META[lang].design;
  return {
    title,
    description,
    alternates: { canonical: `/${lang}/metodo/design`, languages: { en: "/en/metodo/design", es: "/es/metodo/design" } },
  };
}

export default function Page() {
  return <MethodPhasePage phaseId="design" />;
}
