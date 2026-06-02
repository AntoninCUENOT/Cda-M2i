---
title: "Dossier Projet ECF - AnimeTracker"
author: "[Ton Nom]"
date: "Janvier 2026"
subtitle: "Conception d'une Application Mobile de Suivi d'Animes"
documentclass: article
geometry: margin=2.5cm
fontsize: 11pt
---

\newpage

# DOSSIER PROJET – ECF
## Conception d'un Projet Applicatif

**Projet** : AnimeTracker
**Type** : Application mobile React Native + Expo
**Candidat** : [Ton Nom]
**Formation** : Concepteur Développeur d'Applications (CDA)
**Date** : Janvier 2026

\newpage

# 1. CONTEXTE ET CADRAGE DU PROJET

## 1.1 Description du besoin

Les amateurs d'animes ont du mal à suivre leurs visionnages et à organiser leur liste d'animes à regarder. Les solutions existantes (MyAnimeList, AniList) sont principalement web avec des applications mobiles parfois limitées.

**AnimeTracker** répond à ce besoin en proposant une **application mobile native moderne** permettant de :

- Gérer sa bibliothèque personnelle d'animes (à voir, en cours, terminés, abandonnés)
- Noter et commenter les animes visionnés
- Suivre sa progression épisode par épisode
- Échanger avec d'autres fans via des groupes de discussion
- Recevoir des notifications lors de la sortie de nouveaux épisodes

L'objectif est d'offrir une **expérience utilisateur fluide et intuitive** spécifiquement conçue pour mobile, avec une dimension communautaire permettant de partager sa passion des animes.

---

## 1.2 Utilisateurs cibles

### Utilisateur principal : Amateur d'animes

- **Âge** : 15-35 ans
- **Profil** : Regarde régulièrement des animes, suit plusieurs séries en parallèle
- **Besoin** : Organiser ses visionnages, ne pas oublier où il en est dans chaque série
- **Comportement** : Utilise principalement son smartphone, actif sur les réseaux sociaux

### Utilisateur secondaire : Fan actif de la communauté

- **Profil** : Passionné, aime partager ses avis et découvrir de nouveaux animes
- **Besoin** : Échanger avec d'autres fans, donner son avis, suivre l'actualité
- **Comportement** : Participe à des discussions, lit et écrit des reviews

### Utilisateur avancé : Modérateur / Administrateur

- **Profil** : Membre actif de la communauté, souhaite contribuer à la qualité du contenu
- **Besoin** : Modérer les discussions, gérer les signalements, créer des groupes thématiques
- **Comportement** : Gère la communauté, veille au respect des règles

---

## 1.3 Contexte du projet

**Type de projet** : Projet de formation dans le cadre du titre professionnel Concepteur Développeur d'Applications (CDA).

**Objectif pédagogique** :

- Démontrer la maîtrise de la conception d'une application complète
- Appliquer les méthodologies UML et Merise
- Concevoir une architecture technique robuste et scalable
- Mettre en œuvre les bonnes pratiques de sécurité et de qualité

**Périmètre** :

- Application mobile multiplateforme (iOS / Android)
- API REST backend
- Base de données relationnelle PostgreSQL
- Intégration d'API externe (Jikan API pour les données d'animes)
- Système de notifications push

---

## 1.4 Contraintes identifiées

### 1.4.1 Contraintes de sécurité

| Contrainte | Solution retenue |
|------------|------------------|
| **Authentification** | JWT (JSON Web Token) avec expiration 7 jours |
| **Mots de passe** | Hachage bcrypt (salt rounds: 10) |
| **Données personnelles (RGPD)** | Suppression complète des données utilisateur sur demande (CASCADE), consentement explicite |
| **Validation des données** | Validation avec Joi/Zod + ORM Sequelize (requêtes paramétrées) |
| **Rate limiting** | Limitation à 100 requêtes / 15 minutes par IP |
| **HTTPS** | Obligatoire en production (certificat SSL/TLS) |

### 1.4.2 Contraintes techniques

| Contrainte | Solution retenue |
|------------|------------------|
| **Multiplateforme** | React Native + Expo (code unique pour iOS/Android) |
| **Performance** | Index BDD, cache API externe, pagination |
| **Scalabilité** | Architecture en couches, clustering Node.js (PM2) |
| **API externe** | Cache local des animes en BDD, synchronisation intelligente |
| **Notifications push** | Expo Push Notifications Service |
| **Stockage images** | CDN externe (Cloudinary / AWS S3) |

