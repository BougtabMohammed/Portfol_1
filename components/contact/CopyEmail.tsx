'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { ui } from '@/content/data/ui';

/**
 * Copie de l'adresse en un clic.
 *
 * L'adresse reste un lien `mailto:` à part entière : sans JavaScript, le bouton
 * n'apparaît simplement pas et le contact reste possible.
 */
export function CopyEmail({ email, locale }: { email: string; locale: Locale }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé) : le lien mailto reste utilisable.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={ui.actions.copyEmail[locale]}
      className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--color-border)] px-3 py-2 font-mono text-xs text-[var(--color-text-muted)] transition-colors duration-150 hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
    >
      {copied ? (
        <>
          <Check size={13} aria-hidden className="text-[var(--color-accent)]" />
          {ui.actions.copied[locale]}
        </>
      ) : (
        <>
          <Copy size={13} aria-hidden />
          {ui.actions.copyEmail[locale]}
        </>
      )}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? ui.actions.copied[locale] : ''}
      </span>
    </button>
  );
}
