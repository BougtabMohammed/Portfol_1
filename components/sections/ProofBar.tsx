import type { Locale } from '@/lib/i18n';
import { proofStats } from '@/content/data/profile';
import { Counter } from '@/components/motion/Counter';

/**
 * Bandeau de preuve — la preuve avant le discours.
 *
 * Chaque valeur est directement dérivable du parcours : nombre d'expériences,
 * d'études de cas publiées, de cursus, de couches techniques couvertes. Aucune
 * n'est une estimation, aucune n'est un résultat non mesuré.
 */
export function ProofBar({ locale }: { locale: Locale }) {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
      <div className="container-page">
        <dl className="grid grid-cols-2 divide-[var(--color-border)] md:grid-cols-4 md:divide-x">
          {proofStats.map((stat, index) => (
            <div
              key={stat.label.fr}
              className={[
                'py-8 md:px-6',
                index % 2 === 0 ? 'pr-4' : 'pl-4 border-l border-[var(--color-border)] md:border-l-0 md:pl-6',
                index < 2 ? 'border-b border-[var(--color-border)] md:border-b-0' : '',
                index === 0 ? 'md:pl-0' : '',
              ].join(' ')}
            >
              <dd className="font-mono text-3xl font-semibold tabular-nums text-[var(--color-text)] md:text-4xl">
                <Counter value={stat.value} />
              </dd>
              <dt className="mt-2 text-sm leading-snug text-[var(--color-text-muted)]">
                {stat.label[locale]}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
