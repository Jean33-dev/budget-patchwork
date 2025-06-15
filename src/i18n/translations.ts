
// Types et utilitaires
export type Currency = "EUR" | "USD" | "GBP";

export const supportedLanguages = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" },
];

// Import des traductions de chaque langue
import frTranslations from "./locales/fr";
import enTranslations from "./locales/en";
import esTranslations from "./locales/es";
import deTranslations from "./locales/de";
import itTranslations from "./locales/it";

/**
 * Pour ajouter une nouvelle langue :
 * 1. Créez le fichier correspondant dans locales/ (e.g. pt.ts).
 * 2. Ajoutez l'objet dans supportedLanguages ci-dessus.
 * 3. Ajoutez la langue dans l'objet translations ci-dessous.
 */
export const translations: Record<string, Record<string, string>> = {
  fr: frTranslations,
  en: enTranslations,
  es: esTranslations,
  de: deTranslations,
  it: itTranslations,
};
