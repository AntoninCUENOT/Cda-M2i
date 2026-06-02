# DOSSIER PROJET – ECF
## Conception d'un Projet Applicatif

---

**Titre du projet** : AnimeTracker
**Type d'application** : Application mobile (React Native + Expo)
**Candidat** : [Ton nom]
**Formation** : Concepteur Développeur d'Applications (CDA)
**Date** : Janvier 2026

---

# 1. CONTEXTE ET CADRAGE DU PROJET

## 1.1 Description du besoin

Les amateurs d'animes et de mangas ont souvent du mal à suivre leurs visionnages et à organiser leur liste d'animes à regarder. Les solutions existantes (MyAnimeList, AniList) sont principalement des sites web avec des applications mobiles parfois limitées ou peu ergonomiques.

**AnimeTracker** répond à ce besoin en proposant une **application mobile native moderne** permettant de :
- Gérer sa bibliothèque personnelle d'animes (à voir, en cours, terminés, abandonnés)
- Noter et commenter les animes visionnés
- Suivre sa progression épisode par épisode
- Échanger avec d'autres fans via des groupes de discussion
- Recevoir des notifications lors de la sortie de nouveaux épisodes

L'objectif est d'offrir une **expérience utilisateur fluide et intuitive** spécifiquement conçue pour mobile, avec une dimension communautaire permettant de partager sa passion des animes.

---

## 1.2 Utilisateurs cibles

### **Utilisateur principal** : Amateur d'animes
- **Âge** : 15-35 ans
- **Profil** : Regarde régulièrement des animes, suit plusieurs séries en parallèle
- **Besoin** : Organiser ses visionnages, ne pas oublier où il en est dans chaque série
- **Comportement** : Utilise principalement son smartphone, actif sur les réseaux sociaux

### **Utilisateur secondaire** : Fan actif de la communauté anime
- **Profil** : Passionné, aime partager ses avis et découvrir de nouveaux animes
- **Besoin** : Échanger avec d'autres fans, donner son avis, suivre l'actualité
- **Comportement** : Participe à des discussions, lit et écrit des reviews

### **Utilisateur avancé** : Modérateur / Administrateur
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
- Base de données relationnelle
- Intégration d'API externe (Jikan API pour les données d'animes)
- Système de notifications push

---

## 1.4 Contraintes identifiées

### **Contraintes de sécurité**

| Contrainte | Description | Solution retenue |
|------------|-------------|------------------|
| **Authentification** | Sécuriser l'accès aux comptes utilisateurs | JWT (JSON Web Token) avec expiration 7 jours |
| **Mots de passe** | Protection des mots de passe en base | Hachage bcrypt (salt rounds: 10) |
| **Données personnelles (RGPD)** | Conformité RGPD, droit à l'oubli | Suppression complète des données utilisateur sur demande (CASCADE) |
| **Validation des données** | Prévenir injections SQL et XSS | Validation avec Joi/Zod + ORM Sequelize (requêtes paramétrées) |
| **Rate limiting** | Protection contre les abus API | Limitation à 100 requêtes / 15 minutes par IP |
| **HTTPS** | Chiffrement des communications | Obligatoire en production (certificat SSL/TLS) |

### **Contraintes techniques**

| Contrainte | Description | Solution retenue |
|------------|-------------|------------------|
| **Multiplateforme** | Application iOS et Android | React Native + Expo (code unique) |
| **Performance** | Temps de réponse < 200ms | Index BDD, cache API externe, pagination |
| **Scalabilité** | Support de milliers d'utilisateurs | Architecture en couches, clustering Node.js (PM2), réplication BDD |
| **API externe** | Dépendance à Jikan API (gratuite mais limitée) | Cache local des animes en BDD, système de synchronisation intelligent |
| **Notifications push** | Envoi de notifications mobiles | Expo Push Notifications Service |
| **Stockage images** | Photos de profil des utilisateurs | CDN externe (Cloudinary / AWS S3) |

