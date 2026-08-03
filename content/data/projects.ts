import type { I18nText, I18nList, Locale } from '@/lib/i18n';

/**
 * Études de cas.
 *
 * Schéma volontairement fermé et identique pour les six projets : contexte,
 * problème, contraintes, architecture, décisions, évaluation, résultat,
 * rétrospective. Deux raisons à ce choix plutôt qu'un MDX libre :
 *
 *  1. il force chaque étude de cas à répondre aux mêmes questions — c'est ce qui
 *     sépare une étude de cas d'une liste de technologies ;
 *  2. il rend le contenu typé, donc impossible à publier incomplet.
 *
 * La section « rétrospective » n'est pas décorative : dire ce qu'on referait
 * autrement est le signal de maturité technique le plus lisible pour un
 * ingénieur expérimenté qui lit le dossier.
 */

export type DiagramNode = {
  id: string;
  label: string;
  note?: I18nText;
  /** `accent` met en évidence le composant central de l'architecture. */
  tone?: 'default' | 'accent' | 'muted';
};

export type DiagramLayer = {
  title: I18nText;
  nodes: readonly DiagramNode[];
};

export type Decision = {
  choice: I18nText;
  rationale: I18nText;
  /** L'option écartée — sans elle, une décision n'en est pas une. */
  alternative: I18nText;
};

export type Project = {
  slug: Record<Locale, string>;
  order: number;
  featured: boolean;
  confidential: boolean;
  title: I18nText;
  tagline: I18nText;
  client: I18nText;
  clientReal?: string;
  role: I18nText;
  period: I18nText;
  year: string;
  domain: I18nText;
  stack: readonly string[];
  /** Filtres de la page index. */
  tags: readonly string[];
  repository?: string;
  context: I18nText;
  problem: I18nText;
  constraints: I18nList;
  architecture: {
    caption: I18nText;
    layers: readonly DiagramLayer[];
  };
  decisions: readonly Decision[];
  evaluation: I18nList;
  outcome: I18nList;
  retrospective: I18nText;
};

