import type { Locale } from './i18n';

/**
 * Table de correspondance des routes entre les deux langues.
 *
 * Source unique de vérité pour : la navigation, le sélecteur de langue,
 * les balises `hreflang`, les canoniques et le sitemap. Toute route ajoutée
 * ici est automatiquement prise en compte partout.
 *
 * Les URL françaises sont en français (`/projets`, `/parcours`) et les
 * anglaises en anglais (`/en/projects`, `/en/experience`) : c'est ce qui
 * permet à chaque version de se positionner sur les requêtes de sa langue.
 */
export type RouteKey =
  | 'home'
  | 'projects'
  | 'notes'
  | 'experience'
  | 'about'
  | 'faq'
  | 'contact'
  | 'resume';

export const ROUTES: Record<RouteKey, Record<Locale, string>> = {
  home: { fr: '/', en: '/en' },
  projects: { fr: '/projets', en: '/en/projects' },
  notes: { fr: '/notes', en: '/en/notes' },
  experience: { fr: '/parcours', en: '/en/experience' },
  about: { fr: '/a-propos', en: '/en/about' },
  faq: { fr: '/faq', en: '/en/faq' },
  contact: { fr: '/contact', en: '/en/contact' },
  resume: { fr: '/cv', en: '/en/resume' },
};

export function route(key: RouteKey, locale: Locale): string {
  return ROUTES[key][locale];
}

/** URL d'une étude de cas. */
export function projectRoute(slug: string, locale: Locale): string {
  return `${ROUTES.projects[locale]}/${slug}`;
}

/** URL d'une note technique. */
export function noteRoute(slug: string, locale: Locale): string {
  return `${ROUTES.notes[locale]}/${slug}`;
}

/**
 * Équivalent d'un chemin dans l'autre langue — utilisé par le sélecteur de
 * langue et par les `hreflang`. Retombe sur l'accueil si le chemin est inconnu.
 */
export function alternatePath(pathname: string, target: Locale): string {
  const normalized = normalize(pathname);
  const source: Locale = target === 'en' ? 'fr' : 'en';

  for (const key of Object.keys(ROUTES) as RouteKey[]) {
    if (normalize(ROUTES[key][source]) === normalized) return ROUTES[key][target];
  }

  // Étude de cas : /projets/<slug> ↔ /en/projects/<slug>
  const prefix = normalize(ROUTES.projects[source]);
  if (normalized.startsWith(`${prefix}/`)) {
    const slug = normalized.slice(prefix.length + 1);
    return projectRoute(slug, target);
  }

  return ROUTES.home[target];
}

/** Retire le slash final pour que `/projets/` et `/projets` se comparent. */
function normalize(path: string): string {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path;
}

/** Ordre d'affichage dans la navigation principale. */
export const NAV_KEYS: readonly RouteKey[] = [
  'projects',
  'notes',
  'experience',
  'about',
  'faq',
  'contact',
] as const;
