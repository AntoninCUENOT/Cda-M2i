# CLAUDE.md — AnimeTracker

Projet CDA d'Antonin CUENOT. Application mobile full-stack de suivi d'animés.

---

## Contexte projet

- **Candidat** : Antonin CUENOT
- **Formation** : CDA (Concepteur Développeur d'Applications) — titre RNCP niveau 6
- **Parcours** : DWWM obtenu en 2024, enchaîne avec le CDA
- **Objectif du projet** : Première application mobile (le DWWM était un site web)
- **État** : Application fonctionnelle, testée sur émulateur Android

---

## Stack

- **Frontend** : React Native + Expo + TypeScript + Redux Toolkit + React Navigation + Axios
- **Backend** : Node.js + Express + TypeScript + Sequelize + Zod + JWT + bcrypt
- **BDD** : PostgreSQL 15 (Docker, port **5433**)
- **Cache** : Redis 7 (Docker, port **6380**)
- **Tests** : Jest + Supertest (38 tests, 100% pass)

---

## Lancer le projet

```bash
# 1. Infrastructure
cd AnimeTracker && docker compose up -d

# 2. Backend (dans un terminal séparé)
cd AnimeTracker/backend && npm install && npm run dev

# 3. Frontend (dans un autre terminal)
cd AnimeTracker && npm install && npx expo start
```

Après modification du backend : `docker restart animetracker_backend`  
(nodemon ne détecte pas les changements sur Windows depuis Docker)

---

## Architecture

### Frontend — `AnimeTracker/src/`

```
screens/auth/       → LoginScreen, RegisterScreen
screens/main/       → HomeScreen, SearchScreen, AnimeDetailScreen,
                       LibraryScreen, ChatScreen, MessagesScreen,
                       AnimeGroupScreen, ProfileScreen, UserProfileScreen,
                       SettingsScreen, EditProfileScreen, NewMessageScreen
store/slices/       → authSlice, librarySlice, reviewsSlice, socialSlice,
                       groupsSlice, messagingSlice, animeSlice, settingsSlice
services/           → apiClient.ts (Axios + intercepteurs JWT)
                       jikanApi.ts (API externe MyAnimeList)
contexts/           → ThemeContext.tsx (thème clair/sombre)
navigation/         → index.tsx (AuthStack + MainStack + TabBar)
                       types.ts (MainStackParamList typé)
types/index.ts      → Interfaces TypeScript partagées
utils/constants.ts  → Spacing, FontSize, BorderRadius, StorageKeys
```

### Backend — `AnimeTracker/backend/src/`

```
app.ts              → Config Express, middlewares globaux
server.ts           → Point d'entrée, connexion BDD + Redis
config/             → database.ts, redis.ts, env.ts
models/             → User, UserAnime, Review, Follow, Conversation,
                       ConversationParticipant, Message, Group,
                       GroupMember, GroupMessage + associations.ts
routes/             → auth.ts, users.ts, animes.ts, messages.ts, groups.ts, index.ts
controllers/        → authController, userController, userAnimeController,
                       reviewController, animeController, messageController, groupController
services/           → authService, userService, userAnimeService, reviewService,
                       animeService, jikanService, messageService, groupService
middlewares/        → authenticate.ts (JWT + Redis blacklist), errorHandler.ts
schemas/            → auth.ts, user.ts, review.ts, userAnime.ts (validation Zod)
utils/asyncHandler.ts → Wrapper async pour Express 4
```

---

## Conventions importantes

- **snake_case** en base de données (`id_user`, `created_at`)
- **camelCase** dans le code TypeScript (`userId`, `createdAt`)
- Toujours mapper BDD → frontend dans les services avec une fonction `mapXxx()`
- Les `.env` réels ne sont JAMAIS committés — utiliser `.env.dev` comme template
- Pattern Controllers / Services strict : le controller ne fait que du HTTP, le service fait la logique métier

---

## Règles métier clés

- Les avis (`review`) sont **privés par défaut** — visibility: 'PRIVE'
- 1 seul avis par (utilisateur, animé) — UPSERT côté service
- Un groupe officiel par animé — créé automatiquement, ne peut pas être supprimé
- On ne peut pas se suivre soi-même — contrainte CHECK en SQL ET validation service
- Token JWT blacklisté dans Redis à la déconnexion (TTL = durée restante du token)
- Port PostgreSQL : **5433** (pas 5432)
- URL API depuis émulateur Android : `http://10.0.2.2:3000/api`

---

## Endpoints API (43 routes — préfixe /api)

| Groupe | Routes |
|--------|--------|
| Auth | POST /auth/register, /auth/login, /auth/logout · GET /auth/me |
| Users | GET/PATCH/DELETE /users/me · /me/password · /me/animes · /me/stats · /me/data |
| Users | GET/POST/DELETE /:userId/follow · GET /:userId/followers · /:userId/following |
| Animes | GET /animes/search · /animes/top · /animes/:id |
| Reviews | GET/POST/DELETE /animes/:id/reviews · GET /animes/:id/my-review |
| Reviews | DELETE /users/me/reviews/:id · POST /users/me/reviews/:id/like |
| Conversations | GET / · POST /with/:recipientId · GET/POST /:id/messages · PATCH /:id/read · DELETE /:id |
| Groups | GET/POST /groups/anime/:animeId · GET /:id · POST /:id/join · DELETE /:id/leave · GET/POST /:id/messages |

---

## Tests

```bash
cd AnimeTracker/backend
npm test
# authService.test.ts  → 15 tests unitaires
# userService.test.ts  → 12 tests unitaires
# auth.test.ts         → 11 tests d'intégration
# Total : 38/38 PASS
```

Tous les modèles Sequelize, la BDD et Redis sont mockés — aucune connexion réelle pendant les tests.

---

## Fichiers de documentation

```
documentation/
├── dossier-cda-animetracker.docx    ← Dossier CDA complet (à remettre)
├── fiche-revision-soutenance.docx   ← Fiche de révision pour la soutenance
├── explication-technique.md
├── architecture-technique.md
├── plan-de-tests.md
└── bilan-retrospective.md

scripts-docx/
├── generate-dossier.mjs    ← Regénère le dossier CDA DOCX
├── generate-revision.mjs   ← Regénère la fiche de révision
├── generate-diagrams.mjs   ← Regénère les diagrammes UML (PlantUML API)
└── generate-mockups.mjs    ← Regénère les maquettes SVG/PNG
```

Pour regénérer le dossier DOCX :
```bash
cd scripts-docx && npm install && node generate-dossier.mjs
```

---

## CI/CD à mettre en place (GitHub Actions)

Quand l'utilisateur demande de mettre en place le CI/CD, créer ces deux fichiers et commiter :

### `.github/workflows/ci.yml`
```yaml
name: CI — AnimeTracker

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Lint + Type check + Tests Jest
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: AnimeTracker/backend/package-lock.json
      - name: Install
        run: cd AnimeTracker/backend && npm ci
      - name: Lint
        run: cd AnimeTracker/backend && npm run lint
      - name: Type check
        run: cd AnimeTracker/backend && npx tsc --noEmit
      - name: Tests Jest
        run: cd AnimeTracker/backend && npm test
        env:
          NODE_ENV: test
          JWT_SECRET: test_secret_for_ci_minimum_32_chars_ok
          POSTGRES_HOST: localhost
          POSTGRES_PORT: 5432
          POSTGRES_DB: animetracker
          POSTGRES_USER: animetracker_user
          POSTGRES_PASSWORD: animetracker_dev_password
          REDIS_HOST: localhost
          REDIS_PORT: 6379
          JIKAN_API_URL: https://api.jikan.moe/v4
```

**Note :** Les 38 tests mockent entièrement BDD et Redis — aucun service externe requis en CI.

### Badge à ajouter en haut du `README.md`
```markdown
[![CI](https://github.com/AntoninCUENOT/Cda-M2i/actions/workflows/ci.yml/badge.svg)](https://github.com/AntoninCUENOT/Cda-M2i/actions/workflows/ci.yml)
```

---

## Historique des bugs résolus (utile pour le contexte)

| Problème | Cause | Solution |
|----------|-------|----------|
| Avis privé disparaît après navigation | GET /reviews ne retourne que les publics | Endpoint dédié GET /animes/:id/my-review |
| Follow button toujours désactivé | selectIsFollowing lisait le mauvais slice | Vérification dans state.social.followers |
| Appartenance groupe perdue au restart | Redux éphémère | checkAnimeGroup au montage → GET /groups/anime/:id |
| Tests Jest échouent après nouveaux modèles | Sequelize init au import sans mock | jest.mock() pour chaque nouveau modèle |
| Hot-reload mort sur Windows + Docker | inotify non transmis par Docker Desktop | Backend lancé en local (npm run dev) |
