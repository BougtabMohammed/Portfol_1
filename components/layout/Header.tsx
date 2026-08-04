'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X, Languages } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { NAV_KEYS, ROUTES, route, type RouteKey } from '@/lib/routes';
import { ui } from '@/content/data/ui';
import { SearchTrigger } from '@/components/search/SearchProvider';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

/**
 * En-tête fixe.
 *
 * Se masque au défilement descendant et réapparaît au défilement montant, à
 * partir d'un seuil de 80 px : sur mobile, cela rend une bande de 56 px à la
 * lecture sans jamais mettre la navigation à plus d'un geste.
 *
 * `alternateHref` est fourni explicitement par chaque page plutôt que déduit du
 * chemin courant : les études de cas ont des identifiants d'URL différents dans
 * chaque langue, et une déduction générique s'y tromperait.
 */
export function Header({
  locale,
  currentKey,
  alternateHref,
}: {
  locale: Locale;
  currentKey?: RouteKey;
  alternateHref: string;
}) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 80 && y > lastY);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menu mobile : verrouille le défilement et ferme sur Échap.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const switchLabel =
    locale === 'fr' ? ui.nav.switchToEnglish.fr : ui.nav.switchToFrench.en;

  return (
    <header
      className={cn(
        'no-print fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)]',
        'bg-[var(--color-bg)]/80 backdrop-blur-[8px]',
        'transition-transform duration-200 ease-out motion-reduce:transition-none',
        hidden && !open && '-translate-y-full',
      )}
    >
      <div className="container-page flex h-14 items-center justify-between gap-4">
        <Link
          href={route('home', locale)}
          className="font-mono text-sm font-semibold tracking-tight"
          // WCAG 2.5.3 « Label in Name » : le nom accessible doit contenir le
          // texte visible. Un simple aria-label="Accueil" romprait le lien entre
          // ce que l'utilisateur voit (« MB ») et ce qu'une commande vocale dit.
          aria-label={`MB — ${ui.nav.home[locale]}`}
        >
          <span className="text-[var(--color-accent)]">MB</span>
          <span className="text-[var(--color-text-muted)]" aria-hidden>
            /
          </span>
        </Link>

        <nav aria-label={ui.nav.home[locale]} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_KEYS.map((key) => {
              const active = key === currentKey;
              return (
                <li key={key}>
                  <Link
                    href={ROUTES[key][locale]}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative rounded-[4px] px-3 py-2 text-sm transition-colors duration-150',
                      active
                        ? 'text-[var(--color-text)]'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                    )}
                  >
                    {ui.nav[key][locale]}
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[var(--color-accent)]"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <SearchTrigger label={ui.search.title[locale]} shortcut="⌘K" />

          <Link
            href={alternateHref}
            hrefLang={locale === 'fr' ? 'en' : 'fr'}
            aria-label={switchLabel}
            title={switchLabel}
            className="hidden h-9 items-center gap-1.5 rounded-[6px] border border-[var(--color-border)] px-2.5 font-mono text-[11px] uppercase text-[var(--color-text-muted)] transition-colors duration-150 hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)] sm:inline-flex"
          >
            <Languages size={14} aria-hidden />
            {locale === 'fr' ? 'EN' : 'FR'}
          </Link>

          <ThemeToggle locale={locale} />

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={ui.nav.openMenu[locale]}
            aria-expanded={open}
            className="grid size-9 place-items-center rounded-[6px] border border-[var(--color-border)] text-[var(--color-text-muted)] md:hidden"
          >
            <Menu size={16} aria-hidden />
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-[var(--color-bg)] md:hidden">
          <div className="container-page flex h-14 items-center justify-between">
            <span className="font-mono text-sm font-semibold">
              <span className="text-[var(--color-accent)]">MB</span>
              <span className="text-[var(--color-text-muted)]">/</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={ui.nav.closeMenu[locale]}
              autoFocus
              className="grid size-9 place-items-center rounded-[6px] border border-[var(--color-border)] text-[var(--color-text-muted)]"
            >
              <X size={16} aria-hidden />
            </button>
          </div>
          <nav className="container-page pt-6" aria-label={ui.nav.home[locale]}>
            <ul className="flex flex-col gap-1">
              {NAV_KEYS.map((key) => (
                <li key={key}>
                  <Link
                    href={ROUTES[key][locale]}
                    onClick={() => setOpen(false)}
                    aria-current={key === currentKey ? 'page' : undefined}
                    className="block border-b border-[var(--color-border)] py-4 text-lg"
                  >
                    {ui.nav[key][locale]}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={alternateHref}
                  hrefLang={locale === 'fr' ? 'en' : 'fr'}
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center gap-2 py-4 font-mono text-sm text-[var(--color-text-muted)]"
                >
                  <Languages size={16} aria-hidden />
                  {switchLabel}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
