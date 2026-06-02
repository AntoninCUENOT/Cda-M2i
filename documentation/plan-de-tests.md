# Plan de tests — AnimeTracker

**Projet** : AnimeTracker  
**Date** : Mai 2026  
**Version** : 1.0  

---

## Sommaire

1. [Stratégie de tests](#1-stratégie-de-tests)
2. [Tests automatisés (Jest)](#2-tests-automatisés-jest)
3. [Plan de tests manuels](#3-plan-de-tests-manuels)
4. [Résultats des tests](#4-résultats-des-tests)
5. [Couverture fonctionnelle](#5-couverture-fonctionnelle)

---

## 1. Stratégie de tests

L'application AnimeTracker est testée sur deux niveaux complémentaires :

| Niveau | Outil | Objectif |
|--------|-------|----------|
| **Tests unitaires** | Jest + mocks | Valider la logique métier de chaque service isolément |
| **Tests d'intégration** | Jest + Supertest | Valider les routes HTTP complètes (requête → réponse) |
| **Tests manuels** | Émulateur Android | Valider le comportement réel de l'application mobile |

**Environnement de test :**
- Émulateur Android (Android Studio) — API level 33
- Backend Node.js/Express en local (port 3000)
- Base de données PostgreSQL (Docker, port 5433)
- Redis (Docker, port 6380)

---

## 2. Tests automatisés (Jest)

### 2.1 Configuration

```json
// backend/jest.config.js
{
  "preset": "ts-jest",
  "testEnvironment": "node",
  "testMatch": ["**/tests/**/*.test.ts"]
}
```

Tous les modèles Sequelize, la base de données et Redis sont mockés — aucune connexion réelle n'est établie pendant les tests automatisés.

### 2.2 Tests unitaires — `authService.test.ts`

| # | Cas de test | Résultat attendu | Résultat obtenu |
|---|-------------|-----------------|-----------------|
| 1 | Inscription avec données valides | Token JWT + objet user retournés | ✅ PASS |
| 2 | Inscription avec email déjà existant | AppError 409 "Email déjà utilisé" | ✅ PASS |
| 3 | Inscription avec pseudo déjà existant | AppError 409 "Pseudo déjà utilisé" | ✅ PASS |
| 4 | Connexion avec identifiants corrects | Token JWT + objet user retournés | ✅ PASS |
| 5 | Connexion avec email inexistant | AppError 401 "Identifiants incorrects" | ✅ PASS |
| 6 | Connexion avec mauvais mot de passe | AppError 401 "Identifiants incorrects" | ✅ PASS |
| 7 | Déconnexion — ajout token en blacklist | Token ajouté dans Redis avec TTL | ✅ PASS |
| 8 | Vérification token blacklisté | AppError 401 "Session expirée" | ✅ PASS |
| 9 | Vérification token valide | Payload JWT retourné | ✅ PASS |
| 10 | Vérification token malformé | AppError 401 | ✅ PASS |
| 11 | Mot de passe haché avec bcrypt | Le hash ≠ mot de passe clair | ✅ PASS |
| 12 | Comparaison bcrypt — bon mot de passe | Retourne true | ✅ PASS |
| 13 | Comparaison bcrypt — mauvais mot de passe | Retourne false | ✅ PASS |
| 14 | Token JWT expiré | AppError 401 | ✅ PASS |
| 15 | Payload JWT contient userId et role | Champs présents dans le token | ✅ PASS |

### 2.3 Tests unitaires — `userService.test.ts`

| # | Cas de test | Résultat attendu | Résultat obtenu |
|---|-------------|-----------------|-----------------|
| 1 | Récupérer profil utilisateur existant | Objet user sans champ password | ✅ PASS |
| 2 | Récupérer profil utilisateur inexistant | AppError 404 | ✅ PASS |
| 3 | Mettre à jour pseudo avec valeur valide | Pseudo mis à jour en BDD | ✅ PASS |
| 4 | Mettre à jour avec pseudo déjà pris | AppError 409 | ✅ PASS |
| 5 | Changer mot de passe — ancien correct | Nouveau hash sauvegardé | ✅ PASS |
| 6 | Changer mot de passe — ancien incorrect | AppError 401 | ✅ PASS |
| 7 | Suivre un utilisateur (follow) | Relation créée en BDD | ✅ PASS |
| 8 | Suivre un utilisateur déjà suivi | AppError 409 | ✅ PASS |
| 9 | Se suivre soi-même | AppError 400 | ✅ PASS |
| 10 | Se désabonner d'un utilisateur suivi | Relation supprimée | ✅ PASS |
| 11 | Se désabonner d'un utilisateur non suivi | AppError 404 | ✅ PASS |
| 12 | Rechercher des utilisateurs | Liste filtrée retournée | ✅ PASS |

### 2.4 Tests d'intégration — `auth.test.ts`

| # | Route | Cas de test | Code HTTP attendu | Résultat obtenu |
|---|-------|-------------|-------------------|-----------------|
| 1 | POST /auth/register | Inscription valide | 201 | ✅ PASS |
| 2 | POST /auth/register | Email manquant | 400 | ✅ PASS |
| 3 | POST /auth/register | Mot de passe trop court | 400 | ✅ PASS |
| 4 | POST /auth/register | Email déjà utilisé | 409 | ✅ PASS |
| 5 | POST /auth/login | Connexion valide | 200 | ✅ PASS |
| 6 | POST /auth/login | Mauvais mot de passe | 401 | ✅ PASS |
| 7 | POST /auth/login | Utilisateur inexistant | 401 | ✅ PASS |
| 8 | POST /auth/logout | Déconnexion avec token valide | 200 | ✅ PASS |
| 9 | POST /auth/logout | Sans token | 401 | ✅ PASS |
| 10 | GET /api/health | Endpoint de santé | 200 | ✅ PASS |
| 11 | Route inconnue | 404 Not Found | 404 | ✅ PASS |

### 2.5 Résumé Jest

```
Test Suites : 3 passed, 3 total
Tests       : 38 passed, 38 total (0 failed)
Snapshots   : 0
Durée       : ~4 secondes
```

---

## 3. Plan de tests manuels

### 3.1 Authentification

| # | Action | Données de test | Résultat attendu | Résultat obtenu |
|---|--------|-----------------|-----------------|-----------------|
| M-01 | Inscription avec données valides | email: `test@test.fr`, pwd: `Test1234!`, pseudo: `TestUser` | Compte créé, redirection vers Home | ✅ OK |
| M-02 | Inscription avec email invalide | email: `pasunemail` | Message d'erreur sous le champ | ✅ OK |
| M-03 | Inscription avec pseudo trop court | pseudo: `ab` | Message d'erreur affiché | ✅ OK |
| M-04 | Inscription avec email déjà pris | email existant | Toast "Email déjà utilisé" | ✅ OK |
| M-05 | Connexion avec identifiants corrects | email + pwd valides | Connexion réussie, profil chargé | ✅ OK |
| M-06 | Connexion avec mauvais mot de passe | bon email, mauvais pwd | Toast "Identifiants incorrects" | ✅ OK |
| M-07 | Déconnexion | — | Retour écran Login, token invalidé | ✅ OK |

### 3.2 Bibliothèque personnelle

| # | Action | Résultat attendu | Résultat obtenu |
|---|--------|-----------------|-----------------|
| M-08 | Rechercher un animé | Liste de résultats affichée | ✅ OK |
| M-09 | Ouvrir la page détail d'un animé | Informations Jikan affichées (titre, synopsis, note...) | ✅ OK |
| M-10 | Ajouter un animé à la bibliothèque | Animé ajouté avec statut choisi, persisté en BDD | ✅ OK |
| M-11 | Modifier le statut d'un animé | Statut mis à jour en BDD | ✅ OK |
| M-12 | Incrémenter l'épisode courant | Compteur mis à jour, persisté | ✅ OK |
| M-13 | Marquer un animé en favori | Étoile active, persisté | ✅ OK |
| M-14 | Supprimer un animé de la bibliothèque | Animé retiré, confirmé en BDD | ✅ OK |
| M-15 | Consulter la bibliothèque après reconnexion | Données toujours présentes | ✅ OK |

### 3.3 Avis (Reviews)

| # | Action | Résultat attendu | Résultat obtenu |
|---|--------|-----------------|-----------------|
| M-16 | Créer un avis public | Avis sauvegardé en BDD, visible par les autres | ✅ OK |
| M-17 | Créer un avis privé | Avis sauvegardé en BDD, non visible par les autres | ✅ OK |
| M-18 | Modifier un avis existant | Mise à jour en BDD | ✅ OK |
| M-19 | Supprimer un avis | Avis retiré de la BDD | ✅ OK |
| M-20 | Voir les avis d'un autre utilisateur | Seuls les avis publics visibles | ✅ OK |
| M-21 | Liker un avis | Compteur likes incrémenté | ✅ OK |
| M-22 | Revenir sur la page après redémarrage | Avis toujours visible (chargé depuis BDD) | ✅ OK |

### 3.4 Messagerie privée

| # | Action | Résultat attendu | Résultat obtenu |
|---|--------|-----------------|-----------------|
| M-23 | Rechercher un utilisateur pour écrire | Résultats filtrés (min 2 caractères) | ✅ OK |
| M-24 | Démarrer une conversation | Conversation créée en BDD | ✅ OK |
| M-25 | Envoyer un message | Message sauvegardé en BDD, affiché immédiatement | ✅ OK |
| M-26 | Voir les messages d'une conversation existante | Historique chargé depuis BDD | ✅ OK |
| M-27 | Supprimer une conversation | Conversation retirée de la liste | ✅ OK |
| M-28 | Accéder au profil depuis le chat | Navigation vers UserProfileScreen | ✅ OK |

### 3.5 Groupes de discussion

| # | Action | Résultat attendu | Résultat obtenu |
|---|--------|-----------------|-----------------|
| M-29 | Rejoindre un groupe d'animé | Groupe créé si inexistant, membre ajouté en BDD | ✅ OK |
| M-30 | Envoyer un message dans le groupe | Message sauvegardé, affiché immédiatement | ✅ OK |
| M-31 | Revenir sur le groupe après redémarrage | Appartenance vérifiée depuis BDD, chat affiché | ✅ OK |
| M-32 | Quitter un groupe | Membre retiré de la BDD | ✅ OK |

### 3.6 Social (abonnements)

| # | Action | Résultat attendu | Résultat obtenu |
|---|--------|-----------------|-----------------|
| M-33 | Accéder au profil d'un autre utilisateur | Profil public affiché | ✅ OK |
| M-34 | S'abonner à un utilisateur | Relation créée en BDD, bouton change en "Ne plus suivre" | ✅ OK |
| M-35 | Se désabonner | Relation supprimée en BDD | ✅ OK |
| M-36 | Voir la liste des abonnés | Liste chargée depuis BDD | ✅ OK |
| M-37 | Voir la liste des abonnements | Liste chargée depuis BDD | ✅ OK |

### 3.7 Profil utilisateur

| # | Action | Résultat attendu | Résultat obtenu |
|---|--------|-----------------|-----------------|
| M-38 | Modifier le pseudo | Pseudo mis à jour en BDD et affiché | ✅ OK |
| M-39 | Modifier la bio | Bio mise à jour en BDD | ✅ OK |
| M-40 | Changer le mot de passe | Nouveau mot de passe fonctionnel | ✅ OK |
| M-41 | Voir les statistiques de visionnage | Temps total calculé, animés comptés | ✅ OK |

---

## 4. Résultats des tests

### 4.1 Tests automatisés

| Suite | Tests | Passés | Échoués | Taux de succès |
|-------|-------|--------|---------|----------------|
| authService.test.ts | 15 | 15 | 0 | **100%** |
| userService.test.ts | 12 | 12 | 0 | **100%** |
| auth.test.ts | 11 | 11 | 0 | **100%** |
| **Total** | **38** | **38** | **0** | **100%** |

### 4.2 Tests manuels

| Domaine | Tests | Passés | Bloquants | Taux de succès |
|---------|-------|--------|-----------|----------------|
| Authentification | 7 | 7 | 0 | **100%** |
| Bibliothèque | 8 | 8 | 0 | **100%** |
| Avis | 7 | 7 | 0 | **100%** |
| Messagerie | 6 | 6 | 0 | **100%** |
| Groupes | 4 | 4 | 0 | **100%** |
| Social | 5 | 5 | 0 | **100%** |
| Profil | 4 | 4 | 0 | **100%** |
| **Total** | **41** | **41** | **0** | **100%** |

---

## 5. Couverture fonctionnelle

| Fonctionnalité | Testée automatiquement | Testée manuellement | Couverture |
|----------------|----------------------|--------------------| -----------|
| Inscription / Connexion | ✅ | ✅ | Complète |
| Gestion de profil | ✅ (partiel) | ✅ | Complète |
| Bibliothèque animés | ❌ | ✅ | Manuelle |
| Avis (reviews) | ❌ | ✅ | Manuelle |
| Messagerie privée | ❌ | ✅ | Manuelle |
| Groupes de discussion | ❌ | ✅ | Manuelle |
| Social (follow) | ✅ (partiel) | ✅ | Complète |
| Sécurité JWT | ✅ | ✅ | Complète |
| Validation données (Zod) | ✅ | ✅ | Complète |
| Rate limiting | ✅ | ✅ | Complète |

> Les tests automatisés couvrent principalement la couche service (logique métier) et les routes d'authentification. Les fonctionnalités métier complexes (bibliothèque, messagerie, groupes) sont validées par tests manuels sur émulateur Android.
