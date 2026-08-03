import type { Locale } from '@/lib/i18n';
import { experiences } from '@/content/data/experiences';
import { REVEAL_CONFIDENTIAL_NAMES } from '@/content/data/profile';
import { Tag } from '@/components/ui/primitives';
import { Reveal } from '@/components/motion/Reveal';
import { staggerDelay } from '@/lib/motion';

/**
 * Frise du parcours.
 *
 * Le libellé de chapitre (Mesurer → Construire → Prédire → Décider →
 * Industrialiser) rend le fil narratif lisible d'un coup d'œil : c'est ce qui
 * transforme une liste antichronologique en progression.
 */
export function Timeline({ locale, detailed = false }: { locale: Locale; detailed?: boolean }) {
  return (
    <ol className="relative">
      {experiences.map((experience, index) => {
        const company =
          REVEAL_CONFIDENTIAL_NAMES && experience.companyReal
            ? experience.companyReal
            : experience.company[locale];

        return (
          <Reveal as="li" key={experience.id} delay={staggerDelay(index)}>
            <div className="relative grid gap-x-8 gap-y-3 border-l border-[var(--color-border)] pb-12 pl-6 md:grid-cols-[150px_1fr] md:pl-8">
              <span
                aria-hidden
                className="absolute -left-[4.5px] top-1.5 size-2 rounded-full bg-[var(--color-accent)]"
              />

              <div className="md:pt-0.5">
                <p className="font-mono text-xs text-[var(--color-text-muted)]">
                  {experience.period[locale]}
                </p>
                <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-accent)]">
                  {experience.chapter[locale]}
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold tracking-[-0.01em]">
                  {experience.role[locale]}
                </h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {company} · {experience.location[locale]} · {experience.contract[locale]}
                </p>

                <p className="prose-column mt-3 leading-relaxed">
                  {experience.headline[locale]}
                </p>

                {detailed ? (
                  <ul className="prose-column mt-4 space-y-2.5">
                    {experience.bullets[locale].map((bullet) => (
                      <li
                        key={bullet.slice(0, 40)}
                        className="relative pl-5 text-sm leading-relaxed text-[var(--color-text-muted)]"
                      >
                        <span
                          aria-hidden
                          className="absolute left-0 top-[0.6em] size-1 rounded-full bg-[var(--color-border-strong)]"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {experience.stack.map((tech) => (
                    <li key={tech}>
                      <Tag>{tech}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}
