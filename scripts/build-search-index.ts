/**
 * Construit l'index de recherche vectorielle.
 *
 * Ce script lit le contenu structuré de `content/data/`, en dérive un corpus de
 * documents, les vectorise en TF-IDF, les projette en deux dimensions par analyse
 * en composantes principales, puis écrit le tout dans
 * `content/generated/search-index.json`.
 *
 * Deux sorties, deux usages distincts :
 *
 *  - les **vecteurs creux TF-IDF** servent la recherche `⌘K` dans le navigateur.
 *    Ils sont normalisés L2 puis quantifiés sur 8 bits, et seuls les termes de
 *    poids le plus fort sont conservés par document ;
 *  - les **coordonnées 2D** servent la constellation du hero. La position d'un
 *    point n'est donc pas décorative : c'est la sortie réelle de la projection.
 *
 * Rien n'est calculé à l'exécution du site. Aucun appel réseau, aucune clé, aucun
 * coût — le fichier généré est committé et servi comme n'importe quel actif statique.
 *
 * Usage :  node --experimental-strip-types scripts/build-search-index.ts
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { tokenize } from '../lib/text.ts';
import { LOCALES } from '../lib/i18n.ts';
import { ROUTES } from '../lib/routes.ts';
import { profile, thesis } from '../content/data/profile.ts';
import { experiences } from '../content/data/experiences.ts';
import { degrees, dualEducationNarrative, certifications } from '../content/data/education.ts';
import { skillGroups } from '../content/data/skills.ts';
import { faqItems } from '../content/data/faq.ts';
import { projects } from '../content/data/projects.ts';
import { pageSeo } from '../content/data/seo.ts';
import { ui } from '../content/data/ui.ts';

type Locale = (typeof LOCALES)[number];

type RawDoc = {
  id: string;
  type: 'page' | 'project' | 'experience' | 'education' | 'faq' | 'skill';
  title: string;
  subtitle: string;
  href: string;
  excerpt: string;
  /** Texte complet soumis à la vectorisation. */
  text: string;
};

/**
 * Nombre de termes conservés par document.
 *
 * Volontairement élevé : la première version plafonnait à 48 et coupait les termes
 * rares des études de cas les plus longues — « hallucination » disparaissait de
 * l'index alors que le mot figure bien dans le texte. BM25 n'ayant pas besoin de
 * normalisation L2, garder les termes ne déforme plus le score.
 */
const MAX_TERMS_PER_DOC = 260;
/** Un terme présent dans un seul document reste utile ; au-delà de 70 % il ne discrimine plus. */
const MAX_DOC_FREQUENCY_RATIO = 0.7;
/** Poids d'un terme apparaissant dans le titre ou le sous-titre du document. */
const TITLE_BOOST = 4;

/* ------------------------------------------------------------------ corpus */

