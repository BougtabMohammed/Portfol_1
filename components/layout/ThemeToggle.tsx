'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { ui } from '@/content/data/ui';

type Theme = 'light' | 'dark';

export function ThemeToggle({ locale }: { locale: Locale }) {
  // On part de `null` : tant que le composant n'est pas monté, on ne connaît pas
  // le thème appliqué par le script inline, et afficher la mauvaise icône serait
  // pire que n'en afficher aucune.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'light' ? 'light' : 'dark');
  }, []);

  function toggle() {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Navigation privée : le thème ne sera pas mémorisé, ce n'est pas bloquant.
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={ui.nav.toggleTheme[locale]}
      title={ui.nav.toggleTheme[locale]}
      className="grid size-9 place-items-center rounded-[6px] border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors duration-150 hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
    >
      {theme === 'light' ? <Moon size={16} aria-hidden /> : <Sun size={16} aria-hidden />}
    </button>
  );
}
