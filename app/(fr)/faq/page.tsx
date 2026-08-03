import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { route } from '@/lib/routes';
import { pageSeo } from '@/content/data/seo';
import { FaqView } from '@/components/views/FaqView';

const LOCALE = 'fr' as const;
const KEY = 'faq' as const;

export const metadata: Metadata = buildMetadata({
  locale: LOCALE,
  path: route(KEY, LOCALE),
  alternatePath: route(KEY, 'en'),
  title: pageSeo[KEY].title[LOCALE],
  description: pageSeo[KEY].description[LOCALE],
  keywords: pageSeo[KEY].keywords[LOCALE],
});

export default function Page() {
  return <FaqView locale={LOCALE} />;
}
