import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';
import type { RouteKey } from '@/lib/routes';
import { ui } from '@/content/data/ui';
import { Header } from './Header';
import { Footer } from './Footer';

/**
 * Ossature commune à toutes les pages : lien d'évitement, en-tête, contenu, pied.
 *
 * Le lien « aller au contenu » est le premier élément focalisable du document —
 * exigence WCAG pour qu'un utilisateur au clavier n'ait pas à traverser la
 * navigation à chaque page.
 */
export function PageShell({
  locale,
  currentKey,
  alternateHref,
  children,
}: {
  locale: Locale;
  currentKey?: RouteKey;
  alternateHref: string;
  children: ReactNode;
}) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[6px] focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--color-on-accent)]"
      >
        {ui.skipToContent[locale]}
      </a>

      <Header locale={locale} currentKey={currentKey} alternateHref={alternateHref} />

      <main id="main" className="pt-14">
        {children}
      </main>

      <Footer locale={locale} />
    </>
  );
}
