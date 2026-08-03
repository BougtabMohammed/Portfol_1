import { Mail, MapPin, Phone } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { route } from '@/lib/routes';
import { profile } from '@/content/data/profile';
import { pageSeo } from '@/content/data/seo';
import { ui } from '@/content/data/ui';
import { PageShell } from '@/components/layout/PageShell';
import { CopyEmail } from '@/components/contact/CopyEmail';
import { ButtonLink, Label } from '@/components/ui/primitives';
import { JsonLd, jsonLdGraph, personSchema, websiteSchema, webPageSchema } from '@/lib/jsonld';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';

/**
 * Contact — zéro friction.
 *
 * Pas de formulaire : le site est statique, un formulaire imposerait un service
 * tiers, donc un traqueur, un risque de panne silencieuse et une donnée
 * personnelle hébergée ailleurs. Un lien mailto fonctionne partout, tout de
 * suite, et laisse une trace dans la boîte d'envoi de la personne qui écrit.
 */
export function ContactView({ locale }: { locale: Locale }) {
  const path = route('contact', locale);
  const alternate = route('contact', locale === 'fr' ? 'en' : 'fr');

  return (
    <PageShell locale={locale} currentKey="contact" alternateHref={alternate}>
      <JsonLd
        data={jsonLdGraph(
          personSchema(locale),
          websiteSchema(locale),
          webPageSchema({
            locale,
            path,
            name: pageSeo.contact.title[locale],
            description: pageSeo.contact.description[locale],
          }),
        )}
      />

      <div className="container-page py-16 md:py-24">
        <header className="mb-12">
          <Label className="mb-3">{ui.sections.contact[locale]}</Label>
          <h1 className="max-w-3xl text-[clamp(1.875rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.025em]">
            {ui.meta.availableFor[locale]}
          </h1>
          <p className="prose-column mt-5 text-lg leading-relaxed text-[var(--color-text-muted)]">
            {ui.meta.ctaClosing[locale]}
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <dl className="space-y-px overflow-hidden rounded-[8px] border border-[var(--color-border)]">
              <Row icon={<Mail size={16} aria-hidden />} label="Email">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-mono text-sm text-[var(--color-accent)] underline-offset-4 hover:underline"
                  >
                    {profile.email}
                  </a>
                  <CopyEmail email={profile.email} locale={locale} />
                </div>
              </Row>
              <Row icon={<Phone size={16} aria-hidden />} label={locale === 'fr' ? 'Téléphone' : 'Phone'}>
                <a
                  href={`tel:${profile.phone}`}
                  className="font-mono text-sm hover:text-[var(--color-accent)]"
                >
                  {profile.phoneDisplay}
                </a>
              </Row>
              <Row icon={<MapPin size={16} aria-hidden />} label={locale === 'fr' ? 'Localisation' : 'Location'}>
                <span className="text-sm">{profile.location[locale]}</span>
              </Row>
              <Row icon={<GithubIcon size={16} aria-hidden />} label="GitHub">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm hover:text-[var(--color-accent)]"
                >
                  {profile.githubHandle}
                </a>
              </Row>
              <Row icon={<LinkedinIcon size={16} aria-hidden />} label="LinkedIn">
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm hover:text-[var(--color-accent)]"
                >
                  {profile.name}
                </a>
              </Row>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`mailto:${profile.email}`} external>
                {locale === 'fr' ? 'Écrire un message' : 'Send a message'}
              </ButtonLink>
              <ButtonLink href={route('resume', locale)} variant="secondary">
                {ui.nav.resume[locale]}
              </ButtonLink>
            </div>
          </div>

          <aside className="rounded-[8px] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
            <h2 className="label-mono mb-4">{ui.sections.languages[locale]}</h2>
            <ul className="space-y-3">
              {profile.languages.map((language) => (
                <li key={language.name.fr}>
                  <p className="text-sm font-medium">{language.name[locale]}</p>
                  <p className="font-mono text-xs text-[var(--color-text-muted)]">
                    {language.level[locale]}
                  </p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-[var(--color-surface)] p-5">
      <dt className="flex min-w-[130px] items-center gap-2.5 text-[var(--color-text-muted)]">
        {icon}
        <span className="label-mono">{label}</span>
      </dt>
      <dd>{children}</dd>
    </div>
  );
}