### 1.4.3 Contraintes de délais

| Phase | Durée estimée |
|-------|---------------|
| **Conception** | 2 semaines |
| **Développement MVP** | 4-6 semaines |
| **Tests & Corrections** | 1-2 semaines |
| **Déploiement** | 1 semaine |

**Approche** : Développement itératif avec livraison d'un MVP (Minimum Viable Product) puis fonctionnalités additionnelles.

\newpage

# 2. ANALYSE FONCTIONNELLE DU BESOIN

## 2.1 Fonctionnalités principales

### MVP (Version 1.0) – Prioritaire

**Authentification & Profil**

- Inscription avec email et mot de passe
- Connexion / Déconnexion
- Modification du profil (pseudo, photo, bio)

**Catalogue d'animes**

- Recherche d'animes par nom
- Filtrage par genres, année, score
- Consultation de la fiche détaillée d'un anime

**Ma bibliothèque personnelle**

- Ajouter un anime avec statut : "À voir", "En cours", "Terminé", "Abandonné"
- Suivre ma progression (épisodes vus / total)
- Modifier le statut d'un anime

**Notes & Commentaires**

- Noter un anime (sur 10 avec paliers de 0.5)
- Écrire un commentaire/review
- Choisir la visibilité : public ou privé

**Notifications**

- Notification lors de la sortie d'un nouvel épisode

### Version 1.5 – Fonctionnalités sociales

- Consulter le profil d'autres utilisateurs
- Suivre des utilisateurs
- Liker des reviews publiques
- Envoyer des messages privés
- Notifications sociales (nouveau follower, nouveau message)

### Version 2.0 – Fonctionnalités communautaires

- Rejoindre des groupes de discussion (officiels et personnalisés)
- Créer des groupes personnalisés
- Publier dans les groupes
- Signaler du contenu inapproprié
- Modération (pour modérateurs/admins)

---

## 2.2 Cas d'utilisation

### Diagramme de cas d'utilisation (UML)

Le diagramme complet présente **5 acteurs** et **38 cas d'utilisation** organisés en 9 packages fonctionnels.

**Acteurs** :

- **Visiteur** : Utilisateur non connecté
- **Utilisateur** : Utilisateur inscrit et connecté
- **Modérateur** : Utilisateur avec droits de modération
- **Administrateur** : Gestion complète de la plateforme
- **Jikan API** : Système externe fournissant les données

**Packages fonctionnels** :

1. Authentification & Profil
2. Catalogue & Découverte
3. Ma Bibliothèque
4. Notes & Commentaires
5. Interactions Sociales
6. Groupes de Discussion
7. Notifications
8. Administration & Modération

*Voir annexe : Diagramme de cas d'utilisation complet*

---

## 2.3 Tableau Acteur → Actions possibles

| Acteur | Actions autorisées |
|--------|--------------------|
| **Visiteur** | • Consulter le catalogue d'animes<br>• Rechercher et filtrer des animes<br>• Voir les fiches détaillées<br>• Consulter les reviews publiques |
| **Utilisateur** | • Toutes les actions du Visiteur +<br>• Gérer son compte<br>• Gérer sa bibliothèque d'animes<br>• Noter et commenter les animes<br>• Consulter les profils des autres<br>• Suivre des utilisateurs<br>• Liker des reviews<br>• Messagerie privée<br>• Rejoindre/Créer des groupes<br>• Recevoir des notifications |
| **Modérateur** | • Toutes les actions de l'Utilisateur +<br>• Gérer les modérateurs d'un groupe<br>• Supprimer des messages dans les groupes<br>• Supprimer un groupe personnalisé créé |
| **Administrateur** | • Toutes les actions du Modérateur +<br>• Consulter tous les signalements<br>• Supprimer n'importe quel contenu<br>• Suspendre/Bannir des utilisateurs |

---

## 2.4 Scénarios utilisateurs simples

### Scénario 1 : Découverte et ajout d'un anime

**Acteur** : Marie, 22 ans, amatrice d'animes

**Objectif** : Trouver un anime et l'ajouter à sa liste "À voir"

**Étapes** :

