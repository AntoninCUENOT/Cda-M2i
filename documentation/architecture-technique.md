# Architecture Technique - AnimeTracker

## Vue d'ensemble

AnimeTracker est une application mobile React Native avec une architecture client-serveur moderne, suivant les principes de séparation des responsabilités et d'architecture en couches.

---

## Stack Technique

### **Frontend - Application Mobile**

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **React Native** | 0.73+ | Framework mobile multiplateforme |
| **Expo** | SDK 50+ | Toolchain et services (build, push, updates) |
| **TypeScript** | 5.x | Typage statique |
| **Redux Toolkit** | 2.x | Gestion d'état global |
| **React Navigation** | 6.x | Navigation entre écrans |
| **Axios** | 1.x | Client HTTP pour API |
| **Expo SecureStore** | - | Stockage sécurisé du token JWT |
| **React Hook Form** | 7.x | Gestion des formulaires |
| **NativeBase / Styled Components** | - | Composants UI et styling |

### **Backend - API REST**

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **Node.js** | 18 LTS+ | Runtime JavaScript serveur |
| **Express.js** | 4.x | Framework web |
| **TypeScript** | 5.x | Typage statique |
| **Sequelize** | 6.x | ORM pour PostgreSQL |
| **jsonwebtoken** | 9.x | Génération et vérification JWT |
| **bcrypt** | 5.x | Hachage des mots de passe |
| **Joi / Zod** | - | Validation des données |
| **node-cron** | 3.x | Tâches planifiées |
| **axios** | 1.x | Client HTTP pour Jikan API |
| **express-rate-limit** | 7.x | Protection contre les abus |

### **Base de Données**

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **PostgreSQL** | 15+ | Base de données relationnelle |

### **Services Externes**

| Service | Utilisation |
|---------|-------------|
| **Jikan API v4** | Catalogue d'animes (MyAnimeList) |
| **Expo Push Notifications** | Notifications push mobile |
| **Cloudinary / AWS S3** | Stockage d'images (photos profil) |

### **Infrastructure & DevOps**

| Technologie | Utilisation |
|-------------|-------------|
| **Nginx** | Reverse proxy, SSL/TLS |
| **PM2** | Process manager Node.js |
| **GitHub Actions** | CI/CD |
| **Sentry** | Error tracking |
| **Redis** (optionnel) | Cache API |

---

## Architecture en Couches

### **1. Couche Présentation (Mobile)**

```
┌─────────────────────────────────────┐
│       Screens (Pages)               │
│  - AuthScreen                       │
│  - HomeScreen                       │
│  - AnimeListScreen                  │
│  - AnimeDetailScreen                │
│  - ProfileScreen                    │
│  - GroupScreen                      │
│  - ConversationScreen               │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│    Components Réutilisables         │
│  - AnimeCard                        │
│  - ReviewCard                       │
│  - MessageBubble                    │
│  - NotificationBadge                │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│    State Management (Redux)         │
│  - authSlice                        │
│  - animesSlice                      │
│  - notificationsSlice               │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│    Services Client                  │
│  - API Client (Axios)               │
│  - Auth Service (JWT Storage)       │
│  - Push Notification Handler        │
└─────────────────────────────────────┘
```

**Responsabilités :**
- Affichage des données
- Gestion des interactions utilisateur
- Navigation entre écrans
- Gestion d'état local et global
- Communication avec l'API backend

---

### **2. Couche API (Backend)**

```
┌─────────────────────────────────────┐
│    Routes & Controllers             │
│  - AuthController                   │
│  - UsersController                  │
│  - AnimesController                 │
│  - ReviewsController                │
│  - GroupsController                 │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│        Middlewares                  │
│  - authMiddleware (JWT)             │
│  - validationMiddleware             │
│  - errorHandler                     │
│  - rateLimiter                      │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│    Services Métier                  │
│  - AuthService                      │
│  - AnimeService                     │
│  - ReviewService                    │
│  - NotificationService              │
│  - GroupService                     │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│    Repositories (Data Access)       │
│  - UserRepository                   │
│  - AnimeRepository                  │
│  - ReviewRepository                 │
└─────────────────────────────────────┘
```

