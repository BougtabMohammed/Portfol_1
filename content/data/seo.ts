import type { I18nText } from '@/lib/i18n';
import type { RouteKey } from '@/lib/routes';

/**
 * Métadonnées SEO par page.
 *
 * Titres ≤ 60 caractères, descriptions ≤ 155 : au-delà, Google tronque et la
 * promesse de la page est coupée en plein milieu. Chaque page vise une intention
 * distincte pour qu'elles ne se concurrencent pas entre elles.
 */

export type PageSeo = {
  title: I18nText;
  description: I18nText;
  keywords: { fr: readonly string[]; en: readonly string[] };
};

export const pageSeo: Record<RouteKey, PageSeo> = {
  home: {
    title: {
      fr: 'Mohammed Bougtab — AI Engineer | Data & Agentic Systems',
      en: 'Mohammed Bougtab — AI Engineer | Data & Agentic Systems',
    },
    description: {
      fr: "AI Engineer à Casablanca. Je conçois des systèmes multi-agents, des solutions RAG et les pipelines de données qui les alimentent.",
      en: 'AI Engineer in Casablanca. I design multi-agent systems, RAG solutions and the data pipelines that feed them.',
    },
    keywords: {
      fr: ['mohammed bougtab', 'ai engineer maroc', 'data engineer casablanca', 'systèmes multi-agents', 'ingénieur ia'],
      en: ['mohammed bougtab', 'ai engineer morocco', 'data engineer casablanca', 'multi-agent systems', 'rag engineer'],
    },
  },
  projects: {
    title: {
      fr: "Projets — Systèmes d'IA, RAG & Data Engineering",
      en: 'Projects — AI systems, RAG & data engineering',
    },
    description: {
      fr: 'Études de cas détaillées : systèmes multi-agents, RAG, pipelines temps réel Kafka et Spark, MLOps sur Google Cloud.',
      en: 'Detailed case studies: multi-agent systems, RAG, real-time Kafka and Spark pipelines, MLOps on Google Cloud.',
    },
    keywords: {
      fr: ['portfolio ai engineer', 'projets langgraph', 'étude de cas rag', 'pipeline kafka spark'],
      en: ['ai engineer portfolio', 'langgraph projects', 'rag case study', 'kafka spark pipeline'],
    },
  },
  notes: {
    title: {
      fr: 'Notes techniques — RAG, agents et architecture',
      en: 'Technical notes — RAG, agents and architecture',
    },
    // Une page de sommaire décrit sa rubrique, pas les sujets de ses articles.
    // La version précédente citait « hallucination » et « découpage de corpus » —
    // elle remportait alors les requêtes destinées aux articles eux-mêmes.
    description: {
      fr: 'Retours d’expérience sur la conception de systèmes d’IA destinés à la production : décisions d’architecture, arbitrages et enseignements de terrain.',
      en: 'Field notes on designing AI systems meant for production: architectural decisions, trade-offs and lessons learned.',
    },
    keywords: {
      fr: ['blog ai engineer', 'notes techniques ia', 'retour expérience ingénieur ia'],
      en: ['ai engineer blog', 'ai engineering notes', 'ai engineer field notes'],
    },
  },
  experience: {
    title: {
      fr: 'Parcours & formation — Mohammed Bougtab',
      en: 'Experience & education — Mohammed Bougtab',
    },
    description: {
      fr: "Ingénieur EMSI et licencié en droit public. Six expériences en data et IA, de l'analyse de données à l'industrialisation d'agents.",
      en: 'EMSI engineering graduate with a public law degree. Six data and AI roles, from data analysis to industrialising agents.',
    },
    keywords: {
      fr: ['parcours ai engineer', 'ingénieur emsi', 'double formation ingénieur droit', 'expérience data engineer maroc'],
      en: ['ai engineer background', 'emsi engineer', 'dual degree engineering law', 'data engineer experience morocco'],
    },
  },
  about: {
    title: {
      fr: 'À propos — Ingénierie IA et décision publique',
      en: 'About — AI engineering and public decision-making',
    },
    description: {
      fr: "Pourquoi un ingénieur en IA a suivi une licence de droit public, et ce que cela change dans la conception des systèmes de décision.",
      en: 'Why an AI engineer studied public law, and what that changes in the design of decision-support systems.',
    },
    keywords: {
      fr: ['ia et politiques publiques', 'gouvernance de l’ia', 'ingénieur ia droit public', 'ia secteur public maroc'],
      en: ['ai and public policy', 'ai governance', 'ai engineer public law', 'public sector ai morocco'],
    },
  },
  faq: {
    title: {
      fr: 'Questions fréquentes — Mohammed Bougtab, AI Engineer',
      en: 'Frequently asked questions — Mohammed Bougtab',
    },
    description: {
      fr: 'Réponses directes sur son parcours, ses technologies, ses projets, ses disponibilités et ses domaines d’expertise.',
      en: 'Direct answers about his background, technologies, projects, availability and areas of expertise.',
    },
    keywords: {
      fr: ['qui est mohammed bougtab', 'technologies ai engineer', 'expérience rag', 'recruter ingénieur ia maroc'],
      en: ['who is mohammed bougtab', 'ai engineer technologies', 'rag experience', 'hire ai engineer morocco'],
    },
  },
  contact: {
    title: {
      fr: 'Contact — AI Engineer à Casablanca',
      en: 'Contact — AI Engineer in Casablanca',
    },
    description: {
      fr: 'Disponible pour des postes et des missions en AI et Data Engineering, au Maroc, en Europe et à distance.',
      en: 'Available for roles and contracts in AI and Data Engineering, in Morocco, Europe and remote.',
    },
    keywords: {
      fr: ['contacter ai engineer maroc', 'freelance data ia casablanca', 'recruter data engineer'],
      en: ['contact ai engineer morocco', 'freelance data ai casablanca', 'hire data engineer'],
    },
  },
  resume: {
    title: {
      fr: 'CV — Mohammed Bougtab, AI Engineer',
      en: 'Résumé — Mohammed Bougtab, AI Engineer',
    },
    description: {
      fr: 'CV complet : expériences en data et IA, double formation ingénieur et droit public, compétences techniques et certifications.',
      en: 'Full résumé: data and AI experience, dual engineering and public law education, technical skills and certifications.',
    },
    keywords: {
      fr: ['cv ai engineer', 'cv data engineer maroc', 'mohammed bougtab cv'],
      en: ['ai engineer resume', 'data engineer cv morocco', 'mohammed bougtab resume'],
    },
  },
};
