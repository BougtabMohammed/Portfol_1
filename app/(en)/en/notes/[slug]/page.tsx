import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { noteRoute } from '@/lib/routes';
import { notes, getNoteBySlug } from '@/content/data/notes';
import { NoteDetailView } from '@/components/views/NoteDetailView';

const LOCALE = 'en' as const;

export function generateStaticParams() {
  // Les brouillons sont générés eux aussi : ils doivent rester consultables par
  // leur URL directe pour être relus. C'est `noindex` et l'absence dans le
  // sitemap, le flux et l'index qui les tiennent hors de la publication.
  return notes.map((note) => ({ slug: note.slug.en }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug, LOCALE);
  if (!note) return {};

  return buildMetadata({
    locale: LOCALE,
    path: noteRoute(note.slug.en, LOCALE),
    alternatePath: noteRoute(note.slug.fr, 'fr'),
    title: note.title.en,
    description: note.excerpt.en,
    keywords: note.tags,
    type: 'article',
    ogImage: `/og/en/note-${note.slug.fr}.png`,
    noIndex: note.draft,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getNoteBySlug(slug, LOCALE);
  if (!note) notFound();

  return <NoteDetailView note={note} locale={LOCALE} />;
}
