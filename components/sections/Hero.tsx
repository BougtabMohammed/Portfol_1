import { ArrowRight, MapPin } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { route } from '@/lib/routes';
import { profile } from '@/content/data/profile';
import { ui } from '@/content/data/ui';
import { ButtonLink } from '@/components/ui/primitives';

/**
 * Hero.
 *
 * Le titre est l'élément LCP : il est rendu côté serveur en texte pur, sans
 * image ni animation d'entrée qui en retarderait la peinture. C'est ce qui
 * permet de viser un LCP sous 1,2 s.
 */
export function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="border-b border-[var(--color-border)]">
      <div className="container-page py-20 md:py-28">
        <p className="label-mono mb-5 flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden />
          {profile.availability[locale]}
        </p>

        <h1 className="max-w-4xl text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.03em]">
          {profile.name}
        </h1>

        <p className="mt-3 font-mono text-base text-[var(--color-accent)] md:text-lg">
          {profile.jobTitle[locale]}
        </p>

        <p className="prose-column mt-7 text-lg leading-relaxed text-[var(--color-text-muted)]">
          {profile.tagline[locale]}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <ButtonLink href={route('projects', locale)}>
            {ui.actions.viewProjects[locale]}
            <ArrowRight size={16} aria-hidden />
          </ButtonLink>
          <ButtonLink href={route('contact', locale)} variant="secondary">
            {ui.actions.contactMe[locale]}
          </ButtonLink>
        </div>

        <p className="mt-8 flex items-center gap-2 font-mono text-xs text-[var(--color-text-muted)]">
          <MapPin size={13} aria-hidden />
          {profile.location[locale]}
        </p>
      </div>
    </section>
  );
}
