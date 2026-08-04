import type { I18nText, I18nList, Locale } from '@/lib/i18n';

/**
 * Notes techniques.
 *
 * ⚠️ **Les deux articles ci-dessous sont des BROUILLONS** rédigés à partir de
 * décisions d'architecture réellement prises et déjà documentées dans
 * `content/data/projects.ts`. Ils développent ce travail ; ils n'inventent aucune
 * expertise et n'avancent aucun chiffre qui n'ait été mesuré.
 *
 * Tant que `draft` vaut `true`, un article est exclu du sitemap, du flux RSS, de
 * l'index de recherche et de la liste publique. Il reste consultable par son URL
 * directe, pour relecture, et porte un bandeau qui le signale.
 *
 * **Avant publication** : relire, corriger, s'approprier le texte, puis passer
 * `draft` à `false`. Rien ne doit paraître sous une signature sans avoir été validé
 * par la personne qui signe.
 */

export type NoteBlock =
  | { kind: 'heading'; text: I18nText }
  | { kind: 'paragraph'; text: I18nText }
  | { kind: 'list'; items: I18nList }
  | { kind: 'quote'; text: I18nText }
  | { kind: 'callout'; text: I18nText }
  | { kind: 'code'; language: string; code: string };

export type Note = {
  slug: Record<Locale, string>;
  /** Tant que vrai : hors sitemap, hors flux, hors index, hors liste. */
  draft: boolean;
  /** ISO. Alimente `datePublished` du schéma Article et le tri. */
  date: string;
  readingMinutes: number;
  title: I18nText;
  excerpt: I18nText;
  tags: readonly string[];
  /** Identifiant français de l'étude de cas dont l'article développe une décision. */
  relatedProject?: string;
  body: readonly NoteBlock[];
};

