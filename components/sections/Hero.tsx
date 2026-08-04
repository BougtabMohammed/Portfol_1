import { ArrowRight, MapPin } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { route } from '@/lib/routes';
import { profile } from '@/content/data/profile';
import { heroTrace } from '@/content/data/traces';
import { ui } from '@/content/data/ui';
import { getLatentPoints } from '@/lib/latent-points.ts';
import { ButtonLink } from '@/components/ui/primitives';
import { ExecutionTrace } from '@/components/hero/ExecutionTrace';
import { LatentSpace } from '@/components/hero/LatentSpace';

/**
 * Hero.
 *
 * Le titre est l'élément LCP : rendu côté serveur, en texte pur, sans image ni
 * animation d'entrée qui en retarderait la peinture.
 *
 * Deux dispositifs l'accompagnent, chacun natif au métier plutôt que décoratif :
 *  - la **trace d'exécution** montre ce que « système multi-agents » veut dire,
 *    en cinq secondes et sans une ligne de JavaScript ;
 *  - la **carte de l'espace latent** place les contenus du site selon leur
 *    proximité de vocabulaire réelle, et s'illumine quand la recherche trouve.
 *
 * La constellation n'apparaît qu'à partir de `lg` : sur mobile elle coûterait des
 * cycles pour un espace où elle serait illisible.
 */
export function Hero({ locale }: { locale: Locale }) {
  const points = getLatentPoints(locale);

  return (
    <section className="relative border-b border-[var(--color-border)]">
      <div className="container-page grid gap-12 py-16 md:py-20 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-16 lg:py-24">
        <div>
          <p className="label-mono mb-6 flex items-center gap-2">
            <span
              className="inline-block size-1.5 rounded-full bg-[var(--color-accent)]"
              aria-hidden
            />
            {profile.availability[locale]}
          </p>

          <h1 className="text-[clamp(3rem,9vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.045em]">
            {profile.name}
          </h1>

          <p className="mt-5 font-mono text-base text-[var(--color-accent)] md:text-lg">
            {profile.jobTitle[locale]}
          </p>

          <p className="prose-column mt-6 text-lg leading-relaxed text-[var(--color-text-muted)]">
            {profile.tagline[locale]}
          </p>

          <ExecutionTrace trace={heroTrace} locale={locale} className="mt-9 max-w-2xl" />

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

        {/* Hauteur fixée pour que rien ne bouge à l'apparition du canvas : CLS = 0. */}
        <div className="hidden h-[460px] lg:block">
          <LatentSpace points={points} label={ui.search.latentLabel[locale]} />
        </div>
      </div>
    </section>
  );
}
