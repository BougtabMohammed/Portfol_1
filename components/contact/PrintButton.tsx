'use client';

import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';
import { ui } from '@/content/data/ui';

/** Déclenche l'impression. Sans JavaScript, le bouton n'apparaît pas — Ctrl+P reste évidemment disponible. */
export function PrintButton({ children, locale }: { children: ReactNode; locale: Locale }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      aria-label={ui.actions.printPage[locale]}
      className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)]"
    >
      {children}
    </button>
  );
}