export const notes: readonly Note[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: {
      fr: 'interdire-au-modele-de-produire-un-chiffre',
      en: 'never-let-the-model-produce-a-number',
    },
    draft: true,
    date: '2026-08-04',
    readingMinutes: 6,
    tags: ['RAG', 'Agents', 'Évaluation', 'Secteur public'],
    relatedProject: 'systeme-multi-agents-prevision-budgetaire',
    title: {
      fr: "Pourquoi j'interdis à mes agents de produire un chiffre",
      en: 'Why I never let my agents produce a number',
    },
    excerpt: {
      fr: "Sur un système d'aide à la décision budgétaire, un chiffre faux a des conséquences réelles. La seule garantie solide n'est pas de vérifier après coup : c'est d'interdire structurellement la génération de nombres.",
      en: 'On a budget decision-support system, a wrong figure has real consequences. The only solid guarantee is not to check afterwards: it is to structurally forbid number generation.',
    },
    body: [
      {
        kind: 'paragraph',
        text: {
          fr: "Un modèle de langage produit le mot suivant le plus probable. Cette phrase paraît anodine jusqu'au jour où le mot suivant est un montant en dirhams, et que quelqu'un va s'en servir pour bâtir une prévision de dépense publique.",
          en: 'A language model produces the most probable next token. That sounds harmless until the next token is an amount in dirhams, and somebody is about to use it to build a public spending forecast.',
        },
      },
      {
        kind: 'paragraph',
        text: {
          fr: "En concevant un système multi-agents d'aide à la prévision budgétaire pour une administration, j'ai pris une décision d'architecture qui a structuré tout le reste : **aucun nombre présent dans la réponse finale ne peut provenir de la génération.** Chaque chiffre doit être le retour d'un appel d'outil, et être traçable jusqu'à sa source.",
          en: 'While designing a multi-agent system supporting budget forecasting for a public administration, I made one architectural decision that shaped everything else: **no number in the final answer may come from generation.** Every figure has to be the return value of a tool call, traceable back to its source.',
        },
      },
      {
        kind: 'heading',
        text: {
          fr: 'Le réflexe habituel, et pourquoi il ne suffit pas',
          en: 'The usual reflex, and why it falls short',
        },
      },
      {
        kind: 'paragraph',
        text: {
          fr: "L'approche courante consiste à laisser le modèle estimer, puis à vérifier. On lui demande une réponse, on confronte les nombres qu'elle contient à une source de vérité, et on corrige les écarts. C'est fluide à écrire et ça marche souvent.",
          en: 'The common approach is to let the model estimate, then verify. You ask for an answer, check the numbers it contains against a source of truth, and correct the discrepancies. It is smooth to write and it often works.',
        },
      },
      {
        kind: 'paragraph',
        text: {
          fr: "Le problème est dans le « souvent ». Une vérification a posteriori ne rattrape que ce qu'elle sait chercher. Elle repère un montant qui contredit la base ; elle ne repère pas un montant plausible pour une catégorie de dépense qui n'existe pas, ni une somme correcte rapportée à la mauvaise période, ni un pourcentage que rien n'a jamais produit. Le modèle ne se trompe pas au hasard : il se trompe de façon vraisemblable. C'est exactement ce qui rend la vérification incomplète.",
          en: 'The problem is “often”. Post-hoc verification only catches what it knows to look for. It flags an amount that contradicts the database; it does not flag a plausible amount for a spending category that does not exist, nor a correct sum attributed to the wrong period, nor a percentage nothing ever produced. The model does not err randomly: it errs plausibly. That is precisely what makes verification incomplete.',
        },
      },
      {
        kind: 'quote',
        text: {
          fr: "Une vérification écarte les erreurs qu'elle anticipe. Une contrainte d'architecture écarte celles qu'on n'a pas imaginées.",
          en: 'A check removes the errors you anticipated. An architectural constraint removes the ones you never imagined.',
        },
      },
      {
        kind: 'heading',
        text: { fr: "Ce que l'interdiction change concrètement", en: 'What the ban changes in practice' },
      },
      {
        kind: 'paragraph',
        text: {
          fr: "Le superviseur ne calcule rien. Il décide quel outil appeler, dans quel ordre, et compose la réponse à partir de ce que les outils retournent. Trois outils dans mon cas : un modèle de prédiction pour la projection, un moteur de recherche contextuel pour la norme applicable, une requête SQL pour la donnée de référence.",
          en: 'The supervisor computes nothing. It decides which tool to call, in what order, and composes the answer from what the tools return. Three tools in my case: a prediction model for the projection, a contextual search engine for the applicable rule, a SQL query for the reference data.',
        },
      },
      {
        kind: 'paragraph',
        text: {
          fr: "Le modèle garde un rôle, et il est important : comprendre la question, choisir les outils, articuler le résultat en langue naturelle. Il perd un seul droit, celui d'inventer une valeur. La frontière est nette, donc vérifiable — on peut littéralement parcourir la réponse et exiger que chaque nombre soit rattaché à un appel.",
          en: 'The model keeps a role, and an important one: understanding the question, choosing the tools, articulating the result in natural language. It loses exactly one right, that of inventing a value. The boundary is sharp, therefore checkable — you can literally walk the answer and require every number to map to a call.',
        },
      },
      {
        kind: 'list',
        items: {
          fr: [
            "Chaque réponse est accompagnée de sa trace : quel outil, sur quelle source, avec quel résultat.",
            "Un chiffre sans appel correspondant est une anomalie détectable automatiquement, pas une nuance d'interprétation.",
            "L'auditabilité n'est plus une fonctionnalité à ajouter : elle découle de la structure.",
          ],
          en: [
            'Every answer carries its trace: which tool, against which source, with what result.',
            'A number with no matching call is an automatically detectable anomaly, not a matter of interpretation.',
            'Auditability stops being a feature to add: it follows from the structure.',
          ],
        },
      },
      {
        kind: 'heading',
        text: { fr: 'Ce que ça coûte', en: 'What it costs' },
      },
      {
        kind: 'paragraph',
        text: {
          fr: "Ce serait malhonnête de présenter cette contrainte comme gratuite. Elle coûte en latence, puisqu'il faut réellement appeler les outils avant de répondre. Elle coûte en couverture : quand aucun outil ne sait répondre, le système dit qu'il ne sait pas, là où un modèle libre aurait produit quelque chose. Et elle coûte en conception, parce qu'il faut décider à l'avance quelles questions le système a le droit de traiter.",
          en: 'It would be dishonest to present this constraint as free. It costs latency, since the tools must actually be called before answering. It costs coverage: when no tool can answer, the system says so, where a free-running model would have produced something. And it costs design effort, because you have to decide in advance which questions the system is allowed to handle.',
        },
      },
      {
        kind: 'paragraph',
        text: {
          fr: "Ce dernier point ressemble à une limite. C'est en réalité le principal bénéfice : un système qui refuse de répondre hors de son périmètre est un système dont on connaît le périmètre.",
          en: 'That last point looks like a limitation. It is in fact the main benefit: a system that declines to answer outside its scope is a system whose scope is known.',
        },
      },
      {
        kind: 'callout',
        text: {
          fr: "Cette contrainte n'a pas de sens partout. Pour de la reformulation, du résumé ou de l'exploration, elle serait absurde. Elle vaut là où une erreur a un coût identifiable et où quelqu'un devra justifier la réponse devant un tiers.",
          en: 'This constraint does not make sense everywhere. For rewriting, summarising or exploration it would be absurd. It applies where an error carries an identifiable cost and where someone will have to justify the answer to a third party.',
        },
      },
      {
        kind: 'heading',
        text: { fr: 'La question à se poser en premier', en: 'The question to ask first' },
      },
      {
        kind: 'paragraph',
        text: {
          fr: "Avant de choisir un modèle, je pose désormais trois questions : qui utilisera la réponse, devant qui cette personne devra-t-elle la justifier, et que se passe-t-il si elle est fausse. Les réponses déterminent l'architecture bien plus sûrement que l'état de l'art.",
          en: 'Before choosing a model I now ask three questions: who will use the answer, to whom will they have to justify it, and what happens if it is wrong. The answers shape the architecture far more reliably than the state of the art does.',
        },
      },
      {
        kind: 'paragraph',
        text: {
          fr: "Sur un projet de prévision budgétaire publique, les trois réponses pointaient dans la même direction. L'interdiction n'était pas une précaution : c'était la spécification.",
          en: 'On a public budget forecasting project, all three pointed the same way. The ban was not a precaution: it was the specification.',
        },
      },
    ],
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: {
      fr: 'decouper-un-corpus-reglementaire',
      en: 'chunking-a-regulatory-corpus',
    },
    draft: true,
    date: '2026-08-04',
    readingMinutes: 5,
    tags: ['RAG', 'Embeddings', 'Architecture'],
    relatedProject: 'systeme-multi-agents-prevision-budgetaire',
    title: {
      fr: 'Découper un corpus réglementaire : pourquoi la taille fixe échoue',
      en: 'Chunking a regulatory corpus: why fixed size fails',
    },
    excerpt: {
      fr: "Le découpage est présenté partout comme un réglage. Sur un corpus normatif, c'est une décision d'architecture — et je l'ai comprise trop tard.",
      en: 'Chunking is presented everywhere as a tuning knob. On a normative corpus it is an architectural decision — and I understood that too late.',
    },
    body: [
      {
        kind: 'paragraph',
        text: {
          fr: "Tous les tutoriels RAG proposent le même point de départ : fenêtre glissante de 500 à 1 000 caractères, recouvrement de 10 à 20 %, et on passe à la suite. C'est raisonnable sur de la prose. Sur un corpus de normes et de référentiels métier, ça produit un moteur de recherche qui retourne des fragments inexploitables.",
          en: 'Every RAG tutorial offers the same starting point: a sliding window of 500 to 1,000 characters, 10 to 20 % overlap, then move on. That is reasonable on prose. On a corpus of standards and reference frameworks it produces a search engine that returns unusable fragments.',
        },
      },
      {
        kind: 'heading',
        text: { fr: "Ce qui casse", en: 'What breaks' },
      },
      {
        kind: 'paragraph',
        text: {
          fr: "Un texte normatif n'est pas continu : il est structuré en unités qui ont un sens complet et une portée délimitée. Un article, un alinéa, une rubrique de référentiel. Chacune énonce une règle, et la règle ne veut rien dire tronquée.",
          en: 'Normative text is not continuous: it is structured into units with a complete meaning and a bounded scope. An article, a paragraph, a reference-framework entry. Each states a rule, and a truncated rule means nothing.',
        },
      },
      {
        kind: 'paragraph',
        text: {
          fr: "Une fenêtre de taille fixe ignore cette structure. Elle coupe au milieu d'un article et produit deux fragments dont aucun n'est utilisable : le premier énonce une condition sans sa conséquence, le second une conséquence sans sa condition. Le recouvrement atténue le symptôme sans traiter la cause — il multiplie les fragments partiels au lieu de les supprimer.",
          en: 'A fixed-size window ignores that structure. It cuts through the middle of an article and produces two fragments, neither usable: the first states a condition without its consequence, the second a consequence without its condition. Overlap softens the symptom without addressing the cause — it multiplies partial fragments instead of removing them.',
        },
      },
      {
        kind: 'quote',
        text: {
          fr: "Un passage récupéré qui perd sa condition d'application ne dit pas quelque chose d'incomplet. Il dit quelque chose de faux.",
          en: 'A retrieved passage that loses its condition of application does not say something incomplete. It says something false.',
        },
      },
      {
        kind: 'heading',
        text: { fr: 'Découper à la frontière de sens', en: 'Chunking at the boundary of meaning' },
      },
      {
        kind: 'paragraph',
        text: {
          fr: "La correction consiste à faire coïncider l'unité de découpage avec l'unité réglementaire. Un fragment devient un article entier, quelle que soit sa longueur, et non un nombre de caractères. Les fragments deviennent inégaux — certains font trois lignes, d'autres deux pages — mais chacun est autonome.",
          en: 'The fix is to make the chunking unit coincide with the regulatory unit. A chunk becomes a whole article, whatever its length, rather than a character count. Chunks become uneven — some three lines, some two pages — but each stands on its own.',
        },
      },
      {
        kind: 'paragraph',
        text: {
          fr: "Cette inégalité gêne l'intuition, parce qu'on aime les vecteurs comparables. Elle est pourtant préférable : mieux vaut un fragment long et complet qu'un fragment calibré et amputé. Pour les unités les plus longues, un second niveau de découpage à l'intérieur de l'unité, en conservant systématiquement l'en-tête de l'article dans chaque sous-fragment, préserve le contexte sans revenir à la taille fixe.",
          en: 'That unevenness bothers the intuition, because we like comparable vectors. It is nonetheless preferable: a long complete chunk beats a calibrated amputated one. For the longest units, a second level of chunking inside the unit — while systematically keeping the article header in every sub-chunk — preserves context without falling back to fixed size.',
        },
      },
      {
        kind: 'heading',
        text: { fr: "Comment j'ai vu le problème", en: 'How I saw the problem' },
      },
      {
        kind: 'paragraph',
        text: {
          fr: "Pas en lisant le code. En regardant, question par question, quels passages le moteur remontait — et en constatant que les mauvaises réponses n'étaient pas des erreurs de raisonnement du modèle, mais des fragments qui ne contenaient pas ce qu'il fallait pour raisonner.",
          en: 'Not by reading the code. By looking, question by question, at which passages the engine returned — and finding that the bad answers were not the model failing to reason, but chunks that did not contain what was needed to reason.',
        },
      },
      {
        kind: 'paragraph',
        text: {
          fr: "C'est la leçon la plus utile de ce projet, et elle dépasse le découpage : quand un système RAG répond mal, le réflexe est de retoucher l'instruction. C'est presque toujours le mauvais endroit. La question à poser d'abord est : **est-ce que le passage récupéré contenait la réponse ?** Si non, aucune formulation ne rattrapera quoi que ce soit.",
          en: 'That is the most useful lesson from the project, and it goes beyond chunking: when a RAG system answers badly, the reflex is to tweak the prompt. It is almost always the wrong place. The first question to ask is: **did the retrieved passage contain the answer?** If not, no wording will fix anything.',
        },
      },
      {
        kind: 'callout',
        text: {
          fr: "Ce que je referais autrement : construire le jeu d'évaluation avant le système. Nous l'avons écrit une fois l'architecture en place, et il a révélé des problèmes qu'un jeu de tests écrit en amont aurait exposés bien plus tôt, et pour beaucoup moins cher.",
          en: 'What I would do differently: build the evaluation set before the system. We wrote it once the architecture was in place, and it surfaced problems an up-front test set would have exposed far earlier, and far more cheaply.',
        },
      },
      {
        kind: 'heading',
        text: { fr: 'La généralisation', en: 'The general case' },
      },
      {
        kind: 'paragraph',
        text: {
          fr: "Le corpus réglementaire n'a rien d'un cas exotique. Une documentation technique, un catalogue produit, un référentiel comptable, un jeu de procédures : tous ont une unité de sens propre, et tous souffrent du découpage à l'aveugle. La règle est simple à formuler et coûteuse à ignorer — **le découpage doit suivre la structure du document, pas la commodité du vecteur.**",
          en: 'A regulatory corpus is nothing exotic. Technical documentation, a product catalogue, an accounting framework, a set of procedures: all have their own unit of meaning, and all suffer from blind chunking. The rule is easy to state and expensive to ignore — **chunking must follow the structure of the document, not the convenience of the vector.**',
        },
      },
    ],
  },
] as const;

/* ---------------------------------------------------------------- helpers */

/** Notes publiées, les plus récentes d'abord. Les brouillons n'en font jamais partie. */
export const publishedNotes = notes
  .filter((note) => !note.draft)
  .slice()
  .sort((a, b) => b.date.localeCompare(a.date));

export function getNoteBySlug(slug: string, locale: Locale): Note | undefined {
  return notes.find((note) => note.slug[locale] === slug);
}
