import type { I18nText, I18nList } from '@/lib/i18n';

/**
 * Double formation — l'élément absent du CV et le socle de la thèse du portfolio.
 * Présentée en deux colonnes parallèles pour rendre visible d'un coup d'œil que
 * les deux cursus ont été menés simultanément de 2023 à 2026.
 */

export type Degree = {
  id: string;
  institution: string;
  institutionUrl?: string;
  degree: I18nText;
  field: I18nText;
  period: string;
  startDate: string;
  endDate: string;
  highlights: I18nList;
};

export const degrees: readonly Degree[] = [
  {
    id: 'emsi',
    institution: 'EMSI Casablanca',
    degree: { fr: 'Cycle Ingénieur — Bac+5', en: 'Engineering degree — 5 years' },
    field: {
      fr: 'Informatique & Réseaux, spécialisation MIAGE',
      en: 'Computer Science & Networks, MIAGE specialisation',
    },
    period: '2021 — 2026',
    startDate: '2021-09-01',
    endDate: '2026-07-31',
    highlights: {
      fr: [
        'Méthodes informatiques appliquées à la gestion des entreprises',
        'Génie logiciel, bases de données, systèmes distribués',
        'Big Data, machine learning et intelligence artificielle',
      ],
      en: [
        'Computer methods applied to business management',
        'Software engineering, databases, distributed systems',
        'Big Data, machine learning and artificial intelligence',
      ],
    },
  },
  {
    id: 'hassan-ii',
    institution: 'Université Hassan II de Casablanca',
    degree: { fr: 'Licence', en: "Bachelor's degree" },
    field: {
      fr: 'Droit Public, Relations Internationales et Sciences Politiques',
      en: 'Public Law, International Relations and Political Science',
    },
    period: '2023 — 2026',
    startDate: '2023-09-01',
    endDate: '2026-07-31',
    highlights: {
      fr: [
        'Droit administratif et finances publiques',
        'Politiques publiques et processus de décision',
        'Gouvernance, relations internationales et institutions',
      ],
      en: [
        'Administrative law and public finance',
        'Public policy and decision-making processes',
        'Governance, international relations and institutions',
      ],
    },
  },
] as const;

/** Le texte qui transforme les deux diplômes en un seul argument. */
export const dualEducationNarrative = {
  title: {
    fr: 'Deux diplômes, trois ans en parallèle',
    en: 'Two degrees, three years in parallel',
  },
  body: {
    fr: [
      "J'ai ajouté la licence en droit public en 2023, en parallèle du cycle ingénieur. Ce n'était pas un plan de carrière : je voulais comprendre comment se prennent les décisions que j'apprenais à automatiser.",
      "Trois ans plus tard, j'ai conçu un système d'IA pour la prévision budgétaire d'une administration publique. Le vocabulaire des finances publiques, la logique d'un référentiel réglementaire, la notion de responsabilité devant un contrôle — je ne les ai pas découverts sur ce projet.",
      "C'est ce qui m'a permis de poser les bonnes questions avant d'écrire la première ligne de code.",
    ],
    en: [
      'I added the public law degree in 2023, alongside the engineering programme. It was not a career plan: I wanted to understand how the decisions I was learning to automate actually get made.',
      'Three years later I designed an AI system for budget forecasting at a public administration. The vocabulary of public finance, the logic of a regulatory framework, the idea of answering to an audit — I did not discover them on that project.',
      'That is what let me ask the right questions before writing the first line of code.',
    ],
  },
} as const;

export type Certification = {
  name: string;
  issuer: string;
};

export const certifications: readonly Certification[] = [
  { name: 'IBM Data Engineering Professional Certificate', issuer: 'IBM' },
  { name: 'The Structured Query Language (SQL)', issuer: 'University of Colorado Boulder' },
  { name: 'Programming for Everybody (Getting Started with Python)', issuer: 'University of Michigan' },
] as const;
