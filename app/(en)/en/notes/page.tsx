import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { route } from '@/lib/routes';
import { pageSeo } from '@/content/data/seo';
import { NotesView } from '@/components/views/NotesView';

const LOCALE = 'en' as const;

export const metadata: Metadata = buildMetadata({
  locale: LOCALE,
  path: route('notes', LOCALE),
  alternatePath: route('notes', 'fr'),
  title: pageSeo.notes.title[LOCALE],
  description: pageSeo.notes.description[LOCALE],
  keywords: pageSeo.notes.keywords[LOCALE],
  ogImage: '/og/en/page-notes.png',
});

export default function Page() {
  return <NotesView locale={LOCALE} />;
}