function buildCorpus(locale: Locale): RawDoc[] {
  const docs: RawDoc[] = [];

  // --- Pages ---------------------------------------------------------------
  const pageExtras: Partial<Record<keyof typeof ROUTES, string>> = {
    home: [
      profile.tagline[locale],
      profile.summary[locale],
      thesis.title[locale],
      thesis.body[locale].join(' '),
      thesis.pullQuote[locale],
    ].join(' '),
    about: [thesis.pullQuote[locale], dualEducationNarrative.body[locale].join(' ')].join(' '),
    experience: [
      dualEducationNarrative.title[locale],
      experiences.map((e) => e.role[locale]).join(' '),
      certifications.map((c) => `${c.name} ${c.issuer}`).join(' '),
    ].join(' '),
    contact: [profile.location[locale], ui.meta.availableFor[locale]].join(' '),
    resume: profile.summary[locale],
  };

  // Note délibérée : les pages d'index (`/projets`, `/faq`) n'absorbent PAS les
  // titres de ce qu'elles listent. Le faire les mettait en concurrence avec leurs
  // propres enfants — la page « Projets » remportait « détection de fraude sur
  // google cloud » devant l'étude de cas éponyme. Une page de sommaire doit
  // répondre à « projets » ou « études de cas », pas à un sujet précis.

  for (const key of Object.keys(ROUTES) as (keyof typeof ROUTES)[]) {
    const seo = pageSeo[key];
    docs.push({
      id: `page:${key}`,
      type: 'page',
      title: seo.title[locale],
      subtitle: ui.nav[key][locale],
      href: ROUTES[key][locale],
      excerpt: seo.description[locale],
      text: [
        seo.title[locale],
        seo.description[locale],
        seo.keywords[locale].join(' '),
        pageExtras[key] ?? '',
      ].join(' '),
    });
  }

  // --- Études de cas -------------------------------------------------------
  for (const project of projects) {
    docs.push({
      id: `project:${project.slug.fr}`,
      type: 'project',
      title: project.title[locale],
      subtitle: `${project.domain[locale]} · ${project.year}`,
      href: `${ROUTES.projects[locale]}/${project.slug[locale]}`,
      excerpt: project.tagline[locale],
      text: [
        project.title[locale],
        project.tagline[locale],
        project.domain[locale],
        project.client[locale],
        project.stack.join(' '),
        project.context[locale],
        project.problem[locale],
        project.constraints[locale].join(' '),
        project.architecture.caption[locale],
        project.architecture.layers
          .flatMap((layer) => [layer.title[locale], ...layer.nodes.map((n) => n.label)])
          .join(' '),
        project.decisions
          .flatMap((d) => [d.choice[locale], d.rationale[locale], d.alternative[locale]])
          .join(' '),
        project.evaluation[locale].join(' '),
        project.outcome[locale].join(' '),
        project.retrospective[locale],
      ].join(' '),
    });
  }

  // --- Expériences ---------------------------------------------------------
  for (const experience of experiences) {
    docs.push({
      id: `experience:${experience.id}`,
      type: 'experience',
      title: experience.role[locale],
      subtitle: `${experience.company[locale]} · ${experience.period[locale]}`,
      href: ROUTES.experience[locale],
      excerpt: experience.headline[locale],
      text: [
        experience.role[locale],
        experience.company[locale],
        experience.chapter[locale],
        experience.headline[locale],
        experience.bullets[locale].join(' '),
        experience.stack.join(' '),
      ].join(' '),
    });
  }

  // --- Formation -----------------------------------------------------------
  for (const degree of degrees) {
    docs.push({
      id: `education:${degree.id}`,
      type: 'education',
      title: `${degree.degree[locale]} — ${degree.institution}`,
      subtitle: degree.period,
      href: ROUTES.experience[locale],
      excerpt: degree.field[locale],
      text: [
        degree.institution,
        degree.degree[locale],
        degree.field[locale],
        degree.highlights[locale].join(' '),
      ].join(' '),
    });
  }

  // --- FAQ -----------------------------------------------------------------
  for (const item of faqItems) {
    docs.push({
      id: `faq:${item.id}`,
      type: 'faq',
      title: item.question[locale],
      subtitle: ui.nav.faq[locale],
      href: `${ROUTES.faq[locale]}#${item.id}`,
      excerpt: item.answer[locale].slice(0, 160),
      text: `${item.question[locale]} ${item.answer[locale]}`,
    });
  }

  // --- Compétences ---------------------------------------------------------
  for (const group of skillGroups) {
    docs.push({
      id: `skill:${group.id}`,
      type: 'skill',
      title: group.title[locale],
      subtitle: ui.sections.skills[locale],
      href: `${ROUTES.experience[locale]}#skills`,
      excerpt: group.caption[locale],
      text: [group.title[locale], group.caption[locale], group.skills.join(' ')].join(' '),
    });
  }

  return docs;
}

/* -------------------------------------------------------------- statistiques */

type DocStats = {
  /** Fréquences pondérées par champ : titre et sous-titre comptent TITLE_BOOST fois. */
  frequencies: Map<string, number>;
  /** Longueur pondérée du document, en jetons. */
  length: number;
};

function analyse(doc: RawDoc): DocStats {
  const bodyTokens = tokenize(doc.text);
  const titleTokens = tokenize(`${doc.title} ${doc.subtitle}`);

  const frequencies = new Map<string, number>();
  for (const token of bodyTokens) {
    frequencies.set(token, (frequencies.get(token) ?? 0) + 1);
  }
  for (const token of titleTokens) {
    frequencies.set(token, (frequencies.get(token) ?? 0) + TITLE_BOOST);
  }

  return { frequencies, length: bodyTokens.length + titleTokens.length * TITLE_BOOST };
}

