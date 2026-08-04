import type { Metadata } from 'next';
import type { Locale } from './i18n';
import { HREFLANG } from './i18n';
import { SITE_URL, profile } from '@/content/data/profile';

/**
 * Fabrique de métadonnées.
 *
 * Une seule fonction produit titre, description, canonique, alternates
 * `hreflang`, Open Graph et Twitter Card — ce qui rend impossible d'oublier
 * l'un d'eux sur une page. Les `hreflang` sont réciproques par construction :
 * chaque page déclare les deux langues, y compris la sienne.
 */
export function buildMetadata({
  locale,
  path,
  alternatePath,
  title,
  description,
  keywords,
  type = 'website',
  ogImage,
  noIndex = false,
}: {
  locale: Locale;
  /** Chemin de la page dans sa propre langue, ex. `/projets`. */
  path: string;
  /** Chemin équivalent dans l'autre langue, ex. `/en/projects`. */
  alternatePath: string;
  title: string;
  description: string;
  keywords?: readonly string[];
  type?: 'website' | 'article' | 'profile';
  /** Vignette de partage propre à la page. `/og.png` sert de repli. */
  ogImage?: string;
  /** Retire la page des index — utilisé par les brouillons. */
  noIndex?: boolean;
}): Metadata {
  const frPath = locale === 'fr' ? path : alternatePath;
  const enPath = locale === 'en' ? path : alternatePath;
  const canonical = absolute(path);
  const image = absolute(ogImage ?? '/og.png');

  return {
    // `absolute` neutralise le gabarit du layout racine. Sans cela, une page
    // enfant recevrait « … | Mohammed Bougtab » tandis qu'une page de segment
    // racine ne le recevrait pas — les titres deviendraient incohérents d'une
    // langue à l'autre, et dépasseraient la limite d'affichage de Google.
    // Chaque titre de `content/data/seo.ts` est déjà écrit pour tenir en 60 signes.
    title: { absolute: title },
    description,
    keywords: keywords ? [...keywords] : undefined,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: {
        [HREFLANG.fr]: absolute(frPath),
        [HREFLANG.en]: absolute(enPath),
        'x-default': absolute(frPath),
      },
    },
    openGraph: {
      type: type === 'profile' ? 'profile' : type,
      url: canonical,
      title,
      description,
      siteName: profile.name,
      locale: locale === 'fr' ? 'fr_MA' : 'en_US',
      alternateLocale: locale === 'fr' ? 'en_US' : 'fr_MA',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} — ${profile.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    authors: [{ name: profile.name, url: SITE_URL }],
    creator: profile.name,
  };
}

export function absolute(path: string): string {
  if (path === '/') return `${SITE_URL}/`;
  const withSlash = path.endsWith('/') ? path : `${path}/`;
  return `${SITE_URL}${withSlash}`;
}
