import { Download, Printer } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { route } from '@/lib/routes';
import { experiences } from '@/content/data/experiences';
import { degrees, certifications } from '@/content/data/education';
import { skillGroups } from '@/content/data/skills';
import { REVEAL_CONFIDENTIAL_NAMES, profile } from '@/content/data/profile';
import { pageSeo } from '@/content/data/seo';
import { ui } from '@/content/data/ui';
import { PageShell } from '@/components/layout/PageShell';
import { PrintButton } from '@/components/contact/PrintButton';
import { JsonLd, jsonLdGraph, personSchema, websiteSchema, webPageSchema } from '@/lib/jsonld';

/**
 * CV — version HTML imprimable.
 *
 * Mise en page pensée pour sortir proprement en A4 (voir la règle `@media print`
 * dans globals.css) : la navigation, le pied de page et les boutons disparaissent,
 * les couleurs passent en noir sur blanc et les sections ne se coupent pas entre
 * deux pages. Le PDF téléchargeable reste proposé pour ceux qui veulent un fichier.
 */
export function ResumeView({ locale }: { locale: Locale }) {
  const path = route('resume', locale);
  const alternate = route('resume', locale === 'fr' ? 'en' : 'fr');

  return (
    <PageShell locale={locale} currentKey="contact" alternateHref={alternate}>
      <JsonLd
        data={jsonLdGraph(
          personSchema(locale),
          websiteSchema(locale),
          webPageSchema({
            locale,
            path,
            name: pageSeo.resume.title[locale],
            description: pageSeo.resume.description[locale],
          }),
        )}
      />

      <div className="container-page max-w-4xl py-12 md:py-16">
        <div className="mb-8 flex flex-wrap gap-3 no-print">
          <a
            href="/cv-mohammed-bougtab.pdf"
            download
            className="inline-flex items-center gap-2 rounded-[6px] bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-[var(--color-on-accent)] transition-colors duration-150 hover:bg-[var(--color-accent-hover)]"
          >
            <Download size={16} aria-hidden />
            {ui.actions.downloadCv[locale]}
          </a>
          <PrintButton locale={locale}>
            <Printer size={16} aria-hidden />
            {ui.actions.printPage[locale]}
          </PrintButton>
        </div>

        <article>
          <header className="border-b border-[var(--color-border)] pb-6">
            <h1 className="text-3xl font-bold tracking-[-0.025em]">{profile.name}</h1>
            <p className="mt-1.5 font-mono text-sm text-[var(--color-accent)]">
              {profile.jobTitle[locale]}
            </p>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-[var(--color-text-muted)]">
              <span>{profile.location[locale]}</span>
              <span>{profile.phoneDisplay}</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <a href={profile.github}>{profile.githubHandle}</a>
            </p>
            <p className="mt-5 leading-relaxed">{profile.summary[locale]}</p>
          </header>

          <ResumeSection title={locale === 'fr' ? 'Expériences' : 'Experience'}>
            {experiences.map((experience) => {
              const company =
                REVEAL_CONFIDENTIAL_NAMES && experience.companyReal
                  ? experience.companyReal
                  : experience.company[locale];
              return (
                <div key={experience.id} className="print-block mb-7 last:mb-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-sm font-semibold">
                      {experience.role[locale]}
                      <span className="font-normal text-[var(--color-text-muted)]">
                        {' '}
                        — {company}, {experience.location[locale]}
                      </span>
                    </h3>
                    <span className="font-mono text-xs text-[var(--color-text-muted)]">
                      {experience.period[locale]}
                    </span>
                  </div>
                  <ul className="mt-2.5 space-y-1.5">
                    {experience.bullets[locale].map((bullet) => (
                      <li
                        key={bullet.slice(0, 40)}
                        className="relative pl-4 text-sm leading-relaxed text-[var(--color-text-muted)]"
                      >
                        <span aria-hidden className="absolute left-0">
                          ·
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </ResumeSection>

          <ResumeSection title={locale === 'fr' ? 'Formation' : 'Education'}>
            {degrees.map((degree) => (
              <div key={degree.id} className="print-block mb-4 last:mb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-sm font-semibold">
                    {degree.institution}
                    <span className="font-normal text-[var(--color-text-muted)]">
                      {' '}
                      — {degree.degree[locale]}
                    </span>
                  </h3>
                  <span className="font-mono text-xs text-[var(--color-text-muted)]">
                    {degree.period}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{degree.field[locale]}</p>
              </div>
            ))}
          </ResumeSection>

          <ResumeSection title={locale === 'fr' ? 'Compétences' : 'Skills'}>
            <dl className="space-y-2.5">
              {skillGroups.map((group) => (
                <div key={group.id} className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
                  <dt className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--color-accent)]">
                    {group.title[locale]}
                  </dt>
                  <dd className="text-sm text-[var(--color-text-muted)]">
                    {group.skills.join(' · ')}
                  </dd>
                </div>
              ))}
            </dl>
          </ResumeSection>

          <ResumeSection title={ui.sections.certifications[locale]}>
            <ul className="space-y-1.5">
              {certifications.map((certification) => (
                <li key={certification.name} className="text-sm text-[var(--color-text-muted)]">
                  {certification.name} — {certification.issuer}
                </li>
              ))}
            </ul>
          </ResumeSection>

          <ResumeSection title={ui.sections.languages[locale]}>
            <p className="text-sm text-[var(--color-text-muted)]">
              {profile.languages
                .map((language) => `${language.name[locale]} (${language.level[locale]})`)
                .join(' · ')}
            </p>
          </ResumeSection>
        </article>
      </div>
    </PageShell>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="print-tight mt-8 border-t border-[var(--color-border)] pt-6">
      <h2 className="label-mono mb-4">{title}</h2>
      {children}
    </section>
  );
}
