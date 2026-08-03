/**
 * Internationalisation FR/EN sans dépendance ni middleware.
 *
 * Choix d'architecture : le site est exporté statiquement (`output: 'export'`),
 * ce qui exclut tout middleware. Les deux langues sont donc servies par des
 * routes réelles — le français à la racine, l'anglais sous /en — et chaque
 * chaîne porte ses deux traductions côte à côte dans `content/`.
 * Avantage : aucune traduction ne peut dériver de sa source sans être vue.
 */

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'fr';

/** Une chaîne dans les deux langues. */
export type I18nText = { readonly fr: string; readonly en: string };
/** Une liste dans les deux langues. */
export type I18nList = { readonly fr: readonly string[]; readonly en: readonly string[] };

export function t(text: I18nText, locale: Locale): string {
  return text[locale];
}

export function tList(list: I18nList, locale: Locale): readonly string[] {
  return list[locale];
}

/** Code de langue complet, pour les attributs `lang` et `hreflang`. */
export const HREFLANG: Record<Locale, string> = {
  fr: 'fr-MA',
  en: 'en',
};
