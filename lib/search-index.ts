import type { Locale } from './i18n';
import type { LocaleIndex } from './vector.ts';

/**
 * Chargement paresseux de l'index de recherche.
 *
 * L'import est dynamique et par langue : webpack en fait un morceau séparé, qui
 * n'est téléchargé qu'à la première ouverture de la palette. L'index reste donc
 * hors du chemin critique — le budget de première visite n'en porte rien.
 *
 * Le résultat est mémorisé, y compris la promesse elle-même : deux ouvertures
 * rapprochées ne déclenchent qu'un seul téléchargement.
 */
const cache = new Map<Locale, Promise<LocaleIndex>>();

export function loadSearchIndex(locale: Locale): Promise<LocaleIndex> {
  const cached = cache.get(locale);
  if (cached) return cached;

  const promise: Promise<LocaleIndex> = (
    locale === 'en'
      ? import('@/content/generated/search-index.en.json')
      : import('@/content/generated/search-index.fr.json')
  ).then((module) => (module.default ?? module) as unknown as LocaleIndex);

  cache.set(locale, promise);
  return promise;
}