1. Marie ouvre l'application AnimeTracker
2. Elle se connecte avec son email et mot de passe
3. Elle utilise la barre de recherche et tape "Attack on Titan"
4. L'application affiche une liste de résultats
5. Marie clique sur "Attack on Titan"
6. Elle consulte la fiche détaillée : synopsis, 75 épisodes, note 8.9/10
7. Elle clique sur "Ajouter à ma liste"
8. Elle sélectionne le statut "À voir"
9. L'anime est ajouté à sa bibliothèque
10. Elle reçoit une confirmation visuelle

**Résultat** : L'anime apparaît dans l'onglet "À voir" de sa bibliothèque.

---

### Scénario 2 : Suivi de progression et notation

**Acteur** : Thomas, 19 ans

**Objectif** : Mettre à jour sa progression et noter un anime terminé

**Étapes** :

1. Thomas ouvre l'application
2. Il va dans "Ma bibliothèque" → "En cours"
3. Il clique sur "One Piece"
4. Il met à jour : "850 épisodes vus / 1000"
5. Après avoir fini, il change le statut en "Terminé"
6. L'application propose de noter l'anime
7. Il donne 9.5/10
8. Il écrit : "Chef-d'œuvre absolu, personnages attachants"
9. Il choisit de rendre sa review publique
10. Il valide

**Résultat** : L'anime passe dans "Terminés", sa note et review sont sauvegardées.

---

### Scénario 3 : Interaction sociale

**Acteur** : Léa, 25 ans

**Objectif** : Échanger avec d'autres fans d'un anime

**Étapes** :

1. Léa consulte la fiche de "Demon Slayer"
2. Elle voit l'onglet "Groupe de discussion"
3. Elle clique sur le groupe officiel
4. Elle clique "Rejoindre le groupe"
5. Elle lit les derniers messages
6. Elle écrit : "Qui a préféré l'arc du district des plaisirs ?"
7. Elle publie son message
8. D'autres membres répondent
9. Elle reçoit des notifications pour les réponses

**Résultat** : Léa participe activement à la discussion avec la communauté.

\newpage

# 3. CONCEPTION GÉNÉRALE DE L'APPLICATION

## 3.1 Architecture globale

AnimeTracker suit une **architecture client-serveur en couches**, garantissant séparation des responsabilités, maintenabilité et scalabilité.

### Schéma d'architecture globale

```
┌─────────────────────────────────────────┐
│      UTILISATEURS MOBILES               │
│      (iOS / Android)                    │
└─────────────────────────────────────────┘
                  ↓ HTTPS
┌─────────────────────────────────────────┐
│   COUCHE PRÉSENTATION (Mobile)          │
│                                         │
│   Application React Native + Expo      │
│   - Screens (Pages)                    │
│   - Components UI                      │
│   - State Management (Redux)           │
│   - Navigation                         │
└─────────────────────────────────────────┘
                  ↓ REST API (JSON)
┌─────────────────────────────────────────┐
│   COUCHE API / BACKEND                  │
│                                         │
│   API REST - Node.js + Express         │
│   - Routes & Controllers               │
│   - Middlewares (Auth, Validation)     │
│   - Services Métier                    │
│   - Repositories (Data Access)         │
│                                         │
│   Services :                            │
│   - Authentification JWT               │
│   - Notifications Service              │
│   - Scheduler (Cron Jobs)              │
└─────────────────────────────────────────┘
         ↓ SQL              ↓ HTTP
┌──────────────────┐   ┌──────────────────┐
│ COUCHE DONNÉES   │   │ SERVICES EXTERNES│
│                  │   │                  │
│ PostgreSQL       │   │ - Jikan API v4   │
│ - 18 Tables      │   │ - Expo Push      │
│ - Triggers       │   │ - CDN Images     │
│ - ORM Sequelize  │   │                  │
└──────────────────┘   └──────────────────┘
```

---

## 3.2 Découpage en couches

L'application suit le principe de **séparation des préoccupations** avec **3 couches principales** :

### COUCHE 1 : Présentation (Client Mobile)

**Rôle** : Interface utilisateur et expérience utilisateur

**Technologies** :

