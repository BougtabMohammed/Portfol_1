import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { route } from '@/lib/routes';
import { REVEAL_CONFIDENTIAL_NAMES } from '@/content/data/profile';
import { relatedProjects, type Project } from '@/content/data/projects';
import { projectTraces } from '@/content/data/traces';
import { ui } from '@/content/data/ui';
import { PageShell } from '@/components/layout/PageShell';
import { ArchitectureDiagram } from '@/components/project/ArchitectureDiagram';
import { ExecutionTrace } from '@/components/hero/ExecutionTrace';
import { ProjectCard } from '@/components/project/ProjectCard';
import { ContactCta } from '@/components/sections/ContactCta';
import { Label, Tag } from '@/components/ui/primitives';
import { Reveal } from '@/components/motion/Reveal';
import { GithubIcon } from '@/components/ui/BrandIcons';
import {
  JsonLd,
  jsonLdGraph,
  personSchema,
  websiteSchema,
  projectSchema,
  breadcrumbSchema,
} from '@/lib/jsonld';

/**
 * Étude de cas — la page la plus importante du site.
 *
 * Elle suit toujours le même déroulé : contexte, problème, contraintes,
 * architecture, décisions, évaluation, résultat, rétrospective. La régularité
 * est délibérée : elle rend les projets comparables entre eux et montre que le
 * raisonnement précède la technologie.
 */
