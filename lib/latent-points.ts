import type { DocType } from './vector.ts';
import frIndex from '@/content/generated/search-index.fr.json';
import enIndex from '@/content/generated/search-index.en.json';
import type { Locale } from './i18n';

/**
 * Coordonnées de la constellation, extraites de l'index au rendu serveur.
 *
 * Point important pour le budget : seuls l'identifiant, le type, le titre et les
 * deux coordonnées voyagent — soit ~2 Ko dans la charge utile du serveur. L'index
 * complet (80 Ko) reste chargé paresseusement par la palette et ne pèse rien sur
 * le premier rendu, alors même que la constellation s'affiche immédiatement.
 *
 * Les positions viennent de l'analyse en composantes principales des vecteurs
 * TF-IDF : deux points proches à l'écran le sont réellement dans l'espace des
 * termes. Ce n'est pas une disposition décorative.
 */
export type LatentPoint = {
  id: string;
  type: DocType;
  title: string;
  href: string;
  x: number;
  y: number;
};

export function getLatentPoints(locale: Locale): LatentPoint[] {
  const index = locale === 'en' ? enIndex : frIndex;
  return index.docs.map((doc) => ({
    id: doc.id,
    type: doc.type as DocType,
    title: doc.title,
    href: doc.href,
    x: doc.x,
    y: doc.y,
  }));
}
