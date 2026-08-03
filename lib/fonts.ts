import { Inter, JetBrains_Mono } from 'next/font/google';

/**
 * Deux familles, pas une de plus.
 *
 * `next/font` télécharge les fichiers au build et les sert depuis le domaine du
 * site : aucune requête vers un tiers, donc aucun aller-retour DNS sur le chemin
 * critique. `adjustFontFallback` aligne les métriques de la police de secours sur
 * la police finale, ce qui annule le décalage de mise en page au moment de la
 * bascule — le principal contributeur de CLS sur un site typographique.
 *
 * Deux réglages viennent d'une mesure Lighthouse en mobile bridé, où le LCP
 * était à 84 % du « render delay » avec trois fichiers de police préchargés :
 *
 *  - `latin` seul pour Inter. Le sous-ensemble `latin-ext` n'apportait que le
 *    « œ » et quelques diacritiques d'Europe centrale, absents du contenu rendu
 *    (vérification faite : ils n'apparaissent que dans des commentaires de code).
 *  - JetBrains Mono n'est pas préchargée. Elle ne porte aucun élément LCP —
 *    seulement les étiquettes, dates et badges. La précharger la mettait en
 *    concurrence avec Inter sur la bande passante du premier rendu.
 */

export const fontSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true,
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
  weight: ['400', '500'],
  preload: false,
  adjustFontFallback: true,
});

export const fontVariables = `${fontSans.variable} ${fontMono.variable}`;
