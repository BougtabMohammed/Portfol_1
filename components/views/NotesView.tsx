import Link from 'next/link';
import { ArrowUpRight, Rss } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { noteRoute, route } from '@/lib/routes';
import { publishedNotes } from '@/content/data/notes';
import { pageSeo } from '@/content/data/seo';
import { ui } from '@/content/data/ui';
import { PageShell } from '@/components/layout/PageShell';
import { ContactCta } from '@/components/sections/ContactCta';
import { Label, Tag } from '@/components/ui/primitives';
import { JsonLd, jsonLdGraph, personSchema, websiteSchema, webPageSchema } from '@/lib/jsonld';

/**
 * Index des notes techniques.
 *
 * Ne liste que les articles publiés : un brouillon n'apparaît nulle part, pas
 * même ici. Si tout est en brouillon, la page affiche un état vide assumé plutôt
 * qu'une liste factice — un blog qui ment sur son contenu est pire qu'un blog vide.
 */
export function NotesView({ locale }: { locale: Locale }) {
  const path = route('notes', locale);
  const alternate = route('notes', locale === 'fr' ? 'en' : 'fr');

  return (
    <PageShell locale={locale} currentKey="notes" alternateHref={alternate}>
      <JsonLd
        data={jsonLdGraph(
          personSchema(locale),
          websiteSchema(locale),
          webPageSchema({
            locale,
            path,
            name: pageSeo.notes.title[locale],
            description: pageSeo.notes.description[locale],
          }),
        )}
      />

      <div className="container-page py-16 md:py-20">
        <header className="mb-12 md:mb-16">
          <Label className="mb-3">{ui.nav.notes[locale]}</Label>
          <h1 className="max-w-3xl text-[clamp(1.875rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.025em]">
            {locale === 'fr' ? 'Notes techniques' : 'Technical notes'}
          </h1>
          <p className="prose-column mt-5 text-lg leading-relaxed text-[var(--color-text-muted)]">
            {ui.notes.lead[locale]}
          </p>
          <a
            href={`${path}/feed.xml`}
            className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text)]"
          >
            <Rss size={13} aria-hidden />
            {ui.notes.feed[locale]}
          </a>
        </header>

        {publishedNotes.length === 0 ? (
          <p className="rounded-[8px] border border-dashed border-[var(--color-border)] px-6 py-12 text-center text-[var(--color-text-muted)]">
            {ui.notes.empty[locale]}
          </p>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2">
            {publishedNotes.map((note) => (
              <li key={note.slug.fr}>
                <article className="group relative flex h-full flex-col rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors duration-150 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-hover)]">
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                    <time dateTime={note.date}>
                      {new Date(note.date).toLocaleDateString(locale === 'fr' ? 'fr-MA' : 'en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    {' · '}
                    {note.readingMinutes} {ui.notes.readingTime[locale]}
                  </p>

                  <h2 className="text-lg font-semibold leading-snug tracking-[-0.01em]">
                    <Link
                      href={noteRoute(note.slug[locale], locale)}
                      className="after:absolute after:inset-0 after:content-['']"
                    >
                      {note.title[locale]}
                    </Link>
                  </h2>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {note.excerpt[locale]}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {note.tags.map((tag) => (
                      <li key={tag}>
                        <Tag>{tag}</Tag>
                      </li>
                    ))}
                  </ul>

                  <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-accent)]">
                    {locale === 'fr' ? 'Lire' : 'Read'}
                    <ArrowUpRight
                      size={13}
                      aria-hidden
                      className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                    />
                  </span>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ContactCta locale={locale} />
    </PageShell>
  );
}
