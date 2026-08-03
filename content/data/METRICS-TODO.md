# Métriques de périmètre à valider

> **Règle du projet** : on chiffre librement le **périmètre** (volumes, sources, composants,
> utilisateurs, durée) parce qu'il est vérifiable. On ne chiffre un **résultat** que s'il a
> réellement été mesuré. Aucun résultat estimé n'est publié comme un fait.
>
> **Rien de ce fichier n'apparaît sur le site.** Ces valeurs sont volontairement absentes
> des pages tant qu'elles ne sont pas confirmées. Une fois validées, elles s'ajoutent dans
> le champ `scope` de l'étude de cas concernée (`content/data/projects.ts`).

## Comment répondre

Remplace `[À VALIDER]` par la valeur, ou raye la ligne si tu ne la connais pas.
Un ordre de grandeur honnête (« environ 40 000 », « une quinzaine ») vaut mieux qu'un blanc,
et infiniment mieux qu'un chiffre inventé.

---

## Système multi-agents — prévision budgétaire (stage de fin d'études)

- [ ] Nombre de tables interrogées par l'outil SQL : `[À VALIDER]`
- [ ] Volume approximatif du référentiel de prix (lignes) : `[À VALIDER]`
- [ ] Nombre de documents indexés dans le RAG : `[À VALIDER]`
- [ ] Nombre d'utilisateurs métier visés : `[À VALIDER]`
- [ ] Nombre de questions du jeu d'évaluation LLM : `[À VALIDER]`
- [ ] Horizon de prévision des modèles (mois / trimestres) : `[À VALIDER]`

## Agents IA d'automatisation métier (poste actuel)

- [ ] Nombre d'équipes métier servies : `[À VALIDER]`
- [ ] Nombre de sources de données intégrées : `[À VALIDER]`
- [ ] Nombre d'agents ou d'outils en production : `[À VALIDER]`
- [ ] Fréquence de rafraîchissement des pipelines : `[À VALIDER]`

## Détection de fraude — MLOps sur GCP

- [ ] Volume du jeu de données (lignes / Go) : `[À VALIDER]`
- [ ] Nombre de variables après feature engineering : `[À VALIDER]`
- [ ] Métrique de performance réellement mesurée (AUC, precision/recall) : `[À VALIDER]`
- [ ] Taux de déséquilibre des classes : `[À VALIDER]`

## Pipeline temps réel — actualités

- [ ] Nombre de sources d'actualités ingérées : `[À VALIDER]`
- [ ] Débit approximatif (messages/jour) : `[À VALIDER]`
- [ ] Nombre de classes du modèle de classification : `[À VALIDER]`
- [ ] Exactitude mesurée du modèle de sentiment : `[À VALIDER]`

## Scoring de propension au paiement

- [ ] Nombre de cibles scorées : `[À VALIDER]`
- [ ] Profondeur d'historique utilisée (mois) : `[À VALIDER]`
- [ ] Nombre d'agents de recouvrement utilisateurs : `[À VALIDER]`

## Analyse de paniers et prévision des ventes

- [ ] Nombre de transactions analysées : `[À VALIDER]`
- [ ] Nombre de références produit : `[À VALIDER]`
- [ ] Nombre de règles d'association retenues : `[À VALIDER]`
- [ ] Horizon de prévision Prophet : `[À VALIDER]`

---

## Autres points à confirmer avant mise en ligne

- [ ] **Niveau d'anonymisation** — vérifier auprès de l'employeur si le nom de l'entreprise
      peut être cité (le poste est public sur LinkedIn ; c'est le contenu du projet qui est
      couvert par le NDA). Si oui : passer `REVEAL_CONFIDENTIAL_NAMES` à `true` dans
      `content/data/profile.ts`. Le nom de l'administration cliente n'est jamais publié,
      quelle que soit la valeur du drapeau.
- [ ] **URL LinkedIn exacte** — celle utilisée est déduite du nom, à corriger dans
      `content/data/profile.ts` si elle diffère.
- [ ] **Nom de domaine** — `SITE_URL` dans `content/data/profile.ts`.
- [ ] **CV PDF** — déposer le fichier à jour dans `public/cv-mohammed-bougtab.pdf`.
- [ ] **Trois dépôts GitHub vitrines** — README avec schéma d'architecture, instructions de
      reproduction et licence. Renseigner leur URL dans le champ `repository` des études de
      cas concernées ; sans elles, aucun lien de code n'est affiché.
