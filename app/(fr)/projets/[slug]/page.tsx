import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { route } from '@/lib/routes';
import { projects, getProjectBySlug } from '@/content/data/projects';
import { ProjectDetailView } from '@/components/views/ProjectDetailView';

const LOCALE = 'fr' as const;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug.fr }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug, LOCALE);
  if (!project) return {};

  return buildMetadata({
    locale: LOCALE,
    path: `${route('projects', LOCALE)}/${project.slug.fr}`,
    alternatePath: `${route('projects', 'en')}/${project.slug.en}`,
    title: project.title.fr,
    description: project.tagline.fr,
    keywords: project.stack,
    type: 'article',
    ogImage: `/og/fr/project-${project.slug.fr}.png`,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug, LOCALE);
  if (!project) notFound();

  return <ProjectDetailView project={project} locale={LOCALE} />;
}