### **Contraintes de délais**

| Phase | Durée estimée | Livrables |
|-------|---------------|-----------|
| **Conception** | 2 semaines | Dossiers de conception (UML, MCD/MLD/MPD, architecture) |
| **Développement MVP** | 4-6 semaines | Application fonctionnelle (fonctionnalités prioritaires) |
| **Tests & Corrections** | 1-2 semaines | Tests unitaires, tests d'intégration, corrections bugs |
| **Déploiement** | 1 semaine | Mise en production (backend + publication stores) |

**Priorités** : Le développement sera réalisé en **approche itérative**, en délivrant d'abord un MVP (Minimum Viable Product) puis des fonctionnalités additionnelles.

---

# 2. ANALYSE FONCTIONNELLE DU BESOIN

## 2.1 Fonctionnalités principales

### **MVP (Minimum Viable Product) – Version 1.0**

#### **Authentification & Profil**
- Inscription avec email et mot de passe
- Connexion / Déconnexion
- Modification du profil (pseudo, photo, bio)

#### **Catalogue d'animes**
- Recherche d'animes par nom
- Filtrage par genres, année, score
- Consultation de la fiche détaillée d'un anime (synopsis, épisodes, note, trailer)

#### **Ma bibliothèque personnelle**
- Ajouter un anime à ma liste avec statut : "À voir", "En cours", "Terminé", "Abandonné"
- Suivre ma progression (épisodes vus / total)
- Modifier le statut d'un anime

#### **Notes & Commentaires**
- Noter un anime (sur 10 avec paliers de 0.5)
- Écrire un commentaire/review
- Choisir la visibilité : public ou privé

#### **Notifications**
- Recevoir une notification lors de la sortie d'un nouvel épisode (pour les animes "En cours" ou "À voir")

---

### **Version 1.5 (Fonctionnalités sociales)**

