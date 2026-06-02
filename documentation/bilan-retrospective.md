# Bilan et Rétrospective — AnimeTracker

**Projet** : AnimeTracker  
**Date** : Mai 2026  
**Version** : 1.0  

---

## Sommaire

1. [Présentation du projet](#1-présentation-du-projet)
2. [Ce qui a bien fonctionné](#2-ce-qui-a-bien-fonctionné)
3. [Difficultés rencontrées](#3-difficultés-rencontrées)
4. [Solutions apportées](#4-solutions-apportées)
5. [Axes d'amélioration](#5-axes-damélioration)
6. [Compétences acquises](#6-compétences-acquises)
7. [Conclusion](#7-conclusion)

---

## 1. Présentation du projet

AnimeTracker est une application mobile développée dans le cadre du titre professionnel **Concepteur Développeur d'Applications (CDA)**. Elle permet à des utilisateurs passionnés d'animés de gérer leur bibliothèque personnelle, d'interagir via des avis, une messagerie privée et des groupes de discussion par animé.

**Durée estimée du projet** : 4 à 6 semaines  
**Technologies utilisées** : React Native (Expo), Node.js/Express, PostgreSQL, Redis, Docker  
**Plateformes cibles** : Android (émulateur API 33 pendant le développement)

---

## 2. Ce qui a bien fonctionné

### 2.1 Architecture découplée front/back

Le choix de séparer l'application mobile (React Native) du backend (Node.js/Express) a facilité le développement indépendant des deux couches. L'API REST a pu évoluer sans contraindre le frontend, et inversement.

### 2.2 Redux Toolkit pour la gestion d'état

L'utilisation de Redux Toolkit avec `createAsyncThunk` a standardisé les appels API et la gestion des états de chargement (`isLoading`, `error`). Le découpage en slices par domaine métier (auth, library, reviews, social, groups, chat) a rendu la base de code claire et maintenable.

### 2.3 Docker pour l'environnement de développement

Dockeriser PostgreSQL et Redis a permis d'avoir un environnement reproductible en une seule commande (`docker-compose up`). Cela a évité les problèmes d'installation locale et permis de travailler avec des versions précises des services.

### 2.4 Authentification JWT + Redis

Le système d'authentification combinant JWT (court TTL) et Redis pour la blacklist de tokens offre un bon équilibre entre performance (pas de requête BDD à chaque vérification) et sécurité (déconnexion immédiate possible). Ce mécanisme fonctionne de façon fiable tout au long du projet.

### 2.5 Validation avec Zod

L'intégration de Zod pour la validation des données entrantes côté backend a permis de standardiser les messages d'erreur et de sécuriser toutes les routes sans code de validation répétitif. Les erreurs retournées au format `{errors: {field: [...]}}` sont directement exploitables par le frontend.

### 2.6 Tests Jest

Les 38 tests automatisés (unitaires + intégration) couvrent la couche critique de l'application : authentification, gestion des utilisateurs et routes HTTP. Ils constituent un filet de sécurité lors des modifications.

---

## 3. Difficultés rencontrées

### 3.1 Persistance de l'état Redux après redémarrage

**Problème** : Redux ne persiste pas entre les sessions. L'appartenance à un groupe de discussion était perdue au redémarrage de l'application — l'utilisateur voyait l'écran "Rejoindre le groupe" alors qu'il en était déjà membre.

**Impact** : Expérience utilisateur dégradée, données incohérentes entre frontend et backend.

### 3.2 Visibilité des avis privés

**Problème** : L'endpoint `GET /animes/:animeId/reviews` ne retourne que les avis publics (par conception, pour protéger la vie privée). Un utilisateur qui créait un avis privé le voyait disparaître dès qu'il naviguait vers un autre écran et revenait.

**Impact** : Confusion utilisateur, données semblant perdues alors qu'elles étaient bien en base.

### 3.3 Système de suivi (follow/unfollow)

**Problème** : Plusieurs sous-problèmes imbriqués :
- Le backend retournait `void` sur le follow, sans données utiles pour mettre à jour le store Redux
- `selectIsFollowing` consultait `state.social.following` (les personnes que l'utilisateur consulté suit) au lieu de `state.social.followers` (les abonnés de l'utilisateur consulté)
- La terminologie "abonné/abonnement" dans l'interface était ambiguë

**Impact** : Le bouton Follow/Unfollow ne reflétait pas l'état réel, bloquant une fonctionnalité clé.

### 3.4 Mapping snake_case / camelCase

**Problème** : PostgreSQL et Sequelize utilisent des conventions snake_case (`id_user`, `created_at`) tandis que le frontend JavaScript attend du camelCase (`userId`, `createdAt`). Ce décalage a causé plusieurs bugs subtils où des champs arrivaient `undefined` dans les composants.

**Impact** : Bugs difficiles à diagnostiquer, données manquantes en UI sans erreur explicite.

### 3.5 Tests Jest — isolation des modèles Sequelize

**Problème** : L'ajout de nouveaux modèles (Conversation, GroupMember, etc.) en cours de projet a cassé la suite de tests d'intégration. Ces modèles tentaient d'initialiser une vraie connexion Sequelize au moment de l'import, alors que la base de données était mockée.

**Impact** : Suite de tests passant de 38/38 à quelques échecs, bloquant la validation CI.

### 3.6 Encodage des fichiers de documentation

**Problème** : Les fichiers Markdown créés initialement avaient des problèmes d'encodage. Les caractères accentués français (é, è, ê, à, ç) étaient affichés comme des séquences corrompues. Plusieurs tentatives de correction par recréation des fichiers ont aggravé le problème (double-corruption UTF-8/Windows-1252).

**Impact** : Documentation illisible, nécessité d'un script de correction spécifique.

### 3.7 Communication réseau Android emulateur ↔ backend

**Problème** : Sur l'émulateur Android, `localhost` ne pointe pas vers la machine hôte mais vers le propre réseau virtuel de l'émulateur. Les appels API échouaient silencieusement.

**Impact** : L'application semblait non fonctionnelle en développement avant d'identifier la cause.

---

## 4. Solutions apportées

### 4.1 Vérification d'appartenance au démarrage (groupe)

Création d'un endpoint dédié `GET /groups/anime/:animeId` retournant `{ group, memberCount, isMember }`. Appelé au montage de `AnimeGroupScreen`, il restaure l'état d'appartenance depuis le backend au lieu de dépendre du store Redux. Le thunk `checkAnimeGroup` met à jour `joinedGroupIds` en conséquence.

### 4.2 Endpoint dédié pour l'avis personnel

Ajout de `GET /animes/:animeId/my-review` (authentifié) qui retourne l'avis de l'utilisateur connecté quelle que soit sa visibilité (public ou privé). Le thunk `loadMyReview` est appelé au chargement d'`AnimeDetailScreen` en parallèle de `loadReviewsForAnime`.

### 4.3 Correction du flux social

Trois corrections coordonnées :
1. Le backend retourne désormais les données complètes (`FollowData`) après un follow, permettant la mise à jour immédiate du store
2. `selectIsFollowing` vérifie `state.social.followers` (chargé sur le profil de l'utilisateur consulté)
3. Les libellés UI ont été clarifiés : "Abonnés" = personnes qui suivent l'utilisateur, "Abonnements" = personnes que l'utilisateur suit

### 4.4 Conventions de mapping explicites

Adoption d'une fonction `mapReview()` dans le slice Redux pour convertir systématiquement les champs snake_case du backend en camelCase côté frontend. Ce pattern a été appliqué à tous les nouveaux services : reviews, social, groups.

### 4.5 Isolation complète des modèles dans les tests

Ajout de `jest.mock()` pour chaque nouveau modèle Sequelize dans le fichier de setup des tests d'intégration. Cette pratique a été documentée pour être systématiquement appliquée lors de l'ajout de tout nouveau modèle.

### 4.6 Script de correction d'encodage

Développement d'un script PowerShell utilisant la formule de reversal double-encoding : lecture en Latin-1, ré-encodage en UTF-8, écriture. Cette approche a correctement restauré les 13 fichiers Markdown corrompus.

### 4.7 Adresse réseau émulateur Android

Configuration de l'URL de base de l'API à `http://10.0.2.2:3000` dans le fichier de configuration, documentée dans la documentation technique pour tout développeur rejoignant le projet.

---

## 5. Axes d'amélioration

### 5.1 Tests automatisés des fonctionnalités métier

Actuellement, la bibliothèque animés, la messagerie et les groupes sont uniquement couverts par des tests manuels. Des tests d'intégration supplémentaires pour ces routes augmenteraient la fiabilité et accéléreraient la détection de régressions.

### 5.2 Refresh automatique des tokens JWT

La gestion actuelle de l'expiration des tokens repose sur une déconnexion forcée. Implémenter un mécanisme de refresh token (avec un endpoint dédié et un `refreshToken` stocké de façon sécurisée) améliorerait l'expérience utilisateur en évitant les déconnexions inattendues.

### 5.3 Notifications en temps réel

La messagerie (privée et groupes) est actuellement en mode "pull" : les messages ne s'actualisent qu'au chargement de l'écran. Intégrer Socket.IO permettrait des mises à jour en temps réel, une expérience chat classique avec indicateur de frappe et notifications push.

### 5.4 Pagination des listes

Les endpoints retournent actuellement toutes les données disponibles. Pour des utilisateurs avec de nombreux animés ou messages, la pagination (`limit/offset` ou curseur) serait nécessaire pour maintenir les performances.

### 5.5 Upload d'avatar

Le profil utilisateur supporte un champ `avatar` (index de couleur) mais pas d'image réelle. Intégrer un upload S3/Cloudinary permettrait des avatars personnalisés.

### 5.6 Mode hors ligne

L'application est entièrement dépendante du réseau. Redux Persist + une stratégie de cache permettraient de consulter la bibliothèque et les avis hors ligne.

### 5.7 Tests E2E sur device réel

Les tests manuels ont été réalisés sur émulateur Android. Des tests sur device physique et sur iOS (via TestFlight) vérifieraient les comportements spécifiques à chaque plateforme (clavier, safe areas, performances).

---

## 6. Compétences acquises

### 6.1 Architecture full-stack mobile

Ce projet a permis de maîtriser la conception d'une application mobile complète : de la base de données relationnelle jusqu'à l'interface utilisateur, en passant par une API REST sécurisée. La cohérence entre ces couches (typage partagé, conventions de nommage) est un défi récurrent en développement professionnel.

### 6.2 Gestion d'état complexe avec Redux Toolkit

La gestion de l'état d'une application avec de multiples domaines interdépendants (auth, social, reviews...) a nécessité une compréhension approfondie des sélecteurs, des thunks asynchrones et des patterns d'optimisation (éviter les re-renders inutiles).

### 6.3 Sécurité applicative

L'implémentation de l'authentification JWT, du rate limiting, de la validation Zod et de la blacklist Redis a concrétisé les concepts de sécurité web dans un contexte réel. La compréhension des vecteurs d'attaque (injection, force brute, token replay) guide chaque choix de conception.

### 6.4 DevOps de base avec Docker

La conteneurisation de l'environnement de développement et la gestion des services (PostgreSQL, Redis) via docker-compose sont des compétences directement transférables en environnement professionnel.

### 6.5 Debugging méthodique

Les bugs complexes (social, encodage, encodage double) ont nécessité une approche de debugging par hypothèses successives : isoler, reproduire, identifier la cause racine, corriger, vérifier. Cette méthode est applicable à tout projet.

### 6.6 Documentation technique

La rédaction de documentation technique structurée (architecture, API, tests, bilan) est une compétence souvent sous-estimée mais indispensable pour la maintenabilité et la transmission du projet.

---

## 7. Conclusion

Le projet AnimeTracker a été développé avec succès en respectant le périmètre fonctionnel défini. Les 7 fonctionnalités principales (authentification, bibliothèque, avis, messagerie privée, groupes, social, profil) sont opérationnelles et testées.

Les difficultés rencontrées — notamment la persistance d'état, la gestion de la visibilité des données et les conventions de mapping — sont représentatives des challenges réels du développement full-stack mobile. Chaque problème a été résolu par une approche méthodique, souvent en ajoutant une couche d'API dédiée plutôt qu'en contournant les contraintes côté frontend.

Ce projet valide la capacité à concevoir, développer et tester une application mobile professionnelle de bout en bout, en maîtrisant l'ensemble de la chaîne technologique.

---

*Document rédigé dans le cadre du titre professionnel CDA — Mai 2026*