**Responsabilités :**
- Réception et routage des requêtes HTTP
- Authentification et autorisation (JWT)
- Validation des données entrantes
- Logique métier
- Accès aux données (ORM Sequelize)
- Gestion des erreurs

---

### **3. Couche Données**

```
┌─────────────────────────────────────┐
│    ORM - Sequelize Models           │
│  - User Model                       │
│  - Anime Model                      │
│  - Review Model                     │
│  - Group Model                      │
│  - Message Model                    │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│    PostgreSQL Database              │
│  - 18 Tables                        │
│  - Triggers                         │
│  - Contraintes d'intégrité          │
│  - Index de performance             │
└─────────────────────────────────────┘
```

**Responsabilités :**
- Mapping objet-relationnel (ORM)
- Requêtes SQL optimisées
- Migrations de base de données
- Gestion des transactions

---

## Flux de Données Principaux

### **1. Authentification (JWT)**

```
Mobile App                API Backend              Database
    |                         |                        |
    |-- POST /auth/login ---->|                        |
    |    {email, password}    |                        |
    |                         |-- SELECT user -------->|
    |                         |<-- user data ----------|
    |                         |                        |
    |                         |-- bcrypt.compare ----->|
    |                         |                        |
    |<-- 200 OK --------------|                        |
    |    {token: "JWT...",    |                        |
    |     user: {...}}        |                        |
    |                         |                        |
    |-- Store JWT in ---------->                       |
    |   SecureStore           |                        |
```

**Token JWT contient :**
- `id_user` : UUID
- `role` : USER | MODERATEUR | ADMIN
- `exp` : Expiration (7 jours)

**Toutes les requêtes suivantes incluent :**
```
Authorization: Bearer <token_jwt>
```

---

### **2. Récupération d'animes (Cache intelligent)**

```
Mobile App         API Backend         Jikan API         Database
    |                   |                   |                 |
    |-- GET /animes/:id >|                  |                 |
    |                   |-- SELECT anime -->|                 |
    |                   |<-- anime or NULL -|                 |
    |                   |                   |                 |
    |                   |-- If NULL or old ->|                |
    |                   |                   |-- GET anime --> |
    |                   |<-- anime data ----|                 |
    |                   |                   |                 |
    |                   |-- INSERT/UPDATE -->                 |
    |<-- 200 OK --------|                   |                 |
    |    {anime}        |                   |                 |
```

**Stratégie de cache :**
- Anime en BDD + `last_fetched_at` < 7 jours → Retour direct
- Sinon → Fetch Jikan API + Update BDD

---

### **3. Notifications Push**

```
Backend           NotificationService     Expo Push API      Mobile App
    |                     |                      |                |
    |-- sendNotif() ----->|                      |                |
    |                     |-- Check prefs ------>|                |
    |                     |<-- enabled = true ---|                |
    |                     |                      |                |
    |                     |-- Save to DB ------->|                |
    |                     |                      |                |
    |                     |-- POST /push ------->|                |
    |                     |    {token, title,    |                |
    |                     |     body, data}      |                |
    |                     |                      |-- Push ------->|
    |                     |<-- 200 OK -----------|   Notification |
    |<-- OK --------------|                      |                |
```

**Types de notifications :**
1. **Nouveau follower** : Immédiat
2. **Nouvel épisode** : Quotidien (cron job 8h)
3. **Nouveau message** : Immédiat
4. **Réponse groupe** : Immédiat

---

### **4. Tâches Planifiées (Cron)**

```
Scheduler (node-cron)         API Backend           Jikan API        Database
        |                          |                     |                |
        |-- Every day 8:00 AM ---->|                     |                |
        |                          |-- Get animes ------>|                |
        |                          |   "Currently Airing"|                |
        |                          |<-- anime list ------|                |
        |                          |                     |                |
        |                          |-- For each anime -->|                |
        |                          |-- GET /anime/:id -->|                |
        |                          |<-- episodes count --|                |
        |                          |                     |                |
        |                          |-- Compare with DB ->|                |
        |                          |<-- old episodes ----|                |
        |                          |                     |                |
        |                          |-- If new episode -->|                |
        |                          |-- UPDATE anime ---->|                |
        |                          |-- CREATE notifs --->|                |
        |                          |   for users         |                |
```

---

## Sécurité

### **Authentification & Autorisation**

