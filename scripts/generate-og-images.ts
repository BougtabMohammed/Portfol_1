/**
 * Génère une vignette Open Graph par page et par langue.
 *
 * Sans cela, les 26 URL du site partagent la même image : partager l'étude de cas
 * budgétaire sur LinkedIn affiche « Mohammed Bougtab — AI Engineer » au lieu du
 * titre du projet. Or c'est précisément par LinkedIn que ces liens circuleront.
 *
 * Pourquoi `sharp` et non `next/og` : ce dernier repose sur Satori, qui exige
 * qu'on lui fournisse explicitement un fichier de police. Il faudrait donc aller
 * chercher les binaires que `next/font` a mis en cache dans `.next/` — un chemin
 * interne, non garanti d'une version à l'autre. Le rendu SVG puis rastérisation
 * est déjà éprouvé dans ce dépôt et ne dépend de rien.
 *
 * Usage :  node --experimental-strip-types scripts/generate-og-images.ts
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import { LOCALES } from '../lib/i18n.ts';
import { ROUTES } from '../lib/routes.ts';
import { profile } from '../content/data/profile.ts';
import { pageSeo } from '../content/data/seo.ts';
import { projects } from '../content/data/projects.ts';
import { notes } from '../content/data/notes.ts';

type Locale = (typeof LOCALES)[number];

const BG = '#0A0C10';
const ACCENT = '#2DD4A7';
const TEXT = '#E8EBF0';
const MUTED = '#8A93A3';
const RULE = '#232833';

/** Échappe le texte destiné au SVG — un `&` non échappé casse le document entier. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Largeur utile entre les marges de la carte. */
const CONTENT_WIDTH = 1040;

/**
 * Largeur moyenne d'un glyphe, en fraction de la taille de police.
 *
 * Sans moteur de rendu, impossible de mesurer un texte : on estime. Les valeurs
 * viennent de DejaVu, la police dont dispose la rastérisation. Le premier essai
 * supposait un nombre de caractères fixe par ligne, indépendant du corps — les
 * titres longs débordaient de la carte et recouvraient l'étiquette.
 */
const GLYPH_RATIO = { bold: 0.62, regular: 0.53, mono: 0.6 } as const;

function fitsIn(text: string, size: number, ratio: number): boolean {
  return text.length * size * ratio <= CONTENT_WIDTH;
}

/** Découpe un texte en lignes tenant dans la largeur utile, au corps donné. */
function wrap(text: string, size: number, ratio: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (fitsIn(candidate, size, ratio) || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);

  // Texte tronqué : on le signale plutôt que de le laisser déborder.
  const rendered = lines.join(' ');
  if (rendered.length < text.replace(/\s+/g, ' ').length && lines.length > 0) {
    const last = lines[lines.length - 1]!;
    const room = Math.floor(CONTENT_WIDTH / (size * ratio)) - 1;
    lines[lines.length - 1] = `${last.slice(0, Math.max(room, 8)).trimEnd()}…`;
  }
  return lines;
}

/**
 * Choisit le plus grand corps qui fasse tenir le titre en `maxLines` lignes.
 * On descend par paliers plutôt que de figer une taille : un titre court doit
 * occuper la carte, un titre long ne doit pas en sortir.
 */
function fitTitle(text: string, maxLines: number) {
  for (const size of [70, 62, 54, 46, 40]) {
    const lines = wrap(text, size, GLYPH_RATIO.bold, maxLines);
    if (lines.length <= maxLines && lines.every((line) => fitsIn(line, size, GLYPH_RATIO.bold))) {
      return { size, lines };
    }
  }
  const size = 40;
  return { size, lines: wrap(text, size, GLYPH_RATIO.bold, maxLines) };
}

type Card = {
  /** Étiquette en haut à gauche : domaine, rubrique, année. */
  eyebrow: string;
  title: string;
  /** Ligne de contexte sous le titre. */
  subtitle: string;
  /** Coin inférieur droit : pile technique ou mention. */
  footnote: string;
};