function buildVocabulary(stats: DocStats[]) {
  const documentFrequency = new Map<string, number>();
  for (const { frequencies } of stats) {
    for (const term of frequencies.keys()) {
      documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
    }
  }

  const n = stats.length;
  const maxDf = Math.max(2, Math.floor(n * MAX_DOC_FREQUENCY_RATIO));

  const vocabulary: string[] = [];
  const termToId = new Map<string, number>();
  const idf: number[] = [];

  for (const [term, df] of documentFrequency) {
    if (df > maxDf) continue;
    termToId.set(term, vocabulary.length);
    vocabulary.push(term);
    // IDF façon BM25 (Robertson-Sparck Jones lissé). Toujours positif grâce au 1 +.
    idf.push(Math.round(Math.log(1 + (n - df + 0.5) / (df + 0.5)) * 1000) / 1000);
  }

  return { vocabulary, termToId, idf };
}

/* -------------------------------------------------------------- projection */

/**
 * Projection 2D par analyse en composantes principales, sur des vecteurs TF-IDF
 * normalisés.
 *
 * BM25 sert au classement, pas à la géométrie : pour placer des points, il faut un
 * espace euclidien où la distance a un sens, et c'est le TF-IDF normalisé qui le
 * fournit. Les deux calculs coexistent donc, chacun pour ce qu'il fait bien.
 *
 * Le corpus compte beaucoup plus de termes que de documents. On passe par la matrice
 * de Gram (documents × documents) plutôt que par la covariance (termes × termes) :
 * ses vecteurs propres donnent directement les coordonnées, et elle est minuscule.
 */
function project2D(stats: DocStats[], termToId: Map<string, number>, idf: number[]) {
  const n = stats.length;
  if (n === 0) return [];

  const dimension = idf.length;
  const vectors = stats.map(({ frequencies }) => {
    const vector = new Float64Array(dimension);
    for (const [term, count] of frequencies) {
      const id = termToId.get(term);
      if (id === undefined) continue;
      vector[id] = (1 + Math.log(count)) * (idf[id] ?? 0);
    }
    let norm = 0;
    for (const value of vector) norm += value * value;
    norm = Math.sqrt(norm) || 1;
    for (let i = 0; i < dimension; i++) vector[i]! /= norm;
    return vector;
  });

  const mean = new Float64Array(dimension);
  for (const vector of vectors) for (let i = 0; i < dimension; i++) mean[i]! += vector[i]! / n;
  const centered = vectors.map((vector) => {
    const out = new Float64Array(dimension);
    for (let i = 0; i < dimension; i++) out[i] = vector[i]! - mean[i]!;
    return out;
  });

  const gram: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let dot = 0;
      const a = centered[i]!;
      const b = centered[j]!;
      for (let k = 0; k < dimension; k++) dot += a[k]! * b[k]!;
      gram[i]![j] = dot;
      gram[j]![i] = dot;
    }
  }

  const first = topEigenvector(gram, n);
  deflate(gram, n, first.vector, first.value);
  const second = topEigenvector(gram, n);

  const points = Array.from({ length: n }, (_, i) => ({
    x: first.vector[i]! * Math.sqrt(Math.max(first.value, 1e-9)),
    y: second.vector[i]! * Math.sqrt(Math.max(second.value, 1e-9)),
  }));

  // Recadrage dans [-1, 1] pour que le rendu ne dépende pas de l'échelle du corpus.
  const maxX = Math.max(...points.map((p) => Math.abs(p.x)), 1e-9);
  const maxY = Math.max(...points.map((p) => Math.abs(p.y)), 1e-9);

  /**
   * Étalement doux.
   *
   * La première composante principale est portée par quelques documents très
   * atypiques — la page CV, le bloc « langues ». Un recadrage linéaire les envoie
   * aux bords et tasse tous les autres au centre : à l'écran, la constellation
   * devenait un amas illisible avec trois satellites. Une puissance inférieure à 1
   * dilate le centre sans toucher à l'ordre ni au signe, donc sans mentir sur les
   * positions relatives.
   */
  const spread = (value: number) => Math.sign(value) * Math.pow(Math.abs(value), 0.55);

  return points.map((p) => ({
    x: Math.round(spread(p.x / maxX) * 1000) / 1000,
    y: Math.round(spread(p.y / maxY) * 1000) / 1000,
  }));
}

