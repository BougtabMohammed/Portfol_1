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
                <div className="md:pl-[164px]" aria-hidden>
                  <span className="my-2 ml-4 block h-5 w-px bg-[var(--color-border-strong)]" />
                </div>
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
