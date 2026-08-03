'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Barre de filtres.
 *
 * Les cartes sont rendues côté serveur et restent dans le HTML : le filtre se
 * contente de masquer les éléments dont l'attribut `data-tags` ne correspond
 * pas. Conséquence importante, ce composant ne reçoit **aucune donnée projet** —
 * seulement des libellés. Le contenu des six études de cas, dans les deux
 * langues, ne part jamais dans le bundle client.
 *
 * Sans JavaScript, les boutons ne s'affichent pas et la liste complète reste
 * visible : c'est exactement ce qu'on veut voir indexé.
 */
export function ProjectFilterBar({
  tags,
  allLabel,
  groupLabel,
  countOne,
  countMany,
  targetId,
  emptyId,
}: {
  tags: readonly { id: string; label: string }[];
  allLabel: string;
  groupLabel: string;
  /** Gabarits avec un jeton `{n}` — une fonction ne peut pas traverser la
   *  frontière serveur → client, contrairement à une chaîne. */
  countOne: string;
  countMany: string;
  targetId: string;
  emptyId: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    const list = document.getElementById(targetId);
    const empty = document.getElementById(emptyId);
    if (!list) return;

    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-tags]'));
    let shown = 0;

    for (const item of items) {
      const itemTags = (item.dataset.tags ?? '').split(' ');
      const matches = active === null || itemTags.includes(active);
      item.hidden = !matches;
      if (matches) shown += 1;
    }

    if (empty) empty.hidden = shown > 0;

    // On n'annonce le résultat qu'après une interaction : au premier rendu,
    // rien n'a changé et une annonce serait du bruit pour un lecteur d'écran.
    if (mounted.current) setVisibleCount(shown);
    mounted.current = true;
  }, [active, targetId, emptyId]);

  return (
    <div className="mb-10">
      <ul className="flex flex-wrap gap-2" role="group" aria-label={groupLabel}>
        <li>
          <FilterButton active={active === null} onClick={() => setActive(null)}>
            {allLabel}
          </FilterButton>
        </li>
        {tags.map((tag) => (
          <li key={tag.id}>
            <FilterButton
              active={active === tag.id}
              onClick={() => setActive(active === tag.id ? null : tag.id)}
            >
              {tag.label}
            </FilterButton>
          </li>
        ))}
      </ul>
      <p role="status" aria-live="polite" className="sr-only">
        {visibleCount === null
          ? ''
          : (visibleCount > 1 ? countMany : countOne).replace('{n}', String(visibleCount))}
      </p>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-[6px] border px-3 py-1.5 font-mono text-xs transition-colors duration-150',
        active
          ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]',
      )}
    >
      {children}
    </button>
  );
}
