import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, PenLine } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { noteRoute, projectRoute, route } from '@/lib/routes';
import type { Note, NoteBlock } from '@/content/data/notes';
import { projects } from '@/content/data/projects';
import { ui } from '@/content/data/ui';
import { PageShell } from '@/components/layout/PageShell';
import { ContactCta } from '@/components/sections/ContactCta';
import { Label, Tag } from '@/components/ui/primitives';
import {
  JsonLd,
  jsonLdGraph,
  personSchema,
  websiteSchema,
  articleSchema,
  breadcrumbSchema,
} from '@/lib/jsonld';

/**
 * Article.
 *
 * Un brouillon reste accessible par son URL directe — c'est ainsi qu'on le
 * relit — mais il l'annonce par un bandeau, il porte `noindex`, et il n'apparaît
 * ni dans la liste, ni dans le flux, ni dans la recherche.
 */
export function NoteDetailView({ note, locale }: { note: Note; locale: Locale }) {
  const path = noteRoute(note.slug[locale], locale);
  const otherLocale: Locale = locale === 'fr' ? 'en' : 'fr';
  const alternate = noteRoute(note.slug[otherLocale], otherLocale);
  const related = note.relatedProject
    ? projects.find((project) => project.slug.fr === note.relatedProject)
    : undefined;

  return (
    <PageShell locale={locale} currentKey="notes" alternateHref={alternate}>
      {/* Un brouillon n'est pas une publication : il ne prétend pas en être une
          auprès des moteurs non plus. */}
      {note.draft ? null : (
        <JsonLd
          data={jsonLdGraph(
            personSchema(locale),
            websiteSchema(locale),
            articleSchema(note, locale, path),
            breadcrumbSchema([
              { name: ui.nav.home[locale], path: route('home', locale) },
              { name: ui.nav.notes[locale], path: route('notes', locale) },
              { name: note.title[locale], path },
            ]),
          )}
        />
      )}

      <article className="container-page py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--color-text-muted)]">
            <li>
              <Link href={route('home', locale)} className="hover:text-[var(--color-text)]">
                {ui.nav.home[locale]}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={route('notes', locale)} className="hover:text-[var(--color-text)]">
                {ui.nav.notes[locale]}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-[var(--color-text)]">
              {note.title[locale]}
            </li>
          </ol>
        </nav>

        {note.draft ? (
          <aside className="prose-column mb-10 flex gap-3 rounded-[8px] border border-[var(--color-highlight)]/40 bg-[var(--color-highlight)]/[0.08] p-4">
            <PenLine size={16} aria-hidden className="mt-0.5 shrink-0 text-[var(--color-highlight)]" />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-highlight)]">
                {ui.notes.draftBadge[locale]}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {ui.notes.draftNotice[locale]}
              </p>
            </div>
          </aside>
        ) : null}

        <header className="border-b border-[var(--color-border)] pb-8">
          <Label className="mb-3">
            <time dateTime={note.date}>
              {new Date(note.date).toLocaleDateString(locale === 'fr' ? 'fr-MA' : 'en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {' · '}
            {note.readingMinutes} {ui.notes.readingTime[locale]}
          </Label>

          <h1 className="max-w-4xl text-[clamp(1.875rem,4.5vw,3rem)] font-bold leading-[1.1] tracking-[-0.03em]">
            {note.title[locale]}
          </h1>

          <p className="prose-column mt-5 text-lg leading-relaxed text-[var(--color-text-muted)]">
            {note.excerpt[locale]}
          </p>

          <ul className="mt-6 flex flex-wrap gap-1.5">
            {note.tags.map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        </header>

        <div className="mt-10 space-y-6">
          {note.body.map((block, index) => (
            <Block key={index} block={block} locale={locale} />
          ))}
        </div>

        <footer className="mt-14 border-t border-[var(--color-border)] pt-8">
          {related ? (
            <Link
              href={projectRoute(related.slug[locale], locale)}
              className="group flex flex-col gap-2 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors duration-150 hover:border-[var(--color-accent)]/40"
            >
              <span className="label-mono">{ui.notes.relatedProject[locale]}</span>
              <span className="flex items-center gap-2 font-medium">
                {related.title[locale]}
                <ArrowUpRight
                  size={15}
                  aria-hidden
                  className="text-[var(--color-accent)] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                />
              </span>
            </Link>
          ) : null}

          <Link
            href={route('notes', locale)}
            className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text)]"
          >
            <ArrowLeft size={15} aria-hidden />
            {ui.notes.backToNotes[locale]}
          </Link>
        </footer>
      </article>

      <ContactCta locale={locale} />
    </PageShell>
  );
}

/** Rendu d'un bloc. Le jeu est fermé : un article ne peut pas contenir autre chose. */
function Block({ block, locale }: { block: NoteBlock; locale: Locale }) {
  switch (block.kind) {
    case 'heading':
      return (
        <h2 className="prose-column pt-6 text-xl font-semibold tracking-[-0.015em] md:text-2xl">
          {block.text[locale]}
        </h2>
      );

    case 'paragraph':
      return (
        <p
          className="prose-column leading-relaxed"
          // Seul le gras est interprété, via **…**. Volontairement minimal :
          // un jeu de balises restreint ne peut pas produire de rendu inattendu.
          dangerouslySetInnerHTML={{ __html: emphasise(block.text[locale]) }}
        />
      );

    case 'list':
      return (
        <ul className="prose-column space-y-3">
          {block.items[locale].map((item) => (
            <li key={item.slice(0, 40)} className="relative pl-5 leading-relaxed">
              <span
                aria-hidden
                className="absolute left-0 top-[0.65em] size-1.5 rounded-[2px] bg-[var(--color-accent)]"
              />
              {item}
            </li>
          ))}
        </ul>
      );

    case 'quote':
      return (
        <blockquote className="prose-column border-l-2 border-[var(--color-accent)] py-1 pl-6">
          <p className="text-lg font-medium leading-relaxed tracking-[-0.01em]">
            {block.text[locale]}
          </p>
        </blockquote>
      );

    case 'callout':
      return (
        <aside className="prose-column rounded-[8px] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            {block.text[locale]}
          </p>
        </aside>
      );

    case 'code':
      return (
        <pre className="overflow-x-auto rounded-[8px] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 font-mono text-[13px] leading-relaxed">
          <code>{block.code}</code>
        </pre>
      );
  }
}

/** Convertit `**texte**` en `<strong>`, et échappe tout le reste. */
function emphasise(input: string): string {
  const escaped = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}
