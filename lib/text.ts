/**
 * Tokenisation partagée entre le build et le navigateur.
 *
 * Point critique : l'index est construit au build par `scripts/build-search-index.ts`
 * et la requête est vectorisée dans le navigateur. Les deux **doivent** produire
 * exactement les mêmes jetons, sinon aucun terme ne se rencontre et la recherche
 * ne retourne rien. D'où ce module unique, importé des deux côtés.
 */

/** Mots-outils français et anglais, sans valeur discriminante dans le corpus. */
const STOPWORDS = new Set([
  // français
  'a', 'ai', 'au', 'aux', 'avec', 'ce', 'ces', 'cet', 'cette', 'dans', 'de', 'des', 'du',
  'elle', 'en', 'et', 'eu', 'il', 'ils', 'je', 'la', 'le', 'les', 'leur', 'lui', 'ma',
  'mais', 'me', 'meme', 'mes', 'moi', 'mon', 'ne', 'nos', 'notre', 'nous', 'on', 'ont',
  'ou', 'par', 'pas', 'plus', 'pour', 'qu', 'que', 'qui', 'sa', 'se', 'ses', 'son', 'sur',
  'ta', 'te', 'tes', 'toi', 'ton', 'tu', 'un', 'une', 'vos', 'votre', 'vous', 'y', 'est',
  'sont', 'ete', 'etre', 'avoir', 'fait', 'faire', 'tout', 'tous', 'toute', 'toutes',
  'comme', 'donc', 'alors', 'aussi', 'entre', 'sans', 'sous', 'dont', 'lors', 'chaque',
  'leurs', 'cela', 'ceux', 'celle', 'celles', 'quand', 'deux', 'trois', 'peut', 'plutot',
  // interrogatifs — ils portent l'intention de la question, jamais son sujet.
  // Sans eux, « comment il gère les hallucinations » remontait la FAQ « Comment le
  // contacter ? », le mot « comment » y étant pondéré comme un terme de titre.
  'comment', 'pourquoi', 'quel', 'quelle', 'quels', 'quelles', 'combien', 'quoi',
  'lequel', 'laquelle', 'lesquels', 'lesquelles', 'ceci', 'voici', 'voila',
  // anglais
  'the', 'and', 'or', 'of', 'to', 'in', 'is', 'it', 'that', 'this', 'these', 'those',
  'for', 'with', 'as', 'was', 'were', 'be', 'been', 'are', 'an', 'at', 'by', 'from',
  'has', 'have', 'had', 'not', 'but', 'they', 'their', 'them', 'its', 'which', 'who',
  'what', 'when', 'where', 'how', 'why', 'can', 'could', 'would', 'should', 'will',
  'on', 'into', 'than', 'then', 'there', 'here', 'each', 'both', 'also', 'more', 'most',
  'other', 'some', 'such', 'only', 'own', 'same', 'so', 'no', 'nor', 'too', 'very',
  'one', 'two', 'three', 'you', 'your', 'his', 'her', 'him', 'she', 'he', 'we', 'our',
  'my', 'me', 'i', 'do', 'does', 'did', 'doing', 'while', 'about', 'after', 'before',
]);

/**
 * Suffixes retirés pour rapprocher les formes fléchies.
 *
 * Ce n'est pas un vrai racinisateur — un Porter complet serait disproportionné pour
 * un corpus de quelques centaines de documents courts. L'objectif est seulement que
 * « agents » retrouve « agent », « prédictions » retrouve « prédiction » et
 * « pipelines » retrouve « pipeline ». Les suffixes sont triés du plus long au plus
 * court pour que le plus spécifique gagne.
 */
const SUFFIXES = [
  'ations', 'ation', 'ements', 'ement', 'ements', 'iques', 'ique', 'ances', 'ance',
  'ences', 'ence', 'euses', 'euse', 'eurs', 'eur', 'ives', 'ive', 'ings', 'ing',
  'ions', 'ion', 'ees', 'ee', 'es', 'er', 'ed', 'ly', 's',
];

/** Retire les diacritiques et met en minuscules. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, ' ');
}

function stem(word: string): string {
  if (word.length < 6) return word;
  for (const suffix of SUFFIXES) {
    if (word.length - suffix.length >= 4 && word.endsWith(suffix)) {
      return word.slice(0, -suffix.length);
    }
  }
  return word;
}

/**
 * Produit les jetons d'un texte : unigrammes racinisés puis bigrammes.
 *
 * Les bigrammes comptent : « multi agents », « secteur public » ou « base
 * vectorielle » portent un sens que leurs mots isolés ne portent pas, et ce sont
 * précisément les requêtes que fera un recruteur technique.
 */
export function tokenize(text: string): string[] {
  const words = normalize(text)
    .split(/[^a-z0-9+#.]+/)
    .map((w) => w.replace(/^[.]+|[.]+$/g, ''))
    .filter((w) => w.length >= 2 && w.length <= 24 && !STOPWORDS.has(w) && !/^\d+$/.test(w));

  const unigrams = words.map(stem);
  const bigrams: string[] = [];
  for (let i = 0; i < unigrams.length - 1; i++) {
    bigrams.push(`${unigrams[i]} ${unigrams[i + 1]}`);
  }

  return [...unigrams, ...bigrams];
}

/** Compte les occurrences de chaque jeton. */
export function termFrequencies(tokens: readonly string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return counts;
}
