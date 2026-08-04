'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Colonne de flux — sommaire de l'accueil, dessiné comme un pipeline.
 *
 * Descendre la page, c'est parcourir la chaîne : la ligne se remplit, l'étape
 * courante s'allume. Le dispositif est aussi une navigation réelle — chaque nœud
 * est une ancre — donc il gagne sa place au lieu de décorer.
 *
 * Masqué sous `xl` : il n'y a pas de gouttière libre en dessous, et un rail
 * superposé au contenu gênerait plus qu'il n'aiderait.
 */
export type FlowStep = { id: string; label: string };

export function FlowRail({ steps }: { steps: readonly FlowStep[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const sections = steps
      .map((step) => document.getElementById(step.id))
      .filter((element): element is HTMLElement => element !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // On retient la section visible la plus haute dans la page : au moment où
        // deux sections se croisent, c'est celle qu'on est en train de quitter qui
        // doit céder la main, pas l'inverse.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => sections.indexOf(entry.target as HTMLElement))
          .filter((index) => index >= 0);
        if (visible.length > 0) setActiveIndex(Math.min(...visible));
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [steps]);

  return (
    <nav
      aria-label="Progression"
      // Seuil calculé, pas choisi : le conteneur plafonne à 1200 px, le rail
      // occupe ~130 px avec ses libellés. En dessous de 1560 px de fenêtre, la
      // gouttière ne suffit plus et le rail passerait sur le texte.
      className="pointer-events-none fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 min-[1560px]:block"
    >
      <ol className="relative flex flex-col gap-6">
        {/* Rail de fond, puis rail rempli par-dessus. */}
        <span
          aria-hidden
          className="absolute left-[3px] top-1 h-[calc(100%-0.5rem)] w-px bg-[var(--color-border)]"
        />
        <span
          aria-hidden
          className="absolute left-[3px] top-1 w-px origin-top bg-[var(--color-accent)] transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{
            height: 'calc(100% - 0.5rem)',
            transform: `scaleY(${steps.length > 1 ? activeIndex / (steps.length - 1) : 0})`,
          }}
        />

        {steps.map((step, index) => {
          const reached = index <= activeIndex;
          return (
            <li key={step.id} className="pointer-events-auto relative flex items-center gap-3">
              <span
                aria-hidden
                className={cn(
                  'size-[7px] shrink-0 rounded-full border transition-colors duration-200 motion-reduce:transition-none',
                  reached
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
                    : 'border-[var(--color-border-strong)] bg-[var(--color-bg)]',
                )}
              />
              <a
                href={`#${step.id}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                className={cn(
                  'font-mono text-[10px] uppercase tracking-[0.08em] transition-colors duration-200 motion-reduce:transition-none',
                  index === activeIndex
                    ? 'text-[var(--color-text)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                )}
              >
                {step.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