export const projects: readonly Project[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: {
      fr: 'systeme-multi-agents-prevision-budgetaire',
      en: 'multi-agent-budget-forecasting',
    },
    order: 1,
    featured: true,
    confidential: true,
    title: {
      fr: 'Système multi-agents pour la prévision budgétaire publique',
      en: 'Multi-agent system for public budget forecasting',
    },
    tagline: {
      fr: "Un agent superviseur, trois outils spécialisés, et des workflows décisionnels explicites — pour aider une administration à anticiper ses dépenses.",
      en: 'A supervisor agent, three specialised tools and explicit decision workflows — to help an administration anticipate its spending.',
    },
    client: { fr: 'Administration publique marocaine', en: 'Moroccan public administration' },
    role: { fr: 'Conception et développement', en: 'Design and development' },
    period: { fr: 'Mars — Juil. 2026', en: 'Mar. — Jul. 2026' },
    year: '2026',
    domain: { fr: 'Secteur public', en: 'Public sector' },
    stack: ['LangGraph', 'LangChain', 'Python', 'Scikit-Learn', 'Pandas', 'PostgreSQL', 'Docker'],
    tags: ['agents', 'rag', 'ml', 'public'],
    context: {
      fr: "Une administration publique doit projeter ses dépenses à partir de trois sources qui ne se parlent pas : des séries budgétaires historiques, un corpus de normes et de référentiels réglementaires, et une base de prix de référence nationale. Les agents chargés de ces projections passaient l'essentiel de leur temps à réconcilier ces sources à la main avant même de pouvoir raisonner.",
      en: 'A public administration needs to project its spending from three sources that do not talk to each other: historical budget series, a corpus of regulatory standards and reference frameworks, and a national price reference database. The officers doing this work spent most of their time reconciling those sources by hand before they could even start reasoning.',
    },
    problem: {
      fr: "Une seule question métier — « quel budget prévoir pour cette catégorie de dépense ? » — exige simultanément un calcul statistique, une lecture réglementaire et une requête sur des données de référence. Aucun modèle de langage seul ne peut répondre correctement : il inventerait les chiffres. Aucun modèle prédictif seul ne le peut non plus : il ignorerait la norme applicable.",
      en: 'A single business question — “what budget should we plan for this spending category?” — simultaneously requires a statistical computation, a regulatory reading and a query against reference data. No language model alone can answer it correctly: it would invent the figures. No predictive model alone can either: it would ignore the applicable rule.',
    },
    constraints: {
      fr: [
        "Aucune réponse chiffrée ne peut provenir du modèle de langage lui-même : tout chiffre doit être traçable jusqu'à une source.",
        "Le raisonnement doit être auditable — une projection budgétaire publique se justifie devant un contrôle.",
        "Déploiement dans l'environnement du client, sans dépendance à une infrastructure externe.",
        'Corpus réglementaire volumineux et hétérogène, mis à jour indépendamment des données chiffrées.',
      ],
      en: [
        'No numeric answer may come from the language model itself: every figure must be traceable to a source.',
        'The reasoning must be auditable — a public budget projection has to be justified to an auditor.',
        'Deployment inside the client environment, with no dependency on external infrastructure.',
        'A large, heterogeneous regulatory corpus, updated independently from the numeric data.',
      ],
    },
    architecture: {
      caption: {
        fr: "Le superviseur ne calcule rien lui-même : il décide quel outil appeler, dans quel ordre, et compose la réponse à partir de ce que les outils retournent.",
        en: 'The supervisor computes nothing itself: it decides which tool to call, in what order, and composes the answer from what the tools return.',
      },
      layers: [
        {
          title: { fr: 'Entrée', en: 'Input' },
          nodes: [{ id: 'q', label: 'Question métier', tone: 'muted' }],
        },
        {
          title: { fr: 'Orchestration', en: 'Orchestration' },
          nodes: [
            {
              id: 'sup',
              label: 'Agent superviseur — LangGraph',
              tone: 'accent',
              note: {
                fr: 'Routage vers les outils, gestion de l’état, boucle de vérification',
                en: 'Tool routing, state management, verification loop',
              },
            },
          ],
        },
        {
          title: { fr: 'Outils spécialisés', en: 'Specialised tools' },
          nodes: [
            {
              id: 'ml',
              label: 'Prédiction — Scikit-Learn',
              note: { fr: 'Projection et tendances', en: 'Projection and trends' },
            },
            {
              id: 'rag',
              label: 'RAG — base vectorielle',
              note: { fr: 'Normes et référentiels', en: 'Standards and frameworks' },
            },
            {
              id: 'sql',
              label: 'Requête — PostgreSQL',
              note: { fr: 'Référentiel des prix', en: 'Price reference data' },
            },
          ],
        },
        {
          title: { fr: 'Sources', en: 'Sources' },
          nodes: [
            { id: 's1', label: 'Séries budgétaires', tone: 'muted' },
            { id: 's2', label: 'Corpus réglementaire', tone: 'muted' },
            { id: 's3', label: 'Référentiel national des prix', tone: 'muted' },
          ],
        },
        {
          title: { fr: 'Sortie', en: 'Output' },
          nodes: [
            {
              id: 'out',
              label: 'Réponse sourcée',
              note: { fr: 'Chiffre, norme citée, trace des appels', en: 'Figure, cited rule, call trace' },
            },
          ],
        },
      ],
    },
    decisions: [
      {
        choice: {
          fr: 'Un graphe d’états LangGraph plutôt qu’une chaîne d’agents',
          en: 'A LangGraph state graph rather than an agent chain',
        },
        rationale: {
          fr: "Une chaîne exécute les étapes dans un ordre figé. Un graphe permet au superviseur de revenir en arrière quand un outil renvoie un résultat insuffisant, et rend chaque transition inspectable — ce qui est la condition de l'auditabilité exigée.",
          en: 'A chain runs steps in a fixed order. A graph lets the supervisor go back when a tool returns an insufficient result, and makes every transition inspectable — which is what the required auditability depends on.',
        },
        alternative: {
          fr: 'Une chaîne LangChain séquentielle : plus simple à écrire, mais incapable de reprendre un raisonnement incomplet.',
          en: 'A sequential LangChain chain: simpler to write, but unable to resume an incomplete line of reasoning.',
        },
      },
      {
        choice: {
          fr: 'Interdire au modèle de produire un chiffre',
          en: 'Forbidding the model from producing any figure',
        },
        rationale: {
          fr: "Tout nombre présent dans la réponse finale provient d'un appel d'outil, jamais de la génération. C'est la seule façon d'éliminer structurellement l'hallucination numérique sur un sujet où un chiffre faux a des conséquences réelles.",
          en: 'Every number in the final answer comes from a tool call, never from generation. It is the only way to structurally eliminate numeric hallucination on a subject where a wrong figure has real consequences.',
        },
        alternative: {
          fr: "Laisser le modèle estimer et vérifier ensuite : plus fluide, mais on ne peut pas garantir qu'une vérification rattrape toutes les erreurs.",
          en: 'Letting the model estimate then checking afterwards: smoother, but there is no guarantee a check catches every error.',
        },
      },
      {
        choice: {
          fr: 'Découpage du corpus par unité réglementaire, pas par taille fixe',
          en: 'Chunking the corpus by regulatory unit, not by fixed size',
        },
        rationale: {
          fr: "Un découpage à taille fixe coupe un article de norme en plein milieu et retourne un fragment inexploitable. Découper à la frontière de l'unité réglementaire préserve le sens de chaque passage récupéré.",
          en: 'Fixed-size chunking cuts a regulatory article in half and returns an unusable fragment. Chunking at the boundary of the regulatory unit preserves the meaning of every retrieved passage.',
        },
        alternative: {
          fr: 'Fenêtre glissante de taille fixe avec recouvrement : standard et rapide à mettre en place, mais bruitée sur du texte normatif structuré.',
          en: 'Fixed-size sliding window with overlap: standard and quick to set up, but noisy on structured normative text.',
        },
      },
      {
        choice: {
          fr: 'Conteneurisation Docker dès la phase de développement',
          en: 'Docker containerisation from the development phase',
        },
        rationale: {
          fr: "Le système devait tourner dans l'environnement du client, pas dans le mien. Conteneuriser dès le début évite de découvrir les écarts d'environnement au moment de la livraison.",
          en: 'The system had to run in the client’s environment, not mine. Containerising from the start avoids discovering environment gaps at handover time.',
        },
        alternative: {
          fr: 'Environnement virtuel Python et packaging tardif : plus léger au quotidien, risqué à la livraison.',
          en: 'A Python virtual environment with late packaging: lighter day to day, risky at delivery.',
        },
      },
    ],
    evaluation: {
      fr: [
        "Jeu de questions de référence construit avec les utilisateurs métier, couvrant les trois types de raisonnement — calcul, norme, donnée de référence.",
        "Vérification que chaque chiffre de la réponse est bien rattaché à un appel d'outil et non généré.",
        "Contrôle de la pertinence des passages récupérés par le RAG, question par question.",
        "Suivi des cas d'échec : question mal routée, passage réglementaire manquant, requête trop large.",
      ],
      en: [
        'A reference question set built with the business users, covering all three reasoning types — computation, regulation, reference data.',
        'Verification that every figure in the answer traces back to a tool call rather than generation.',
        'Question-by-question review of the relevance of passages retrieved by the RAG.',
        'Failure-case tracking: misrouted questions, missing regulatory passages, overly broad queries.',
      ],
    },
    outcome: {
      fr: [
        "Un système livré et conteneurisé, capable de répondre à une question budgétaire en mobilisant les trois sources dans le même raisonnement.",
        "Chaque réponse est accompagnée de sa trace d'exécution : quel outil a été appelé, sur quelle source, avec quel résultat.",
        "La réconciliation manuelle des trois sources, qui précédait tout travail d'analyse, n'est plus un préalable.",
      ],
      en: [
        'A delivered, containerised system able to answer a budget question by bringing all three sources into a single line of reasoning.',
        'Every answer comes with its execution trace: which tool was called, against which source, with what result.',
        'The manual reconciliation of the three sources, which used to precede any analysis, is no longer a prerequisite.',
      ],
    },
    retrospective: {
      fr: "Je construirais l'évaluation avant le système. Nous avons écrit le jeu de questions de référence une fois l'architecture en place, et il a révélé des problèmes de routage qu'un jeu de tests écrit en amont aurait exposés bien plus tôt — et pour beaucoup moins cher. Je passerais aussi plus de temps sur la stratégie de découpage du corpus : c'est le paramètre qui a le plus pesé sur la qualité des réponses, et nous l'avons traité comme un détail d'implémentation avant de comprendre que c'était une décision d'architecture.",
      en: 'I would build the evaluation before the system. We wrote the reference question set once the architecture was in place, and it surfaced routing problems that an up-front test set would have exposed far earlier — and far more cheaply. I would also spend more time on the chunking strategy: it was the single parameter that most affected answer quality, and we treated it as an implementation detail before realising it was an architectural decision.',
    },
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: {
      fr: 'agents-ia-automatisation-processus-metier',
      en: 'business-process-ai-agents',
    },
    order: 2,
    featured: true,
    confidential: true,
    title: {
      fr: "Agents IA pour l'automatisation de processus métier",
      en: 'AI agents for business process automation',
    },
    tagline: {
      fr: "Des agents en production, alimentés par leurs propres pipelines et évalués en continu — pas une démonstration.",
      en: 'Agents in production, fed by their own pipelines and continuously evaluated — not a demo.',
    },
    client: { fr: 'Groupe de distribution marocain', en: 'Moroccan retail group' },
    clientReal: 'Marwa',
    role: { fr: 'AI & Data Engineer', en: 'AI & Data Engineer' },
    period: { fr: "Juil. 2026 — aujourd'hui", en: 'Jul. 2026 — present' },
    year: '2026',
    domain: { fr: 'Retail', en: 'Retail' },
    stack: ['Python', 'LLM', 'RAG', 'Tool calling', 'Agents', 'Docker'],
    tags: ['agents', 'rag', 'production'],
    context: {
      fr: "Un groupe de distribution dont plusieurs équipes métier consacrent une part importante de leur temps à des tâches répétitives à faible valeur : chercher une information dispersée dans plusieurs systèmes, produire un état récurrent, vérifier une cohérence entre deux sources.",
      en: 'A retail group where several business teams spend a large share of their time on repetitive, low-value work: hunting for information scattered across systems, producing a recurring report, checking consistency between two sources.',
    },
    problem: {
      fr: "Ces tâches sont trop variables pour une automatisation classique par règles, et trop dépendantes du contexte de l'entreprise pour qu'un assistant générique y réponde utilement. Un agent qui répond avec assurance à partir de données périmées est pire que pas d'agent du tout.",
      en: 'These tasks are too variable for classic rule-based automation, and too dependent on company-specific context for a generic assistant to be useful. An agent that answers confidently from stale data is worse than no agent at all.',
    },
    constraints: {
      fr: [
        "Les agents doivent s'appuyer sur des données à jour : la fraîcheur du contexte conditionne la fiabilité de la réponse.",
        "Chaque agent doit couvrir un périmètre métier délimité, avec des outils explicites plutôt qu'un accès général.",
        "Coût et latence maîtrisés : un agent utilisé quotidiennement doit rester économiquement viable.",
        "Adoption par des utilisateurs non techniques, qui jugent le système sur ses erreurs et non sur ses réussites.",
      ],
      en: [
        'Agents must work from current data: the freshness of the context determines how reliable the answer is.',
        'Each agent must cover a bounded business scope, with explicit tools rather than general access.',
        'Controlled cost and latency: an agent used daily has to stay economically viable.',
        'Adoption by non-technical users, who judge the system on its mistakes rather than its successes.',
      ],
    },
    architecture: {
      caption: {
        fr: "Les pipelines ne sont pas une couche annexe : ce sont eux qui déterminent si l'agent répond juste. La qualité du contexte prime sur la sophistication de l'orchestration.",
        en: 'The pipelines are not a side layer: they determine whether the agent answers correctly. Context quality matters more than orchestration sophistication.',
      },
      layers: [
        {
          title: { fr: 'Utilisateurs', en: 'Users' },
          nodes: [{ id: 'u', label: 'Équipes métier', tone: 'muted' }],
        },
        {
          title: { fr: 'Agents', en: 'Agents' },
          nodes: [
            {
              id: 'a',
              label: 'Agents spécialisés par domaine',
              tone: 'accent',
              note: { fr: 'Périmètre délimité, outils explicites', en: 'Bounded scope, explicit tools' },
            },
          ],
        },
        {
          title: { fr: 'Capacités', en: 'Capabilities' },
          nodes: [
            { id: 'tool', label: 'Tool calling' },
            { id: 'rag', label: 'Recherche contextuelle (RAG)' },
            { id: 'eval', label: 'Évaluation des réponses' },
          ],
        },
        {
          title: { fr: 'Données', en: 'Data' },
          nodes: [
            {
              id: 'pipe',
              label: 'Pipelines d’intégration',
              note: { fr: 'Sources hétérogènes réconciliées', en: 'Heterogeneous sources reconciled' },
            },
          ],
        },
      ],
    },
    decisions: [
      {
        choice: {
          fr: 'Des agents spécialisés plutôt qu’un agent généraliste',
          en: 'Specialised agents rather than one general-purpose agent',
        },
        rationale: {
          fr: "Un agent au périmètre restreint échoue de façon prévisible et se corrige vite. Un agent généraliste échoue de façon diffuse, et chaque correction en dégrade une autre partie.",
          en: 'A narrowly scoped agent fails predictably and is quick to fix. A general-purpose agent fails diffusely, and every fix degrades another part of it.',
        },
        alternative: {
          fr: "Un assistant unique avec accès à tous les outils : plus simple à présenter, beaucoup plus difficile à évaluer et à faire progresser.",
          en: 'A single assistant with access to every tool: easier to present, far harder to evaluate and improve.',
        },
      },
      {
        choice: {
          fr: 'Investir dans les pipelines avant d’investir dans les prompts',
          en: 'Investing in pipelines before investing in prompts',
        },
        rationale: {
          fr: "La grande majorité des réponses fausses venaient d'un contexte incomplet ou périmé, pas d'une formulation d'instruction imparfaite. Améliorer la donnée corrige la cause ; ajuster l'instruction masque le symptôme.",
          en: 'The large majority of wrong answers came from incomplete or stale context, not from imperfect instruction wording. Improving the data fixes the cause; tuning the instruction hides the symptom.',
        },
        alternative: {
          fr: "Itérer sur les prompts : gains immédiats et visibles, mais un plafond de qualité atteint très vite.",
          en: 'Iterating on prompts: immediate, visible gains, but a quality ceiling reached very quickly.',
        },
      },
      {
        choice: {
          fr: 'Un protocole d’évaluation avant la mise en production',
          en: 'An evaluation protocol before going to production',
        },
        rationale: {
          fr: "Sans jeu d'évaluation, « l'agent s'est amélioré » est une opinion. Avec, c'est une mesure — et on peut arbitrer entre coût, latence et qualité au lieu de deviner.",
          en: 'Without an evaluation set, “the agent got better” is an opinion. With one it is a measurement — and you can trade off cost, latency and quality instead of guessing.',
        },
        alternative: {
          fr: "Se fier aux retours utilisateurs : indispensable, mais tardif et non reproductible.",
          en: 'Relying on user feedback: essential, but late and not reproducible.',
        },
      },
    ],
    evaluation: {
      fr: [
        "Jeu de cas de référence par agent, construit à partir des demandes réelles des équipes.",
        "Revue systématique des cas d'échec, catégorisés par cause : contexte manquant, mauvais outil appelé, réponse hors périmètre.",
        "Arbitrage explicite entre coût, latence et qualité à chaque changement de configuration.",
      ],
      en: [
        'A reference case set per agent, built from the teams’ real requests.',
        'Systematic review of failure cases, categorised by cause: missing context, wrong tool called, out-of-scope answer.',
        'Explicit cost / latency / quality trade-off at every configuration change.',
      ],
    },
    outcome: {
      fr: [
        "Des agents en service quotidien auprès des équipes métier, sur des tâches auparavant entièrement manuelles.",
        "Un cycle d'amélioration continue reposant sur des mesures et non sur des impressions.",
        "Des pipelines d'intégration qui servent au-delà des agents, en réconciliant des sources qui ne l'étaient pas.",
      ],
      en: [
        'Agents in daily use by business teams, on work that used to be entirely manual.',
        'A continuous improvement cycle driven by measurements rather than impressions.',
        'Integration pipelines that serve beyond the agents, by reconciling sources that previously were not.',
      ],
    },
    retrospective: {
      fr: "J'ai sous-estimé au départ la part du travail qui relève de la donnée et non de l'IA. Le réflexe, face à une réponse insatisfaisante, est de retoucher l'instruction ; c'est presque toujours le mauvais endroit. Je commencerais désormais tout projet d'agent par une cartographie des sources et de leur fraîcheur, avant même de choisir un modèle.",
      en: 'I initially underestimated how much of the work is data work rather than AI work. The reflex, faced with an unsatisfying answer, is to tweak the instruction; that is almost always the wrong place. I would now start any agent project with a map of the sources and their freshness, before even choosing a model.',
    },
  },

  /* ------------------------------------------------------------------ 3 */
  {
    slug: {
      fr: 'detection-fraude-pipeline-mlops-gcp',
      en: 'fraud-detection-mlops-pipeline-gcp',
    },
    order: 3,
    featured: true,
    confidential: false,
    title: {
      fr: 'Détection de fraude — pipeline MLOps sur Google Cloud',
      en: 'Fraud detection — MLOps pipeline on Google Cloud',
    },
    tagline: {
      fr: "Un modèle de détection d'anomalies sur transactions financières, de l'ingestion au déploiement et au suivi en production.",
      en: 'An anomaly detection model on financial transactions, from ingestion through deployment and production monitoring.',
    },
    client: { fr: 'Projet personnel', en: 'Personal project' },
    role: { fr: 'Conception et développement', en: 'Design and development' },
    period: { fr: '2025', en: '2025' },
    year: '2025',
    domain: { fr: 'Finance', en: 'Finance' },
    stack: ['GCP', 'BigQuery ML', 'Vertex AI', 'Dataflow', 'Python', 'SQL'],
    tags: ['ml', 'mlops', 'cloud'],
    context: {
      fr: "La détection de fraude sur transactions financières est un cas d'école du déséquilibre extrême : les cas frauduleux représentent une fraction infime du volume, et ce sont les seuls qui comptent.",
      en: 'Fraud detection on financial transactions is a textbook case of extreme imbalance: fraudulent cases are a tiny fraction of the volume, and they are the only ones that matter.',
    },
    problem: {
      fr: "Un modèle qui prédit « pas de fraude » systématiquement atteint une exactitude quasi parfaite et ne sert à rien. L'enjeu n'est pas d'entraîner un modèle, mais de construire une chaîne complète — préparation, entraînement, déploiement, suivi — dont la métrique reflète le coût réel d'une erreur.",
      en: 'A model that always predicts “not fraud” reaches near-perfect accuracy and is useless. The challenge is not training a model but building a full chain — preparation, training, deployment, monitoring — whose metric reflects the real cost of an error.',
    },
    constraints: {
      fr: [
        'Classes fortement déséquilibrées : l’exactitude globale est une métrique trompeuse.',
        'Volumes trop importants pour un traitement en mémoire sur une seule machine.',
        "Un faux négatif et un faux positif n'ont pas le même coût métier.",
        'Le modèle doit rester exploitable après déploiement, pas seulement performant à l’entraînement.',
      ],
      en: [
        'Heavily imbalanced classes: overall accuracy is a misleading metric.',
        'Volumes too large for in-memory processing on a single machine.',
        'A false negative and a false positive do not carry the same business cost.',
        'The model has to remain usable after deployment, not merely perform well in training.',
      ],
    },
    architecture: {
      caption: {
        fr: "Le traitement reste là où sont les données. Déplacer le calcul vers l'entrepôt plutôt que les données vers le calcul évite l'essentiel des coûts et des délais.",
        en: 'Processing stays where the data lives. Moving computation to the warehouse rather than data to the computation avoids most of the cost and latency.',
      },
      layers: [
        {
          title: { fr: 'Ingestion', en: 'Ingestion' },
          nodes: [
            {
              id: 'df',
              label: 'Dataflow',
              note: { fr: 'Transformation distribuée', en: 'Distributed transformation' },
            },
          ],
        },
        {
          title: { fr: 'Stockage & préparation', en: 'Storage & preparation' },
          nodes: [
            {
              id: 'bq',
              label: 'BigQuery',
              tone: 'accent',
              note: { fr: 'Feature engineering en SQL', en: 'Feature engineering in SQL' },
            },
          ],
        },
        {
          title: { fr: 'Modélisation', en: 'Modelling' },
          nodes: [
            { id: 'bqml', label: 'BigQuery ML', note: { fr: 'Itération rapide', en: 'Fast iteration' } },
            { id: 'vx', label: 'Vertex AI', note: { fr: 'Entraînement et déploiement', en: 'Training and deployment' } },
          ],
        },
        {
          title: { fr: 'Exploitation', en: 'Operations' },
          nodes: [
            { id: 'pred', label: 'Prédictions par lot' },
            { id: 'mon', label: 'Suivi des performances' },
          ],
        },
      ],
    },
    decisions: [
      {
        choice: {
          fr: 'Feature engineering en SQL dans BigQuery, pas en Python',
          en: 'Feature engineering in SQL inside BigQuery, not in Python',
        },
        rationale: {
          fr: "Extraire des millions de lignes pour les transformer ailleurs coûte du temps et de l'argent pour rien. Le calcul exécuté là où résident les données supprime le transfert et se parallélise sans effort.",
          en: 'Extracting millions of rows to transform them elsewhere costs time and money for nothing. Running the computation where the data lives removes the transfer and parallelises for free.',
        },
        alternative: {
          fr: 'Extraction vers Pandas : plus confortable pour explorer, ingérable à ce volume.',
          en: 'Extraction into Pandas: more comfortable for exploration, unmanageable at this volume.',
        },
      },
      {
        choice: {
          fr: 'BigQuery ML pour explorer, Vertex AI pour livrer',
          en: 'BigQuery ML to explore, Vertex AI to ship',
        },
        rationale: {
          fr: "BigQuery ML permet de tester une hypothèse en une requête, sans quitter l'entrepôt. Vertex AI apporte ce qui manque ensuite : versionnement, déploiement et suivi. Utiliser chacun pour ce qu'il fait le mieux évite de forcer un outil hors de son usage.",
          en: 'BigQuery ML lets you test a hypothesis in one query without leaving the warehouse. Vertex AI provides what is missing next: versioning, deployment and monitoring. Using each for what it does best avoids forcing a tool out of its purpose.',
        },
        alternative: {
          fr: "Tout faire dans Vertex AI : plus homogène, mais une boucle d'exploration nettement plus lente.",
          en: 'Doing everything in Vertex AI: more homogeneous, but a markedly slower exploration loop.',
        },
      },
      {
        choice: {
          fr: 'Écarter l’exactitude au profit de la précision et du rappel',
          en: 'Discarding accuracy in favour of precision and recall',
        },
        rationale: {
          fr: "Sur des classes déséquilibrées, l'exactitude mesure surtout la proportion de la classe majoritaire. Précision et rappel décrivent ce qui intéresse réellement le métier : les fraudes manquées et les alertes injustifiées.",
          en: 'On imbalanced classes, accuracy mostly measures the share of the majority class. Precision and recall describe what the business actually cares about: missed frauds and unjustified alerts.',
        },
        alternative: {
          fr: "Optimiser l'exactitude : un chiffre flatteur qui décrit un modèle inutile.",
          en: 'Optimising accuracy: a flattering number describing a useless model.',
        },
      },
    ],
    evaluation: {
      fr: [
        'Précision, rappel et aire sous la courbe précision-rappel plutôt qu’exactitude globale.',
        'Analyse du compromis entre fraudes manquées et alertes injustifiées, en fonction du seuil de décision.',
        'Suivi des performances du modèle après déploiement, pour détecter une dérive des données.',
      ],
      en: [
        'Precision, recall and area under the precision-recall curve rather than overall accuracy.',
        'Analysis of the trade-off between missed frauds and unjustified alerts, as a function of the decision threshold.',
        'Post-deployment performance monitoring, to detect data drift.',
      ],
    },
    outcome: {
      fr: [
        'Une chaîne MLOps complète, de l’ingestion brute au modèle déployé et suivi.',
        'Un feature engineering entièrement exécuté dans l’entrepôt, donc reproductible et versionné avec le SQL.',
        "Un seuil de décision choisi à partir du coût métier de l'erreur, et non de la métrique par défaut.",
      ],
      en: [
        'A complete MLOps chain, from raw ingestion to a deployed and monitored model.',
        'Feature engineering executed entirely inside the warehouse, therefore reproducible and versioned with the SQL.',
        'A decision threshold chosen from the business cost of an error rather than from the default metric.',
      ],
    },
    retrospective: {
      fr: "J'ai passé trop de temps à comparer des familles de modèles et pas assez sur le seuil de décision. Sur un problème déséquilibré, le choix du seuil pèse souvent plus lourd sur le résultat opérationnel que le choix de l'algorithme — et il se discute avec le métier, pas dans un notebook.",
      en: 'I spent too much time comparing model families and not enough on the decision threshold. On an imbalanced problem, the threshold often weighs more on the operational result than the algorithm does — and it is a conversation with the business, not something settled in a notebook.',
    },
  },

  /* ------------------------------------------------------------------ 4 */
  {
    slug: {
      fr: 'pipeline-temps-reel-analyse-actualites',
      en: 'realtime-news-analysis-pipeline',
    },
    order: 4,
    featured: false,
    confidential: false,
    title: {
      fr: "Analyse temps réel des actualités",
      en: 'Real-time news analysis',
    },
    tagline: {
      fr: "Un pipeline Big Data de bout en bout : ingestion en continu, traitement distribué, modèles NLP et restitution analytique.",
      en: 'An end-to-end Big Data pipeline: continuous ingestion, distributed processing, NLP models and analytical reporting.',
    },
    client: { fr: 'Projet académique', en: 'Academic project' },
    role: { fr: 'Conception et développement', en: 'Design and development' },
    period: { fr: '2025', en: '2025' },
    year: '2025',
    domain: { fr: 'Big Data / NLP', en: 'Big Data / NLP' },
    stack: ['Apache Kafka', 'PySpark', 'Spark ML', 'Python', 'NLP', 'Power BI'],
    tags: ['data', 'nlp', 'streaming'],
    context: {
      fr: "Les flux d'actualités arrivent en continu, sans volume prévisible et sans possibilité de rejouer ce qui a été manqué. Ce n'est pas un jeu de données : c'est un flux.",
      en: 'News feeds arrive continuously, with unpredictable volume and no way to replay what was missed. It is not a dataset: it is a stream.',
    },
    problem: {
      fr: "Un traitement par lot classique impose de choisir entre latence et complétude. Il fallait une chaîne capable d'absorber un débit variable, d'appliquer des modèles NLP au fil de l'eau, et de rendre les résultats exploitables sans attendre la fin d'un cycle.",
      en: 'Classic batch processing forces a choice between latency and completeness. The chain had to absorb variable throughput, apply NLP models on the fly, and make results usable without waiting for a cycle to finish.',
    },
    constraints: {
      fr: [
        'Débit variable et imprévisible, avec des pics non anticipables.',
        'Aucune perte de message tolérée : un flux manqué ne se rattrape pas.',
        'Traitement linguistique coûteux appliqué en continu.',
        'Résultats destinés à un usage analytique, donc lisibles par des non-techniciens.',
      ],
      en: [
        'Variable, unpredictable throughput with unforeseeable spikes.',
        'No message loss tolerated: a missed stream cannot be recovered.',
        'Expensive language processing applied continuously.',
        'Results intended for analytical use, therefore readable by non-technical people.',
      ],
    },
    architecture: {
      caption: {
        fr: "Kafka découple la production de la consommation : le pipeline absorbe un pic sans perdre de message et sans dimensionner le traitement pour le pire cas.",
        en: 'Kafka decouples production from consumption: the pipeline absorbs a spike without losing messages and without sizing processing for the worst case.',
      },
      layers: [
        {
          title: { fr: 'Sources', en: 'Sources' },
          nodes: [{ id: 'news', label: 'Flux d’actualités', tone: 'muted' }],
        },
        {
          title: { fr: 'Ingestion', en: 'Ingestion' },
          nodes: [
            {
              id: 'kafka',
              label: 'Apache Kafka',
              tone: 'accent',
              note: { fr: 'Tampon durable, découplage', en: 'Durable buffer, decoupling' },
            },
          ],
        },
        {
          title: { fr: 'Traitement', en: 'Processing' },
          nodes: [
            { id: 'spark', label: 'PySpark', note: { fr: 'Traitement distribué', en: 'Distributed processing' } },
            { id: 'ml', label: 'Spark ML — NLP', note: { fr: 'Sentiment, classification', en: 'Sentiment, classification' } },
          ],
        },
        {
          title: { fr: 'Restitution', en: 'Reporting' },
          nodes: [{ id: 'bi', label: 'Power BI', note: { fr: 'Suivi analytique', en: 'Analytical monitoring' } }],
        },
      ],
    },
    decisions: [
      {
        choice: { fr: 'Kafka comme tampon durable, pas comme simple file', en: 'Kafka as a durable buffer, not just a queue' },
        rationale: {
          fr: "Conserver les messages après consommation permet de rejouer un traitement après correction d'un modèle, sans réingérer la source. Sur un flux non rejouable, c'est la seule protection contre une erreur de traitement.",
          en: 'Keeping messages after consumption makes it possible to replay processing after fixing a model, without re-ingesting the source. On a non-replayable stream it is the only protection against a processing mistake.',
        },
        alternative: {
          fr: 'Une file de messages classique : plus légère, mais toute erreur de traitement devient une perte définitive.',
          en: 'A classic message queue: lighter, but any processing error becomes a permanent loss.',
        },
      },
      {
        choice: { fr: 'PySpark plutôt que du traitement en mémoire', en: 'PySpark rather than in-memory processing' },
        rationale: {
          fr: "Le débit n'étant pas connu à l'avance, la chaîne devait pouvoir absorber un pic sans réécriture. Un traitement distribué s'ajuste ; un script en mémoire s'effondre.",
          en: 'With throughput unknown in advance, the chain had to absorb a spike without a rewrite. Distributed processing scales; an in-memory script collapses.',
        },
        alternative: {
          fr: 'Pandas dans un processus unique : suffisant en test, intenable dès le premier pic réel.',
          en: 'Pandas in a single process: fine in testing, untenable at the first real spike.',
        },
      },
    ],
    evaluation: {
      fr: [
        'Mesure de la qualité des modèles de sentiment et de classification sur un jeu de test annoté.',
        'Vérification de l’absence de perte de message entre production et consommation.',
        'Observation du comportement de la chaîne sous charge variable.',
      ],
      en: [
        'Quality measurement of the sentiment and classification models on an annotated test set.',
        'Verification that no message is lost between production and consumption.',
        'Observation of the chain’s behaviour under variable load.',
      ],
    },
    outcome: {
      fr: [
        "Un pipeline de bout en bout couvrant l'ingestion continue, le traitement distribué, l'inférence NLP et la restitution.",
        'Des résultats analytiques disponibles au fil de l’eau plutôt qu’à la fin d’un cycle de traitement.',
        'Une chaîne capable de rejouer un traitement après correction, sans réingérer la source.',
      ],
      en: [
        'An end-to-end pipeline covering continuous ingestion, distributed processing, NLP inference and reporting.',
        'Analytical results available continuously rather than at the end of a processing cycle.',
        'A chain able to replay processing after a fix, without re-ingesting the source.',
      ],
    },
    retrospective: {
      fr: "J'ai dimensionné le traitement distribué avant d'avoir mesuré le débit réel — l'infrastructure était surdimensionnée pour le volume effectif. La leçon vaut au-delà de ce projet : instrumenter d'abord, dimensionner ensuite. J'ajouterais aussi une file de messages en échec dès le départ, plutôt qu'après avoir perdu des messages malformés.",
      en: 'I sized the distributed processing before measuring actual throughput — the infrastructure was oversized for the real volume. The lesson generalises: instrument first, size second. I would also add a dead-letter queue from the start, rather than after losing malformed messages.',
    },
  },

  /* ------------------------------------------------------------------ 5 */
  {
    slug: {
      fr: 'scoring-propension-paiement-recouvrement',
      en: 'payment-propensity-scoring',
    },
    order: 5,
    featured: false,
    confidential: false,
    title: {
      fr: 'Scoring de propension au paiement',
      en: 'Payment propensity scoring',
    },
    tagline: {
      fr: "Prioriser l'action d'agents de recouvrement à partir du comportement observé plutôt que de l'ordre du fichier.",
      en: 'Prioritising collection agents’ work from observed behaviour rather than the order of the file.',
    },
    client: { fr: 'Société Marocaine de Recouvrement', en: 'Société Marocaine de Recouvrement' },
    role: { fr: 'Data Scientist freelance', en: 'Freelance Data Scientist' },
    period: { fr: 'Déc. 2025 — Janv. 2026', en: 'Dec. 2025 — Jan. 2026' },
    year: '2026',
    domain: { fr: 'Recouvrement', en: 'Debt collection' },
    stack: ['Python', 'Pandas', 'Scikit-Learn', 'SQL'],
    tags: ['ml', 'freelance'],
    context: {
      fr: "Des agents de recouvrement traitent un portefeuille de cibles trop large pour être couvert intégralement. En l'absence de priorisation, l'ordre de traitement suit le fichier — c'est-à-dire le hasard.",
      en: 'Collection agents work a portfolio of targets too large to cover fully. With no prioritisation, the processing order follows the file — that is, chance.',
    },
    problem: {
      fr: "L'enjeu n'est pas de prédire qui paiera, mais de classer : à effort constant, quelles cibles traiter en premier ? Un modèle très précis mais inexploitable par les agents n'apporte rien.",
      en: 'The point is not to predict who will pay, but to rank: with constant effort, which targets should be worked first? A very accurate model that agents cannot act on brings nothing.',
    },
    constraints: {
      fr: [
        'Deux signaux de nature différente : historique de réponses et comportement de règlement.',
        'Le score doit être compris et accepté par des agents non techniciens.',
        'Durée de mission courte : la solution devait être livrable et exploitable immédiatement.',
      ],
      en: [
        'Two signals of different nature: response history and settlement behaviour.',
        'The score has to be understood and accepted by non-technical agents.',
        'A short engagement: the solution had to be deliverable and usable immediately.',
      ],
    },
    architecture: {
      caption: {
        fr: "Le score combine deux dimensions plutôt qu'une : la joignabilité et la solvabilité observée ne se substituent pas l'une à l'autre.",
        en: 'The score combines two dimensions rather than one: reachability and observed ability to pay do not substitute for each other.',
      },
      layers: [
        {
          title: { fr: 'Signaux', en: 'Signals' },
          nodes: [
            { id: 'h', label: 'Historique de réponses', tone: 'muted' },
            { id: 'p', label: 'Comportement de règlement', tone: 'muted' },
          ],
        },
        {
          title: { fr: 'Modélisation', en: 'Modelling' },
          nodes: [
            {
              id: 'm',
              label: 'Score composite',
              tone: 'accent',
              note: { fr: 'Python, Scikit-Learn', en: 'Python, Scikit-Learn' },
            },
          ],
        },
        {
          title: { fr: 'Usage', en: 'Use' },
          nodes: [
            { id: 'r', label: 'File de traitement priorisée' },
            { id: 'a', label: 'Pilotage par les administrateurs' },
          ],
        },
      ],
    },
    decisions: [
      {
        choice: { fr: 'Un score de classement, pas une prédiction binaire', en: 'A ranking score, not a binary prediction' },
        rationale: {
          fr: "Dire « cette cible ne paiera pas » est à la fois faux et inutilisable. Ordonner un portefeuille par probabilité décroissante donne à l'agent une file de travail, ce dont il a réellement besoin.",
          en: 'Saying “this target will not pay” is both wrong and unusable. Ordering a portfolio by decreasing probability gives the agent a work queue, which is what they actually need.',
        },
        alternative: {
          fr: "Une classification payeur / non-payeur : plus simple à évaluer, mais elle décide à la place de l'agent.",
          en: 'A payer / non-payer classification: easier to evaluate, but it decides in the agent’s place.',
        },
      },
      {
        choice: { fr: 'Un modèle interprétable plutôt qu’un modèle plus performant', en: 'An interpretable model over a better-performing one' },
        rationale: {
          fr: "Un score que l'agent ne comprend pas n'est pas suivi, et un score non suivi n'a aucun effet. La performance réelle d'un modèle inclut son taux d'adoption.",
          en: 'A score the agent does not understand is not followed, and a score that is not followed has no effect. A model’s real performance includes its adoption rate.',
        },
        alternative: {
          fr: "Un modèle d'ensemble : meilleur sur le papier, opaque à l'usage et donc probablement ignoré.",
          en: 'An ensemble model: better on paper, opaque in use and therefore likely ignored.',
        },
      },
    ],
    evaluation: {
      fr: [
        'Évaluation par la qualité du classement plutôt que par l’exactitude d’une prédiction.',
        'Comparaison avec le traitement dans l’ordre du fichier, comme référence de base.',
        'Vérification que le score reste lisible et explicable cible par cible.',
      ],
      en: [
        'Evaluation on ranking quality rather than prediction accuracy.',
        'Comparison against processing in file order, used as the baseline.',
        'Verification that the score stays readable and explainable target by target.',
      ],
    },
    outcome: {
      fr: [
        'Un score exploitable directement comme file de travail par les agents.',
        'Une priorisation fondée sur le comportement observé et non sur l’ordre d’arrivée.',
        'Un indicateur de pilotage pour les administrateurs, au-delà de l’usage individuel.',
      ],
      en: [
        'A score usable directly as a work queue by the agents.',
        'Prioritisation based on observed behaviour rather than arrival order.',
        'A management indicator for administrators, beyond individual use.',
      ],
    },
    retrospective: {
      fr: "Je définirais la métrique d'évaluation avec le client avant de modéliser. Nous avons parlé performance avant d'avoir défini ce que « bien classer » voulait dire pour eux — et ces deux conversations auraient dû être une seule, tenue en premier.",
      en: 'I would define the evaluation metric with the client before modelling. We discussed performance before defining what “ranking well” meant to them — and those two conversations should have been one, held first.',
    },
  },

  /* ------------------------------------------------------------------ 6 */
  {
    slug: {
      fr: 'analyse-paniers-prevision-ventes-retail',
      en: 'market-basket-analysis-sales-forecasting',
    },
    order: 6,
    featured: false,
    confidential: false,
    title: {
      fr: "Analyse de paniers et prévision des ventes",
      en: 'Market basket analysis and sales forecasting',
    },
    tagline: {
      fr: "Comprendre ce que les clients achètent ensemble, et anticiper la demande — pendant la transformation d'une enseigne.",
      en: 'Understanding what customers buy together, and anticipating demand — during a retail brand’s transformation.',
    },
    client: { fr: 'Brands & Corners (ex-Virgin Megastore)', en: 'Brands & Corners (formerly Virgin Megastore)' },
    role: { fr: 'Data Scientist freelance', en: 'Freelance Data Scientist' },
    period: { fr: 'Déc. 2025 — Janv. 2026', en: 'Dec. 2025 — Jan. 2026' },
    year: '2026',
    domain: { fr: 'Retail', en: 'Retail' },
    stack: ['Python', 'Pandas', 'Apriori', 'FP-Growth', 'Prophet'],
    tags: ['ml', 'freelance', 'retail'],
    context: {
      fr: "Une enseigne de distribution culturelle passait d'une franchise internationale à une structure 100 % marocaine. Ce changement remet en cause les repères commerciaux hérités : l'assortiment, les associations de produits et la saisonnalité ne sont plus nécessairement ceux du réseau d'origine.",
      en: 'A cultural retail chain was moving from an international franchise to a fully Moroccan structure. That change puts inherited commercial assumptions in question: assortment, product associations and seasonality are no longer necessarily those of the original network.',
    },
    problem: {
      fr: "Deux questions distinctes, deux méthodes distinctes : quels produits s'achètent ensemble dans le contexte local, et quelle demande anticiper sur les prochaines périodes ?",
      en: 'Two distinct questions, two distinct methods: which products are bought together in the local context, and what demand should be expected in the coming periods?',
    },
    constraints: {
      fr: [
        "Historique partiellement hérité d'un contexte de franchise différent.",
        'Grand nombre de références produit, donc explosion combinatoire des associations possibles.',
        'Résultats destinés à des décisions commerciales, pas à une publication technique.',
      ],
      en: [
        'History partly inherited from a different franchise context.',
        'A large number of product references, hence combinatorial explosion of possible associations.',
        'Results intended for commercial decisions, not a technical publication.',
      ],
    },
    architecture: {
      caption: {
        fr: "Deux chaînes indépendantes sur la même donnée transactionnelle : l'une décrit ce qui se produit ensemble, l'autre projette ce qui va se produire.",
        en: 'Two independent chains over the same transactional data: one describes what happens together, the other projects what will happen.',
      },
      layers: [
        {
          title: { fr: 'Données', en: 'Data' },
          nodes: [{ id: 'tx', label: 'Transactions et paniers', tone: 'muted' }],
        },
        {
          title: { fr: 'Analyse', en: 'Analysis' },
          nodes: [
            {
              id: 'assoc',
              label: 'Règles d’association — Apriori, FP-Growth',
              tone: 'accent',
              note: { fr: 'Produits achetés ensemble', en: 'Products bought together' },
            },
            {
              id: 'fc',
              label: 'Prévision — Prophet',
              note: { fr: 'Tendance et saisonnalité', en: 'Trend and seasonality' },
            },
          ],
        },
        {
          title: { fr: 'Décision', en: 'Decision' },
          nodes: [
            { id: 'assort', label: 'Assortiment et implantation' },
            { id: 'stock', label: 'Anticipation de la demande' },
          ],
        },
      ],
    },
    decisions: [
      {
        choice: { fr: 'Apriori et FP-Growth, pas l’un ou l’autre', en: 'Both Apriori and FP-Growth, not one or the other' },
        rationale: {
          fr: "Apriori est lisible et facile à expliquer au métier ; FP-Growth passe à l'échelle sur un catalogue large. Les faire tourner tous les deux a servi de contrôle croisé : une règle retrouvée par les deux méthodes est nettement plus solide.",
          en: 'Apriori is readable and easy to explain to the business; FP-Growth scales on a large catalogue. Running both acted as a cross-check: a rule found by both methods is markedly more solid.',
        },
        alternative: {
          fr: "Ne garder que FP-Growth pour la performance : plus rapide, mais on perd le contrôle croisé.",
          en: 'Keeping only FP-Growth for performance: faster, but the cross-check is lost.',
        },
      },
      {
        choice: { fr: 'Prophet plutôt qu’un modèle autorégressif classique', en: 'Prophet rather than a classic autoregressive model' },
        rationale: {
          fr: "La demande en distribution culturelle est fortement saisonnière et marquée par des événements. Prophet modélise explicitement tendance, saisonnalité et jours particuliers, et reste interprétable par des interlocuteurs non statisticiens.",
          en: 'Demand in cultural retail is strongly seasonal and event-driven. Prophet explicitly models trend, seasonality and special days, and stays interpretable for non-statistician stakeholders.',
        },
        alternative: {
          fr: "Un modèle ARIMA : plus rigoureux statistiquement, plus difficile à paramétrer et à expliquer dans une mission courte.",
          en: 'An ARIMA model: statistically more rigorous, harder to tune and to explain within a short engagement.',
        },
      },
    ],
    evaluation: {
      fr: [
        'Filtrage des règles d’association par support, confiance et lift, pour écarter les corrélations triviales.',
        'Confrontation des règles retenues à la connaissance métier des équipes commerciales.',
        'Évaluation des prévisions sur une période retenue hors apprentissage.',
      ],
      en: [
        'Filtering association rules by support, confidence and lift, to discard trivial correlations.',
        'Checking retained rules against the commercial teams’ business knowledge.',
        'Forecast evaluation on a hold-out period.',
      ],
    },
    outcome: {
      fr: [
        'Un ensemble de règles d’association exploitables pour l’assortiment et l’implantation.',
        'Une prévision de ventes utilisable pour anticiper la demande sur les périodes suivantes.',
        'Des livrables formulés en termes de décisions commerciales et non de métriques statistiques.',
      ],
      en: [
        'A set of association rules usable for assortment and store layout decisions.',
        'A sales forecast usable to anticipate demand over the following periods.',
        'Deliverables framed in terms of commercial decisions rather than statistical metrics.',
      ],
    },
    retrospective: {
      fr: "Une part des règles remontées étaient statistiquement valides et commercialement évidentes — deux produits d'un même rayon achetés ensemble n'apprend rien à personne. Je filtrerais désormais dès le départ sur l'écart à l'attendu métier plutôt que sur les seuls indicateurs statistiques : ce qui a de la valeur, c'est la règle qui surprend.",
      en: 'Some of the surfaced rules were statistically valid and commercially obvious — two products from the same aisle bought together teaches nobody anything. I would now filter from the start on divergence from business expectation rather than statistical indicators alone: the valuable rule is the surprising one.',
    },
  },
] as const;

