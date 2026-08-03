import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { route } from '@/lib/routes';
import { projects, getProjectBySlug } from '@/content/data/projects';
import { ProjectDetailView } from '@/components/views/ProjectDetailView';

const LOCALE = 'en' as const;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug.en }));
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
    path: `${route('projects', LOCALE)}/${project.slug.en}`,
    alternatePath: `${route('projects', 'fr')}/${project.slug.fr}`,
    title: project.title.en,
    description: project.tagline.en,
    keywords: project.stack,
    type: 'article',
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug, LOCALE);
  if (!project) notFound();

  return <ProjectDetailView project={project} locale={LOCALE} />;
}