function renderCard(card: Card): string {
  const { size, lines } = fitTitle(card.title, 3);
  const advance = size * 1.16;

  // Mise en page ancrée par le haut : le bloc de titre grandit vers le bas et le
  // sous-titre suit. Un centrage vertical faisait remonter les titres longs sur
  // l'étiquette.
  const eyebrowY = 168;
  const titleTop = 252;
  const subtitleTop = titleTop + (lines.length - 1) * advance + 76;
  const subtitleLines = wrap(card.subtitle, 26, GLYPH_RATIO.regular, 2);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BG}"/>
  <rect x="0" y="0" width="1200" height="4" fill="${ACCENT}"/>
  <g opacity="0.07" stroke="${ACCENT}" stroke-width="1">
    ${Array.from({ length: 11 }, (_, i) => `<line x1="${80 + i * 96}" y1="0" x2="${80 + i * 96}" y2="630"/>`).join('\n    ')}
  </g>

  <text x="80" y="112" font-family="DejaVu Sans Mono, monospace" font-size="21" fill="${ACCENT}" letter-spacing="3">MB /</text>
  <text x="80" y="${eyebrowY}" font-family="DejaVu Sans Mono, monospace" font-size="19" fill="${MUTED}" letter-spacing="2">${escapeXml(card.eyebrow.toUpperCase())}</text>

  ${lines
    .map(
      (line, i) =>
        `<text x="80" y="${titleTop + i * advance}" font-family="DejaVu Sans, sans-serif" font-size="${size}" font-weight="bold" fill="${TEXT}">${escapeXml(line)}</text>`,
    )
    .join('\n  ')}

  ${subtitleLines
    .map(
      (line, i) =>
        `<text x="80" y="${subtitleTop + i * 34}" font-family="DejaVu Sans, sans-serif" font-size="26" fill="${MUTED}">${escapeXml(line)}</text>`,
    )
    .join('\n  ')}

  <line x1="80" y1="540" x2="1120" y2="540" stroke="${RULE}" stroke-width="1"/>
  <text x="80" y="584" font-family="DejaVu Sans Mono, monospace" font-size="21" fill="${ACCENT}">${escapeXml(profile.name)}</text>
  <text x="1120" y="584" font-family="DejaVu Sans Mono, monospace" font-size="19" fill="${MUTED}" text-anchor="end">${escapeXml(card.footnote)}</text>
</svg>`;
}

/* --------------------------------------------------------------- cartes */

function cardsFor(locale: Locale): { slug: string; card: Card }[] {
  const cards: { slug: string; card: Card }[] = [];

  for (const key of Object.keys(ROUTES) as (keyof typeof ROUTES)[]) {
    const seo = pageSeo[key];
    cards.push({
      slug: `page-${key}`,
      card: {
        eyebrow: key === 'home' ? profile.jobTitle[locale] : seo.title[locale].split(' — ')[0]!,
        title: key === 'home' ? profile.name : seo.title[locale].split(' — ').slice(1).join(' — ') || seo.title[locale],
        subtitle: seo.description[locale],
        footnote: locale === 'fr' ? 'Casablanca, Maroc' : 'Casablanca, Morocco',
      },
    });
  }

  for (const project of projects) {
    cards.push({
      slug: `project-${project.slug.fr}`,
      card: {
        eyebrow: `${project.domain[locale]} · ${project.year}`,
        title: project.title[locale],
        subtitle: project.tagline[locale],
        footnote: project.stack.slice(0, 3).join(' · '),
      },
    });
  }

  for (const note of notes) {
    cards.push({
      slug: `note-${note.slug.fr}`,
      card: {
        eyebrow: locale === 'fr' ? 'Note technique' : 'Technical note',
        title: note.title[locale],
        subtitle: note.excerpt[locale],
        footnote: note.tags.slice(0, 3).join(' · '),
      },
    });
  }

  return cards;
}

/* --------------------------------------------------------------- écriture */

const here = dirname(fileURLToPath(import.meta.url));
let total = 0;
let bytes = 0;
let largest = 0;

for (const locale of LOCALES) {
  const outputDir = resolve(here, `../public/og/${locale}`);
  mkdirSync(outputDir, { recursive: true });

  for (const { slug, card } of cardsFor(locale)) {
    const png = await sharp(Buffer.from(renderCard(card)))
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toBuffer();
    writeFileSync(resolve(outputDir, `${slug}.png`), png);
    total += 1;
    bytes += png.length;
    largest = Math.max(largest, png.length);
  }
}

console.log(
  `  ${total} vignettes Open Graph — ${(bytes / 1024).toFixed(0)} Ko au total, ` +
    `${(largest / 1024).toFixed(1)} Ko pour la plus lourde`,
);
