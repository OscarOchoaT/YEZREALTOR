import type { Localized } from "@/i18n/config";

export const ENTRY_KEY = "yez-entry";

// TODO(client): link "Privacy Policy" / "Terms of Use" to real pages once the
// client provides them; today the checkbox only records the acceptance.
export const ENTRY_I18N: Localized<{
  languageHeading: string;
  accept: string;
  sound: string;
  soundHint: string;
  enter: string;
  needAccept: string;
}> = {
  en: {
    languageHeading: "Choose your language",
    accept: "I accept the Privacy Policy and Terms of Use.",
    sound: "Enable sound",
    soundHint: "For the interactive Human + Technology experience.",
    enter: "Enter",
    needAccept: "Accept the policies to continue.",
  },
  es: {
    languageHeading: "Elige tu idioma",
    accept: "Acepto la Política de Privacidad y los Términos de Uso.",
    sound: "Activar sonido",
    soundHint: "Para la experiencia interactiva Humano + Tecnología.",
    enter: "Entrar",
    needAccept: "Acepta las políticas para continuar.",
  },
};
