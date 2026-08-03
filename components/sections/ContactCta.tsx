import { ArrowRight } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { route } from '@/lib/routes';
import { profile } from '@/content/data/profile';
import { ui } from '@/content/data/ui';
import { ButtonLink, Label } from '@/components/ui/primitives';
import { Reveal } from '@/components/motion/Reveal';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';

export function ContactCta({ locale }: { locale: Locale }) {
  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
      <div className="container-page py-16 md:py-24">
        <Reveal>
          <Label className="mb-4">{ui.sections.contact[locale]}</Label>
          <h2 className="prose-column text-2xl font-semibold tracking-[-0.015em] md:text-3xl">
            {ui.meta.availableFor[locale]}
          </h2>
          <p className="prose-column mt-4 leading-relaxed text-[var(--color-text-muted)]">
            {ui.meta.ctaClosing[locale]}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={`mailto:${profile.email}`} external>
              {profile.email}
              <ArrowRight size={16} aria-hidden />
            </ButtonLink>
            <ButtonLink href={route('resume', locale)} variant="secondary">
              {ui.nav.resume[locale]}
            </ButtonLink>
            <ButtonLink href={profile.github} variant="secondary" external>
              <GithubIcon size={16} aria-hidden />
              GitHub
            </ButtonLink>
            <ButtonLink href={profile.linkedin} variant="secondary" external>
              <LinkedinIcon size={16} aria-hidden />
              LinkedIn
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
