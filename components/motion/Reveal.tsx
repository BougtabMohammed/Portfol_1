'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Révélation au scroll — IntersectionObserver et CSS, sans librairie.
 *
 * La conception prévoyait Framer Motion. Mesure faite sur le build réel, il
 * coûtait ~56 Ko de JavaScript de première visite pour produire un fondu de
 * 12 pixels — un tiers du budget total pour un effet que trois lignes de CSS
 * rendent à l'identique. L'arbitrage a donc été tranché en faveur du budget de
 * performance annoncé (Lighthouse ≥ 98, JS < 120 Ko).
 *
 * Deux garanties reposent sur le CSS plutôt que sur ce composant :
 *  - sans JavaScript, `.reveal` reste pleinement visible (l'état masqué est
 *    conditionné à la classe `js` posée par le script de thème) ;
 *  - en `prefers-reduced-motion`, l'élément est rendu à son état final, sans
 *    transition — pas une transition raccourcie.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Component = 'div',
}: {
  children: ReactNode;
  /** Délai en secondes, pour rester compatible avec l'API d'origine. */
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-visible', 'true');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      // @ts-expect-error — la ref est bien un élément HTML quel que soit le tag choisi.
      ref={ref}
      className={cn('reveal', className)}
      style={delay ? ({ '--reveal-delay': `${delay * 1000}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Component>
  );
}
