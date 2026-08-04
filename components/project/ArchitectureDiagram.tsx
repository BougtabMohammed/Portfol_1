import type { Locale } from '@/lib/i18n';
import type { DiagramLayer } from '@/content/data/projects';
import { cn } from '@/lib/utils';

/**
 * Schéma d'architecture.
 *
 * Rendu en HTML et CSS plutôt qu'en image : le contenu reste lisible par un
 * lecteur d'écran et par un moteur d'indexation, s'adapte à la largeur de
 * l'écran, suit le thème clair ou sombre, et ne coûte aucun octet de bitmap.
 * C'est le seul visuel du site — et il porte de l'information, pas du décor.
 *
 * Les connecteurs entre couches sont animés : un trait se dessine de haut en bas,
 * puis un point le parcourt. La donnée traverse littéralement le schéma. Tout est
 * en CSS (`stroke-dashoffset` et `offset-distance`), donc sans JavaScript et sans
 * travail sur le fil principal ; l'animation ne démarre qu'une fois, et jamais
 * sous `prefers-reduced-motion`.
 */
export function ArchitectureDiagram({
  layers,
  caption,
  locale,
}: {
  layers: readonly DiagramLayer[];
  caption: string;
  locale: Locale;
}) {
  return (
    <figure className="my-8">
      <div className="overflow-x-auto rounded-[8px] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 md:p-8">
        <ol className="flex min-w-[280px] flex-col gap-0">
          {layers.map((layer, layerIndex) => (
            <li key={layer.title.fr}>
              <div className="grid gap-3 md:grid-cols-[140px_1fr] md:items-start md:gap-6">
                <p className="label-mono pt-2">{layer.title[locale]}</p>
                <ul
                  className={cn(
                    'grid gap-3',
                    layer.nodes.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-3' : '',
                  )}
                >
                  {layer.nodes.map((node) => (
                    <li
                      key={node.id}
                      className={cn(
                        'rounded-[6px] border px-4 py-3',
                        node.tone === 'accent'
                          ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent-subtle)]'
                          : node.tone === 'muted'
                            ? 'border-dashed border-[var(--color-border)] bg-transparent'
                            : 'border-[var(--color-border)] bg-[var(--color-surface)]',
                      )}
                    >
                      <p
                        className={cn(
                          'font-mono text-[13px] leading-snug',
                          node.tone === 'accent'
                            ? 'text-[var(--color-accent)]'
                            : 'text-[var(--color-text)]',
                        )}
                      >
                        {node.label}
                      </p>
                      {node.note ? (
                        <p className="mt-1.5 text-xs leading-snug text-[var(--color-text-muted)]">
                          {node.note[locale]}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>

              {layerIndex < layers.length - 1 ? (
                <Connector index={layerIndex} />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="prose-column mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
        {caption}
      </figcaption>
    </figure>
  );
}

/**
 * Connecteur entre deux couches : un trait qui se dessine, puis un point qui
 * le descend. Le délai est dérivé du rang de la couche, si bien que le flux
 * progresse de haut en bas comme une exécution réelle.
 */
function Connector({ index }: { index: number }) {
  return (
    <div className="md:pl-[164px]" aria-hidden>
      <svg
        width="9"
        height="28"
        viewBox="0 0 9 28"
        fill="none"
        className="my-1 ml-[11.5px] block overflow-visible"
        style={{ '--layer': index } as React.CSSProperties}
      >
        <line
          x1="4.5"
          y1="0"
          x2="4.5"
          y2="28"
          stroke="var(--color-border-strong)"
          strokeWidth="1"
          className="diagram-line"
        />
        <circle cx="4.5" cy="0" r="2" fill="var(--color-accent)" className="diagram-pulse" />
      </svg>
    </div>
  );
}
