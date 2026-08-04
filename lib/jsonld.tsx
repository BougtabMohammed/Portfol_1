import type { Locale } from './i18n';
import { absolute } from './seo';
import { SITE_URL, profile, REVEAL_CONFIDENTIAL_NAMES } from '@/content/data/profile';
import { degrees, certifications } from '@/content/data/education';
import { skillGroups } from '@/content/data/skills';
import { faqItems } from '@/content/data/faq';
import type { Project } from '@/content/data/projects';
import type { Note } from '@/content/data/notes';
import { experiences } from '@/content/data/experiences';

/**
 * Données structurées Schema.org.
 *
 * Objectif principal : faire de Mohammed Bougtab une **entité** et non une
 * chaîne de caractères. Un moteur de recherche — et surtout un moteur de réponse
 * fondé sur un modèle de langage — ne peut citer une source qu'il ne parvient
 * pas à désambiguïser. `@id` stable et réutilisé partout est la clé de voûte.
 */

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** `Person` — l'entité racine. Référencée par toutes les autres. */
export function personSchema(locale: Locale) {
  const employer = experiences[0];
  const employerName =
    employer && REVEAL_CONFIDENTIAL_NAMES && employer.companyReal
      ? employer.companyReal
      : employer?.company[locale];

  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.name,
    givenName: 'Mohammed',
    familyName: 'Bougtab',
    jobTitle: profile.jobTitle[locale],
    description: profile.summary[locale],
    email: `mailto:${profile.email}`,
    url: SITE_URL,
    image: absolute('/og.png'),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Casablanca',
      addressCountry: 'MA',
    },
    nationality: { '@type': 'Country', name: 'Morocco' },
    // Les profils publics permettent au moteur de rapprocher l'entité de ses
    // autres représentations sur le web — c'est ce qui consolide l'identité.
    sameAs: [profile.github, profile.linkedin],
    knowsLanguage: [
      { '@type': 'Language', name: 'Arabic', alternateName: 'ar' },
      { '@type': 'Language', name: 'French', alternateName: 'fr' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
    ],
    knowsAbout: skillGroups.flatMap((group) => group.skills),
    alumniOf: degrees.map((degree) => ({
      '@type': 'EducationalOrganization',
      name: degree.institution,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Casablanca',
        addressCountry: 'MA',
      },
    })),
    hasCredential: certifications.map((certification) => ({
      '@type': 'EducationalOccupationalCredential',
      name: certification.name,
      credentialCategory: 'certificate',
      recognizedBy: { '@type': 'Organization', name: certification.issuer },
    })),
    ...(employerName ? { worksFor: { '@type': 'Organization', name: employerName } } : {}),
    hasOccupation: {
      '@type': 'Occupation',
      name: 'AI Engineer',
      occupationalCategory: '15-2051.00',
      description: profile.summary[locale],
      skills: skillGroups.flatMap((group) => group.skills).join(', '),
    },
  };
}

/** `WebSite` — identité du site et action de recherche. */
export function websiteSchema(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: `${profile.name} — ${profile.jobTitle[locale]}`,
    description: profile.summary[locale],
    inLanguage: locale === 'fr' ? 'fr-MA' : 'en',
    publisher: { '@id': PERSON_ID },
  };
}

/** `ProfilePage` — déclare l'accueil comme la page de référence sur la personne. */
export function profilePageSchema(locale: Locale, path: string) {
  return {
    '@type': 'ProfilePage',
    '@id': `${absolute(path)}#page`,
    url: absolute(path),
    name: `${profile.name} — ${profile.jobTitle[locale]}`,
    inLanguage: locale === 'fr' ? 'fr-MA' : 'en',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    mainEntity: { '@id': PERSON_ID },
  };
}

/** `WebPage` — pour les pages internes. */
export function webPageSchema({
  locale,
  path,
  name,
  description,
}: {
  locale: Locale;
  path: string;
  name: string;
  description: string;
}) {
  return {
    '@type': 'WebPage',
    '@id': `${absolute(path)}#page`,
    url: absolute(path),
    name,
    description,
    inLanguage: locale === 'fr' ? 'fr-MA' : 'en',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
  };
}

/** `BreadcrumbList` — fil d'Ariane des études de cas. */
export function breadcrumbSchema(items: readonly { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

/**
 * `CreativeWork` par étude de cas.
 *
 * `SoftwareSourceCode` n'est utilisé que si un dépôt public existe : annoncer
 * du code source sans lien vers du code serait une donnée structurée fausse.
 */
export function projectSchema(project: Project, locale: Locale, path: string) {
  const base = {
    '@id': `${absolute(path)}#project`,
    url: absolute(path),
    name: project.title[locale],
    headline: project.title[locale],
    description: project.tagline[locale],
    inLanguage: locale === 'fr' ? 'fr-MA' : 'en',
    author: { '@id': PERSON_ID },
    creator: { '@id': PERSON_ID },
    keywords: project.stack.join(', '),
    dateCreated: project.year,
    isPartOf: { '@id': WEBSITE_ID },
    about: project.domain[locale],
  };

  if (project.repository) {
    return {
      ...base,
      '@type': 'SoftwareSourceCode',
      codeRepository: project.repository,
      programmingLanguage: project.stack.filter((tech) =>
        ['Python', 'Java', 'SQL'].includes(tech),
      ),
    };
  }

  return { ...base, '@type': 'CreativeWork' };
}

/**
 * `Article` — pour les notes techniques.
 *
 * `author` et `publisher` pointent tous deux vers l'entité `Person` : sur un site
 * personnel, confondre les deux est exact, et cela renforce l'association entre la
 * personne et son expertise plutôt que de la diluer dans une organisation fictive.
 */
export function articleSchema(note: Note, locale: Locale, path: string) {
  return {
    '@type': 'Article',
    '@id': `${absolute(path)}#article`,
    url: absolute(path),
    headline: note.title[locale],
    description: note.excerpt[locale],
    datePublished: note.date,
    dateModified: note.date,
    inLanguage: locale === 'fr' ? 'fr-MA' : 'en',
    keywords: note.tags.join(', '),
    wordCount: note.body.reduce((total, block) => {
      if (block.kind === 'list') return total + block.items[locale].join(' ').split(/\s+/).length;
      if (block.kind === 'code') return total;
      return total + block.text[locale].split(/\s+/).length;
    }, 0),
    timeRequired: `PT${note.readingMinutes}M`,
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    isPartOf: { '@id': WEBSITE_ID },
    mainEntityOfPage: absolute(path),
  };
}

/** `FAQPage` — le schéma à plus fort effet sur les moteurs de réponse. */
export function faqSchema(locale: Locale, path: string) {
  return {
    '@type': 'FAQPage',
    '@id': `${absolute(path)}#faq`,
    url: absolute(path),
    inLanguage: locale === 'fr' ? 'fr-MA' : 'en',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question[locale],
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer[locale],
      },
    })),
  };
}

/**
 * Emballe plusieurs schémas dans un seul `@graph`.
 * Un graphe unique évite de répéter le contexte et rend les `@id` résolvables
 * entre eux, ce que des blocs séparés ne permettent pas.
 */
export function jsonLdGraph(...nodes: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}

/** Balise à insérer dans la page. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
