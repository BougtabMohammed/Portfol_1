import type { Locale } from '@/lib/i18n';
import { route } from '@/lib/routes';
import { certifications } from '@/content/data/education';
import { profile } from '@/content/data/profile';
import { pageSeo } from '@/content/data/seo';
import { ui } from '@/content/data/ui';
import { PageShell } from '@/components/layout/PageShell';
import { Timeline } from '@/components/sections/Timeline';
import { DualEducation } from '@/components/sections/DualEducation';
import { SkillLayers } from '@/components/sections/SkillLayers';
import { ContactCta } from '@/components/sections/ContactCta';
import { Label, Section, SectionHeader } from '@/components/ui/primitives';
import { Reveal } from '@/components/motion/Reveal';
import { JsonLd, jsonLdGraph, personSchema, websiteSchema, webPageSchema } from '@/lib/jsonld';

export function ExperienceView({ locale }: { locale: Locale }) {
  const path = route('experience', locale);
  const alternate = route('experience', locale === 'fr' ? 'en' : 'fr');

  return (
    <PageShell locale={locale} currentKey="experience" alternateHref={alternate}>
      <JsonLd
        data={jsonLdGraph(
          personSchema(locale),
          websiteSchema(locale),
          webPageSchema({
            locale,
            path,
            name: pageSeo.experience.title[locale],
            description: pageSeo.experience.description[locale],
          }),
        )}
      />

      <div className="container-page py-16 md:py-20">
        <header className="mb-14">
          <Label className="mb-3">{ui.sections.journey[locale]}</Label>
          <h1 className="max-w-3xl text-[clamp(1.875rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.025em]">
            {locale === 'fr' ? 'De la donnée à la décision' : 'From data to decision'}
          </h1>
          <p className="prose-column mt-5 text-lg leading-relaxed text-[var(--color-text-muted)]">
            {ui.sections.journeyLead[locale]}
          </p>
        </header>

        {/* Titre réservé aux technologies d'assistance : la frise porte des H3,
            un H2 est nécessaire pour ne pas sauter de niveau après le H1. */}
        <h2 className="sr-only">
          {locale === 'fr' ? 'Expériences professionnelles' : 'Professional experience'}
        </h2>
        <Timeline locale={locale} detailed />
      </div>

      <Section className="border-t border-[var(--color-border)]">
        <div className="container-page">
          <SectionHeader title={ui.sections.education[locale]} />
          <DualEducation locale={locale} />

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <Reveal>
              <h3 className="label-mono mb-4">{ui.sections.certifications[locale]}</h3>
              <ul className="space-y-3">
                {certifications.map((certification) => (
                  <li
                    key={certification.name}
                    className="rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                  >
                    <p className="text-sm font-medium leading-snug">{certification.name}</p>
                    <p className="mt-1 font-mono text-xs text-[var(--color-text-muted)]">
                      {certification.issuer}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.05}>
              <h3 className="label-mono mb-4">{ui.sections.languages[locale]}</h3>
              <ul className="space-y-3">
                {profile.languages.map((language) => (
                  <li
                    key={language.name.fr}
                    className="flex items-baseline justify-between gap-4 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                  >
                    <span className="text-sm font-medium">{language.name[locale]}</span>
                    <span className="font-mono text-xs text-[var(--color-text-muted)]">
                      {language.level[locale]}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section className="border-t border-[var(--color-border)]">
        <div className="container-page">
          <SectionHeader
            title={ui.sections.skills[locale]}
            lead={ui.sections.skillsLead[locale]}
          />
          <SkillLayers locale={locale} />
        </div>
      </Section>

      <ContactCta locale={locale} />
    </PageShell>
  );
}