- **JWT** : Token signé avec secret (HS256)
- **Expiration** : 7 jours
- **Refresh token** : Optionnel (future amélioration)
- **HTTPS** : Obligatoire en production
- **Middleware** : Vérifie JWT sur routes protégées

### **Protection des Données**

- **Passwords** : Hachés avec bcrypt (salt rounds: 10)
- **SQL Injection** : Prévenu par Sequelize (requêtes paramétrées)
- **XSS** : Validation et sanitization des inputs
- **CORS** : Configuré pour accepter uniquement le domaine mobile
- **Rate Limiting** : 100 requêtes / 15 min par IP

### **RGPD**

- **Droit à l'oubli** : Suppression complète des données (CASCADE)
- **Consentement** : Préférences de notifications opt-in
- **Anonymisation** : Contenus publics anonymisés si suppression compte

---

## Performance & Scalabilité

### **Optimisations Backend**

1. **Index de base de données** : 30+ index sur clés étrangères et recherches
2. **Triggers SQL** : Mise à jour automatique de `updated_at` et `likes_count`
3. **Pagination** : Toutes les listes sont paginées (limit 20-50)
4. **Cache Redis** (optionnel) : Cache des réponses Jikan API (TTL: 24h)
5. **Clustering PM2** : 4 instances Node.js en mode cluster

### **Optimisations Mobile**

1. **Images** : Lazy loading + cache natif
2. **Listes** : FlatList avec pagination infinie
3. **State** : Redux avec memoization (reselect)
4. **Bundle** : Code splitting avec React.lazy
5. **OTA Updates** : Expo Updates pour déploiement rapide

### **Limitations**

| Ressource | Limite |
|-----------|--------|
| Taille image profil | 5 MB max |
| Longueur commentaire | 2000 caractères |
| Longueur message | 1000 caractères |
| Requêtes API | 100 / 15 min |
| Animes dans bibliothèque | Illimité |
| Groupes rejoints | Illimité |

---

## Déploiement

### **Environnements**

1. **Développement** : Local (localhost)
2. **Staging** : Serveur de test
3. **Production** : Serveur cloud

### **Infrastructure Production**

**Backend API :**
- **Provider** : AWS EC2 / DigitalOcean / Heroku
- **OS** : Ubuntu 22.04 LTS
- **Specs** : 4 GB RAM, 2 vCPU, 50 GB SSD
- **Process Manager** : PM2 (4 instances cluster)
- **Reverse Proxy** : Nginx (HTTPS, gzip, rate limiting)

**Base de données :**
- **Provider** : AWS RDS / DigitalOcean Managed DB / Supabase
- **Specs** : 20 GB Storage, Backups quotidiens
- **Réplication** : Replica en lecture (optionnel)

**Mobile App :**
- **Build** : Expo EAS Build
- **Distribution** : App Store (iOS) + Google Play (Android)
- **OTA Updates** : Expo Updates

---

## Monitoring & Logs

### **Outils**

- **Sentry** : Error tracking (backend + mobile)
- **DataDog / New Relic** : APM (Application Performance Monitoring)
- **PM2 Logs** : Logs applicatifs backend
- **PostgreSQL Logs** : Slow queries, erreurs
- **Nginx Logs** : Access logs, error logs

### **Métriques clés**

- Temps de réponse API (< 200ms objectif)
- Taux d'erreur (< 1%)
- Disponibilité (99.5% uptime)
- Nombre d'utilisateurs actifs
- Utilisation base de données

---

## CI/CD

### **Pipeline GitHub Actions**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]

jobs:
  test:
    - Lint (ESLint)
    - Tests unitaires (Jest)
    - Tests d'intégration

  build:
    - Build backend (TypeScript)
    - Build mobile (Expo)

  deploy:
    - Deploy backend sur serveur (SSH + PM2)
    - Publish mobile sur Expo (EAS Build)
```

---

## Évolutions Futures

### **Phase 2**

- Messagerie en temps réel (WebSocket / Socket.io)
- Système de recommandations d'animes (ML)
- Partage de listes publiques
- Import/Export MyAnimeList

### **Phase 3**

- Application web (React)
- Dark mode
- Traductions (i18n)
- Statistiques avancées (graphiques)

---

**Document créé le** : 19/01/2026
**Version** : 1.0
