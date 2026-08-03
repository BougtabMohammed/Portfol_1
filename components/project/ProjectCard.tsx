import Link from 'next/link';
import { ArrowUpRight, Lock } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import type { Project } from '@/content/data/projects';
import { ui } from '@/content/data/ui';
import { Tag } from '@/components/ui/primitives';

/**
 * Le niveau de titre est paramétrable parce que la carte apparaît à deux
 * profondeurs différentes : directement sous le H1 sur la page index (donc H2),
 * et sous un H2 dans les sections « à la une » et « autres études de cas »
 * (donc H3). Un niveau figé créerait un saut de hiérarchie sur l'une des deux.
 */
export function ProjectCard({
  project,
  locale,
  headingLevel = 3,
}: {
  project: Project;
  locale: Locale;
  headingLevel?: 2 | 3;
}) {
  const href = `${locale === 'fr' ? '/projets' : '/en/projects'}/${project.slug[locale]}`;
  const Heading = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <article className="group relative flex h-full flex-col rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors duration-150 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-hover)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
          {project.domain[locale]} · {project.year}
        </span>
        {project.confidential ? (
          <span
            className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--color-text-muted)]"
            title={ui.meta.confidentialNotice[locale]}
          >
            <Lock size={11} aria-hidden />
            {ui.meta.confidentialBadge[locale]}
          </span>
        ) : null}
      </div>

      <Heading className="text-lg font-semibold leading-snug tracking-[-0.01em]">
        {/* Le lien couvre toute la carte : la cible tactile est la carte entière. */}
        <Link href={href} className="after:absolute after:inset-0 after:content-['']">
          {project.title[locale]}
        </Link>
      </Heading>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
        {project.tagline[locale]}
      </p>

      <ul className="mt-5 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 5).map((tech) => (
          <li key={tech}>
            <Tag>{tech}</Tag>
          </li>
        ))}
      </ul>

      <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-accent)]">
        {ui.actions.readCaseStudy[locale]}
        <ArrowUpRight
          size={13}
          aria-hidden
          className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
        />
      </span>
    </article>
  );
}
