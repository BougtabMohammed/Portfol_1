import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { route } from '@/lib/routes';
import { featuredProjects } from '@/content/data/projects';
import { ui } from '@/content/data/ui';
import { PageShell } from '@/components/layout/PageShell';
import { FlowRail } from '@/components/layout/FlowRail';
import { Hero } from '@/components/sections/Hero';
import { ProofBar } from '@/components/sections/ProofBar';
import { Thesis } from '@/components/sections/Thesis';
import { Timeline } from '@/components/sections/Timeline';
import { DualEducation } from '@/components/sections/DualEducation';
import { SkillLayers } from '@/components/sections/SkillLayers';
import { ContactCta } from '@/components/sections/ContactCta';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Section, SectionHeader } from '@/components/ui/primitives';
import { Reveal } from '@/components/motion/Reveal';
import { staggerDelay } from '@/lib/motion';
import { JsonLd, jsonLdGraph, personSchema, websiteSchema, profilePageSchema } from '@/lib/jsonld';

/**
 * Accueil — résumé exécutif complet et autonome.
 *
 * Conçu pour qu'un recruteur qui ne cliquera sur aucun lien reparte quand même
 * avec tout ce dont il a besoin pour décider : positionnement, preuves, projets,
 * parcours, formation, compétences et contact.
 *
 * Ordre délibéré : la preuve avant le discours, les projets avant le parcours,
 * la double formation après les projets — pour qu'elle se lise comme un renfort
 * de crédibilité et non comme une curiosité de CV.
 */
export function HomeView({ locale }: { locale: Locale }) {
  const homePath = route('home', locale);
  const alternate = route('home', locale === 'fr' ? 'en' : 'fr');

  return (
    <PageShell locale={locale} alternateHref={alternate}>
      <JsonLd
        data={jsonLdGraph(
          personSchema(locale),
          websiteSchema(locale),
          profilePageSchema(locale, homePath),
        )}
      />

      <FlowRail
        steps={[
          { id: 'thesis', label: locale === 'fr' ? 'Thèse' : 'Thesis' },
          { id: 'projects', label: locale === 'fr' ? 'Projets' : 'Projects' },
          { id: 'journey', label: locale === 'fr' ? 'Parcours' : 'Journey' },
          { id: 'education', label: locale === 'fr' ? 'Formation' : 'Education' },
          { id: 'skills', label: locale === 'fr' ? 'Compétences' : 'Skills' },
        ]}
      />

      <Hero locale={locale} />
      <ProofBar locale={locale} />
      <Thesis locale={locale} />

      <Section id="projects" className="border-t border-[var(--color-border)]">
        <div className="container-page">
          <SectionHeader
            label={`02 — ${ui.sections.featuredWork[locale]}`}
            title={ui.sections.featuredWork[locale]}
            lead={ui.sections.featuredWorkLead[locale]}
          />
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <Reveal as="li" key={project.slug.fr} delay={staggerDelay(index)}>
                <ProjectCard project={project} locale={locale} />
              </Reveal>
            ))}
          </ul>
          <Link
            href={route('projects', locale)}
            className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-[var(--color-accent)] transition-colors duration-150 hover:text-[var(--color-accent-hover)]"
          >
            {ui.actions.allProjects[locale]}
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
      </Section>

      <Section id="journey" className="border-t border-[var(--color-border)]">
        <div className="container-page">
          <SectionHeader
            label={`03 — ${ui.sections.journey[locale]}`}
            title={ui.sections.journey[locale]}
            lead={ui.sections.journeyLead[locale]}
          />
          <Timeline locale={locale} />
        </div>
      </Section>

      <Section id="education" className="border-t border-[var(--color-border)]">
        <div className="container-page">
          <SectionHeader
            label={`04 — ${ui.sections.education[locale]}`}
            title={ui.sections.education[locale]}
          />
          <DualEducation locale={locale} />
        </div>
      </Section>

      <Section id="skills" className="border-t border-[var(--color-border)]">
        <div className="container-page">
          <SectionHeader
            label={`05 — ${ui.sections.skills[locale]}`}
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