/** Vecteur propre dominant, par itération de la puissance. */
function topEigenvector(matrix: number[][], n: number) {
  let vector = new Float64Array(n);
  // Amorçage déterministe : le fichier généré doit être identique d'un build à
  // l'autre, sinon le dépôt enregistre une différence à chaque exécution.
  for (let i = 0; i < n; i++) vector[i] = Math.cos(i * 1.7) * 0.5 + 0.25;

  let value = 0;
  for (let iteration = 0; iteration < 300; iteration++) {
    const next = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      const row = matrix[i]!;
      for (let j = 0; j < n; j++) sum += row[j]! * vector[j]!;
      next[i] = sum;
    }
    let norm = 0;
    for (const v of next) norm += v * v;
    norm = Math.sqrt(norm);
    if (norm < 1e-12) break;
    for (let i = 0; i < n; i++) next[i]! /= norm;
    value = norm;
    vector = next;
  }

  // Signe déterministe : on impose une première composante significative positive.
  const pivot = [...vector].find((v) => Math.abs(v) > 1e-9) ?? 1;
  if (pivot < 0) for (let i = 0; i < n; i++) vector[i] = -vector[i]!;

  return { vector, value };
}

/** Retire la composante déjà extraite pour faire émerger la suivante. */
function deflate(matrix: number[][], n: number, vector: Float64Array, value: number) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      matrix[i]![j]! -= value * vector[i]! * vector[j]!;
    }
  }
}

/* ------------------------------------------------------------------ sortie */

function buildLocaleIndex(locale: Locale) {
  const docs = buildCorpus(locale);
  const stats = docs.map(analyse);
  const { vocabulary, termToId, idf } = buildVocabulary(stats);
  const points = project2D(stats, termToId, idf);

  const usedTerms = new Set<number>();
  const perDoc = stats.map(({ frequencies }) => {
    const entries: { id: number; frequency: number }[] = [];
    for (const [term, count] of frequencies) {
      const id = termToId.get(term);
      if (id === undefined) continue;
      entries.push({ id, frequency: Math.min(count, 255) });
    }
    entries.sort((a, b) => b.frequency - a.frequency);
    const kept = entries.slice(0, MAX_TERMS_PER_DOC);
    for (const entry of kept) usedTerms.add(entry.id);
    return kept;
  });

  // Le vocabulaire est réduit aux seuls termes effectivement conservés : c'est ce
  // qui allège le fichier sans changer un seul résultat.
  const remap = new Map<number, number>();
  const trimmedVocabulary: string[] = [];
  const trimmedIdf: number[] = [];
  for (const id of [...usedTerms].sort((a, b) => a - b)) {
    remap.set(id, trimmedVocabulary.length);
    trimmedVocabulary.push(vocabulary[id]!);
    trimmedIdf.push(idf[id] ?? 0);
  }

  const lengths = stats.map((s) => s.length);
  const avgdl = Math.round((lengths.reduce((a, b) => a + b, 0) / lengths.length) * 10) / 10;

  return {
    vocabulary: trimmedVocabulary,
    idf: trimmedIdf,
    avgdl,
    docs: docs.map((doc, index) => ({
      id: doc.id,
      type: doc.type,
      title: doc.title,
      subtitle: doc.subtitle,
      href: doc.href,
      excerpt: doc.excerpt,
      x: points[index]?.x ?? 0,
      y: points[index]?.y ?? 0,
      t: perDoc[index]!.map((entry) => remap.get(entry.id)!),
      f: perDoc[index]!.map((entry) => entry.frequency),
      len: lengths[index] ?? 0,
    })),
  };
}

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(here, '../content/generated');
mkdirSync(outputDir, { recursive: true });

/**
 * Un fichier par langue, et non un fichier unique.
 *
 * La palette ne charge l'index qu'à sa première ouverture, et un visiteur ne
 * consulte qu'une seule langue : servir les deux doublerait le transfert pour rien.
 * Chaque fichier devient une entrée d'import dynamique distincte, donc un morceau
 * chargé à la demande.
 */
const METHOD =
  'BM25 (unigrammes + bigrammes, pondération de champ) · projection 2D par ACP sur vecteurs TF-IDF';

for (const locale of LOCALES) {
  const localeIndex = buildLocaleIndex(locale);
  const payload = { version: 1, method: METHOD, ...localeIndex };
  const serialized = JSON.stringify(payload);
  writeFileSync(resolve(outputDir, `search-index.${locale}.json`), serialized, 'utf-8');
  console.log(
    `  ${locale} : ${localeIndex.docs.length} documents, ${localeIndex.vocabulary.length} termes, ` +
      `longueur moyenne ${localeIndex.avgdl} — ${(serialized.length / 1024).toFixed(1)} Ko`,
  );
}