- React Native (framework mobile multiplateforme)
- Expo (toolchain : build, push notifications, OTA updates)
- TypeScript (typage statique)
- Redux Toolkit (gestion d'état global)
- React Navigation (navigation entre écrans)

**Composants** :

```
Screens (Pages)
├── AuthScreen (Login/Register)
├── HomeScreen
├── AnimeListScreen (Bibliothèque)
├── AnimeDetailScreen
├── ProfileScreen
├── GroupScreen
└── ConversationScreen

State Management (Redux)
├── authSlice
├── animesSlice
├── notificationsSlice
└── messagesSlice

Services Client
├── apiClient (Axios)
├── authService (JWT storage)
└── pushHandler (notifications)
```

**Responsabilités** :

- Afficher les données
- Capturer les interactions utilisateur
- Gérer la navigation
- Stocker le token JWT en local
- Gérer l'état de l'application
- Envoyer des requêtes HTTP à l'API

---

### COUCHE 2 : Logique Métier (API Backend)

**Rôle** : Traiter les requêtes, appliquer la logique métier, sécuriser les accès

**Technologies** :

- Node.js 18+ (runtime JavaScript serveur)
- Express.js (framework web)
- TypeScript
- Sequelize (ORM pour PostgreSQL)
- JWT (authentification)
- bcrypt (hachage mots de passe)

**Architecture interne** :

```
Routes & Controllers
├── AuthController
├── UsersController
├── AnimesController
├── ReviewsController
└── GroupsController

Middlewares
├── authMiddleware (vérifie JWT)
├── validationMiddleware
├── errorHandler
└── rateLimiter

Services Métier
├── AuthService
├── AnimeService
├── ReviewService
├── NotificationService
└── GroupService

Repositories
├── UserRepository
├── AnimeRepository
└── ReviewRepository
```

**Responsabilités** :

- Recevoir et router les requêtes HTTP
- Vérifier l'authentification (JWT)
- Valider les données entrantes
- Appliquer la logique métier
- Interroger la base de données
- Communiquer avec les API externes
- Envoyer les notifications push
- Gérer les erreurs

**Tâches planifiées** :

- Vérification quotidienne des nouveaux épisodes (8h)
- Envoi de notifications aux utilisateurs concernés

---

### COUCHE 3 : Données (Persistance)

**Rôle** : Stocker et gérer les données de l'application

**Technologies** :

- PostgreSQL 15+ (base de données relationnelle)
- Sequelize (ORM)

**Structure** :

```
Base de Données PostgreSQL
├── 18 Tables relationnelles
│   ├── user, anime, genre, studio
│   ├── user_anime (bibliothèque)
│   ├── review, review_like
│   ├── follow, conversation, message
│   ├── group, group_member, group_message
│   └── notification, report
│
├── Triggers automatiques
│   ├── update_updated_at
│   └── increment_review_likes
│
├── Contraintes d'intégrité
│   ├── Clés primaires (UUID/SERIAL)
│   ├── Clés étrangères (CASCADE/SET NULL)
│   └── Contraintes CHECK
│
└── Index de performance (30+)
```

**Responsabilités** :

- Stocker toutes les données
- Garantir l'intégrité des données
- Optimiser les requêtes
- Assurer la cohérence (transactions)
- Gérer la persistance

---

## 3.3 Identification des responsabilités

### Principe de responsabilité unique

Chaque couche et composant a une **responsabilité unique et bien définie** :

| Couche / Composant | Responsabilité | Interactions |
|--------------------|----------------|--------------|
| **React Native App** | Affichage et interactions utilisateur | → API Backend (HTTP) |
| **Redux Store** | Gestion de l'état global | ← React Components |
| **API Client (Axios)** | Communication HTTP | → API Backend |
| **Controllers** | Réception et routage des requêtes | → Services Métier |
| **Middlewares** | Authentification, validation, erreurs | ↔ Controllers |
| **Services Métier** | Logique métier et règles de gestion | → Repositories, API externes |
| **Repositories** | Accès aux données via ORM | → Base de données |
| **Sequelize Models** | Mapping objet-relationnel | → PostgreSQL |
| **PostgreSQL** | Persistance des données | - |

---

### Flux de données type : "Ajouter un anime"

```
1. Utilisateur clique "Ajouter" dans l'app
   ↓
2. React Component → Action Redux
   ↓
3. Redux dispatch → API Client (Axios)
   ↓
4. HTTP POST /users/me/animes {anime_id, status}
   ↓
5. Backend : authMiddleware vérifie JWT
   ↓
6. Backend : validationMiddleware valide données
   ↓
7. Backend : AnimesController reçoit requête
   ↓
8. Backend : AnimeService.addAnimeToLibrary()
   ↓
9. Backend : AnimeRepository.create(user_anime)
   ↓
10. Backend : Sequelize INSERT INTO user_anime
   ↓
11. PostgreSQL : Enregistrement créé
   ↓
12. Backend : Réponse 201 Created
   ↓
13. App : Redux met à jour le state
   ↓
14. App : React Component re-render
   ↓
15. Utilisateur voit l'anime dans sa liste
```

---

## 3.4 Stack technique récapitulative

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| **Mobile** | React Native + Expo | Framework multiplateforme mature, grande communauté |
| | TypeScript | Typage statique, meilleure maintenabilité |
| **Backend** | Node.js 18 LTS | Performance, écosystème npm riche |
| | Express.js | Framework web léger et flexible |
| | Sequelize | ORM robuste pour PostgreSQL |
| **Base de données** | PostgreSQL 15+ | SGBD relationnel performant, open source |
| **API externe** | Jikan API v4 | API gratuite, données MyAnimeList complètes |
| **Notifications** | Expo Push | Intégration native avec Expo |
| **Infrastructure** | Nginx + PM2 | Reverse proxy + process manager Node.js |

---

## 3.5 Sécurité et conformité

### Mesures de sécurité

| Aspect | Mesure |
|--------|--------|
| **Authentification** | JWT signé HS256, expiration 7 jours |
| **Mots de passe** | Hachage bcrypt, salt rounds: 10 |
| **Communications** | HTTPS obligatoire (certificat SSL/TLS) |
| **Validation** | Joi/Zod sur toutes routes |
| **SQL Injection** | Requêtes paramétrées (Sequelize) |
| **XSS** | Sanitization des inputs |
| **Rate Limiting** | 100 req / 15 min par IP |

### RGPD

- Droit à l'information (politique de confidentialité)
- Droit d'accès (consultation données personnelles)
- Droit de rectification (modification profil)
- Droit à l'oubli (suppression complète CASCADE)
- Consentement (préférences notifications opt-in)

\newpage

# CONCLUSION

Ce dossier de conception présente une **approche méthodique et complète** pour le développement de l'application AnimeTracker.

## Points clés

✅ **Besoin clairement identifié** : Suivi personnalisé des visionnages d'animes avec dimension communautaire

✅ **Analyse fonctionnelle complète** : Fonctionnalités MVP priorisées, cas d'utilisation détaillés, scénarios utilisateurs

✅ **Architecture robuste** : Architecture en 3 couches, séparation des responsabilités, scalabilité

✅ **Sécurité intégrée** : JWT, bcrypt, HTTPS, RGPD, validation des données

✅ **Base de données optimisée** : 18 tables normalisées, triggers, index de performance

✅ **Stack technique moderne** : React Native, Node.js, PostgreSQL, Expo

✅ **Approche itérative** : MVP prioritaire, fonctionnalités additionnelles en phases

Ce projet démontre la **maîtrise de la conception d'une application complète**, de l'analyse du besoin à l'architecture technique, en passant par la modélisation des données et la définition des interactions utilisateurs.

L'application est **prête à être développée** avec une conception solide, documentée et professionnelle.

\newpage

# ANNEXES

## Liste des documents de conception complets

Les documents suivants sont disponibles dans le dossier du projet :

### Diagrammes UML

- Diagramme de cas d'utilisation (1 fichier)
- Diagrammes de classes (4 fichiers : principal, social, groupes, notifications)
- Diagrammes de séquence (6 scénarios)
- Diagrammes d'architecture (3 fichiers : globale, détaillée, déploiement)

**Localisation** : `conception/uml/`

### Modélisation de la base de données

- MCD (Modèle Conceptuel de Données)
- MLD (Modèle Logique de Données)
- MPD (Modèle Physique de Données - Script SQL PostgreSQL complet)
- Visuels MCD/MLD/MPD (diagrammes PlantUML)

**Localisation** : `conception/mcd/`

### Documentation

- User Stories complètes (43 user stories avec critères d'acceptation)
- Modèle de classes détaillé (16 classes)
- Architecture technique (stack, flux, sécurité, performance)

**Localisation** : `documentation/`

### Maquettes

- Charte graphique (couleurs, typographie, composants)
- Wireframes (12 écrans décrits)
- Guide de maquettage Figma

**Localisation** : `maquettes/`

