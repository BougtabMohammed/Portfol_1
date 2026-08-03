import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Étiquette de section en monospace — la texture « console » du design system. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('label-mono', className)}>{children}</p>;
}

/** Puce de technologie. Purement informative, jamais interactive. */
export function Tag({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'accent' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[4px] border px-2 py-[3px] font-mono text-[11px] leading-none',
        tone === 'accent'
          ? 'border-[var(--color-accent)]/40 bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
          : 'border-[var(--color-border)] text-[var(--color-text-muted)]',
      )}
    >
      {children}
    </span>
  );
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  external?: boolean;
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  external = false,
  className,
}: ButtonLinkProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-[6px] px-4 py-2.5 text-sm font-medium',
    'transition-colors duration-150 active:scale-[0.98] motion-reduce:active:scale-100',
    variant === 'primary'
      ? 'bg-[var(--color-accent)] text-[var(--color-on-accent)] hover:bg-[var(--color-accent-hover)]'
      : 'border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)]',
    className,
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

/** Conteneur de section, avec espacement vertical cohérent sur tout le site. */
export function Section({
  children,
  className,
  id,
  as: Tag_ = 'section',
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: 'section' | 'div';
}) {
  return (
    <Tag_ id={id} className={cn('py-16 md:py-24', className)}>
      {children}
    </Tag_>
  );
}

/** Titre de section : étiquette monospace + titre + chapeau optionnel. */
export function SectionHeader({
  label,
  title,
  lead,
  className,
}: {
  label?: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <header className={cn('mb-10 md:mb-14', className)}>
      {label ? <Label className="mb-3">{label}</Label> : null}
      <h2 className="text-2xl font-semibold tracking-[-0.015em] md:text-3xl">{title}</h2>
      {lead ? (
        <p className="prose-column mt-4 text-[var(--color-text-muted)] leading-relaxed">{lead}</p>
      ) : null}
    </header>
  );
}

/** Carte : élévation par bordure, jamais par ombre. */
export function Card({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface)]',
        interactive &&
          'transition-colors duration-150 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-hover)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
