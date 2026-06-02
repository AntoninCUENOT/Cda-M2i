# Dossier de Projet — Titre Professionnel CDA
# AnimeTracker — Application mobile de suivi d'animés

**Candidat** : [Prénom NOM]  
**Formation** : Concepteur Développeur d'Applications (CDA) — Niveau 6 RNCP  
**Date de soutenance** : [Date]  
**Version** : 1.0 — Mai 2026  

---

# SOMMAIRE

---

## PARTIE 1 — PRÉSENTATION DU PROJET
*(pages 3 à 8 — environ 5 pages)*

**1.1** Présentation du candidat et du contexte de formation  
**1.2** Présentation générale du projet AnimeTracker  
**1.3** Objectifs du projet  
**1.4** Périmètre fonctionnel — ce qui est inclus / exclu  
**1.5** Stack technique retenue — vue synthétique  

---

## PARTIE 2 — ANALYSE DES BESOINS
*(pages 9 à 18 — environ 10 pages)*

**2.1** Acteurs et rôles  
**2.2** User Stories par fonctionnalité  
&emsp;— A. Authentification et profil  
&emsp;— B. Bibliothèque personnelle  
&emsp;— C. Recherche d'animés  
&emsp;— D. Avis et évaluations  
&emsp;— E. Messagerie privée  
&emsp;— F. Groupes de discussion  
&emsp;— G. Social (abonnements)  
**2.3** Règles de gestion  
**2.4** Contraintes techniques et non-fonctionnelles  

---

## PARTIE 3 — CONCEPTION
*(pages 19 à 33 — environ 15 pages)*

**3.1** Architecture générale (client-serveur, REST, découpage en couches)  
**3.2** Modèle Conceptuel de Données (MCD)  
**3.3** Modèle Logique de Données (MLD)  
**3.4** Modèle de classes  
**3.5** Diagrammes UML  
&emsp;— 3.5.1 Diagramme de cas d'utilisation  
&emsp;— 3.5.2 Diagrammes de séquence (authentification, ajout à la bibliothèque, envoi de message)  
**3.6** Maquettes et wireframes  
&emsp;— 3.6.1 Navigation et structure des écrans  
&emsp;— 3.6.2 Écrans principaux  
**3.7** Charte graphique  
&emsp;— 3.7.1 Identité visuelle et palette de couleurs  
&emsp;— 3.7.2 Typographie et composants UI  
&emsp;— 3.7.3 Mode sombre / mode clair  

---

## PARTIE 4 — RÉALISATION TECHNIQUE
*(pages 34 à 50 — environ 17 pages)*

**4.1** Justification des choix technologiques  
&emsp;— 4.1.1 React Native + Expo (frontend mobile)  
&emsp;— 4.1.2 Node.js / Express (backend API REST)  
&emsp;— 4.1.3 PostgreSQL (base de données relationnelle)  
&emsp;— 4.1.4 Redis (cache et blacklist JWT)  
&emsp;— 4.1.5 Docker (environnement de développement)  
&emsp;— 4.1.6 TypeScript (typage statique full-stack)  

**4.2** Architecture backend  
&emsp;— 4.2.1 Structure des dossiers  
&emsp;— 4.2.2 Pattern Routes / Controllers / Services  
&emsp;— 4.2.3 Middleware d'authentification JWT  
&emsp;— 4.2.4 Validation des données (Zod)  
&emsp;— 4.2.5 Gestion centralisée des erreurs  
&emsp;— 4.2.6 Sécurité (rate limiting, CORS, bcrypt)  

**4.3** Architecture frontend  
&emsp;— 4.3.1 Structure des dossiers  
&emsp;— 4.3.2 Navigation (React Navigation — Stack + Tab)  
&emsp;— 4.3.3 Gestion d'état global (Redux Toolkit + AsyncThunk)  
&emsp;— 4.3.4 Client HTTP (Axios — intercepteurs et gestion des tokens)  
&emsp;— 4.3.5 API externe Jikan (MyAnimeList)  
&emsp;— 4.3.6 Thème et mode sombre (ThemeContext)  

**4.4** Base de données  
&emsp;— 4.4.1 Schéma complet des tables  
&emsp;— 4.4.2 Gestion des UUIDs  
&emsp;— 4.4.3 Relations et contraintes  
&emsp;— 4.4.4 ORM Sequelize — modèles et associations  

