import type { MetadataRoute } from 'next';
import { profile } from '@/content/data/profile';

// Les routes de métadonnées doivent être marquées statiques pour être écrites
// sur disque à l'export ; sans cela Next les traite comme dynamiques et échoue.
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — AI Engineer`,
    short_name: 'M. Bougtab',
    description: profile.summary.fr,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0c10',
    theme_color: '#0a0c10',
    lang: 'fr',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
