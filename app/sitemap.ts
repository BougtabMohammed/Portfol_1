import type { MetadataRoute } from 'next';
import { ROUTES, type RouteKey } from '@/lib/routes';
import { projects } from '@/content/data/projects';
import { absolute } from '@/lib/seo';

/**
 * Sitemap généré depuis la table des routes et la liste des projets.
 * Aucune URL n'est écrite à la main : une page ajoutée est une page indexée.
 *
 * Chaque entrée déclare ses alternates `hreflang`, ce que Google recommande
 * pour les sites multilingues — c'est le signal le plus fiable pour qu'il ne
 * traite pas les deux versions comme du contenu dupliqué.
 */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const priorities: Record<RouteKey, number> = {
    home: 1,
    projects: 0.9,
    experience: 0.8,
    about: 0.8,
    faq: 0.7,
    contact: 0.6,
    resume: 0.5,
  };

  const staticPages = (Object.keys(ROUTES) as RouteKey[]).flatMap((key) =>
    (['fr', 'en'] as const).map((locale) => ({
      url: absolute(ROUTES[key][locale]),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: priorities[key],
      alternates: {
        languages: {
          'fr-MA': absolute(ROUTES[key].fr),
          en: absolute(ROUTES[key].en),
        },
      },
    })),
  );

  const projectPages = projects.flatMap((project) =>
    (['fr', 'en'] as const).map((locale) => ({
      url: absolute(`${ROUTES.projects[locale]}/${project.slug[locale]}`),
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: project.featured ? 0.85 : 0.7,
      alternates: {
        languages: {
          'fr-MA': absolute(`${ROUTES.projects.fr}/${project.slug.fr}`),
          en: absolute(`${ROUTES.projects.en}/${project.slug.en}`),
        },
      },
    })),
  );

  return [...staticPages, ...projectPages];
}
