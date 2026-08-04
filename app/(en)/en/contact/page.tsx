import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { route } from '@/lib/routes';
import { pageSeo } from '@/content/data/seo';
import { ContactView } from '@/components/views/ContactView';

const LOCALE = 'en' as const;
const KEY = 'contact' as const;

export const metadata: Metadata = buildMetadata({
  locale: LOCALE,
  path: route(KEY, LOCALE),
  alternatePath: route(KEY, 'fr'),
  title: pageSeo[KEY].title[LOCALE],
  description: pageSeo[KEY].description[LOCALE],
  keywords: pageSeo[KEY].keywords[LOCALE],
  ogImage: `/og/en/page-${KEY}.png`,
});

export default function Page() {
  return <ContactView locale={LOCALE} />;
}