**4.5** Fonctionnalités clés — extraits de code commentés  
&emsp;— 4.5.1 Authentification (register / login / logout)  
&emsp;— 4.5.2 Bibliothèque personnelle (CRUD + statuts)  
&emsp;— 4.5.3 Avis — visibilité publique/privée  
&emsp;— 4.5.4 Messagerie privée  
&emsp;— 4.5.5 Groupes de discussion par animé  
&emsp;— 4.5.6 Système de suivi (follow/unfollow)  

**4.6** Infrastructure Docker  
&emsp;— 4.6.1 docker-compose.yml  
&emsp;— 4.6.2 Services : PostgreSQL, Redis, Backend  

---

## PARTIE 5 — TESTS ET QUALITÉ
*(pages 51 à 56 — environ 6 pages)*

**5.1** Stratégie de tests  
**5.2** Tests automatisés (Jest)  
&emsp;— 5.2.1 Configuration et mocking  
&emsp;— 5.2.2 Tests unitaires — authService (15 tests)  
&emsp;— 5.2.3 Tests unitaires — userService (12 tests)  
&emsp;— 5.2.4 Tests d'intégration — routes auth (11 tests)  
&emsp;— 5.2.5 Résultats : 38/38 PASS  
**5.3** Tests manuels (émulateur Android)  
&emsp;— 5.3.1 Authentification (7 tests)  
&emsp;— 5.3.2 Bibliothèque (8 tests)  
&emsp;— 5.3.3 Avis (7 tests)  
&emsp;— 5.3.4 Messagerie (6 tests)  
&emsp;— 5.3.5 Groupes (4 tests)  
&emsp;— 5.3.6 Social (5 tests)  
&emsp;— 5.3.7 Profil (4 tests)  
**5.4** Tableau de couverture fonctionnelle  

---

## PARTIE 6 — BILAN ET RÉTROSPECTIVE
*(pages 57 à 62 — environ 6 pages)*

**6.1** Ce qui a bien fonctionné  
**6.2** Difficultés rencontrées  
**6.3** Solutions apportées  
**6.4** Axes d'amélioration  
**6.5** Compétences acquises  
**6.6** Conclusion  

---

## ANNEXES
*(pages 63 à ~70 — variable)*

**Annexe A** — Liste complète des endpoints API REST  
**Annexe B** — Schéma de base de données (diagramme entité-relation complet)  
**Annexe C** — Extraits de code significatifs  
**Annexe D** — Captures d'écran de l'application (émulateur Android)  
**Annexe E** — Résultats Jest (sortie console complète)  

---

## RÉCAPITULATIF DES PARTIES

| Partie | Titre | Pages estimées |
|--------|-------|---------------|
| 1 | Présentation du projet | ~5 pages |
| 2 | Analyse des besoins | ~10 pages |
| 3 | Conception | ~15 pages |
| 4 | Réalisation technique | ~17 pages |
| 5 | Tests et qualité | ~6 pages |
| 6 | Bilan et rétrospective | ~6 pages |
| Annexes | — | ~8 pages |
| **Total** | | **~67 pages** |

---

## DOCUMENTS SOURCES DÉJÀ PRODUITS

| Document | Fichier | Statut |
|----------|---------|--------|
| Explication technique complète | `documentation/explication-technique.md` | ✅ Rédigé |
| Architecture technique | `documentation/architecture-technique.md` | ✅ Rédigé |
| Modèle de classes | `documentation/modele-classes.md` | ✅ Rédigé |
| User Stories | `documentation/user-stories.md` | ✅ Rédigé |
| Plan de tests | `documentation/plan-de-tests.md` | ✅ Rédigé |
| Bilan / rétrospective | `documentation/bilan-retrospective.md` | ✅ Rédigé |
| Wireframes et descriptions d'écrans | `maquettes/wireframes-descriptions.md` | ✅ Rédigé |
| Charte graphique | `maquettes/charte-graphique.md` | ✅ Rédigé |
| Partie 1 — Présentation | `documentation/partie1-presentation.md` | ❌ À rédiger |
| Partie 2 — Analyse des besoins (complétée) | `documentation/partie2-besoins.md` | ❌ À compléter |
| Partie 3 — Conception (complétée) | `documentation/partie3-conception.md` | ❌ À assembler |
| Partie 4 — Réalisation (complétée) | `documentation/partie4-realisation.md` | ❌ À assembler |
| Annexes | `documentation/annexes.md` | ❌ À rédiger |

---

*AnimeTracker — Dossier CDA — Mai 2026*