/* ---------------------------------------------------------------- helpers */

export const featuredProjects = projects.filter((p) => p.featured);

export function getProjectBySlug(slug: string, locale: Locale): Project | undefined {
  return projects.find((p) => p.slug[locale] === slug);
}

/** Les deux projets suivants, pour le maillage interne en bas d'étude de cas. */
export function relatedProjects(current: Project): readonly Project[] {
  const others = projects.filter((p) => p.order !== current.order);
  const sameTag = others.filter((p) => p.tags.some((tag) => current.tags.includes(tag)));
  const pool = sameTag.length >= 2 ? sameTag : others;
  return pool.slice(0, 2);
}

/** Filtres de la page index, dérivés des projets — jamais saisis deux fois. */
export const projectTags: readonly { id: string; label: I18nText }[] = [
  { id: 'agents', label: { fr: 'Agents & LLM', en: 'Agents & LLM' } },
  { id: 'rag', label: { fr: 'RAG', en: 'RAG' } },
  { id: 'ml', label: { fr: 'Machine Learning', en: 'Machine Learning' } },
  { id: 'mlops', label: { fr: 'MLOps & Cloud', en: 'MLOps & Cloud' } },
  { id: 'data', label: { fr: 'Data Engineering', en: 'Data Engineering' } },
  { id: 'public', label: { fr: 'Secteur public', en: 'Public sector' } },
] as const;
