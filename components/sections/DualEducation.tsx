import type { Locale } from '@/lib/i18n';
import { degrees, dualEducationNarrative } from '@/content/data/education';
import { Label } from '@/components/ui/primitives';
import { Reveal } from '@/components/motion/Reveal';

/**
 * Double formation.
 *
 * Les deux cursus sont présentés en colonnes parallèles, et non l'un sous
 * l'autre : c'est la mise en page elle-même qui doit faire comprendre qu'ils
 * ont été menés simultanément de 2023 à 2026.
 */
export function DualEducation({ locale }: { locale: Locale }) {
  return (
    <Reveal>
      <div className="rounded-[8px] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6 md:p-10">
        <Label className="mb-4">{dualEducationNarrative.title[locale]}</Label>

        <div className="grid gap-6 md:grid-cols-2">
          {degrees.map((degree) => (
            <div
              key={degree.id}
              className="rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <p className="font-mono text-xs text-[var(--color-accent)]">{degree.period}</p>
              <h3 className="mt-2.5 text-base font-semibold leading-snug">{degree.institution}</h3>
              <p className="mt-1 text-sm text-[var(--color-text)]">{degree.degree[locale]}</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {degree.field[locale]}
              </p>
              <ul className="mt-4 space-y-1.5">
                {degree.highlights[locale].map((highlight) => (
                  <li
                    key={highlight}
                    className="relative pl-4 text-xs leading-relaxed text-[var(--color-text-muted)]"
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-[0.55em] size-1 rounded-full bg-[var(--color-border-strong)]"
                    />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="prose-column mt-8 space-y-4 leading-relaxed">
          {dualEducationNarrative.body[locale].map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
