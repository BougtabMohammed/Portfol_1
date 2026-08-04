import type { I18nText } from '@/lib/i18n';

/**
 * Traces d'exécution.
 *
 * Ce sont des **illustrations pédagogiques** du fonctionnement d'un système
 * agentique, pas des captures d'exécutions réelles. Aucun nom de client, aucune
 * donnée, aucun chiffre mesuré n'y figure — les durées sont des ordres de grandeur
 * plausibles servant à montrer qu'un appel d'outil prend du temps, et la légende
 * de chaque trace le précise à l'écran.
 *
 * Raison d'être : un recruteur comprend en cinq secondes, sans lire une ligne de
 * prose, ce que « système multi-agents » veut dire concrètement — un superviseur
 * qui décide, des outils qui calculent, et une réponse dont chaque chiffre est
 * rattaché à une source.
 */

export type TraceStep = {
  label: string;
  detail: I18nText;
  duration?: string;
};

export type Trace = {
  query: I18nText;
  steps: readonly TraceStep[];
  caption: I18nText;
};

const ILLUSTRATION: I18nText = {
  fr: 'Illustration du fonctionnement — aucune donnée client, aucune mesure réelle',
  en: 'Illustration of the mechanism — no client data, no measured figures',
};

/** Trace du hero : le système d'aide à la décision budgétaire, anonymisé. */
export const heroTrace: Trace = {
  query: {
    fr: 'quel budget prévoir pour cette catégorie de dépense ?',
    en: 'what budget should we plan for this spending category?',
  },
  steps: [
    {
      label: 'agent superviseur',
      detail: { fr: 'routage vers trois outils', en: 'routing to three tools' },
    },
    {
      label: 'outil ML',
      detail: { fr: 'projection budgétaire', en: 'budget projection' },
      duration: '1.2 s',
    },
    {
      label: 'outil RAG',
      detail: { fr: 'normes applicables retrouvées', en: 'applicable rules retrieved' },
      duration: '0.4 s',
    },
    {
      label: 'outil SQL',
      detail: { fr: 'référentiel des prix interrogé', en: 'price reference queried' },
      duration: '0.2 s',
    },
    {
      label: 'réponse sourcée',
      detail: { fr: 'chiffre · norme citée · trace des appels', en: 'figure · cited rule · call trace' },
    },
  ],
  caption: ILLUSTRATION,
};

/**
 * Traces par étude de cas, indexées sur l'identifiant français du projet.
 * Un projet sans trace n'en affiche simplement pas.
 */
export const projectTraces: Record<string, Trace> = {
  'systeme-multi-agents-prevision-budgetaire': heroTrace,

  'agents-ia-automatisation-processus-metier': {
    query: {
      fr: 'produis l’état hebdomadaire de cette activité',
      en: 'produce the weekly report for this activity',
    },
    steps: [
      {
        label: 'agent métier',
        detail: { fr: 'périmètre reconnu, outils autorisés', en: 'scope recognised, tools authorised' },
      },
      {
        label: 'pipeline',
        detail: { fr: 'sources hétérogènes réconciliées', en: 'heterogeneous sources reconciled' },
        duration: '0.8 s',
      },
      {
        label: 'recherche RAG',
        detail: { fr: 'contexte métier récupéré', en: 'business context retrieved' },
        duration: '0.3 s',
      },
      {
        label: 'évaluation',
        detail: { fr: 'réponse confrontée au jeu de contrôle', en: 'answer checked against the reference set' },
      },
      {
        label: 'état produit',
        detail: { fr: 'livré à l’équipe, traçable', en: 'delivered to the team, traceable' },
      },
    ],
    caption: ILLUSTRATION,
  },

  'detection-fraude-pipeline-mlops-gcp': {
    query: {
      fr: 'cette transaction est-elle anormale ?',
      en: 'is this transaction anomalous?',
    },
    steps: [
      {
        label: 'Dataflow',
        detail: { fr: 'transformation distribuée', en: 'distributed transformation' },
      },
      {
        label: 'BigQuery',
        detail: { fr: 'variables calculées en SQL', en: 'features computed in SQL' },
        duration: '0.6 s',
      },
      {
        label: 'Vertex AI',
        detail: { fr: 'score d’anomalie', en: 'anomaly score' },
        duration: '0.1 s',
      },
      {
        label: 'seuil métier',
        detail: { fr: 'arbitrage faux positifs / fraudes manquées', en: 'false positives vs missed frauds' },
      },
      {
        label: 'décision',
        detail: { fr: 'alerte ou passage, avec le score', en: 'alert or pass, with the score' },
      },
    ],
    caption: ILLUSTRATION,
  },

  'pipeline-temps-reel-analyse-actualites': {
    query: {
      fr: 'flux d’actualités entrant',
      en: 'incoming news stream',
    },
    steps: [
      {
        label: 'Kafka',
        detail: { fr: 'message mis en tampon durable', en: 'message buffered durably' },
      },
      {
        label: 'PySpark',
        detail: { fr: 'traitement distribué', en: 'distributed processing' },
        duration: '0.3 s',
      },
      {
        label: 'modèle NLP',
        detail: { fr: 'sentiment et classification', en: 'sentiment and classification' },
        duration: '0.2 s',
      },
      {
        label: 'Power BI',
        detail: { fr: 'indicateur mis à jour', en: 'indicator updated' },
      },
    ],
    caption: ILLUSTRATION,
  },

  'scoring-propension-paiement-recouvrement': {
    query: {
      fr: 'quelles cibles traiter en premier aujourd’hui ?',
      en: 'which targets should be worked first today?',
    },
    steps: [
      {
        label: 'historique',
        detail: { fr: 'réponses passées agrégées', en: 'past responses aggregated' },
      },
      {
        label: 'comportement',
        detail: { fr: 'règlements observés', en: 'observed settlements' },
      },
      {
        label: 'score composite',
        detail: { fr: 'portefeuille ordonné', en: 'portfolio ranked' },
        duration: '0.1 s',
      },
      {
        label: 'file de travail',
        detail: { fr: 'remise à l’agent, explicable cible par cible', en: 'handed to the agent, explainable per target' },
      },
    ],
    caption: ILLUSTRATION,
  },

  'analyse-paniers-prevision-ventes-retail': {
    query: {
      fr: 'que faut-il implanter côte à côte, et en quelle quantité ?',
      en: 'what should sit side by side, and in what quantity?',
    },
    steps: [
      {
        label: 'transactions',
        detail: { fr: 'paniers d’achat agrégés', en: 'shopping baskets aggregated' },
      },
      {
        label: 'Apriori · FP-Growth',
        detail: { fr: 'règles trouvées par les deux méthodes', en: 'rules found by both methods' },
        duration: '2.1 s',
      },
      {
        label: 'filtre métier',
        detail: { fr: 'associations évidentes écartées', en: 'obvious associations discarded' },
      },
      {
        label: 'Prophet',
        detail: { fr: 'demande projetée, saisonnalité incluse', en: 'demand projected, seasonality included' },
        duration: '0.9 s',
      },
      {
        label: 'décision',
        detail: { fr: 'assortiment et implantation', en: 'assortment and store layout' },
      },
    ],
    caption: ILLUSTRATION,
  },
};
