'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';
import { CommandPalette } from './CommandPalette';

/**
 * Contexte de recherche.
 *
 * Le raccourci clavier est capté ici, une seule fois pour tout le site, et le
 * bouton visible de l'en-tête n'a plus qu'à appeler `open()`. Deux points
 * d'entrée pour un seul état, et la palette n'existe dans le DOM que lorsqu'elle
 * est ouverte — elle ne coûte donc rien au rendu initial.
 */

type SearchContextValue = {
  open: () => void;
  isOpen: boolean;
  /** Identifiants des documents actuellement remontés — lus par la constellation. */
  highlighted: ReadonlySet<string>;
  setHighlighted: (ids: ReadonlySet<string>) => void;
};

const EMPTY: ReadonlySet<string> = new Set();

const SearchContext = createContext<SearchContextValue>({
  open: () => {},
  isOpen: false,
  highlighted: EMPTY,
  setHighlighted: () => {},
});

export function useSearch() {
  return useContext(SearchContext);
}

export function SearchProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<ReadonlySet<string>>(EMPTY);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setHighlighted(EMPTY);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // ⌘K sur macOS, Ctrl+K ailleurs. « / » aussi, mais seulement hors champ de
      // saisie — sinon on volerait la touche à quelqu'un en train d'écrire.
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      const target = event.target as HTMLElement | null;
      const inField =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable === true;
      const isSlash = event.key === '/' && !inField;

      if (isShortcut || isSlash) {
        event.preventDefault();
        setIsOpen((current) => !current);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const value = useMemo(
    () => ({ open, isOpen, highlighted, setHighlighted }),
    [open, isOpen, highlighted],
  );

  return (
    <SearchContext.Provider value={value}>
      {children}
      <CommandPalette locale={locale} open={isOpen} onClose={close} />
    </SearchContext.Provider>
  );
}

/** Bouton visible de l'en-tête : le raccourci seul ne se découvre pas. */
export function SearchTrigger({ label, shortcut }: { label: string; shortcut: string }) {
  const { open } = useSearch();

  return (
    <button
      type="button"
      onClick={open}
      // WCAG 2.5.3 « Label in Name » : le raccourci « ⌘K » est visible dans le
      // bouton, il doit donc figurer dans le nom accessible. Sans lui, une
      // commande vocale prononçant ce qui est affiché ne déclencherait rien.
      aria-label={`${label} (${shortcut})`}
      className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-[var(--color-border)] pl-2.5 pr-1.5 text-[var(--color-text-muted)] transition-colors duration-150 hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <kbd className="hidden rounded-[3px] border border-[var(--color-border)] px-1 py-px font-mono text-[10px] sm:block">
        {shortcut}
      </kbd>
    </button>
  );
}
