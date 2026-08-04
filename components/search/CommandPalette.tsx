'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CornerDownLeft, Loader2 } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import type { LocaleIndex, SearchResult, DocType } from '@/lib/vector.ts';
import { search } from '@/lib/vector.ts';
import { loadSearchIndex } from '@/lib/search-index.ts';
import { useSearch } from './SearchProvider';
import { ui } from '@/content/data/ui';
import { cn } from '@/lib/utils';

/**
 * Palette de commandes — recherche BM25 exécutée dans le navigateur.
 *
 * L'index n'est téléchargé qu'à la première ouverture (~23 Ko compressés) : il ne
 * pèse donc rien sur le premier rendu. Aucun appel réseau vers un service tiers,
 * aucune clé, aucun serveur — tout le classement se fait localement.
 *
 * Accessibilité : dialogue modal, focus piégé, `Échap` pour fermer, navigation aux
 * flèches, résultats annoncés en `aria-live`, et restitution du focus à l'élément
 * qui avait ouvert la palette.
 */

const TYPE_LABEL: Record<DocType, { fr: string; en: string }> = {
  page: { fr: 'Page', en: 'Page' },
  project: { fr: 'Étude de cas', en: 'Case study' },
  experience: { fr: 'Expérience', en: 'Experience' },
  education: { fr: 'Formation', en: 'Education' },
  faq: { fr: 'FAQ', en: 'FAQ' },
  skill: { fr: 'Compétences', en: 'Skills' },
  note: { fr: 'Note', en: 'Note' },
};

export function CommandPalette({
  locale,
  open,
  onClose,
}: {
  locale: Locale;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { setHighlighted } = useSearch();
  const [index, setIndex] = useState<LocaleIndex | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);
  const listId = useId();

  // Téléchargement de l'index à la première ouverture seulement.
  useEffect(() => {
    if (!open || index) return;
    let cancelled = false;
    setLoading(true);
    loadSearchIndex(locale)
      .then((loaded) => {
        if (!cancelled) setIndex(loaded);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, index, locale]);

  // Mémorise puis restitue le focus.
  useEffect(() => {
    if (open) {
      restoreFocusTo.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      // Le champ n'existe qu'après la peinture du dialogue.
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = '';
      restoreFocusTo.current?.focus?.();
      setQuery('');
      setResults([]);
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    if (!index) return;
    const found = search(query, index, 8);
    setResults(found);
    setActive(0);
    // La constellation du hero écoute cet ensemble : les documents remontés
    // s'illuminent derrière la palette pendant la frappe.
    setHighlighted(new Set(found.map((result) => result.doc.id)));
  }, [query, index, setHighlighted]);

  const go = useCallback(
    (result: SearchResult | undefined) => {
      if (!result) return;
      onClose();
      router.push(result.doc.href);
    },
    [onClose, router],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActive((i) => (results.length ? (i + 1) % results.length : 0));
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        go(results[active]);
        return;
      }
      // Piège à focus : un seul élément focalisable, on empêche simplement d'en sortir.
      if (event.key === 'Tab') event.preventDefault();
    },
    [results, active, go, onClose],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" aria-hidden />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ui.search.title[locale]}
        onKeyDown={onKeyDown}
        className="relative w-full max-w-2xl overflow-hidden rounded-[10px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4">
          {loading ? (
            <Loader2 size={16} aria-hidden className="animate-spin text-[var(--color-text-muted)]" />
          ) : (
            <Search size={16} aria-hidden className="text-[var(--color-text-muted)]" />
          )}
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={ui.search.placeholder[locale]}
            aria-label={ui.search.title[locale]}
            aria-controls={listId}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-[var(--color-text-muted)]"
          />
          <kbd className="hidden shrink-0 rounded-[4px] border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-text-muted)] sm:block">
            ESC
          </kbd>
        </div>

        <div id={listId} role="listbox" aria-label={ui.search.results[locale]} className="max-h-[52vh] overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
              {query.trim().length < 2
                ? ui.search.hint[locale]
                : loading
                  ? ui.search.loading[locale]
                  : ui.search.empty[locale]}
            </p>
          ) : (
            <ul>
              {results.map((result, position) => (
                <li key={result.doc.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={position === active}
                    onMouseEnter={() => setActive(position)}
                    onClick={() => go(result)}
                    className={cn(
                      'flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition-colors duration-100',
                      position === active
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
                        : 'border-transparent hover:bg-[var(--color-surface-hover)]',
                    )}
                  >
                    <span className="mt-0.5 w-24 shrink-0 font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
                      {TYPE_LABEL[result.doc.type][locale]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{result.doc.title}</span>
                      <span className="mt-0.5 block truncate text-xs text-[var(--color-text-muted)]">
                        {result.doc.excerpt}
                      </span>
                    </span>
                    <span
                      className="mt-0.5 shrink-0 font-mono text-[10px] tabular-nums text-[var(--color-text-muted)]"
                      title={ui.search.scoreTitle[locale]}
                    >
                      {Math.round(result.score * 100)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[var(--color-border)] px-4 py-2.5">
          <p className="font-mono text-[10px] text-[var(--color-text-muted)]">
            {ui.search.method[locale]}
          </p>
          <p className="hidden items-center gap-1.5 font-mono text-[10px] text-[var(--color-text-muted)] sm:flex">
            <CornerDownLeft size={11} aria-hidden />
            {ui.search.enterHint[locale]}
          </p>
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          {results.length > 0 ? ui.search.results[locale] : ''}
        </p>
      </div>
    </div>
  );
}
