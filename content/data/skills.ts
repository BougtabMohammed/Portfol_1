import type { I18nText } from '@/lib/i18n';

/**
 * Compétences regroupées par couche, dans l'ordre du fil narratif.
 *
 * Remplace la ligne « Mots-clés ATS » du CV, qui était visible du recruteur et
 * mentionnait quatre technologies absentes de toute expérience. Ne figure ici
 * que ce qui est attesté par une expérience ou un projet du site.
 */

export type SkillGroup = {
  id: string;
  title: I18nText;
  caption: I18nText;
  skills: readonly string[];
};

export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'ai-agents',
    title: { fr: 'IA & Agents', en: 'AI & Agents' },
    caption: {
      fr: 'Systèmes qui raisonnent, appellent des outils et rendent des comptes.',
      en: 'Systems that reason, call tools and can be held to account.',
    },
    skills: [
      'LLM',
      'RAG',
      'Tool calling',
      'Systèmes multi-agents',
      'LangChain',
      'LangGraph',
      'Embeddings',
      'Vector stores',
      'Évaluation LLM',
    ],
  },
  {
    id: 'data-ml',
    title: { fr: 'Data & Machine Learning', en: 'Data & Machine Learning' },
    caption: {
      fr: 'De la donnée brute au modèle qui tient en conditions réelles.',
      en: 'From raw data to a model that holds up in real conditions.',
    },
    skills: [
      'Python',
      'Pandas',
      'Scikit-Learn',
      'Prophet',
      'Apache Kafka',
      'PySpark',
      'NLP',
      'SQL',
      'PostgreSQL',
    ],
  },
  {
    id: 'cloud-mlops',
    title: { fr: 'Cloud & MLOps', en: 'Cloud & MLOps' },
    caption: {
      fr: 'Ce qui transforme un modèle en service exploitable.',
      en: 'What turns a model into a service people can rely on.',
    },
    skills: ['Google Cloud Platform', 'BigQuery ML', 'Vertex AI', 'Dataflow', 'Docker'],
  },
  {
    id: 'software',
    title: { fr: 'Ingénierie logicielle', en: 'Software engineering' },
    caption: {
      fr: 'La base qui sépare un système déployé d’un prototype réussi.',
      en: 'The foundation that separates a deployed system from a successful prototype.',
    },
    skills: ['Java', 'Spring Boot', 'APIs REST', 'Modélisation relationnelle', 'Git'],
  },
  {
    id: 'delivery',
    title: { fr: 'Restitution & métier', en: 'Delivery & business' },
    caption: {
      fr: 'Un résultat qui n’est pas compris n’a pas d’effet.',
      en: 'A result nobody understands has no effect.',
    },
    skills: [
      'Power BI',
      'Analyse exploratoire',
      'Cadrage du besoin',
      'Communication métier',
      'Finances publiques',
    ],
  },
] as const;
