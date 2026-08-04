import { publishedNotes } from '@/content/data/notes';
import { profile, SITE_URL } from '@/content/data/profile';
import { pageSeo } from '@/content/data/seo';
import { noteRoute, route } from '@/lib/routes';
import { absolute } from '@/lib/seo';

const LOCALE = 'fr' as const;

// Route de métadonnées : marquée statique pour être écrite sur disque à l'export.
export const dynamic = 'force-static';

/** Échappe le texte pour du XML — un `&` nu invalide le flux entier. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function GET() {
  const self = `${SITE_URL}${route('notes', LOCALE)}/feed.xml`;

  // Seules les notes publiées entrent au flux : un abonné ne doit jamais recevoir
  // un texte que son auteur n'a pas relu.
  const items = publishedNotes
    .map((note) => {
      const url = absolute(noteRoute(note.slug[LOCALE], LOCALE));
      return `    <item>
      <title>${escapeXml(note.title[LOCALE])}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(note.excerpt[LOCALE])}</description>
      <pubDate>${new Date(note.date).toUTCString()}</pubDate>
      ${note.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${profile.name} — ${pageSeo.notes.title[LOCALE]}`)}</title>
    <link>${absolute(route('notes', LOCALE))}</link>
    <description>${escapeXml(pageSeo.notes.description[LOCALE])}</description>
    <language>fr-MA</language>
    <atom:link href="${self}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
