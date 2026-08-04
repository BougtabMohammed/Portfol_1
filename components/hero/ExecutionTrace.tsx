import type { Locale } from '@/lib/i18n';
import type { Trace } from '@/content/data/traces';
import { cn } from '@/lib/utils';

/**
 * Trace d'exécution d'un système agentique.
 *
 * Aucun JavaScript : la cascade est une animation CSS dont chaque ligne porte un
 * `animation-delay` calculé depuis son rang. Sans script, sans réseau, et sans
 * coût sur le fil principal — l'animation tourne sur le compositeur.
 *
 * Le contenu est une **illustration**, jamais la capture d'une exécution réelle
 * chez un client : aucun nom, aucune donnée, aucun chiffre mesuré n'y figure.
 * Le libellé sous la trace le dit explicitement.
 */
export function ExecutionTrace({
  trace,
  locale,
  className,
}: {
  trace: Trace;
  locale: Locale;
  className?: string;
}) {
  const steps = trace.steps;

  return (
    <figure
      className={cn(
        'max-w-full overflow-x-auto rounded-[8px] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 font-mono text-[13px] leading-relaxed md:p-5',
        className,
      )}
    >
      <div className="min-w-[340px]">
        <p className="trace-step flex gap-2 text-[var(--color-text)]" style={{ '--step': 0 } as React.CSSProperties}>
          <span aria-hidden className="select-none text-[var(--color-accent)]">
            ›
          </span>
          <span>{trace.query[locale]}</span>
        </p>

        <ul className="mt-2">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            return (
              <li
                key={step.label}
                className="trace-step flex items-baseline gap-2 py-[3px]"
                style={{ '--step': index + 1 } as React.CSSProperties}
              >
                {/* `aria-hidden` les retire de la lecture, mais ils restent
                    visibles : ils doivent donc tenir le contraste AA comme
                    n'importe quel texte. Mesuré à 1,43:1 en bordure, 6:1 ici. */}
                <span aria-hidden className="select-none text-[var(--color-text-muted)]">
                  {isLast ? '└──' : '├──'}
                </span>
                <span
                  className={cn(
                    'w-[136px] shrink-0 truncate',
                    isLast ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]',
                  )}
                >
                  {step.label}
                </span>
                <span className="flex-1 truncate text-[var(--color-text-muted)]">
                  {step.detail[locale]}
                </span>
                {step.duration ? (
                  <span className="shrink-0 tabular-nums text-[var(--color-text-muted)]">
                    {step.duration}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      <figcaption
        className="trace-step mt-3 border-t border-[var(--color-border)] pt-2.5 text-[10px] uppercase tracking-[0.06em] text-[var(--color-text-muted)]"
        style={{ '--step': steps.length + 1 } as React.CSSProperties}
      >
        {trace.caption[locale]}
      </figcaption>
    </figure>
  );
}
