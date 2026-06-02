# AnimeTracker — Backend API

API REST Node.js/Express/TypeScript pour l'application AnimeTracker.

## Stack technique

| Couche | Technologie |
|---|---|
| Runtime | Node.js 20 LTS |
| Framework | Express 4 |
| Langage | TypeScript 5 |
| Base de données | PostgreSQL 15 (Sequelize ORM) |
| Cache / Blacklist JWT | Redis 7 (ioredis) |
| Authentification | JWT (jsonwebtoken) + bcrypt |
| Validation | Zod |
| Sécurité HTTP | Helmet (CSP) + express-rate-limit + CORS |
| Tests | Jest + ts-jest + supertest |

## Prérequis

- Node.js ≥ 20
- Docker + Docker Compose (pour PostgreSQL et Redis)
- Fichier `.env` configuré (voir `.env.dev` comme modèle)

## Démarrage

```bash
# 1. Démarrer PostgreSQL + Redis
docker compose --profile dev up -d

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement (hot-reload)
npm run dev

# 4. Compiler pour la production
npm run build && npm start
```

## Variables d'environnement

| Variable | Description | Exemple |
|---|---|---|
| `NODE_ENV` | Environnement d'exécution | `development` |
| `PORT` | Port d'écoute du serveur | `3001` |
| `POSTGRES_HOST` | Hôte PostgreSQL | `localhost` |
| `POSTGRES_PORT` | Port PostgreSQL | `5432` |
| `POSTGRES_DB` | Nom de la base | `animetracker_dev` |
| `POSTGRES_USER` | Utilisateur PostgreSQL | `animetracker_user` |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL | *(secret)* |
| `REDIS_HOST` | Hôte Redis | `localhost` |
| `REDIS_PORT` | Port Redis | `6379` |
| `JWT_SECRET` | Clé de signature JWT (≥ 32 caractères) | *(secret)* |
| `JWT_EXPIRES_IN` | Durée de validité des tokens | `7d` |
| `JIKAN_API_URL` | URL base de l'API Jikan | `https://api.jikan.moe/v4` |

## Architecture

```
backend/
├── src/
│   ├── config/         # Connexions DB, Redis, validation env (Zod)
│   ├── controllers/    # Handlers Express (lecture req → appel service → réponse)
│   ├── middlewares/    # authenticate, errorHandler, sanitize, notFound
│   ├── models/         # Modèles Sequelize (User, Anime, UserAnime, Review, Follow)
│   ├── routes/         # Définition des routes Express
│   ├── schemas/        # Schémas Zod (validation des corps de requête)
│   ├── services/       # Logique métier pure (auth, user, anime, review...)
│   ├── types/          # Types TypeScript partagés
│   ├── utils/          # asyncHandler wrapper
│   ├── app.ts          # Instance Express (middlewares globaux)
│   └── server.ts       # Point d'entrée : connexions + écoute
└── tests/
    ├── unit/           # Tests unitaires (services mockés)
    ├── integration/    # Tests d'intégration HTTP (supertest)
    └── setup.ts        # Variables d'environnement pour Jest
```

## Référence API

### Authentification

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Inscription (email, password, pseudo) |
| `POST` | `/api/auth/login` | — | Connexion → JWT |
| `POST` | `/api/auth/logout` | JWT | Révocation du token (blacklist Redis) |
| `GET` | `/api/auth/me` | JWT | Retourne userId et role du token |

> Les routes `/register` et `/login` sont limitées à **10 requêtes / 15 min** par IP (rate limiting).

### Profil utilisateur

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users/me` | JWT | Profil de l'utilisateur connecté |
| `PATCH` | `/api/users/me` | JWT | Mise à jour pseudo / bio / photo |
| `PATCH` | `/api/users/me/password` | JWT | Changement de mot de passe |
| `DELETE` | `/api/users/me` | JWT | Suppression du compte (RGPD Art. 17) |
| `GET` | `/api/users/me/data` | JWT | Export des données personnelles (RGPD Art. 20) |
| `GET` | `/api/users/:userId` | — | Profil public |
| `GET` | `/api/users/:userId/followers` | — | Liste des abonnés |
| `GET` | `/api/users/:userId/following` | — | Liste des abonnements |
| `POST` | `/api/users/:userId/follow` | JWT | S'abonner à un profil |
| `DELETE` | `/api/users/:userId/follow` | JWT | Se désabonner |

### Watchlist

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users/me/animes` | JWT | Watchlist de l'utilisateur |
| `POST` | `/api/users/me/animes` | JWT | Ajouter un anime |
| `PATCH` | `/api/users/me/animes/:animeId` | JWT | Mettre à jour le statut / progression |
| `DELETE` | `/api/users/me/animes/:animeId` | JWT | Retirer un anime |
| `GET` | `/api/users/me/stats` | JWT | Statistiques de visionnage |

### Animes (Jikan API)

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/animes/search?q=&page=` | — | Recherche (synchronisée en BDD) |
| `GET` | `/api/animes/top?page=` | — | Top animes |
| `GET` | `/api/animes/:id` | — | Détail d'un anime (cache 24h) |

### Reviews

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/animes/:animeId/reviews` | — | Reviews d'un anime |
| `POST` | `/api/animes/:animeId/reviews` | JWT | Créer / modifier sa review |
| `DELETE` | `/api/animes/:animeId/reviews` | JWT | Supprimer sa review |
| `POST` | `/api/users/me/reviews/:reviewId/like` | JWT | Liker / unliker une review |
| `DELETE` | `/api/users/me/reviews/:reviewId` | JWT | Supprimer sa review |

### Santé

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Retourne `{ status: "ok", timestamp }` |

## Format de réponse

Toutes les réponses suivent l'enveloppe standardisée :

```json
// Succès
{ "success": true, "data": { ... } }

// Erreur métier
{ "success": false, "message": "Description de l'erreur" }

// Erreur de validation Zod
{ "success": false, "errors": { "body.field": "message" } }
```

## Sécurité

- **Helmet** : Content-Security-Policy stricte (defaultSrc 'self', objectSrc 'none', frameAncestors 'none'), HSTS avec preload
- **CORS** : restreint à l'origine du frontend
- **Rate limiting** : 10 req/15min sur les routes d'authentification
- **JWT blacklist** : les tokens révoqués sont stockés dans Redis avec TTL automatique
- **Sanitisation** : toutes les chaînes du body sont débarrassées des balises HTML avant traitement
- **Validation** : tous les corps de requête sont validés par Zod avant d'atteindre les contrôleurs
- **RGPD** : droit à l'effacement (Art. 17) et droit à la portabilité (Art. 20) implémentés

## Tests

```bash
# Lancer les tests avec couverture
npm test

# Mode watch (développement)
npm run test:watch
```

Couverture actuelle : **≥ 85 %** statements sur les services et middlewares testés.

Les tests sont organisés en deux niveaux :

- **Unitaires** (`tests/unit/`) : services isolés via mocks Jest — aucune dépendance externe
- **Intégration** (`tests/integration/`) : routes HTTP via supertest — modèles Sequelize mockés en factory pour éviter l'initialisation de la base

## Lint

```bash
npm run lint        # Vérification
npm run lint:fix    # Correction automatique
```
