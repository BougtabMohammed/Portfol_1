import type { Locale } from '@/lib/i18n';
import { route } from '@/lib/routes';
import { projects, projectTags } from '@/content/data/projects';
import { pageSeo } from '@/content/data/seo';
import { ui } from '@/content/data/ui';
import { PageShell } from '@/components/layout/PageShell';
import { ProjectCard } from '@/components/project/ProjectCard';
import { ProjectFilterBar } from '@/components/project/ProjectFilterBar';
import { ContactCta } from '@/components/sections/ContactCta';
import { Label } from '@/components/ui/primitives';
import { JsonLd, jsonLdGraph, personSchema, websiteSchema, webPageSchema } from '@/lib/jsonld';

const LIST_ID = 'project-list';
const EMPTY_ID = 'project-empty';

export function ProjectsView({ locale }: { locale: Locale }) {
  const path = route('projects', locale);
  const alternate = route('projects', locale === 'fr' ? 'en' : 'fr');

  // Seuls les filtres réellement productifs sont proposés.
  const tags = projectTags
    .filter((tag) => projects.some((project) => project.tags.includes(tag.id)))
    .map((tag) => ({ id: tag.id, label: tag.label[locale] }));

  return (
    <PageShell locale={locale} currentKey="projects" alternateHref={alternate}>
      <JsonLd
        data={jsonLdGraph(
          personSchema(locale),
          websiteSchema(locale),
          webPageSchema({
            locale,
            path,
            name: pageSeo.projects.title[locale],
            description: pageSeo.projects.description[locale],
          }),
        )}
      />

      <div className="container-page py-16 md:py-20">
        <header className="mb-12 md:mb-16">
          <Label className="mb-3">{ui.sections.featuredWork[locale]}</Label>
          <h1 className="max-w-3xl text-[clamp(1.875rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.025em]">
            {locale === 'fr'
              ? 'Six systèmes, documentés de la même façon'
              : 'Six systems, documented the same way'}
          </h1>
          <p className="prose-column mt-5 text-lg leading-relaxed text-[var(--color-text-muted)]">
            {ui.sections.featuredWorkLead[locale]}
          </p>
        </header>

        <ProjectFilterBar
          tags={tags}
          allLabel={ui.meta.filterAll[locale]}
          groupLabel={ui.meta.filterLabel[locale]}
          countOne={locale === 'fr' ? '{n} projet affiché' : '{n} project shown'}
          countMany={locale === 'fr' ? '{n} projets affichés' : '{n} projects shown'}
          targetId={LIST_ID}
          emptyId={EMPTY_ID}
        />

        <ul id={LIST_ID} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <li key={project.slug.fr} data-tags={project.tags.join(' ')}>
              <ProjectCard project={project} locale={locale} headingLevel={2} />
            </li>
          ))}
        </ul>

        <p id={EMPTY_ID} hidden className="text-[var(--color-text-muted)]">
          {ui.meta.noResults[locale]}
        </p>
      </div>

      <ContactCta locale={locale} />
    </PageShell>
  );
}
