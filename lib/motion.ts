/**
 * Utilitaires de mouvement, volontairement hors de tout module `'use client'`.
 *
 * Une fonction exportée depuis un fichier client devient une référence client :
 * elle ne peut plus être appelée pendant le rendu serveur. `staggerDelay` étant
 * appelée dans des composants serveur pour calculer un délai, elle doit vivre
 * dans un module neutre.
 */

/** Écart entre éléments d'une même grille, plafonné pour ne pas faire attendre. */
export function staggerDelay(index: number, step = 0.05, max = 6): number {
  return Math.min(index, max) * step;
}
