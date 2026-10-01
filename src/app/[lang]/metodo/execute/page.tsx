import type { Metadata } from "next";
import MethodPhasePage from "@/components/MethodPhasePage";
import { PHASE_META } from "@/content/meta";
import { hasLocale } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/metodo/execute">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { title, description } = PHASE_META[lang].execute;
  return {
    title,
    description,
    alternates: { canonical: `/${lang}/metodo/execute`, languages: { en: "/en/metodo/execute", es: "/es/metodo/execute" } },
  };
}

export default function Page() {
  return <MethodPhasePage phaseId="execute" />;
}
