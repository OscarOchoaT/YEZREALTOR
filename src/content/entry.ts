import type { Localized } from "@/i18n/config";

export const ENTRY_KEY = "yez-entry";
// Set when the visitor has picked a language (step 1 done), so step 2 survives
// the locale navigation that remounts the page.
export const ENTRY_STEP_KEY = "yez-entry-step";

// Brand line: deliberately never translated.
export const ENTRY_TAGLINE = "Ownership, Designed.";

// TODO(client): link "Privacy Policy" / "Terms of Use" to real pages once the
// client provides them; today the checkbox only records the acceptance.
export const ENTRY_I18N: Localized<{
  accept: string;
  sound: string;
  soundHint: string;
  enter: string;
  needAccept: string;
}> = {
  en: {
    accept: "I accept the Privacy Policy and Terms of Use.",
    sound: "Enable sound",
    soundHint: "For the interactive Human + Technology experience.",
    enter: "Enter",
    needAccept: "Accept the policies to continue.",
  },
  es: {
    accept: "Acepto la Política de Privacidad y los Términos de Uso.",
    sound: "Activar sonido",
    soundHint: "Para la experiencia interactiva Humano + Tecnología.",
    enter: "Entrar",
    needAccept: "Acepta las políticas para continuar.",
  },
};
