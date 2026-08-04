import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { route } from '@/lib/routes';
import { pageSeo } from '@/content/data/seo';
import { AboutView } from '@/components/views/AboutView';

const LOCALE = 'fr' as const;
const KEY = 'about' as const;

export const metadata: Metadata = buildMetadata({
  locale: LOCALE,
  path: route(KEY, LOCALE),
  alternatePath: route(KEY, 'en'),
  title: pageSeo[KEY].title[LOCALE],
  description: pageSeo[KEY].description[LOCALE],
  keywords: pageSeo[KEY].keywords[LOCALE],
  ogImage: `/og/fr/page-${KEY}.png`,
});

export default function Page() {
  return <AboutView locale={LOCALE} />;
}
