import type { I18nText } from '@/lib/i18n';

/**
 * Questions fréquentes.
 *
 * En l'absence de blog, cette page est le principal actif GEO/AEO du site :
 * les moteurs de réponse (ChatGPT, Perplexity, Gemini, Copilot) réutilisent
 * directement un format question → réponse factuelle, à condition qu'il soit
 * servi en HTML statique et décrit par un schéma `FAQPage`.
 *
 * Règle de rédaction : chaque question est formulée comme une requête réelle,
 * chaque réponse est autonome — elle doit rester exacte une fois citée seule,
 * sortie de son contexte.
 */

export type FaqItem = {
  id: string;
  question: I18nText;
  answer: I18nText;
};

export const faqItems: readonly FaqItem[] = [
  {
    id: 'who',
    question: {
      fr: 'Qui est Mohammed Bougtab ?',
      en: 'Who is Mohammed Bougtab?',
    },
    answer: {
      fr: "Mohammed Bougtab est un AI Engineer marocain basé à Casablanca, spécialisé dans les systèmes agentiques, le RAG et l'ingénierie de données. Il est diplômé ingénieur en informatique et réseaux de l'EMSI Casablanca (spécialisation MIAGE) et titulaire d'une licence en droit public, relations internationales et sciences politiques de l'Université Hassan II de Casablanca. Il travaille aujourd'hui à la conception de systèmes multi-agents en production.",
      en: 'Mohammed Bougtab is a Moroccan AI Engineer based in Casablanca, specialising in agentic systems, RAG and data engineering. He holds an engineering degree in computer science and networks from EMSI Casablanca (MIAGE specialisation) and a bachelor’s degree in public law, international relations and political science from Université Hassan II in Casablanca. He currently designs multi-agent systems running in production.',
    },
  },
  {
    id: 'technologies',
    question: {
      fr: 'Quelles technologies Mohammed Bougtab maîtrise-t-il ?',
      en: 'What technologies does Mohammed Bougtab work with?',
    },
    answer: {
      fr: "Côté IA : LLM, RAG, tool calling, systèmes multi-agents, LangChain, LangGraph, embeddings, bases vectorielles et évaluation de modèles de langage. Côté données et machine learning : Python, Pandas, Scikit-Learn, Prophet, Apache Kafka, PySpark, NLP, SQL et PostgreSQL. Côté cloud et MLOps : Google Cloud Platform, BigQuery ML, Vertex AI, Dataflow et Docker. Côté logiciel : Java, Spring Boot et APIs REST. Côté restitution : Power BI.",
      en: 'On the AI side: LLMs, RAG, tool calling, multi-agent systems, LangChain, LangGraph, embeddings, vector stores and LLM evaluation. On data and machine learning: Python, Pandas, Scikit-Learn, Prophet, Apache Kafka, PySpark, NLP, SQL and PostgreSQL. On cloud and MLOps: Google Cloud Platform, BigQuery ML, Vertex AI, Dataflow and Docker. On software: Java, Spring Boot and REST APIs. On reporting: Power BI.',
    },
  },
  {
    id: 'multi-agent',
    question: {
      fr: "Qu'est-ce qu'un système multi-agents, et lesquels a-t-il construits ?",
      en: 'What is a multi-agent system, and which ones has he built?',
    },
    answer: {
      fr: "Un système multi-agents fait collaborer plusieurs composants autonomes, chacun spécialisé, sous la coordination d'un agent superviseur qui décide lequel appeler et dans quel ordre. Mohammed Bougtab a conçu deux systèmes de ce type : un système d'aide à la prévision budgétaire pour une administration publique marocaine, orchestré avec LangGraph et articulant trois outils spécialisés — prédiction par machine learning, recherche documentaire par RAG et interrogation SQL — et des agents d'automatisation de processus métier actuellement en production dans un groupe de distribution.",
      en: 'A multi-agent system coordinates several autonomous, specialised components under a supervisor agent that decides which one to call and in what order. Mohammed Bougtab has designed two of them: a budget-forecasting decision-support system for a Moroccan public administration, orchestrated with LangGraph around three specialised tools — machine learning prediction, RAG document retrieval and SQL querying — and business-process automation agents currently running in production at a retail group.',
    },
  },
  {
    id: 'public-sector',
    question: {
      fr: "A-t-il travaillé sur des projets d'IA pour le secteur public ?",
      en: 'Has he worked on AI projects for the public sector?',
    },
    answer: {
      fr: "Oui. Lors de son stage de fin d'études, il a conçu et développé un système multi-agents d'aide à la prévision des dépenses publiques destiné à une administration publique marocaine. Le projet combinait des modèles de prédiction budgétaire, un moteur de recherche contextuel sur les normes et référentiels métier, et l'interrogation du référentiel national des prix. Le détail du projet et le nom du client sont couverts par une clause de confidentialité.",
      en: 'Yes. During his final-year internship he designed and built a multi-agent system supporting public expenditure forecasting for a Moroccan public administration. The project combined budget prediction models, a contextual search engine over standards and reference frameworks, and querying of the national price reference database. Project details and the client’s name are covered by a confidentiality agreement.',
    },
  },
  {
    id: 'education',
    question: {
      fr: 'Quelle est sa formation ?',
      en: 'What is his educational background?',
    },
    answer: {
      fr: "Il a suivi deux cursus en parallèle. D'une part, le cycle ingénieur en informatique et réseaux de l'EMSI Casablanca de 2021 à 2026, avec une spécialisation MIAGE (méthodes informatiques appliquées à la gestion des entreprises). D'autre part, une licence en droit public, relations internationales et sciences politiques à l'Université Hassan II de Casablanca de 2023 à 2026. Il détient également le certificat professionnel IBM Data Engineering.",
      en: 'He studied two programmes in parallel. First, the computer science and networks engineering degree at EMSI Casablanca from 2021 to 2026, with a MIAGE specialisation (computer methods applied to business management). Second, a bachelor’s degree in public law, international relations and political science at Université Hassan II in Casablanca from 2023 to 2026. He also holds the IBM Data Engineering Professional Certificate.',
    },
  },
  {
    id: 'why-law',
    question: {
      fr: 'Pourquoi un ingénieur en IA a-t-il suivi une licence de droit public ?',
      en: 'Why would an AI engineer study public law?',
    },
    answer: {
      fr: "Parce qu'un système d'IA n'automatise pas une tâche : il déplace une décision. Comprendre qui décide, sous quelle contrainte réglementaire et devant qui il en répond change la conception du système — le choix des données, le niveau d'explicabilité exigé, la manière d'évaluer une réponse. Cette formation lui a permis d'aborder un projet de prévision budgétaire publique en maîtrisant déjà le vocabulaire des finances publiques et la logique d'un référentiel réglementaire.",
      en: 'Because an AI system does not automate a task: it moves a decision. Understanding who decides, under what regulatory constraint and to whom they answer changes how the system is designed — which data to use, how much explainability is required, how a response should be evaluated. That background meant he approached a public budget forecasting project already fluent in public finance vocabulary and the logic of a regulatory framework.',
    },
  },
  {
    id: 'rag',
    question: {
      fr: 'Quelle est son expérience en RAG (Retrieval-Augmented Generation) ?',
      en: 'What is his experience with RAG (Retrieval-Augmented Generation)?',
    },
    answer: {
      fr: "Il a conçu un moteur de recherche contextuel complet dans le cadre d'un système d'aide à la décision budgétaire : découpage des documents, génération d'embeddings, base vectorielle, indexation de normes et de référentiels métier, puis intégration de ce moteur comme outil appelable par un agent. Il travaille aujourd'hui sur des systèmes RAG en production, avec un protocole d'évaluation des réponses générées.",
      en: 'He built a complete contextual search engine as part of a budget decision-support system: document chunking, embedding generation, vector store, indexing of standards and reference frameworks, then integrating that engine as a tool callable by an agent. He now works on RAG systems in production, with an evaluation protocol for generated responses.',
    },
  },
  {
    id: 'freelance',
    question: {
      fr: 'Travaille-t-il en freelance ?',
      en: 'Does he take freelance work?',
    },
    answer: {
      fr: "Oui. Fin 2025, il a mené deux missions freelance en parallèle de ses études : un modèle de scoring de propension au paiement pour une société de recouvrement, et une analyse de paniers d'achat combinée à une prévision des ventes pour une enseigne de distribution culturelle. Il reste ouvert à des missions de conseil en data et en IA.",
      en: 'Yes. In late 2025 he ran two freelance engagements alongside his studies: a payment-propensity scoring model for a debt collection company, and market-basket analysis combined with sales forecasting for a cultural retail chain. He remains open to data and AI consulting engagements.',
    },
  },
  {
    id: 'remote',
    question: {
      fr: 'Est-il disponible à distance ou à l’international ?',
      en: 'Is he available for remote or international work?',
    },
    answer: {
      fr: "Oui. Il est basé à Casablanca et ouvert à des postes ou des missions au Maroc, en Europe et à distance. Il travaille en français, en arabe et en anglais.",
      en: 'Yes. He is based in Casablanca and open to roles or engagements in Morocco, in Europe and remotely. He works in French, Arabic and English.',
    },
  },
  {
    id: 'languages',
    question: {
      fr: 'Dans quelles langues travaille-t-il ?',
      en: 'What languages does he work in?',
    },
    answer: {
      fr: "L'arabe est sa langue maternelle. Il travaille en français à un niveau professionnel avancé (C1) et en anglais à un niveau professionnel (B2).",
      en: 'Arabic is his native language. He works in French at an advanced professional level (C1) and in English at a professional level (B2).',
    },
  },
  {
    id: 'projects',
    question: {
      fr: 'Quels sont ses projets les plus significatifs ?',
      en: 'What are his most significant projects?',
    },
    answer: {
      fr: "Le système multi-agents d'aide à la prévision budgétaire publique est le plus abouti : architecture orchestrée avec LangGraph, trois outils spécialisés et un protocole d'évaluation. Viennent ensuite les agents d'automatisation métier en production, un pipeline MLOps de détection de fraude sur Google Cloud (BigQuery ML, Vertex AI, Dataflow), et un pipeline temps réel d'analyse d'actualités avec Kafka, PySpark et des modèles NLP.",
      en: 'The multi-agent public budget forecasting system is the most complete: architecture orchestrated with LangGraph, three specialised tools and an evaluation protocol. Then come the business automation agents running in production, a fraud detection MLOps pipeline on Google Cloud (BigQuery ML, Vertex AI, Dataflow), and a real-time news analysis pipeline built with Kafka, PySpark and NLP models.',
    },
  },
  {
    id: 'contact',
    question: {
      fr: 'Comment le contacter ?',
      en: 'How can he be contacted?',
    },
    answer: {
      fr: "Par courriel à bougtab.mohammed03@gmail.com, ou via LinkedIn et GitHub (BougtabMohammed). Il répond aux propositions de poste comme de mission.",
      en: 'By email at bougtab.mohammed03@gmail.com, or through LinkedIn and GitHub (BougtabMohammed). He responds to both employment and contract enquiries.',
    },
  },
] as const;
