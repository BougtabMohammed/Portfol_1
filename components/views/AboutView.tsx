import type { Locale } from '@/lib/i18n';
import { route } from '@/lib/routes';
import { pageSeo } from '@/content/data/seo';
import { thesis } from '@/content/data/profile';
import { ui } from '@/content/data/ui';
import { PageShell } from '@/components/layout/PageShell';
import { DualEducation } from '@/components/sections/DualEducation';
import { ContactCta } from '@/components/sections/ContactCta';
import { Label, Section } from '@/components/ui/primitives';
import { Reveal } from '@/components/motion/Reveal';
import { JsonLd, jsonLdGraph, personSchema, websiteSchema, webPageSchema } from '@/lib/jsonld';

/**
 * À propos — la page qui porte la thèse.
 *
 * C'est ici que la formation juridique cesse d'être une ligne de CV pour devenir
 * un argument d'ingénierie. Texte à la première personne, sans jargon : cette
 * page s'adresse autant à un directeur de practice qu'à un CTO.
 */
export function AboutView({ locale }: { locale: Locale }) {
  const path = route('about', locale);
  const alternate = route('about', locale === 'fr' ? 'en' : 'fr');

  const narrative = {
    fr: [
      {
        heading: 'Ce que je fais',
        body: [
          "Je conçois des systèmes d'intelligence artificielle destinés à la production. Concrètement : des agents capables d'appeler des outils et de suivre un raisonnement en plusieurs étapes, des moteurs de recherche contextuels qui les alimentent en information fiable, et les pipelines de données qui font tenir l'ensemble.",
          "Ce qui m'intéresse dans ce métier n'est pas la génération de texte. C'est la fiabilité : faire en sorte qu'un système réponde juste, qu'on puisse le vérifier, et qu'il continue de bien répondre six mois plus tard.",
        ],
      },
      {
        heading: 'Comment j’en suis arrivé là',
        body: [
          "J'ai commencé par l'analyse de données, en stage, avec du SQL et des tableaux de bord. J'ai ensuite passé un été à écrire du back-end en Spring Boot et à intégrer une application e-commerce à un ERP — c'est là que j'ai compris la différence entre un programme qui marche et un logiciel qui tient.",
          "Puis sont venues deux missions freelance en data science, menées en parallèle de mes études, où j'ai dû cadrer un besoin, choisir une méthode et défendre un résultat devant des interlocuteurs qui n'étaient pas techniciens. Enfin l'IA générative, d'abord sur un projet d'aide à la décision publique, aujourd'hui en production.",
          "Vu de loin, c'est une remontée régulière de la même chaîne : mesurer, construire, prédire, décider, industrialiser.",
        ],
      },
      {
        heading: 'Pourquoi le droit public',
        body: [
          "En 2023, j'ai commencé une licence en droit public, relations internationales et sciences politiques, en parallèle du cycle ingénieur. Ce n'était pas une réorientation ni un plan de carrière : je voulais comprendre comment se prennent les décisions que j'apprenais à automatiser.",
          "Cette formation a changé ma manière de concevoir. Face à un système d'aide à la décision, je ne commence pas par choisir un modèle : je commence par demander qui utilisera la réponse, devant qui cette personne devra la justifier, et ce qui se passe si elle est fausse. Les réponses à ces trois questions déterminent l'architecture bien plus sûrement que l'état de l'art.",
        ],
      },
      {
        heading: 'Ce que je cherche',
        body: [
          "Des projets où l'IA sert à quelque chose de vérifiable, dans des organisations qui acceptent qu'un bon système se mesure. Le secteur public, la finance et le retail m'intéressent particulièrement — ce sont des environnements où une erreur a un coût identifiable, ce qui oblige à faire les choses sérieusement.",
        ],
      },
    ],
    en: [
      {
        heading: 'What I do',
        body: [
          'I build artificial intelligence systems meant for production. Concretely: agents able to call tools and follow multi-step reasoning, contextual search engines that feed them reliable information, and the data pipelines that hold the whole thing together.',
          'What interests me in this work is not text generation. It is reliability: making a system answer correctly, making that answer verifiable, and keeping it correct six months later.',
        ],
      },
      {
        heading: 'How I got here',
        body: [
          'I started with data analysis, as an intern, with SQL and dashboards. I then spent a summer writing Spring Boot back-end code and integrating an e-commerce application with an ERP — that is where I understood the difference between a program that works and software that lasts.',
          'Then came two freelance data science engagements, run alongside my studies, where I had to scope a need, choose a method and defend a result in front of non-technical stakeholders. Finally generative AI, first on a public decision-support project, now in production.',
          'Seen from a distance, it is a steady climb up the same chain: measure, build, predict, decide, industrialise.',
        ],
      },
      {
        heading: 'Why public law',
        body: [
          'In 2023 I began a bachelor’s degree in public law, international relations and political science, alongside the engineering programme. It was not a change of direction or a career plan: I wanted to understand how the decisions I was learning to automate actually get made.',
          'That background changed how I design. Facing a decision-support system, I do not start by choosing a model: I start by asking who will use the answer, to whom they will have to justify it, and what happens if it is wrong. The answers to those three questions shape the architecture far more reliably than the state of the art does.',
        ],
      },
      {
        heading: 'What I am looking for',
        body: [
          'Projects where AI serves something verifiable, in organisations willing to measure whether a system is good. The public sector, finance and retail interest me particularly — environments where a mistake has an identifiable cost, which forces the work to be done properly.',
        ],
      },
    ],
  };

  return (
    <PageShell locale={locale} currentKey="about" alternateHref={alternate}>
      <JsonLd
        data={jsonLdGraph(
          personSchema(locale),
          websiteSchema(locale),
          webPageSchema({
            locale,
            path,
            name: pageSeo.about.title[locale],
            description: pageSeo.about.description[locale],
          }),
        )}
      />

      <div className="container-page py-16 md:py-20">
        <header className="mb-14">
          <Label className="mb-3">{ui.nav.about[locale]}</Label>
          <h1 className="max-w-3xl text-[clamp(1.875rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.025em]">
            {thesis.title[locale]}
          </h1>
          <blockquote className="mt-8 max-w-3xl border-l-2 border-[var(--color-accent)] py-1 pl-6">
            <p className="text-xl font-medium leading-relaxed tracking-[-0.01em] md:text-2xl">
              {thesis.pullQuote[locale]}
            </p>
          </blockquote>
        </header>

        <div className="space-y-12">
          {narrative[locale].map((block, index) => (
            <Reveal as="section" key={block.heading} delay={index * 0.04}>
              <div className="grid gap-4 md:grid-cols-[200px_1fr] md:gap-10">
                <h2 className="label-mono md:pt-1.5">{block.heading}</h2>
                <div className="prose-column space-y-4 leading-relaxed">
                  {block.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Section className="border-t border-[var(--color-border)]">
        <div className="container-page">
          <DualEducation locale={locale} />
        </div>
      </Section>

      <ContactCta locale={locale} />
    </PageShell>
  );
}