#### **Profils utilisateurs**
- Consulter le profil public d'un autre utilisateur
- Voir ses animes et reviews publiques
- Statistiques publiques (nombre d'animes vus, temps passé, genres préférés)

#### **Interactions sociales**
- Suivre un autre utilisateur
- Liker une review publique
- Envoyer un message privé

#### **Notifications sociales**
- Notification quand quelqu'un me suit
- Notification pour les nouveaux messages privés

---

### **Version 2.0 (Fonctionnalités communautaires)**

#### **Groupes de discussion**
- Rejoindre le groupe officiel d'un anime (créé automatiquement)
- Créer un groupe personnalisé (thématique ou lié à un anime)
- Publier des messages dans un groupe
- Modérateurs : supprimer des messages inappropriés

#### **Administration & Modération**
- Signaler un contenu inapproprié (review, message)
- Modérateurs/Admins : consulter les signalements
- Supprimer du contenu
- Suspendre ou bannir un utilisateur

---

## 2.2 Cas d'utilisation (Diagramme UML)

Le diagramme de cas d'utilisation complet présente :
- **5 acteurs** : Visiteur, Utilisateur, Modérateur, Administrateur, Jikan API
- **9 packages fonctionnels** regroupant 38 cas d'utilisation

**Voir** : [Diagramme de cas d'utilisation](conception/uml/diagramme-cas-utilisation.puml)

### **Principaux cas d'utilisation par acteur :**

#### **Visiteur (non connecté)**
- Rechercher un anime
- Filtrer les animes
- Consulter la fiche d'un anime
- Voir les reviews publiques

#### **Utilisateur (connecté)**
- Tous les cas du Visiteur +
- S'inscrire / Se connecter / Se déconnecter
- Gérer sa bibliothèque d'animes (ajouter, modifier statut, suivre progression)
- Noter et commenter les animes
- Suivre d'autres utilisateurs
- Envoyer des messages privés
- Rejoindre et créer des groupes
- Recevoir des notifications

#### **Modérateur**
- Tous les cas de l'Utilisateur +
- Gérer les modérateurs d'un groupe personnalisé
- Supprimer des messages dans les groupes
- Supprimer un groupe personnalisé

#### **Administrateur**
- Tous les cas du Modérateur +
- Consulter les signalements
- Supprimer du contenu inapproprié
- Suspendre ou bannir des utilisateurs

---

## 2.3 User Stories principales

Les user stories détaillées (43 au total) sont organisées par fonctionnalité avec leurs critères d'acceptation.

**Voir** : [Document complet des User Stories](documentation/user-stories.md)

### **Exemples de User Stories prioritaires (MVP) :**

| ID | En tant que | Je veux | Afin de | Priorité |
|----|-------------|---------|---------|----------|
| US01 | Visiteur | Créer un compte avec email et mot de passe | Accéder aux fonctionnalités de l'application | Haute |
| US02 | Utilisateur | Me connecter avec mes identifiants | Accéder à mon compte | Haute |
| US07 | Utilisateur | Rechercher un anime par nom | Trouver un anime spécifique | Haute |
| US11 | Utilisateur | Ajouter un anime à ma liste "À voir" | Me créer une watchlist | Haute |
| US12 | Utilisateur | Marquer un anime comme "En cours" | Suivre mes visionnages actuels | Haute |
| US15 | Utilisateur | Suivre ma progression (épisodes vus / total) | Savoir où j'en suis dans chaque anime | Haute |
| US17 | Utilisateur | Noter un anime (sur 10 avec paliers de 0.5) | Exprimer mon appréciation | Haute |
| US18 | Utilisateur | Écrire un commentaire/review sur un anime | Partager mon avis détaillé | Haute |
| US37 | Utilisateur | Recevoir une notification quand un nouvel épisode sort pour un anime de ma liste | Ne pas rater de sortie | Haute |

---

## 2.4 Tableau Acteur → Actions possibles

| Acteur | Actions autorisées |
|--------|--------------------|
| **Visiteur** | • Consulter le catalogue d'animes<br>• Rechercher et filtrer des animes<br>• Voir les fiches détaillées<br>• Consulter les reviews publiques |
| **Utilisateur** | • Toutes les actions du Visiteur +<br>• Gérer son compte (inscription, connexion, profil)<br>• Gérer sa bibliothèque d'animes (ajout, statuts, progression)<br>• Noter et commenter les animes (public/privé)<br>• Consulter les profils des autres utilisateurs<br>• Suivre/Ne plus suivre des utilisateurs<br>• Liker des reviews publiques<br>• Envoyer/Recevoir des messages privés<br>• Rejoindre des groupes de discussion<br>• Créer des groupes personnalisés<br>• Publier dans les groupes<br>• Recevoir des notifications<br>• Configurer ses préférences de notifications<br>• Signaler du contenu inapproprié |
| **Modérateur** | • Toutes les actions de l'Utilisateur +<br>• Gérer les modérateurs d'un groupe personnalisé<br>• Supprimer des messages dans les groupes qu'il modère<br>• Supprimer un groupe personnalisé qu'il a créé |
| **Administrateur** | • Toutes les actions du Modérateur +<br>• Consulter tous les signalements<br>• Supprimer n'importe quel contenu (review, message)<br>• Suspendre temporairement un utilisateur<br>• Bannir définitivement un utilisateur |

---

## 2.5 Scénarios utilisateurs simples

### **Scénario 1 : Découverte et ajout d'un anime**

**Acteur** : Utilisateur (Marie, 22 ans, fan d'animes)

**Objectif** : Trouver un anime et l'ajouter à sa liste "À voir"

**Étapes** :
1. Marie ouvre l'application AnimeTracker
2. Elle se connecte avec son email et mot de passe
3. Elle utilise la barre de recherche et tape "Attack on Titan"
4. L'application affiche une liste de résultats
5. Marie clique sur "Attack on Titan" (Shingeki no Kyojin)
6. Elle consulte la fiche détaillée : synopsis, 75 épisodes, note 8.9/10
7. Elle clique sur le bouton "Ajouter à ma liste"
8. Elle sélectionne le statut "À voir"
9. L'anime est ajouté à sa bibliothèque
10. Elle reçoit une confirmation visuelle

**Résultat attendu** : L'anime apparaît dans l'onglet "À voir" de sa bibliothèque.

---

### **Scénario 2 : Suivi de progression et notation**

**Acteur** : Utilisateur (Thomas, 19 ans)

**Objectif** : Mettre à jour sa progression et noter un anime terminé

**Étapes** :
1. Thomas ouvre l'application
2. Il va dans l'onglet "Ma bibliothèque" → "En cours"
3. Il clique sur "One Piece"
4. Il met à jour sa progression : "850 épisodes vus / 1000"
5. Après avoir fini la série, il change le statut en "Terminé"
6. L'application lui propose de noter l'anime
7. Il donne une note de 9.5/10
8. Il écrit un commentaire : "Chef-d'œuvre absolu, personnages attachants"
9. Il choisit de rendre sa review publique
10. Il valide

**Résultat attendu** : L'anime passe dans "Terminés", sa note et review sont sauvegardées.

---

### **Scénario 3 : Interaction sociale**

**Acteur** : Utilisateur (Léa, 25 ans)

**Objectif** : Échanger avec d'autres fans d'un anime

**Étapes** :
1. Léa consulte la fiche de "Demon Slayer"
2. Elle voit un onglet "Groupe de discussion"
3. Elle clique sur le groupe officiel "Discussion - Demon Slayer"
4. Elle clique "Rejoindre le groupe"
5. Elle lit les derniers messages du groupe
6. Elle écrit : "Qui a préféré l'arc du district des plaisirs ?"
7. Elle publie son message
8. D'autres membres répondent à son message
9. Elle reçoit des notifications pour les réponses

**Résultat attendu** : Léa participe activement à la discussion avec la communauté.

---

# 3. CONCEPTION GÉNÉRALE DE L'APPLICATION

## 3.1 Architecture globale

AnimeTracker suit une **architecture client-serveur en couches**, garantissant une séparation claire des responsabilités, une maintenabilité optimale et une scalabilité future.

### **Schéma d'architecture globale**

```
┌─────────────────────────────────────────────────────────────┐
│                    UTILISATEURS MOBILES                      │
│                    (iOS / Android)                           │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│              COUCHE PRÉSENTATION (Mobile)                    │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │   Application React Native + Expo                 │      │
│  │   - Screens (Pages)                               │      │
│  │   - Components UI                                 │      │
│  │   - State Management (Redux)                      │      │
│  │   - Navigation                                    │      │
│  └──────────────────────────────────────────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              ↓ REST API (JSON)
┌─────────────────────────────────────────────────────────────┐
│                 COUCHE API / BACKEND                         │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │   API REST - Node.js + Express                   │      │
│  │   - Routes & Controllers                          │      │
│  │   - Middlewares (Auth JWT, Validation)           │      │
│  │   - Services Métier                               │      │
│  │   - Repositories (Accès données)                  │      │
│  └──────────────────────────────────────────────────┘      │
│                                                              │
│  ┌────────────────┐     ┌──────────────────┐              │
│  │  Authentification│     │  Notifications   │              │
│  │  JWT            │     │  Service         │              │
│  └────────────────┘     └──────────────────┘              │
│                                                              │
│  ┌────────────────────────────────────────┐                │
│  │   Scheduler (Cron Jobs)                 │                │
│  │   - Vérification nouveaux épisodes      │                │
│  │   - Nettoyage cache                     │                │
│  └────────────────────────────────────────┘                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                    ↓ SQL                  ↓ HTTP
┌──────────────────────────┐    ┌──────────────────────────┐
│  COUCHE DONNÉES          │    │  SERVICES EXTERNES       │
│                          │    │                          │
│  ┌────────────────┐     │    │  ┌────────────────┐     │
│  │  PostgreSQL    │     │    │  │  Jikan API v4  │     │
│  │  - 18 Tables   │     │    │  │  (MyAnimeList) │     │
│  │  - Triggers    │     │    │  └────────────────┘     │
│  │  - Contraintes │     │    │                          │
│  └────────────────┘     │    │  ┌────────────────┐     │
│                          │    │  │  Expo Push     │     │
│  ┌────────────────┐     │    │  │  Notifications │     │
│  │  ORM Sequelize │     │    │  └────────────────┘     │
│  └────────────────┘     │    │                          │
│                          │    │  ┌────────────────┐     │
│                          │    │  │  CDN Images    │     │
│                          │    │  │  (Cloudinary)  │     │
│                          │    │  └────────────────┘     │
└──────────────────────────┘    └──────────────────────────┘
```

**Voir** : [Diagramme d'architecture globale](conception/uml/architecture-globale.puml)

---

## 3.2 Découpage en couches

L'application suit le principe de **séparation des préoccupations** avec une architecture en **3 couches principales** :

### **COUCHE 1 : PRÉSENTATION (Client Mobile)**

**Rôle** : Interface utilisateur et expérience utilisateur

**Technologies** :
- React Native (framework mobile multiplateforme)
- Expo (toolchain pour build, push notifications, OTA updates)
- TypeScript (typage statique)
- Redux Toolkit (gestion d'état global)
- React Navigation (navigation entre écrans)
- Axios (client HTTP)

**Composants** :
```
Screens (Pages)
├── AuthScreen (Login/Register)
├── HomeScreen (Feed d'actualités)
├── AnimeListScreen (Ma bibliothèque)
├── AnimeDetailScreen (Fiche anime)
├── ProfileScreen (Profil utilisateur)
├── GroupScreen (Discussion groupe)
└── ConversationScreen (Messagerie)

Components Réutilisables
├── AnimeCard
├── ReviewCard
├── MessageBubble
└── NotificationBadge

State Management (Redux)
├── authSlice (authentification)
├── animesSlice (bibliothèque)
├── notificationsSlice (notifications)
└── messagesSlice (messagerie)

Services Client
├── apiClient (Axios configuré)
├── authService (gestion token JWT)
└── pushHandler (notifications push)
```

**Responsabilités** :
- Afficher les données à l'utilisateur
- Capturer les interactions (clics, saisies)
- Gérer la navigation entre écrans
- Stocker le token JWT en local (SecureStore)
- Gérer l'état de l'application (Redux)
- Envoyer des requêtes HTTP à l'API backend
- Recevoir et afficher les notifications push

---

### **COUCHE 2 : LOGIQUE MÉTIER (API Backend)**

**Rôle** : Traiter les requêtes, appliquer la logique métier, sécuriser les accès

**Technologies** :
- Node.js 18+ (runtime JavaScript serveur)
- Express.js (framework web)
- TypeScript
- Sequelize (ORM pour PostgreSQL)
- JWT (jsonwebtoken) pour authentification
- bcrypt (hachage mots de passe)
- Joi/Zod (validation des données)
- node-cron (tâches planifiées)

**Architecture interne** :
```
Routes & Controllers
├── AuthController (POST /auth/login, /auth/register)
├── UsersController (GET /users/:id, PUT /users/me)
├── AnimesController (GET /animes, GET /animes/:id)
├── ReviewsController (POST /reviews, DELETE /reviews/:id)
├── GroupsController (POST /groups, GET /groups/:id)
├── ConversationsController (GET /conversations, POST /messages)
└── NotificationsController (GET /notifications)

Middlewares
├── authMiddleware (vérifie JWT)
├── validationMiddleware (valide données entrantes)
├── errorHandler (gestion centralisée des erreurs)
└── rateLimiter (protection contre abus)

Services Métier
├── AuthService (login, register, verifyToken)
├── AnimeService (searchAnimes, syncWithJikan)
├── ReviewService (createReview, likeReview)
├── NotificationService (sendNotification, sendPush)
└── GroupService (createGroup, addMember)

Repositories (Data Access)
├── UserRepository
├── AnimeRepository
├── ReviewRepository
└── NotificationRepository
```

**Responsabilités** :
- Recevoir et router les requêtes HTTP
- Vérifier l'authentification (JWT) et les autorisations
- Valider les données entrantes (schémas Joi/Zod)
- Appliquer la logique métier (règles de gestion)
- Interroger la base de données via l'ORM
- Communiquer avec les API externes (Jikan API)
- Envoyer les notifications push (Expo Push)
- Gérer les erreurs et retourner les réponses HTTP

**Tâches planifiées (Cron Jobs)** :
- **Vérification nouveaux épisodes** : Quotidien à 8h
  - Récupère les animes en diffusion depuis Jikan API
  - Compare le nombre d'épisodes avec la BDD
  - Si nouveauté détectée → met à jour BDD + envoie notifications

---

### **COUCHE 3 : DONNÉES (Persistance)**

**Rôle** : Stocker et gérer les données de l'application

**Technologies** :
- PostgreSQL 15+ (base de données relationnelle)
- Sequelize (ORM - Object-Relational Mapping)

**Structure** :
```
Base de Données PostgreSQL
├── 18 Tables relationnelles
│   ├── user (utilisateurs)
│   ├── anime (cache animes Jikan)
│   ├── user_anime (bibliothèque)
│   ├── review (notes et commentaires)
│   ├── review_like (likes)
│   ├── follow (relations utilisateurs)
│   ├── conversation (messagerie)
│   ├── message (messages privés)
│   ├── group (groupes discussion)
│   ├── group_member (membres groupes)
│   ├── group_message (messages groupes)
│   ├── notification (notifications)
│   ├── notification_preferences (préférences)
│   ├── report (signalements)
│   ├── genre (genres animes)
│   ├── studio (studios production)
│   ├── anime_genre (relation n-n)
│   └── conversation_participant (participants conversations)
│
├── Triggers automatiques
│   ├── update_updated_at (mise à jour timestamps)
│   └── increment_review_likes (compteur likes)
│
├── Contraintes d'intégrité
│   ├── Clés primaires (UUID/SERIAL)
│   ├── Clés étrangères (CASCADE/SET NULL)
│   ├── Contraintes CHECK (validation données)
│   └── Contraintes UNIQUE (unicité)
│
└── Index de performance (30+)
    ├── Index sur clés étrangères
    ├── Index sur champs de recherche (title, pseudo, email)
    └── Index sur filtres fréquents (status, visibility, is_read)
```

**Voir** :
- [MCD - Modèle Conceptuel de Données](conception/mcd/MCD-AnimeTracker.md)
- [MLD - Modèle Logique de Données](conception/mcd/MLD-AnimeTracker.md)
- [MPD - Script SQL PostgreSQL](conception/mcd/MPD-AnimeTracker.sql)

**Responsabilités** :
- Stocker toutes les données de l'application
- Garantir l'intégrité des données (contraintes)
- Optimiser les requêtes (index)
- Assurer la cohérence (transactions)
- Gérer la persistance à long terme

---

## 3.3 Identification des responsabilités

### **Principe de responsabilité unique (SRP)**

Chaque couche et chaque composant a une **responsabilité unique et bien définie** :

| Couche / Composant | Responsabilité | Interactions |
|--------------------|----------------|--------------|
| **React Native App** | Affichage et interactions utilisateur | → API Backend (HTTP) |
| **Redux Store** | Gestion de l'état global de l'application | ← React Components |
| **API Client (Axios)** | Communication HTTP avec le backend | → API Backend |
| **Controllers** | Réception et routage des requêtes | → Services Métier |
| **Middlewares** | Authentification, validation, erreurs | ↔ Controllers |
| **Services Métier** | Logique métier et règles de gestion | → Repositories, API externes |
| **Repositories** | Accès aux données via ORM | → Base de données |
| **Sequelize Models** | Mapping objet-relationnel | → PostgreSQL |
| **PostgreSQL** | Persistance des données | - |
| **Jikan API** | Fournit les données des animes | ← AnimeService |
| **Expo Push** | Envoi des notifications push | ← NotificationService |

### **Flux de données type : "Ajouter un anime à ma liste"**

```
1. Utilisateur clique "Ajouter" dans l'app
   ↓
2. React Component appelle action Redux
   ↓
3. Redux dispatch → API Client (Axios)
   ↓
4. HTTP POST /users/me/animes {anime_id: 21, status: "A_VOIR"}
   ↓
5. Backend : authMiddleware vérifie JWT
   ↓
6. Backend : validationMiddleware valide les données
   ↓
7. Backend : AnimesController reçoit la requête
   ↓
8. Backend : AnimeService.addAnimeToLibrary()
   ↓
9. Backend : AnimeRepository.create(user_anime)
   ↓
10. Backend : Sequelize INSERT INTO user_anime
   ↓
11. PostgreSQL : Enregistrement créé
   ↓
12. Backend : Réponse 201 Created {user_anime}
   ↓
13. App : Redux met à jour le state
   ↓
14. App : React Component re-render avec nouvelle donnée
   ↓
15. Utilisateur voit l'anime dans sa liste "À voir"
```

---

## 3.4 Schéma d'architecture détaillée en couches

**Voir** : [Diagramme d'architecture détaillée](conception/uml/architecture-detaillee.puml)

Ce diagramme présente :
- Les 3 couches principales (Présentation, API, Données)
- Les composants de chaque couche
- Les flux de données entre composants
- Les services externes (Jikan API, Expo Push, CDN)
- Les tâches planifiées (Cron Jobs)

---

## 3.5 Architecture de déploiement (Production)

**Voir** : [Diagramme d'architecture de déploiement](conception/uml/architecture-deploiement.puml)

### **Infrastructure production**

```
Smartphones utilisateurs (iOS/Android)
            ↓ HTTPS
    Nginx (Reverse Proxy + SSL)
            ↓
    PM2 (Process Manager - 4 instances Node.js)
            ↓
    API Backend (Node.js + Express)
            ↓
    PostgreSQL (Managed Database)
            ↓
    Backups quotidiens
```

**Environnement serveur recommandé** :
- **Provider** : AWS EC2 / DigitalOcean / Heroku
- **OS** : Ubuntu 22.04 LTS
- **RAM** : 4-8 GB
- **CPU** : 2-4 vCores
- **Storage** : 50-100 GB SSD

**Base de données** :
- **Provider** : AWS RDS / DigitalOcean Managed DB / Supabase
- **Storage** : 20-50 GB
- **Backups** : Automatiques quotidiens

**Distribution mobile** :
- **Build** : Expo EAS Build
- **iOS** : TestFlight → App Store
- **Android** : Internal Testing → Google Play Store
- **OTA Updates** : Expo Updates (déploiement sans stores)

---

# 4. ANNEXES

## 4.1 Documents de conception complets

### **Diagrammes UML**
- Diagramme de cas d'utilisation
- Diagrammes de classes (4 diagrammes : principal, social, groupes, notifications)
- Diagrammes de séquence (6 scénarios : authentification, ajout anime, review, messagerie, groupes, notifications)
- Diagrammes d'architecture (3 diagrammes : globale, détaillée, déploiement)

**Localisation** : `conception/uml/`

### **Modélisation de la base de données**
- MCD (Modèle Conceptuel de Données)
- MLD (Modèle Logique de Données)
- MPD (Modèle Physique de Données - Script SQL PostgreSQL complet)
- Visuels MCD/MLD/MPD (diagrammes PlantUML)

**Localisation** : `conception/mcd/`

### **Documentation**
- User Stories complètes (43 user stories avec critères d'acceptation)
- Modèle de classes détaillé (16 classes avec attributs, méthodes, relations)
- Architecture technique (stack, flux de données, sécurité, performance)

**Localisation** : `documentation/`

---

## 4.2 Stack technique récapitulative

| Couche | Technologie | Version | Justification |
|--------|-------------|---------|---------------|
| **Mobile** | React Native | 0.73+ | Framework multiplateforme mature, grande communauté |
| | Expo | SDK 50+ | Simplifie build, push notifs, OTA updates |
| | TypeScript | 5.x | Typage statique, meilleure maintenabilité |
| **Backend** | Node.js | 18 LTS | Performance, écosystème npm riche |
| | Express.js | 4.x | Framework web léger et flexible |
| | Sequelize | 6.x | ORM robuste pour PostgreSQL |
| **Base de données** | PostgreSQL | 15+ | SGBD relationnel performant, open source |
| **API externe** | Jikan API v4 | - | API gratuite, données MyAnimeList complètes |
| **Notifications** | Expo Push | - | Intégration native avec Expo |
| **Infrastructure** | Nginx | - | Reverse proxy performant |
| | PM2 | - | Process manager Node.js avec clustering |

---

## 4.3 Sécurité et conformité

### **Mesures de sécurité**

| Aspect | Mesure | Implémentation |
|--------|--------|----------------|
| **Authentification** | JWT | Token signé HS256, expiration 7 jours |
| **Mots de passe** | Hachage bcrypt | Salt rounds: 10 |
| **Communications** | HTTPS | Certificat SSL/TLS obligatoire en prod |
| **Validation** | Joi/Zod | Validation schémas sur toutes routes |
| **SQL Injection** | ORM Sequelize | Requêtes paramétrées |
| **XSS** | Sanitization | Validation et nettoyage inputs |
| **Rate Limiting** | express-rate-limit | 100 req / 15 min par IP |
| **CORS** | cors middleware | Domaines autorisés uniquement |

### **RGPD**

- **Droit à l'information** : Politique de confidentialité accessible
- **Droit d'accès** : Consultation des données personnelles
- **Droit de rectification** : Modification du profil
- **Droit à l'oubli** : Suppression complète du compte (CASCADE en BDD)
- **Consentement** : Préférences de notifications opt-in
- **Portabilité** : Export des données (future amélioration)

---

## 4.4 Évolutions futures

### **Phase 2 (Post-MVP)**
- Messagerie en temps réel (WebSocket)
- Système de recommandations d'animes (algorithme ML)
- Partage de listes publiques
- Import/Export depuis MyAnimeList

### **Phase 3 (Long terme)**
- Application web (React)
- Mode hors ligne (cache local avancé)
- Traductions multilingues (i18n)
- Statistiques avancées (graphiques, analyses)
- Dark mode

---

# CONCLUSION

Ce dossier de conception présente une **approche méthodique et complète** pour le développement de l'application AnimeTracker.

## Points clés

✅ **Besoin clairement identifié** : Suivi personnalisé des visionnages d'animes avec dimension communautaire

✅ **Analyse fonctionnelle complète** : 43 user stories, diagrammes UML, scénarios utilisateurs

✅ **Architecture robuste** : Architecture en couches, séparation des responsabilités, scalabilité

✅ **Sécurité intégrée** : JWT, bcrypt, HTTPS, RGPD, validation des données

✅ **Base de données optimisée** : 18 tables normalisées (3FN), triggers, index de performance

✅ **Stack technique moderne** : React Native, Node.js, PostgreSQL, Expo

✅ **Approche itérative** : MVP prioritaire, fonctionnalités additionnelles en phases

Ce projet démontre la **maîtrise de la conception d'une application complète**, de l'analyse du besoin à l'architecture technique, en passant par la modélisation des données et la définition des interactions utilisateurs.

L'application est **prête à être développée** avec une conception solide, documentée et professionnelle.

