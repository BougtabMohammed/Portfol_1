import type { I18nText, I18nList } from '@/lib/i18n';

/**
 * Parcours professionnel.
 *
 * Réécrit en logique d'impact et non de responsabilité : chaque puce dit ce qui a
 * changé, pas ce qui a été confié. Les deux missions freelance de fin 2025 sont
 * fusionnées en une seule entrée à deux clients — elles étaient menées en parallèle,
 * les séparer donnait l'illusion d'un doublon.
 */

export type Experience = {
  id: string;
  /** Nom affiché quand la confidentialité s'applique. */
  company: I18nText;
  /** Nom réel, affiché seulement si `REVEAL_CONFIDENTIAL_NAMES` est activé. */
  companyReal?: string;
  confidential: boolean;
  role: I18nText;
  contract: I18nText;
  location: I18nText;
  period: I18nText;
  /** Pour le tri et les données structurées. */
  startDate: string;
  endDate: string | null;
  /** Phrase d'accroche : ce que tu fais, en une ligne. */
  headline: I18nText;
  bullets: I18nList;
  stack: readonly string[];
  /** Étape du fil narratif « de la donnée à la décision ». */
  chapter: I18nText;
};

export const experiences: readonly Experience[] = [
  {
    id: 'ai-data-engineer',
    company: { fr: 'Groupe de distribution marocain', en: 'Moroccan retail group' },
    companyReal: 'Marwa',
    confidential: true,
    role: { fr: 'AI & Data Engineer', en: 'AI & Data Engineer' },
    contract: { fr: 'CDI', en: 'Full-time' },
    location: { fr: 'Casablanca', en: 'Casablanca' },
    period: { fr: "Juil. 2026 — aujourd'hui", en: 'Jul. 2026 — present' },
    startDate: '2026-07-01',
    endDate: null,
    chapter: { fr: 'Industrialiser', en: 'Industrialize' },
    headline: {
      fr: "Je construis les systèmes d'agents IA qui automatisent les processus métier du groupe, et les pipelines qui les alimentent.",
      en: 'I build the AI agent systems that automate the group’s business processes, and the pipelines that feed them.',
    },
    bullets: {
      fr: [
        "Conception de systèmes agentiques — LLM, tool calling, RAG — qui prennent en charge des tâches auparavant manuelles pour les équipes métier.",
        "Pipelines d'intégration réunissant des sources hétérogènes, pour donner aux agents un contexte fiable et à jour plutôt que des réponses plausibles.",
        "Mise en place d'une évaluation systématique des réponses des agents : un système d'IA sans protocole d'évaluation n'est pas industrialisable, il est seulement démontrable.",
        "Traduction directe des besoins métier en architecture, au contact des équipes — c'est là que se joue la moitié de la valeur d'un projet d'IA.",
        "Amélioration continue des performances en production : suivi des cas d'échec, ajustement des outils et des invites, arbitrage entre coût, latence et qualité.",
      ],
      en: [
        'Designing agentic systems — LLMs, tool calling, RAG — that take over work business teams used to do by hand.',
        'Integration pipelines pulling together heterogeneous sources, so agents answer from reliable, current context rather than plausible guesses.',
        'Systematic evaluation of agent responses: an AI system without an evaluation protocol is not production-ready, only demo-ready.',
        'Turning business needs directly into architecture, working alongside the teams — where half the value of an AI project is actually decided.',
        'Continuous improvement in production: tracking failure cases, tuning tools and prompts, trading off cost, latency and quality.',
      ],
    },
    stack: ['Python', 'LLM', 'RAG', 'Tool calling', 'Agents', 'Pipelines', 'Docker'],
  },
  {
    id: 'netopia',
    company: { fr: 'Société de conseil en systèmes d’information', en: 'IT consulting firm' },
    companyReal: 'Netopia Solutions',
    confidential: true,
    role: { fr: 'Ingénieur Data & IA', en: 'Data & AI Engineer' },
    contract: { fr: 'Stage de fin d’études', en: 'Final-year internship' },
    location: { fr: 'Rabat', en: 'Rabat' },
    period: { fr: 'Mars — Juil. 2026', en: 'Mar. — Jul. 2026' },
    startDate: '2026-03-01',
    endDate: '2026-07-31',
    chapter: { fr: 'Décider', en: 'Decide' },
    headline: {
      fr: "Système multi-agents d'aide à la prévision budgétaire, livré à une administration publique marocaine.",
      en: 'Multi-agent system supporting budget forecasting, delivered to a Moroccan public administration.',
    },
    bullets: {
      fr: [
        "Architecture agentique orchestrée avec LangChain et LangGraph : un agent superviseur, trois outils spécialisés, des workflows décisionnels explicites plutôt qu'une chaîne de prompts.",
        "Outil de prédiction — modèles Scikit-Learn et Pandas pour la projection budgétaire et l'analyse de tendances.",
        "Outil RAG — recherche contextuelle sur les normes et référentiels métier : découpage, embeddings, base vectorielle, indexation documentaire.",
        "Outil d'interrogation — requêtes SQL optimisées sur le référentiel national des prix.",
        "Évaluation des réponses du modèle, optimisation des performances et conteneurisation Docker pour le passage en environnement client.",
      ],
      en: [
        'Agentic architecture orchestrated with LangChain and LangGraph: a supervisor agent, three specialised tools, explicit decision workflows rather than a prompt chain.',
        'Prediction tool — Scikit-Learn and Pandas models for budget projection and trend analysis.',
        'RAG tool — contextual search across standards and reference frameworks: chunking, embeddings, vector store, document indexing.',
        'Query tool — optimised SQL against the national price reference database.',
        'LLM response evaluation, performance tuning and Docker containerisation for handover to the client environment.',
      ],
    },
    stack: ['LangGraph', 'LangChain', 'Python', 'Scikit-Learn', 'RAG', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'freelance',
    company: { fr: 'Missions freelance', en: 'Freelance engagements' },
    confidential: false,
    role: { fr: 'Data Scientist — indépendant', en: 'Data Scientist — independent' },
    contract: { fr: '2 clients', en: '2 clients' },
    location: { fr: 'Casablanca', en: 'Casablanca' },
    period: { fr: 'Déc. 2025 — Janv. 2026', en: 'Dec. 2025 — Jan. 2026' },
    startDate: '2025-12-01',
    endDate: '2026-01-31',
    chapter: { fr: 'Prédire', en: 'Predict' },
    headline: {
      fr: 'Deux missions menées en parallèle de mon double cursus, du cadrage à la livraison.',
      en: 'Two engagements run alongside my dual degree, from scoping to delivery.',
    },
    bullets: {
      fr: [
        "Société Marocaine de Recouvrement — modèle de scoring de propension au paiement, combinant historique de réponses et comportement de règlement, pour prioriser l'action des agents de recouvrement.",
        "Brands & Corners (ex-Virgin Megastore) — dans un contexte de transformation d'une franchise internationale en enseigne 100 % marocaine : extraction de règles d'association sur les paniers d'achat avec Apriori et FP-Growth.",
        "Brands & Corners — modèle de prévision des ventes avec Prophet, pour anticiper la demande et étayer les décisions commerciales.",
        "Cadrage du besoin, choix méthodologique et restitution des résultats assurés seul, directement auprès des interlocuteurs métier.",
      ],
      en: [
        'Société Marocaine de Recouvrement — a payment-propensity scoring model combining response history and settlement behaviour, to prioritise collection agents’ work.',
        'Brands & Corners (formerly Virgin Megastore) — during the conversion of an international franchise into a fully Moroccan brand: market-basket association rules with Apriori and FP-Growth.',
        'Brands & Corners — sales forecasting with Prophet, to anticipate demand and support commercial decisions.',
        'Scoping, methodology and presentation of results handled alone, directly with business stakeholders.',
      ],
    },
    stack: ['Python', 'Pandas', 'Scikit-Learn', 'Prophet', 'Apriori', 'FP-Growth'],
  },
  {
    id: 'backend',
    company: { fr: '6Solutions', en: '6Solutions' },
    confidential: false,
    role: { fr: 'Développeur Back-End', en: 'Back-End Developer' },
    contract: { fr: 'Stage', en: 'Internship' },
    location: { fr: 'Casablanca', en: 'Casablanca' },
    period: { fr: 'Juil. — Sept. 2025', en: 'Jul. — Sep. 2025' },
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    chapter: { fr: 'Construire', en: 'Build' },
    headline: {
      fr: "Back-end complet d'une application e-commerce, intégrée à un ERP existant.",
      en: 'Full back-end for an e-commerce application, integrated with an existing ERP.',
    },
    bullets: {
      fr: [
        'APIs REST en Spring Boot et modélisation relationnelle conçue pour l’intégration plutôt que pour la démonstration.',
        "Synchronisation bidirectionnelle des produits et des commandes avec l'ERP Dolibarr.",
        "C'est ici que j'ai appris à livrer du logiciel qui tient dans la durée — la compétence qui sépare un système d'IA déployé d'un notebook réussi.",
      ],
      en: [
        'REST APIs in Spring Boot and a relational model designed for integration rather than demonstration.',
        'Two-way synchronisation of products and orders with the Dolibarr ERP.',
        'This is where I learned to ship software that lasts — the skill that separates a deployed AI system from a successful notebook.',
      ],
    },
    stack: ['Java', 'Spring Boot', 'REST', 'SQL', 'Dolibarr'],
  },
  {
    id: 'data-analyst',
    company: { fr: 'Yola Fresh', en: 'Yola Fresh' },
    confidential: false,
    role: { fr: 'Data Analyst', en: 'Data Analyst' },
    contract: { fr: 'Stage', en: 'Internship' },
    location: { fr: 'Casablanca', en: 'Casablanca' },
    period: { fr: 'Juil. — Août 2024', en: 'Jul. — Aug. 2024' },
    startDate: '2024-07-01',
    endDate: '2024-08-31',
    chapter: { fr: 'Mesurer', en: 'Measure' },
    headline: {
      fr: 'Premier contact avec la donnée en entreprise : la mesurer avant de savoir la modéliser.',
      en: 'First contact with data in a company: measuring it before knowing how to model it.',
    },
    bullets: {
      fr: [
        'Extraction, transformation et analyse en SQL avancé, Python et Excel.',
        'Tableaux de bord Power BI pour le pilotage des indicateurs opérationnels.',
        'Analyse des performances et restitution d’insights orientés aide à la décision.',
      ],
      en: [
        'Extraction, transformation and analysis using advanced SQL, Python and Excel.',
        'Power BI dashboards for tracking operational indicators.',
        'Performance analysis and decision-oriented insight reporting.',
      ],
    },
    stack: ['SQL', 'Python', 'Power BI', 'Excel'],
  },
] as const;
