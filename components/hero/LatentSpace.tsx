'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { LatentPoint } from '@/lib/latent-points.ts';
import type { DocType } from '@/lib/vector.ts';
import { useSearch } from '@/components/search/SearchProvider';

/**
 * Carte de l'espace latent — Canvas 2D, sans WebGL.
 *
 * Chaque point est un document du site (étude de cas, expérience, question,
 * groupe de compétences) placé par l'analyse en composantes principales de son
 * vecteur TF-IDF. La proximité à l'écran est donc une proximité de vocabulaire
 * réelle, pas une disposition esthétique : les projets agentiques se regroupent,
 * le droit public s'éloigne des pipelines.
 *
 * Quand la palette de recherche renvoie des résultats, les points correspondants
 * s'illuminent. C'est le moment où le site cesse de décrire ce que fait Mohammed
 * pour le faire.
 *
 * Coût : ~40 points, une boucle d'animation suspendue hors écran, et rien du tout
 * si l'utilisateur demande moins de mouvement.
 */

const TYPE_STYLE: Record<DocType, { radius: number; alpha: number }> = {
  project: { radius: 4.5, alpha: 0.95 },
  note: { radius: 3.6, alpha: 0.8 },
  experience: { radius: 3.2, alpha: 0.7 },
  education: { radius: 3.2, alpha: 0.7 },
  skill: { radius: 2.6, alpha: 0.55 },
  faq: { radius: 2.2, alpha: 0.4 },
  page: { radius: 2.2, alpha: 0.35 },
};

/** Deux points reliés au-delà de cette distance normalisée seraient du bruit. */
const LINK_DISTANCE = 0.42;

type Rendered = LatentPoint & { px: number; py: number };

