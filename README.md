# Portfolio — Mohammed Bougtab

Portfolio professionnel bilingue (FR/EN) d'un **AI Engineer — Data & Agentic Systems**.
Site entièrement statique : sans backend, sans base de données, sans coût récurrent.

**Mesures réelles** (Lighthouse 12, page d'accueil) :

| | Performance | Accessibilité | Bonnes pratiques | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Desktop | **100** | **100** | **100** | **100** | 0,6 s | 0 | 0 ms |
| Mobile bridé | **98** | **100** | **100** | **100** | 2,3 s | 0 | 110 ms |

Contraste vérifié sur **1 726 éléments de texte rendus**, dans les deux thèmes : zéro sous
le seuil WCAG AA.

---

## Démarrer

```bash
npm install
npm run dev          # http://localhost:3000
```

## Commandes

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Export statique complet dans `out/` |
| `npm run serve` | Sert `out/` sur le port 3000 (vérification du build réel) |
| `npm run typecheck` | TypeScript strict, sans émission |
| `npm run pdf` | Régénère les PDF du CV depuis les pages `/cv` et `/en/resume` |

## Déploiement

Le build produit un dossier `out/` de fichiers statiques, déployable tel quel sur Vercel,
Netlify, Cloudflare Pages ou GitHub Pages — aucun runtime Node n'est nécessaire.
Sur Vercel, aucune configuration : le framework est détecté et `output: 'export'` respecté.

---

## Structure

```
app/
  (fr)/              Racine française — servie à la racine du domaine
  (en)/en/           Racine anglaise — servie sous /en
  sitemap.ts         Sitemap généré depuis la table des routes
  robots.ts          Autorise explicitement les crawlers d'IA
  manifest.ts
  globals.css        Design system : tous les jetons de couleur et de typographie

components/
  layout/            Header, Footer, PageShell, thème
  sections/          Hero, ProofBar, Thesis, Timeline, DualEducation, SkillLayers, CTA
  project/           Carte projet, schéma d'architecture, filtres
  views/             Une vue par page, partagée entre les deux langues
  ui/                Primitives et icônes de marque

content/data/        ▸ TOUT le contenu factuel vit ici
  profile.ts         Identité, positionnement, thèse, drapeau de confidentialité
  experiences.ts     Parcours professionnel
  education.ts       Double formation et certifications
  projects.ts        Les six études de cas
  skills.ts          Compétences par couche
  faq.ts             Questions/réponses (données structurées FAQPage)
  seo.ts             Titres et descriptions par page
  ui.ts              Chaînes d'interface
  METRICS-TODO.md    ▸ Métriques restant à valider avant mise en ligne

lib/                 i18n, routes, SEO, JSON-LD, polices
scripts/             Génération des PDF
```

### Le principe à retenir

**Aucun texte n'est écrit en dur dans un composant.** Corriger un chiffre, réécrire une
puce ou lever une anonymisation se fait dans `content/data/`, sans toucher au code — et la
correction se propage au site, au CV imprimable et au PDF en même temps.

---

## Avant la mise en ligne

Trois points bloquants, tous détaillés dans **`content/data/METRICS-TODO.md`** :

1. **Renseigner `SITE_URL`** dans `content/data/profile.ts` (actuellement
   `https://mohammedbougtab.com`). Cette valeur alimente les URL canoniques, les `hreflang`,
   le sitemap et les données structurées.
2. **Vérifier l'URL LinkedIn**, déduite du nom et non confirmée.
3. **Publier les trois dépôts GitHub vitrines**, puis renseigner leur URL dans le champ
   `repository` des études de cas concernées. Tant qu'il est vide, aucun lien de code ne
   s'affiche — c'est volontaire, mais cela prive le dossier de sa seule preuve de code
   vérifiable.

## Confidentialité

Les noms d'employeur et de client soumis à NDA sont anonymisés par défaut. Le drapeau
`REVEAL_CONFIDENTIAL_NAMES` dans `content/data/profile.ts` révèle les noms réels partout où
ils apparaissent, sans autre modification du code.

Le nom de l'administration cliente n'est publié dans aucun cas, quelle que soit la valeur du
drapeau : il n'est stocké nulle part dans le dépôt.

## Chiffres publiés

Règle appliquée à tout le contenu : on chiffre librement le **périmètre** (nombre
d'expériences, d'études de cas, de cursus, de couches techniques), on ne chiffre un
**résultat** que s'il a réellement été mesuré. Aucun résultat estimé n'est présenté comme un
fait. Les valeurs de périmètre encore à confirmer attendent dans `METRICS-TODO.md` et ne
sont pas publiées tant qu'elles ne sont pas validées.

---

## Stack

Next.js 15 (App Router, export statique) · React 19 · TypeScript strict · Tailwind CSS v4 ·
Lucide · Inter + JetBrains Mono auto-hébergées.

**Aucune librairie d'animation.** Les révélations au scroll utilisent IntersectionObserver et
trois règles CSS : Framer Motion coûtait 56 Ko de JavaScript de première visite pour un fondu
de 12 pixels, soit un tiers du budget total. Voir le commentaire dans
`components/motion/Reveal.tsx`.

## Choix d'architecture notables

- **Deux racines `app/`** plutôt qu'un segment `[locale]` : c'est ce qui permet à
  `<html lang>` de valoir réellement `fr` à la racine et `en` sous `/en`. Un segment unique
  aurait imposé une seule valeur pour les deux langues.
- **Aucun middleware**, l'export statique l'interdit. Le routage bilingue passe par des
  routes réelles et une table de correspondance unique (`lib/routes.ts`).
- **Les filtres de projets ne reçoivent aucune donnée projet.** Les cartes sont rendues côté
  serveur et le filtre masque les non-correspondantes via `data-tags`. Le contenu des six
  études de cas, dans les deux langues, ne part jamais dans le bundle client.
- **Le site reste lisible sans JavaScript.** L'état masqué des révélations est conditionné à
  une classe `js` posée au runtime : sans script, tout est visible. C'est la condition
  d'entrée de l'indexation par les crawlers des moteurs de réponse, qui n'exécutent pas de JS.