export function ProjectDetailView({ project, locale }: { project: Project; locale: Locale }) {
  const path = `${route('projects', locale)}/${project.slug[locale]}`;
  const otherLocale: Locale = locale === 'fr' ? 'en' : 'fr';
  const alternate = `${route('projects', otherLocale)}/${project.slug[otherLocale]}`;
  const related = relatedProjects(project);
  const trace = projectTraces[project.slug.fr];

  const client =
    REVEAL_CONFIDENTIAL_NAMES && project.clientReal
      ? project.clientReal
      : project.client[locale];

  return (
    <PageShell locale={locale} currentKey="projects" alternateHref={alternate}>
      <JsonLd
        data={jsonLdGraph(
          personSchema(locale),
          websiteSchema(locale),
          projectSchema(project, locale, path),
          breadcrumbSchema([
            { name: ui.nav.home[locale], path: route('home', locale) },
            { name: ui.nav.projects[locale], path: route('projects', locale) },
            { name: project.title[locale], path },
          ]),
        )}
      />

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
              <Link href={route('projects', locale)} className="hover:text-[var(--color-text)]">
                {ui.nav.projects[locale]}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-[var(--color-text)]">
              {project.title[locale]}
            </li>
          </ol>
        </nav>

        <header className="border-b border-[var(--color-border)] pb-10">
          <Label className="mb-3">
            {project.domain[locale]} · {project.year}
          </Label>
          <h1 className="max-w-4xl text-[clamp(1.875rem,4.5vw,3rem)] font-bold leading-[1.1] tracking-[-0.025em]">
            {project.title[locale]}
          </h1>
          <p className="prose-column mt-5 text-lg leading-relaxed text-[var(--color-text-muted)]">
            {project.tagline[locale]}
          </p>

          <dl className="mt-9 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            <Meta label={ui.caseStudy.client[locale]} value={client} />
            <Meta label={ui.caseStudy.role[locale]} value={project.role[locale]} />
            <Meta label={ui.caseStudy.period[locale]} value={project.period[locale]} />
            <div>
              <dt className="label-mono mb-2">{ui.caseStudy.stack[locale]}</dt>
              <dd className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </dd>
            </div>
          </dl>

          {project.repository ? (
            <a
              href={project.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-[6px] border border-[var(--color-border)] px-3.5 py-2 font-mono text-xs transition-colors duration-150 hover:border-[var(--color-border-strong)]"
            >
              <GithubIcon size={14} aria-hidden />
              {ui.actions.viewCode[locale]}
            </a>
          ) : null}

          {project.confidential ? (
            <aside className="prose-column mt-7 flex gap-3 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
              <Lock size={15} aria-hidden className="mt-0.5 shrink-0 text-[var(--color-text-muted)]" />
              <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                {ui.meta.confidentialNotice[locale]}
              </p>
            </aside>
          ) : null}
        </header>

        <div className="mt-14 space-y-14">
          {trace ? (
            <Block label="00" title={ui.caseStudy.trace[locale]}>
              <ExecutionTrace trace={trace} locale={locale} />
            </Block>
          ) : null}

          <Block label="01" title={ui.caseStudy.context[locale]}>
            <p className="prose-column leading-relaxed">{project.context[locale]}</p>
          </Block>

          <Block label="02" title={ui.caseStudy.problem[locale]}>
            <p className="prose-column text-lg leading-relaxed">{project.problem[locale]}</p>
          </Block>

          <Block label="03" title={ui.caseStudy.constraints[locale]}>
            <ul className="prose-column space-y-3">
              {project.constraints[locale].map((constraint) => (
                <li key={constraint.slice(0, 40)} className="relative pl-5 leading-relaxed">
                  <span
                    aria-hidden
                    className="absolute left-0 top-[0.65em] size-1.5 rounded-[2px] bg-[var(--color-accent)]"
                  />
                  {constraint}
                </li>
              ))}
            </ul>
          </Block>

          <Block label="04" title={ui.caseStudy.architecture[locale]}>
            <ArchitectureDiagram
              layers={project.architecture.layers}
              caption={project.architecture.caption[locale]}
              locale={locale}
            />
          </Block>

          <Block label="05" title={ui.caseStudy.decisions[locale]}>
            <ul className="space-y-4">
              {project.decisions.map((decision) => (
                <li
                  key={decision.choice.fr}
                  className="rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 md:p-6"
                >
                  <h3 className="text-base font-semibold leading-snug">
                    {decision.choice[locale]}
                  </h3>
                  <div className="mt-4 space-y-3">
                    <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                      <span className="label-mono mr-2 inline-block text-[var(--color-accent)]">
                        {ui.caseStudy.decisionRationale[locale]}
                      </span>
                      {decision.rationale[locale]}
                    </p>
                    <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                      <span className="label-mono mr-2 inline-block">
                        {ui.caseStudy.decisionAlternative[locale]}
                      </span>
                      {decision.alternative[locale]}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Block>

          <Block label="06" title={ui.caseStudy.evaluation[locale]}>
            <ul className="prose-column space-y-3">
              {project.evaluation[locale].map((item) => (
                <li key={item.slice(0, 40)} className="relative pl-5 leading-relaxed">
                  <span
                    aria-hidden
                    className="absolute left-0 top-[0.65em] size-1.5 rounded-[2px] bg-[var(--color-accent)]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Block>

          <Block label="07" title={ui.caseStudy.outcome[locale]}>
            <ul className="prose-column space-y-3">
              {project.outcome[locale].map((item) => (
                <li key={item.slice(0, 40)} className="relative pl-5 leading-relaxed">
                  <span
                    aria-hidden
                    className="absolute left-0 top-[0.65em] size-1.5 rounded-[2px] bg-[var(--color-accent)]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Block>

          <Block label="08" title={ui.caseStudy.retrospective[locale]}>
            <blockquote className="prose-column border-l-2 border-[var(--color-highlight)] py-1 pl-6">
              <p className="leading-relaxed">{project.retrospective[locale]}</p>
            </blockquote>
          </Block>
        </div>

        <footer className="mt-16 border-t border-[var(--color-border)] pt-10">
          <Link
            href={route('projects', locale)}
            className="inline-flex items-center gap-2 font-mono text-sm text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text)]"
          >
            <ArrowLeft size={15} aria-hidden />
            {ui.actions.backToProjects[locale]}
          </Link>

          <h2 className="mt-10 mb-5 text-lg font-semibold">{ui.caseStudy.related[locale]}</h2>
          <ul className="grid gap-5 md:grid-cols-2">
            {related.map((other) => (
              <li key={other.slug.fr}>
                <ProjectCard project={other} locale={locale} />
              </li>
            ))}
          </ul>
        </footer>
      </article>

      <ContactCta locale={locale} />
    </PageShell>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label-mono mb-2">{label}</dt>
      <dd className="text-sm leading-snug">{value}</dd>
    </div>
  );
}

function Block({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="section">
      <div className="grid gap-4 md:grid-cols-[80px_1fr] md:gap-8">
        <Label className="md:pt-1.5">{label}</Label>
        <div>
          <h2 className="mb-5 text-xl font-semibold tracking-[-0.015em] md:text-2xl">{title}</h2>
          {children}
        </div>
      </div>
    </Reveal>
  );
}
