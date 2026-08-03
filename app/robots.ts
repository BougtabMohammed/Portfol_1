import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/content/data/profile';

/**
 * robots.txt
 *
 * Les crawlers des moteurs de réponse sont autorisés **explicitement**.
 * Beaucoup de sites les bloquent par défaut ou par méconnaissance : sans cette
 * autorisation, aucune qualité de contenu ni de balisage ne rend le site
 * citable par ChatGPT, Claude, Perplexity ou Gemini. C'est la condition
 * d'entrée du référencement génératif, et elle tient en quelques lignes.
 */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const aiCrawlers = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-User',
    'anthropic-ai',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot-Extended',
    'meta-externalagent',
    'Bytespider',
    'CCBot',
  ];

  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
