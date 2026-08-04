# Portfolio — Mohammed Bougtab

Portfolio professionnel bilingue (FR/EN) d'un **AI Engineer — Data & Agentic Systems**.
Site entièrement statique : sans backend, sans base de données, sans coût récurrent.

**Mesures réelles** (Lighthouse 12, page d'accueil) :

| | Performance | Accessibilité | Bonnes pratiques | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Desktop | **100** | **100** | **100** | **100** | 0,6 s | 0 | 0 ms |
| Mobile bridé | **97** | **100** | **100** | **100** | 2,3 s | 0 | 110 ms |

Contraste vérifié sur **1 824 éléments de texte rendus**, dans les deux thèmes : zéro sous
le seuil WCAG AA. Pertinence de la recherche : **12 requêtes de contrôle sur 12**.

## Recherche vectorielle, sans serveur

Le site embarque une recherche **BM25 exécutée entièrement dans le navigateur** (`⌘K`, `Ctrl+K`
ou `/`). Chaque page, étude de cas, expérience, question et groupe de compétences est indexé au
build par `scripts/build-search-index.ts` : tokenisation en unigrammes et bigrammes, pondération
de champ, IDF pré-calculé, puis projection 2D par analyse en composantes principales.

Taper « comment il gère les hallucinations » remonte l'étude de cas budgétaire, sans que le mot
figure dans son titre. Aucune requête réseau, aucune clé d'API, aucun coût : l'index (~23 Ko
compressés par langue) n'est téléchargé qu'à la première ouverture de la palette.

Le hero affiche la **carte de cet espace latent** : chaque point est un document, placé par la
même projection. La proximité à l'écran est une proximité de vocabulaire réelle, et les points
s'illuminent quand la recherche trouve.

> **Sur le vocabulaire employé.** L'interface annonce « BM25 · calcul local, aucun serveur » et
> « projeté par ACP ». Jamais « embeddings LLM » : ce serait faux, et sur un portfolio d'AI
> Engineer un abus de vocabulaire se retourne en entretien.

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
| `npm run build:search` | Régénère l'index de recherche (lancé automatiquement avant `build` et `dev`) |
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
  layout/            Header, Footer, PageShell, thème, colonne de flux
  sections/          Hero, ProofBar, Thesis, Timeline, DualEducation, SkillLayers, CTA
  hero/              Carte de l'espace latent, trace d'exécution
  search/            Palette ⌘K et contexte de recherche
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
  traces.ts          Traces d'exécution (illustrations, jamais des mesures réelles)
  seo.ts             Titres et descriptions par page
  ui.ts              Chaînes d'interface
  METRICS-TODO.md    ▸ Métriques restant à valider avant mise en ligne

content/generated/   Index de recherche, régénéré au build (committé)

lib/                 i18n, routes, SEO, JSON-LD, polices, tokenisation, BM25
scripts/             Construction de l'index, génération des PDF
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

**Aucune librairie d'animation, aucune librairie de recherche.** Les révélations au scroll
utilisent IntersectionObserver et trois règles CSS : Framer Motion coûtait 56 Ko de JavaScript
de première visite pour un fondu de 12 pixels, soit un tiers du budget total. La recherche est
écrite à la main pour la même raison — et parce qu'un index sur mesure tient en 23 Ko là où une
librairie généraliste en coûterait cinq fois plus.

**Aucun WebGL.** La constellation est du Canvas 2D : ~40 points, une boucle suspendue hors
écran, et un unique rendu statique sous `prefers-reduced-motion`.

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
- **La trace d'exécution du hero n'utilise aucun JavaScript** : la cascade est une animation
  CSS dont chaque ligne dérive son délai de son rang.
- **BM25 plutôt que TF-IDF cosinus.** Le premier essai ne réussissait que 5 requêtes de
  contrôle sur 12 : la normalisation L2 écrasait les termes rares des documents longs, si bien
  que la page « Projets » battait l'étude de cas Kafka sur la requête « kafka ». Le détail du
  diagnostic est dans `lib/vector.ts`.
