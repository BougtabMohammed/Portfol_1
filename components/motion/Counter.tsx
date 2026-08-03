'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Compteur animé à l'entrée dans le viewport.
 *
 * La valeur finale est rendue côté serveur et présente dans le HTML : un
 * crawler, un lecteur d'écran ou un visiteur sans JavaScript voit le chiffre
 * exact. L'animation ne fait que remplacer temporairement un texte déjà correct.
 */
export function Counter({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasRun.current) return;
        hasRun.current = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // Easing out cubique : rapide au départ, freine à l'arrivée.
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(value * eased));
          if (progress < 1) requestAnimationFrame(tick);
          else setDisplay(value);
        };
        setDisplay(0);
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
}
