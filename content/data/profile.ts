import type { I18nText } from '@/lib/i18n';

/**
 * Identité, positionnement et coordonnées.
 * Toute donnée factuelle du site part d'ici — rien n'est écrit en dur dans un composant.
 */

/**
 * NDA — les noms d'employeur et de client soumis à confidentialité sont
 * anonymisés par défaut. Passer ce drapeau à `true` révèle les noms réels
 * partout où ils apparaissent, sans aucune autre modification du code.
 * Voir `content/data/experiences.ts` et `content/data/projects.ts`.
 */
export const REVEAL_CONFIDENTIAL_NAMES = false;

export const SITE_URL = 'https://mohammedbougtab.com';

export const profile = {
  name: 'Mohammed Bougtab',
  jobTitle: {
    fr: 'AI Engineer — Data & Agentic Systems',
    en: 'AI Engineer — Data & Agentic Systems',
  } satisfies I18nText,

  /** Phrase de valeur du hero. Trois substantifs : agents, pipelines, évaluation. */
  tagline: {
    fr: "Je conçois des systèmes d'IA qui tiennent en production : des agents qui raisonnent, des pipelines qui les alimentent, et une évaluation qui prouve qu'ils fonctionnent.",
    en: 'I build AI systems that hold up in production: agents that reason, pipelines that feed them, and the evaluation that proves they work.',
  } satisfies I18nText,

  /** Résumé court, réutilisé dans les meta descriptions et le JSON-LD. */
  summary: {
    fr: "AI Engineer basé à Casablanca. Je conçois des systèmes multi-agents, des solutions RAG et les pipelines de données qui les alimentent. Ingénieur EMSI et licencié en droit public — une double formation qui m'a mené à concevoir un système d'aide à la décision budgétaire pour une administration publique.",
    en: 'AI Engineer based in Casablanca. I design multi-agent systems, RAG solutions and the data pipelines that feed them. Engineering degree from EMSI plus a public law degree — a dual background that led me to build a budget decision-support system for a public administration.',
  } satisfies I18nText,

  location: {
    fr: 'Casablanca, Maroc',
    en: 'Casablanca, Morocco',
  } satisfies I18nText,

  availability: {
    fr: 'Ouvert aux opportunités',
    en: 'Open to opportunities',
  } satisfies I18nText,

  email: 'bougtab.mohammed03@gmail.com',
  phone: '+212698642174',
  phoneDisplay: '+212 6 98 64 21 74',
  github: 'https://github.com/BougtabMohammed',
  githubHandle: 'BougtabMohammed',
  linkedin: 'https://www.linkedin.com/in/mohammed-bougtab',

  languages: [
    { name: { fr: 'Arabe', en: 'Arabic' }, level: { fr: 'Langue maternelle', en: 'Native' } },
    { name: { fr: 'Français', en: 'French' }, level: { fr: 'C1 — professionnel avancé', en: 'C1 — advanced professional' } },
    { name: { fr: 'Anglais', en: 'English' }, level: { fr: 'B2 — professionnel', en: 'B2 — professional' } },
  ],
} as const;

/**
 * Bandeau de preuve de l'accueil.
 * Chaque valeur est directement dérivable du parcours — aucune n'est une estimation.
 * Les métriques de périmètre encore à confirmer sont listées dans
 * `content/data/METRICS-TODO.md` et ne sont pas publiées tant qu'elles ne sont pas validées.
 */
export const proofStats = [
  {
    value: 6,
    label: { fr: 'expériences en data & IA', en: 'data & AI roles' },
  },
  {
    value: 6,
    label: { fr: 'études de cas documentées', en: 'documented case studies' },
  },
  {
    value: 2,
    label: { fr: 'cursus menés en parallèle', en: 'degrees studied in parallel' },
  },
  {
    value: 4,
    label: { fr: 'couches maîtrisées, de la donnée à la décision', en: 'layers covered, from data to decision' },
  },
] as const;

/** La thèse — le cœur de la différenciation du portfolio. */
export const thesis = {
  title: { fr: 'De la donnée à la décision', en: 'From data to decision' },
  body: {
    fr: [
      "J'ai commencé par extraire de la donnée. Puis par construire les systèmes qui la produisent. Puis par la transformer en prédictions. Aujourd'hui, je construis des systèmes qui aident à décider.",
      "C'est une progression, pas une collection de compétences — et c'est la raison pour laquelle j'ai suivi en parallèle une licence en droit public et sciences politiques.",
    ],
    en: [
      'I started by extracting data. Then by building the systems that produce it. Then by turning it into predictions. Today I build systems that help people decide.',
      'That is a progression, not a collection of skills — and it is why I studied for a public law and political science degree at the same time.',
    ],
  },
  pullQuote: {
    fr: "Un système d'IA n'automatise pas une tâche : il déplace une décision. Savoir qui décide, sous quelle contrainte et devant qui il en répond fait partie du travail de l'ingénieur.",
    en: 'An AI system does not automate a task: it moves a decision. Knowing who decides, under what constraint and to whom they answer is part of the engineering work.',
  },
} as const;
