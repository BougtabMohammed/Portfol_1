import { tokenize, termFrequencies } from './text.ts';

/**
 * Recherche lexicale BM25, exécutée dans le navigateur.
 *
 * Premier essai en TF-IDF avec similarité cosinus : 5 requêtes de contrôle sur 12
 * seulement remontaient le bon document. La cause était mécanique — la normalisation
 * L2 divise chaque poids par la norme du document, si bien qu'un terme rare noyé
 * dans une étude de cas de 3 000 signes pèse moins que le même terme dans une page
 * de 200 signes. Résultat : la page « Projets » battait l'étude de cas Kafka sur la
 * requête « kafka ».
 *
 * BM25 corrige exactement ce défaut : la saturation en `k1` empêche qu'un terme
 * répété domine, et le facteur `b` normalise par la longueur **relative** du
 * document plutôt que par sa norme absolue. S'y ajoute une pondération de champ —
 * un terme du titre compte plus lourd qu'un terme du corps.
 *
 * Tout est pré-calculé au build ; il ne reste ici qu'une somme sur les termes de la
 * requête. Aucune requête réseau, aucune clé, aucun serveur.
 */

/** Saturation de la fréquence de terme. Au-delà, répéter un mot n'ajoute presque rien. */
const K1 = 1.2;
/**
 * Force de la normalisation par la longueur. 0 = aucune, 1 = totale.
 *
 * Calibré sur les 12 requêtes de contrôle : 0,65 (valeur usuelle) laissait la FAQ
 * « Quels sont ses projets les plus significatifs ? » — courte et citant le pipeline
 * de détection de fraude — devancer l'étude de cas elle-même. Ici, un document long
 * est généralement plus informatif qu'un document court, pas plus dilué : la
 * pénalité de longueur doit donc rester modérée. 0,45 donne 12/12 avec de la marge
 * de part et d'autre (le plateau va de 0,10 à 0,50).
 */
const B = 0.45;

/**
 * Priorité par nature de document.
 *
 * Une page d'index cite les titres de tout ce qu'elle liste ; elle contient donc
 * légitimement les mots-clés de chaque projet, et sa brièveté la fait gagner en
 * BM25. Sur « détection de fraude sur google cloud », la page « Projets » battait
 * ainsi l'étude de cas correspondante. Un contenu réel prime sur un sommaire.
 */
const TYPE_PRIOR: Record<DocType, number> = {
  project: 1,
  faq: 1,
  experience: 1,
  education: 1,
  skill: 0.95,
  page: 0.82,
};

export type DocType = 'page' | 'project' | 'experience' | 'education' | 'faq' | 'skill';

export type IndexedDoc = {
  id: string;
  type: DocType;
  title: string;
  subtitle: string;
  href: string;
  excerpt: string;
  /** Coordonnées de la projection 2D par ACP, dans [-1, 1]. */
  x: number;
  y: number;
  /** Indices des termes dans le vocabulaire. */
  t: number[];
  /** Fréquences pondérées par champ, alignées sur `t`. */
  f: number[];
  /** Longueur du document en jetons — le dénominateur de BM25. */
  len: number;
};

export type LocaleIndex = {
  vocabulary: string[];
  /** IDF façon BM25, pré-calculé au build. */
  idf: number[];
  avgdl: number;
  docs: IndexedDoc[];
};

export type SearchIndex = {
  version: number;
  method: string;
  locales: Record<string, LocaleIndex>;
};

export type SearchResult = {
  doc: IndexedDoc;
  score: number;
};

/** Cache du dictionnaire terme → indice, construit une seule fois par index. */
const termMaps = new WeakMap<LocaleIndex, Map<string, number>>();

function getTermMap(index: LocaleIndex): Map<string, number> {
  const cached = termMaps.get(index);
  if (cached) return cached;
  const map = new Map<string, number>();
  index.vocabulary.forEach((term, id) => map.set(term, id));
  termMaps.set(index, map);
  return map;
}

/** Table creuse terme → fréquence pondérée, pour un document donné. */
function documentTerms(doc: IndexedDoc): Map<number, number> {
  const map = new Map<number, number>();
  for (let i = 0; i < doc.t.length; i++) {
    const id = doc.t[i];
    if (id !== undefined) map.set(id, doc.f[i] ?? 0);
  }
  return map;
}

function scoreDocument(
  doc: IndexedDoc,
  queryTerms: readonly number[],
  index: LocaleIndex,
): number {
  const terms = documentTerms(doc);
  const normalizer = K1 * (1 - B + (B * doc.len) / (index.avgdl || 1));

  let score = 0;
  let matched = 0;
  for (const termId of queryTerms) {
    const frequency = terms.get(termId);
    if (frequency === undefined || frequency === 0) continue;
    matched++;
    const idf = index.idf[termId] ?? 0;
    score += idf * ((frequency * (K1 + 1)) / (frequency + normalizer));
  }

  if (matched === 0) return 0;

  // Un document qui couvre plusieurs termes de la requête répond mieux qu'un
  // document qui en martèle un seul. Le facteur reste doux pour ne pas écraser
  // les requêtes d'un seul mot.
  const coverage = matched / queryTerms.length;
  return score * (0.7 + 0.3 * coverage) * TYPE_PRIOR[doc.type];
}

export function search(query: string, index: LocaleIndex, limit = 8): SearchResult[] {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const termToId = getTermMap(index);
  const queryTerms: number[] = [];
  for (const term of termFrequencies(tokenize(trimmed)).keys()) {
    const id = termToId.get(term);
    if (id !== undefined) queryTerms.push(id);
  }
  if (queryTerms.length === 0) return [];

  const results: SearchResult[] = [];
  for (const doc of index.docs) {
    const score = scoreDocument(doc, queryTerms, index);
    if (score > 0) results.push({ doc, score });
  }

  results.sort((a, b) => b.score - a.score);

  // Score relatif au meilleur résultat : un pourcentage se lit, un score BM25 brut non.
  const best = results[0]?.score ?? 1;
  return results.slice(0, limit).map((r) => ({ doc: r.doc, score: r.score / best }));
}

/**
 * Documents sémantiquement voisins — utilisé par la constellation pour tracer
 * les liens. Basé sur le recouvrement pondéré des termes.
 */
export function neighbours(doc: IndexedDoc, index: LocaleIndex, limit = 3): IndexedDoc[] {
  const terms = documentTerms(doc);
  const queryTerms = [...terms.keys()];

  const results: SearchResult[] = [];
  for (const other of index.docs) {
    if (other.id === doc.id) continue;
    const score = scoreDocument(other, queryTerms, index);
    if (score > 0) results.push({ doc: other, score });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit).map((r) => r.doc);
}