export function LatentSpace({ points, label }: { points: LatentPoint[]; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<Rendered | null>(null);
  const { highlighted } = useSearch();

  // Les valeurs lues dans la boucle d'animation passent par une ref : la refermer
  // dans le closure figerait la première valeur.
  const highlightRef = useRef(highlighted);
  highlightRef.current = highlighted;
  const renderedRef = useRef<Rendered[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compact = window.matchMedia('(max-width: 639px)').matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = true;
    // Sur téléphone, une image sur deux suffit : la dérive est lente, l'œil ne
    // voit pas la différence, et la boucle consomme deux fois moins de batterie.
    let tick = 0;

    const style = getComputedStyle(document.documentElement);
    const readColor = (name: string, fallback: string) =>
      style.getPropertyValue(name).trim() || fallback;
    const accent = readColor('--color-accent', '#2dd4a7');
    const muted = readColor('--color-text-muted', '#8a93a3');
    const border = readColor('--color-border-strong', '#333a47');

    // Déclarée avant draw() qui la lit : la survol pilote le rendu sans provoquer
    // de nouveau rendu React à chaque déplacement de souris.
    const hoveredIdRef = { current: null as string | null };

    /**
     * Liens de voisinage, calculés une seule fois.
     *
     * Ils ne dépendent que des coordonnées issues de l'ACP, qui sont fixes — la
     * dérive ne déplace les points que de trois pixels. Les recalculer à chaque
     * image coûtait 703 distances par image pour 38 points, soit l'essentiel du
     * temps bloquant mesuré sur mobile (240 ms de TBT, Lighthouse à 93).
     */
    const links: { a: number; b: number; strength: number }[] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i]!;
        const b = points[j]!;
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance > LINK_DISTANCE) continue;
        links.push({ a: i, b: j, strength: 1 - distance / LINK_DISTANCE });
      }
    }

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw(time: number) {
      if (!running) return;
      context!.clearRect(0, 0, width, height);

      const padding = 28;
      const usableW = Math.max(width - padding * 2, 1);
      const usableH = Math.max(height - padding * 2, 1);
      const active = highlightRef.current;

      // Position de chaque point : coordonnée ACP + dérive lente et bornée.
      const rendered: Rendered[] = points.map((point, i) => {
        const drift = reduced ? 0 : Math.sin(time / 3200 + i * 1.7) * 3;
        const driftY = reduced ? 0 : Math.cos(time / 3800 + i * 2.3) * 3;
        return {
          ...point,
          px: padding + ((point.x + 1) / 2) * usableW + drift,
          py: padding + ((point.y + 1) / 2) * usableH + driftY,
        };
      });
      renderedRef.current = rendered;

      // Liens de voisinage, tracés en premier pour passer sous les points.
      context!.lineWidth = 1;
      for (const link of links) {
        const a = rendered[link.a]!;
        const b = rendered[link.b]!;
        const lit = active.size > 0 && (active.has(a.id) || active.has(b.id));
        context!.strokeStyle = lit ? accent : border;
        context!.globalAlpha = (lit ? 0.5 : 0.22) * link.strength;
        context!.beginPath();
        context!.moveTo(a.px, a.py);
        context!.lineTo(b.px, b.py);
        context!.stroke();
      }

      // Points.
      for (const point of rendered) {
        const preset = TYPE_STYLE[point.type];
        const isActive = active.has(point.id);
        const isHovered = hoveredIdRef.current === point.id;
        const radius = preset.radius * (isActive ? 1.9 : isHovered ? 1.5 : 1);

        if (isActive || isHovered) {
          context!.globalAlpha = 0.16;
          context!.fillStyle = accent;
          context!.beginPath();
          context!.arc(point.px, point.py, radius * 3.4, 0, Math.PI * 2);
          context!.fill();
        }

        context!.globalAlpha = isActive || isHovered ? 1 : preset.alpha;
        context!.fillStyle = isActive || isHovered || point.type === 'project' ? accent : muted;
        context!.beginPath();
        context!.arc(point.px, point.py, radius, 0, Math.PI * 2);
        context!.fill();
      }

      context!.globalAlpha = 1;
      if (!reduced) frame = requestAnimationFrame(step);
    }

    /** Cadence : pleine vitesse en desktop, une image sur deux en compact. */
    function step(time: number) {
      if (!running) return;
      tick += 1;
      // Un tiers de la cadence en compact : sur une bande de 190 px, la dérive
      // est imperceptible et chaque image épargnée est du temps rendu au fil
      // principal pendant le chargement.
      if (compact && tick % 3 !== 0) {
        frame = requestAnimationFrame(step);
        return;
      }
      draw(time);
    }

    function pick(event: PointerEvent): Rendered | null {
      const rect = canvas!.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let nearest: Rendered | null = null;
      // La cible d'un doigt n'est pas celle d'un curseur.
      let best = compact ? 26 : 18;
      for (const point of renderedRef.current) {
        const distance = Math.hypot(point.px - x, point.py - y);
        if (distance < best) {
          best = distance;
          nearest = point;
        }
      }
      return nearest;
    }

    function apply(nearest: Rendered | null) {
      hoveredIdRef.current = nearest?.id ?? null;
      setHovered(nearest);
      canvas!.style.cursor = nearest ? 'pointer' : 'default';
    }

    function onPointerMove(event: PointerEvent) {
      // Le survol ne concerne que les pointeurs qui survolent réellement.
      if (event.pointerType === 'touch') return;
      apply(pick(event));
    }

    /**
     * Au doigt, `pointermove` ne se déclenche pas : un appui révèle donc
     * l'étiquette, et c'est un second appui sur l'étiquette qui ouvre la page.
     * Deux gestes délibérément — une navigation déclenchée par un effleurement
     * serait subie plutôt que choisie.
     */
    function onPointerDown(event: PointerEvent) {
      if (event.pointerType !== 'touch') return;
      apply(pick(event));
    }

    /**
     * Un pointeur tactile cesse d'exister après le relâchement : Chromium émet
     * donc `pointerleave` juste après `pointerup`. Sans ce garde, l'étiquette
     * révélée par un appui disparaissait dans la milliseconde — le geste
     * paraissait sans effet. Au doigt, c'est un appui ailleurs qui referme,
     * ce dont `onPointerDown` se charge déjà.
     */
    function onPointerLeave(event: PointerEvent) {
      if (event.pointerType === 'touch') return;
      apply(null);
    }

    resize();
    const observer = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    observer.observe(wrap);

    // La boucle ne tourne que si la constellation est à l'écran.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        running = Boolean(entry?.isIntersecting);
  if (running && !reduced) frame = requestAnimationFrame(step);
      },
      { threshold: 0 },
    );
    visibility.observe(wrap);

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerleave', onPointerLeave);

    if (reduced) draw(0);
    else frame = requestAnimationFrame(step);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [points]);

  return (
    <div
      ref={wrapRef}
      // Décoratif pour les technologies d'assistance : toute l'information
      // qu'il porte est accessible en texte ailleurs sur la page.
      aria-hidden
      className="relative h-full w-full"
    >
      <canvas ref={canvasRef} className="h-full w-full" />

      {hovered ? (
        <Link
          href={hovered.href}
          className="pointer-events-auto absolute z-10 max-w-[220px] -translate-x-1/2 -translate-y-full rounded-[6px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 py-1.5 text-xs leading-snug shadow-lg"
          style={{ left: hovered.px, top: hovered.py - 10 }}
        >
          {hovered.title}
        </Link>
      ) : null}

      <p className="pointer-events-none absolute bottom-0 left-0 font-mono text-[10px] leading-relaxed text-[var(--color-text-muted)]">
        {label}
      </p>
    </div>
  );
}
