import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { route } from '@/lib/routes';
import { pageSeo } from '@/content/data/seo';
import { ExperienceView } from '@/components/views/ExperienceView';

const LOCALE = 'en' as const;
const KEY = 'experience' as const;

export const metadata: Metadata = buildMetadata({
  locale: LOCALE,
  path: route(KEY, LOCALE),
  alternatePath: route(KEY, 'fr'),
  title: pageSeo[KEY].title[LOCALE],
  description: pageSeo[KEY].description[LOCALE],
  keywords: pageSeo[KEY].keywords[LOCALE],
});

export default function Page() {
  return <ExperienceView locale={LOCALE} />;
}
