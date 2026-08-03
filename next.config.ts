import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Export statique intégral : aucun serveur, aucune clé API, aucun coût récurrent.
  // Chaque page est du HTML complet, lisible sans JavaScript — condition d'entrée
  // pour l'indexation par les crawlers d'IA (voir Phase 15 du plan de conception).
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  // L'optimiseur d'images de Next requiert un serveur : indisponible en export.
  // Sans conséquence ici, le site n'utilise que des SVG inline et aucune bitmap.
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
