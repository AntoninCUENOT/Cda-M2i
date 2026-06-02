# AnimeTracker — Explication technique complète

---

## Table des matières

1. [Vue d'ensemble de l'application](#1-vue-densemble-de-lapplication)
2. [Choix de la stack technique](#2-choix-de-la-stack-technique)
3. [Architecture Frontend](#3-architecture-frontend)
   - 3.1 Structure des dossiers
   - 3.2 Navigation (React Navigation)
   - 3.3 Gestion d'état global (Redux Toolkit)
   - 3.4 Client HTTP (Axios / apiClient)
   - 3.5 API externe Jikan (MyAnimeList)
4. [Architecture Backend](#4-architecture-backend)
   - 4.1 Structure des dossiers
   - 4.2 Pattern Controllers / Services
   - 4.3 Middleware d'authentification
   - 4.4 Validation des données (Zod)
   - 4.5 Gestion d'erreurs centralisée
   - 4.6 asyncHandler
5. [Base de données — Schéma](#5-base-de-données--schéma)
   - 5.1 Tables et relations
   - 5.2 Pourquoi des UUID ?
6. [Authentification JWT](#6-authentification-jwt)
7. [Infrastructure Docker](#7-infrastructure-docker)
8. [Tests Jest](#8-tests-jest)

---

## 1. Vue d'ensemble de l'application

AnimeTracker est une **application mobile multiplateforme** (Android / iOS) permettant à ses utilisateurs de :

- **Suivre les animés** qu'ils regardent via une bibliothèque personnelle (statut, épisode courant, note personnelle)
- **Rédiger et consulter des avis** (publics ou privés) sur chaque animé
- **Communiquer en messagerie privée** avec d'autres membres
- **Rejoindre des groupes de discussion** propres à chaque animé
- **Suivre d'autres utilisateurs** via un système social (abonnés / abonnements)

Les données des animés proviennent de l'API publique **Jikan** (interface officieuse de MyAnimeList), tandis que toutes les données utilisateur (bibliothèque, avis, messages, groupes) sont stockées dans une base de données PostgreSQL gérée par le backend.

---

## 2. Choix de la stack technique

### Frontend : React Native + Expo + TypeScript

**React Native** est un framework open-source développé par Meta qui permet d'écrire **une seule base de code TypeScript** compilée en composants natifs Android ET iOS. Cela évite de maintenir deux projets séparés (Swift pour iOS, Kotlin pour Android), divisant ainsi le temps de développement par deux pour un rendu natif (contrairement à des solutions WebView comme Cordova/Ionic).

**Expo** est une surcouche à React Native qui apporte :
- Un **bundler préconfiguré** (Metro) sans avoir besoin d'Android Studio ou Xcode pour les tests
- Des **bibliothèques natives packagées** (`expo-linear-gradient`, `expo-font`, `expo-image-picker`...)
- L'application **Expo Go** pour tester directement sur un téléphone physique via QR code

**TypeScript** est préféré à JavaScript pur pour :
- La **détection d'erreurs à la compilation** plutôt qu'au runtime (ex : passer un `string` là où un `number` est attendu)
- L'**autocomplétion** dans l'éditeur (VSCode)
- La **lisibilité** : les types servent de documentation vivante du code

### Backend : Node.js + Express + TypeScript

**Node.js** est choisi pour plusieurs raisons :
- **Même langage que le frontend** (TypeScript) : une seule compétence couvre les deux parties du projet
- **Modèle event loop non-bloquant** : idéal pour les APIs REST à forte I/O (requêtes BDD, appels réseau) car le serveur ne bloque pas en attendant une réponse
- **Écosystème npm** très riche avec des bibliothèques matures

**Express** est le framework HTTP Node.js le plus minimaliste et flexible. Il gère le routage, les middlewares et la réponse HTTP. Il a été préféré à :
- **NestJS** : trop verbeux et structuré pour un projet de cette taille
- **Fastify** : moins de ressources pédagogiques, courbe d'apprentissage plus haute

### Base de données : PostgreSQL

PostgreSQL a été choisi plutôt que MongoDB ou MySQL parce que :
- **Modèle relationnel** : les données ont des relations claires et définies (un utilisateur possède plusieurs animés, un animé peut avoir plusieurs avis, un avis peut avoir plusieurs likes...)
- **UUID natif** : génération d'identifiants uniques non-prédictibles via `uuid_generate_v4()`
- **Types ENUM natifs** : les valeurs comme `'PUBLIC'/'PRIVE'` ou `'EN_COURS'/'TERMINE'` sont contraintes directement au niveau de la base, garantissant l'intégrité des données
- **Transactions ACID** : cohérence et fiabilité des données garanties même en cas de panne
- **Contraintes CHECK** : ex. `id_follower ≠ id_following` empêche de se suivre soi-même au niveau BDD

MongoDB aurait mal convenu car le schéma est bien défini, les jointures sont nombreuses et fréquentes, et la flexibilité des documents n'apporte pas de valeur ici.

### ORM : Sequelize

Sequelize permet d'écrire les requêtes en TypeScript plutôt qu'en SQL brut :

```typescript
// Avec Sequelize — typé et lisible
await Review.findAll({
  where: { id_anime: animeId, visibility: 'PUBLIC' },
  include: [{ model: User, as: 'author', attributes: ['pseudo', 'photo'] }],
  order: [['likes_count', 'DESC']],
});

// Équivalent SQL brut
// SELECT review.*, user.pseudo, user.photo
// FROM review
// JOIN user ON user.id_user = review.id_user
// WHERE review.id_anime = ? AND review.visibility = 'PUBLIC'
// ORDER BY review.likes_count DESC;
```

Avantages : protection automatique contre l'injection SQL (paramètres préparés), modèles typés avec InferAttributes, migrations versionnées.

### Cache : Redis

Redis est une base de données **en mémoire** (clé/valeur) utilisée ici exclusivement pour la **liste noire de tokens JWT**. Quand un utilisateur se déconnecte, son token est stocké dans Redis avec une TTL (durée de vie) égale à la durée restante avant expiration du token. Toute requête ultérieure avec ce token sera rejetée immédiatement.

Redis est préféré à la BDD PostgreSQL pour cet usage car les opérations de lecture/écriture sont **10 à 100x plus rapides** en mémoire, et cette vérification est effectuée à chaque requête authentifiée.

### Infrastructure : Docker

Docker isole chaque service dans un conteneur indépendant :

| Conteneur | Image | Rôle |
|---|---|---|
| `animetracker_postgres` | `postgres:15` | Base de données relationnelle |
| `animetracker_redis` | `redis:7` | Cache / liste noire JWT |
| `animetracker_backend` | Node.js custom | API REST Express |

**Avantages :**
- **Reproductibilité** : même environnement sur tous les postes de développement (fini le "ça marche sur ma machine")
- **Isolation** : chaque service a ses propres ressources, ports et variables d'environnement
- **Déploiement simplifié** : un `docker-compose up` lance toute l'infrastructure

**Point d'attention rencontré :** Docker Desktop sur Windows ne transmet pas les événements de modification de fichiers au système de fichiers Linux du conteneur. Nodemon (rechargement automatique) ne détectait donc pas les changements de code. Solution : redémarrer manuellement le conteneur backend après chaque modification (`docker restart animetracker_backend`).

### Tests : Jest

Jest est le framework de test JavaScript/TypeScript le plus répandu. Il offre :
- **Tests unitaires** : isolation complète via les mocks, tests rapides sans BDD réelle
- **Tests d'intégration** : simulation de requêtes HTTP complètes avec supertest
- **Couverture de code** : rapport indiquant le pourcentage de code testé

---

## 3. Architecture Frontend

### 3.1 Structure des dossiers

```
src/
├── navigation/
│   ├── index.tsx       → Définition de toutes les routes et leur stack
│   └── types.ts        → Types TypeScript des paramètres de chaque route
├── screens/
│   ├── auth/           → LoginScreen, RegisterScreen
│   └── main/           → HomeScreen, AnimeDetailScreen, ChatScreen...
├── store/
│   ├── index.ts        → Configuration du store Redux
│   └── slices/         → Un fichier par domaine métier
├── services/
│   ├── apiClient.ts    → Instance Axios configurée
│   └── jikanApi.ts     → Appels à l'API externe MyAnimeList
├── contexts/
│   ├── ThemeContext.tsx       → Thème clair/sombre
│   └── NotificationContext.tsx → Notifications in-app
├── components/         → Composants réutilisables (Button, Loading...)
├── types/
│   └── index.ts        → Interfaces TypeScript partagées (User, Review, Anime...)
└── utils/
    ├── constants.ts    → Espacements, tailles de police, BorderRadius, StorageKeys...
    └── colors.ts       → Palette de couleurs de l'application
```

### 3.2 Navigation (React Navigation)

React Navigation gère la navigation entre les écrans. L'architecture est en deux niveaux :

**Niveau 1 — Auth Stack** : écrans accessibles sans connexion
```
AuthStack
├── Login
└── Register
```

**Niveau 2 — Main Stack** : écrans accessibles après connexion, avec une Tab Bar en bas
```
MainStack (Tab Bar)
├── Tab: Home
├── Tab: Search
├── Tab: Library
├── Tab: Messages
└── Tab: Profile
    └── (Stack) AnimeDetail
        └── (Stack) AnimeGroup
    └── (Stack) Chat
    └── (Stack) UserProfile
    ...
```

Chaque route est **typée** via `MainStackParamList` :

```typescript
// navigation/types.ts
export type MainStackParamList = {
  Home: undefined;                          // pas de paramètres
  AnimeDetail: { animeId: number };         // obligatoire : un ID animé
  Chat: {                                   // obligatoire : infos du destinataire
    recipientId: string;
    recipientPseudo: string;
    recipientAvatar: number | string | null;
  };
  UserProfile: {
    userId: string;
    userPseudo: string;
    userAvatar: number | string | null;
  };
  AnimeGroup: { animeId: number; animeTitle: string };
};
```

**Pourquoi typer les routes ?** TypeScript vérifie à la compilation que tous les paramètres obligatoires sont bien passés lors d'un `navigation.navigate('Chat', { ... })`. Une erreur de paramètre est détectée avant même de lancer l'app.

### 3.3 Gestion d'état global (Redux Toolkit)

Redux centralise l'état de l'application dans un **store unique**. Chaque slice gère un domaine métier précis.

**Pourquoi Redux et pas le Context React seul ?**
- Le Context provoque des re-rendus en cascade sur tous les composants abonnés
- Redux optimise les re-rendus : un composant ne se re-rend que si les données qu'il sélectionne changent
- Redux DevTools permet d'inspecter et rejouer chaque action (débogage puissant)

**Structure d'un slice — exemple `reviewsSlice.ts` :**

```typescript
// 1. Définition de l'état
interface ReviewsState {
  reviews: Review[];   // tableau de tous les avis chargés
  isLoading: boolean;
  error: string | null;
}

// 2. AsyncThunk : appel API asynchrone
// createAsyncThunk gère automatiquement les états pending/fulfilled/rejected
export const createReview = createAsyncThunk(
  'reviews/create',          // nom de l'action
  async (reviewData, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(
        `/animes/${reviewData.animeId}/reviews`,
        {
          rating: reviewData.rating,
          comment: reviewData.content,
          visibility: reviewData.isPublic ? 'PUBLIC' : 'PRIVE',
        }
      );
      return mapReview(data.data, reviewData); // transforme le format BDD → format frontend
    } catch (err) {
      return rejectWithValue(err.message); // erreur propre transmise au composant
    }
  }
);

// 3. Reducers : comment le state change selon le résultat de l'action
extraReducers: builder => {
  builder
    .addCase(createReview.fulfilled, (state, action) => {
      // Upsert : si l'avis existe déjà (mise à jour), on le remplace
      const idx = state.reviews.findIndex(
        r => r.userId === action.payload.userId && r.animeId === action.payload.animeId
      );
      if (idx !== -1) state.reviews[idx] = action.payload;
      else state.reviews.push(action.payload);
    });
}

// 4. Selectors : fonctions de lecture de l'état
// Utilisées dans les composants via useAppSelector
export const selectPublicReviewsForAnime = (animeId: number) =>
  (state: { reviews: ReviewsState }) =>
    state.reviews.reviews
      .filter(r => r.animeId === animeId && r.isPublic)
      .sort((a, b) => b.likesCount - a.likesCount);
```

**Utilisation dans un composant :**

```typescript
// Dans AnimeDetailScreen.tsx
const dispatch = useAppDispatch();
const publicReviews = useAppSelector(selectPublicReviewsForAnime(animeId));

// Appel API → mise à jour automatique du store → re-rendu du composant
const handleSaveReview = async () => {
  await dispatch(createReview({ animeId, rating, content, isPublic }));
};
```

### 3.4 Client HTTP (Axios / apiClient)

```typescript
// services/apiClient.ts

// Instance Axios avec URL de base et timeout
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // ex: http://10.0.2.2:3000/api
  timeout: 10000, // 10 secondes max par requête
});

// Intercepteur de REQUÊTE
// S'exécute avant chaque appel API — ajoute automatiquement le token JWT
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de RÉPONSE
// S'exécute après chaque réponse — normalise les erreurs en messages lisibles
apiClient.interceptors.response.use(
  response => response, // succès : on laisse passer
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    const data = error.response?.data;
    // Priorité : message direct > erreurs Zod (format {field: [messages]}) > erreur réseau
    const message =
      data?.message ??
      (data?.errors ? Object.values(data.errors).flat()[0] : null) ??
      (error.code === 'ECONNABORTED' ? 'Délai de connexion dépassé' : 'Erreur réseau');
    return Promise.reject(new Error(message));
  }
);
```

**Pourquoi des intercepteurs ?**
Sans intercepteur, chaque appel API devrait manuellement récupérer le token et formater les erreurs. Les intercepteurs appliquent ce comportement **une seule fois pour tous les appels**.

**Note sur l'URL en émulateur Android :** L'émulateur Android ne peut pas accéder à `localhost` de la machine hôte. Il faut utiliser `10.0.2.2` qui est l'alias Android pour `127.0.0.1` de l'hôte.

### 3.5 API externe Jikan (MyAnimeList)

Les métadonnées des animés (titre, synopsis, note, genres, studios...) proviennent de **Jikan v4**, une API REST publique et gratuite qui expose la base de données MyAnimeList.

```typescript
// services/jikanApi.ts
const JIKAN_BASE = 'https://api.jikan.moe/v4';

// Recherche d'animés par titre
export const searchAnimes = (query: string, page = 1) =>
  axios.get(`${JIKAN_BASE}/anime`, {
    params: { q: query, page, limit: 20, sfw: true }
  });

// Détail d'un animé par son ID MyAnimeList
export const getAnimeById = (id: number) =>
  axios.get(`${JIKAN_BASE}/anime/${id}`);

// Top animés (par score)
export const getTopAnimes = (page = 1) =>
  axios.get(`${JIKAN_BASE}/top/anime`, { params: { page, limit: 25 } });
```

Ces appels sont effectués **directement depuis le frontend** sans passer par notre backend car Jikan est une API publique sans authentification — ajouter un intermédiaire backend serait de la complexité inutile. Le backend n'intervient que pour les données propres à notre application (bibliothèque, avis, messages...).

---

## 4. Architecture Backend

### 4.1 Structure des dossiers

```
backend/src/
├── app.ts              → Configuration Express : middlewares globaux, montage des routes
├── server.ts           → Point d'entrée : connexion BDD + Redis, puis démarrage HTTP
├── config/
│   ├── database.ts     → Instance Sequelize, connexion PostgreSQL
│   └── redis.ts        → Instance Redis, connexion
├── models/             → Modèles Sequelize (une classe = une table)
│   ├── User.ts
│   ├── UserAnime.ts
│   ├── Review.ts
│   ├── Follow.ts
│   ├── Conversation.ts
│   ├── ConversationParticipant.ts
│   ├── Message.ts
│   ├── Group.ts
│   ├── GroupMember.ts
│   ├── GroupMessage.ts
│   └── associations.ts → Définit les relations entre modèles (hasMany, belongsTo...)
├── routes/             → Définit les endpoints HTTP et les middlewares par route
│   ├── auth.ts         → /auth/register, /auth/login, /auth/logout
│   ├── users.ts        → /users/me, /users/:id, follow, unfollow...
│   ├── animes.ts       → /animes/search, /animes/:id, reviews...
│   ├── messages.ts     → /conversations, /conversations/:id/messages...
│   └── groups.ts       → /groups/anime/:id, /groups/:id/messages...
├── controllers/        → Reçoivent req/res, extraient les paramètres, appellent le service
├── services/           → Logique métier pure : requêtes BDD, règles de gestion
├── middlewares/
│   ├── authenticate.ts → Vérifie le JWT et popule req.user
│   └── errorHandler.ts → Handler d'erreur centralisé (dernier middleware)
├── schemas/            → Schémas de validation Zod (forme des données entrantes)
└── utils/
    └── asyncHandler.ts → Wrapper pour capturer les erreurs async/await
```

### 4.2 Pattern Controllers / Services

Ce pattern sépare les responsabilités en deux couches distinctes :

**Controller** = gestion HTTP uniquement
- Extrait les paramètres de `req.params`, `req.body`, `req.query`
- Appelle le service approprié
- Formate et renvoie la réponse HTTP

**Service** = logique métier pure
- Requêtes base de données via Sequelize
- Règles de gestion (ex : vérifier qu'un avis n'existe pas déjà avant création)
- Ne connaît pas HTTP (pas de req/res)
- **Testable indépendamment** : les tests unitaires testent le service sans simuler HTTP

```typescript
// controllers/reviewController.ts
// RÔLE : gérer le HTTP, déléguer au service
export async function upsertReviewController(req, res, next) {
  // 1. Valider et typer les données entrantes
  const { body, params } = upsertReviewSchema.parse({
    body: req.body,
    params: req.params
  });
  const animeId = parseInt(params.animeId, 10);

  // 2. Appeler le service (logique métier)
  const review = await upsertReview(req.user.userId, animeId, body);

  // 3. Retourner la réponse HTTP
  res.status(201).json({ success: true, data: review });
}

// services/reviewService.ts
// RÔLE : logique métier, requêtes BDD
export async function upsertReview(userId, animeId, data) {
  // Règle : un utilisateur ne peut avoir qu'un seul avis par animé (upsert)
  const existing = await Review.findOne({
    where: { id_user: userId, id_anime: animeId }
  });

  if (existing) {
    // Mise à jour si l'avis existe déjà
    await existing.update({ ...data, updated_at: new Date() });
    return existing;
  }

  // Création sinon
  return Review.create({
    id_user: userId,
    id_anime: animeId,
    rating: data.rating,
    comment: data.comment,
    visibility: data.visibility ?? 'PRIVE', // privé par défaut
  });
}
```

### 4.3 Middleware d'authentification

```typescript
// middlewares/authenticate.ts
export async function authenticate(req, res, next) {
  // 1. Extraire le token du header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Token manquant');
  }
  const token = authHeader.replace('Bearer ', '');

  // 2. Vérifier si le token a été révoqué (déconnexion)
  // Redis est consulté : si la clé "blacklist:{token}" existe → token invalide
  const isBlacklisted = await redis.exists(`blacklist:${token}`);
  if (isBlacklisted) throw new AppError(401, 'Session expirée, reconnectez-vous');

  // 3. Vérifier la signature JWT et la date d'expiration
  const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

  // 4. Injecter l'identité dans la requête pour les controllers
  // Tous les controllers authentifiés peuvent accéder à req.user.userId
  (req as AuthenticatedRequest).user = {
    userId: payload.userId,
    role: payload.role,
  };

  next(); // passer au controller suivant
}
```

Ce middleware est appliqué sélectivement sur les routes qui nécessitent une authentification :

```typescript
// routes/users.ts
// Route publique (pas d'authenticate)
router.get('/:userId', asyncHandler(getProfileController));

// Route protégée (authenticate en middleware)
router.patch('/me', asyncHandler(authenticate), asyncHandler(updateProfileController));
router.post('/:userId/follow', asyncHandler(authenticate), asyncHandler(followController));
```

### 4.4 Validation des données (Zod)

Zod valide la forme des données reçues **avant** qu'elles n'atteignent la base de données :

```typescript
// schemas/review.ts
export const upsertReviewSchema = z.object({
  body: z.object({
    // rating doit être un nombre entre 0 et 10, multiple de 0.5
    rating: z
      .number()
      .min(0)
      .max(10)
      .refine(v => (v * 2) % 1 === 0, 'La note doit être un multiple de 0.5'),
    // commentaire optionnel, max 2000 caractères
    comment: z.string().max(2000).optional(),
    // visibilité optionnelle, seulement ces deux valeurs acceptées
    visibility: z.enum(['PUBLIC', 'PRIVE']).optional(),
  }),
  params: z.object({
    animeId: z.string(), // l'ID vient de l'URL comme string, sera parsé en int après
  }),
});
```

**Pourquoi Zod ?**
- Si un client envoie `rating: "abc"`, Zod renvoie une erreur 400 claire **avant** que Sequelize n'essaie d'insérer en BDD
- Les erreurs Zod sont structurées (`{ field: ["message d'erreur"] }`) → facilement affichables dans le frontend
- Les types inférés automatiquement (`z.infer<typeof schema>`) servent dans le controller

### 4.5 Gestion d'erreurs centralisée

```typescript
// middlewares/errorHandler.ts

// Classe d'erreur personnalisée avec code HTTP
export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

// Handler global — dernier middleware Express
export function errorHandler(err, req, res, next) {
  // Erreur applicative connue (404, 403, 409...)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Erreur de validation Zod (données invalides)
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      errors: formatZodErrors(err), // { field: ["message"] }
    });
  }

  // Erreur inattendue (bug, panne BDD...)
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur interne',
  });
}
```

Toutes les erreurs sont propagées via `next(err)` jusqu'à ce handler. Les controllers n'ont **jamais** à gérer le format de la réponse d'erreur eux-mêmes — c'est centralisé ici.

### 4.6 asyncHandler

```typescript
// utils/asyncHandler.ts
export const asyncHandler = (fn) => (req, res, next) => {
  // Encapsule la fonction async et capture toute promesse rejetée
  // pour la transmettre à next() → errorHandler
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

Express 4 ne gère pas nativement les erreurs dans les fonctions `async`. Sans ce wrapper, une exception dans un controller async ferait crasher le serveur sans envoyer de réponse au client. Ce pattern est si courant qu'Express 5 l'intègre nativement.

**Utilisation :**
```typescript
// Chaque controller est wrappé par asyncHandler
router.post('/anime/:animeId', asyncHandler(authenticate), asyncHandler(getOrCreateGroupController));
// Si getOrCreateGroupController throw une erreur → next(err) → errorHandler → réponse 4xx/5xx
```

---

## 5. Base de données — Schéma

### 5.1 Tables et relations

#### Table `user`
Stocke les informations des comptes utilisateurs.

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id_user` | UUID | PK, NOT NULL | Identifiant unique |
| `email` | VARCHAR | UNIQUE, NOT NULL | Email de connexion |
| `pseudo` | VARCHAR | UNIQUE, NOT NULL | Nom d'affichage (3-20 chars, alphanumérique) |
| `password` | VARCHAR | NOT NULL | Hash bcrypt du mot de passe |
| `photo` | INTEGER | NULL | Index d'avatar (0-7, couleurs prédéfinies) |
| `bio` | TEXT | NULL | Description du profil |
| `role` | ENUM | NOT NULL | `USER`, `MODERATEUR`, ou `ADMIN` |
| `is_active` | BOOLEAN | DEFAULT true | Compte actif |
| `is_suspended` | BOOLEAN | DEFAULT false | Compte suspendu |
| `created_at` | TIMESTAMP | NOT NULL | Date de création |

#### Table `user_anime` (bibliothèque personnelle)
Relation entre un utilisateur et un animé de sa bibliothèque.

| Colonne | Type | Description |
|---|---|---|
| `id_user_anime` | UUID PK | Identifiant |
| `id_user` | UUID FK | Référence vers `user` |
| `id_anime` | INTEGER | ID MyAnimeList (pas de FK car données externes) |
| `status` | ENUM | `A_VOIR`, `EN_COURS`, `TERMINE`, `ABANDONNE` |
| `current_episode` | INTEGER | Épisode actuel |
| `total_episodes` | INTEGER NULL | Total (peut être inconnu) |
| `personal_rating` | DECIMAL(3,1) NULL | Note personnelle (0-10, pas 0.5) |
| `personal_note` | TEXT NULL | Note privée texte libre |
| `is_favorite` | BOOLEAN | Marquer comme favori |

Contrainte : `UNIQUE(id_user, id_anime)` → un animé ne peut apparaître qu'une fois dans la bibliothèque.

#### Table `review` (avis)

| Colonne | Type | Description |
|---|---|---|
| `id_review` | UUID PK | Identifiant |
| `id_user` | UUID FK | Auteur de l'avis |
| `id_anime` | INTEGER | Animé concerné |
| `rating` | DECIMAL(3,1) | Note (0-10, multiple de 0.5) |
| `comment` | TEXT NULL | Texte de l'avis |
| `visibility` | ENUM | `PUBLIC` (visible par tous) ou `PRIVE` |
| `likes_count` | INTEGER | Compteur dénormalisé de likes |

Contrainte : `UNIQUE(id_user, id_anime)` → un utilisateur ne peut avoir qu'un seul avis par animé.

#### Table `review_like`
Stocke les likes sur les avis (relation many-to-many).

Contrainte : `UNIQUE(id_review, id_user)` → impossible de liker deux fois le même avis.
Contrainte : impossible de liker son propre avis (vérifiée au niveau service).

#### Table `follow` (abonnements sociaux)

| Colonne | Type | Description |
|---|---|---|
| `id_follow` | UUID PK | Identifiant |
| `id_follower` | UUID FK | L'utilisateur qui s'abonne |
| `id_following` | UUID FK | L'utilisateur suivi |

Contraintes :
- `UNIQUE(id_follower, id_following)` → on ne peut pas s'abonner deux fois
- `CHECK(id_follower ≠ id_following)` → impossible de se suivre soi-même

#### Tables de messagerie privée

**`conversation`** : représente une conversation (conteneur).

**`conversation_participant`** : lie un utilisateur à une conversation.
- `unread_count` : nombre de messages non lus (mis à jour à chaque nouveau message)
- `last_read_at` : date de dernière lecture

**`message`** : un message dans une conversation.
- `id_sender` : expéditeur
- `content` : texte du message
- `is_deleted` : suppression logique (le message reste en BDD, juste masqué)

Ce modèle à 3 tables permet d'étendre facilement les conversations à plus de 2 participants (groupes privés futurs).

#### Tables de groupes de discussion

**`group`** : un groupe de discussion lié à un animé.
- `type` : `OFFICIEL` (créé automatiquement à la demande) ou `PRIVE`
- `id_anime` : l'animé associé
- `is_public` : visibilité du groupe

**`group_member`** : lie un utilisateur à un groupe.

**`group_message`** : un message dans un groupe.
- `deleted_at` : suppression logique avec timestamp
- `id_deleted_by` : qui a supprimé le message (modération future)

### 5.2 Pourquoi des UUID ?

Les UUID (Universally Unique Identifier) sont utilisés comme clés primaires plutôt que des entiers auto-incrémentés (`SERIAL`) pour plusieurs raisons :

1. **Sécurité** : `GET /users/1`, `/users/2`, `/users/3` → un attaquant peut énumérer tous les utilisateurs. Avec des UUID (`/users/f6342c9f-d064-45a0-9eed-691b26f859f1`), c'est impossible.

2. **Non-prédictibilité** : même si un ID est exposé, on ne peut pas deviner les autres.

3. **Distribution future** : si l'application doit un jour utiliser plusieurs serveurs de base de données, les UUID ne créent pas de conflits contrairement aux séquences SQL.

4. **Génération côté base** : `defaultValue: DataTypes.UUIDV4` dans Sequelize → la BDD génère l'UUID, pas l'application.

---

## 6. Authentification JWT

### Flux complet

```
INSCRIPTION
Client → POST /auth/register { email, password, pseudo }
  ↓ Validation Zod (format email, password min 8 chars, pseudo alphanumérique...)
  ↓ Vérification unicité email + pseudo
  ↓ bcrypt.hash(password, 10) → hash sécurisé
  ↓ INSERT INTO user ...
  ↓ jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' })
  ↓ Réponse { user: {...}, token: "eyJ..." }

CONNEXION
Client → POST /auth/login { email, password }
  ↓ SELECT * FROM user WHERE email = ?
  ↓ bcrypt.compare(password, user.password) → vérifie le hash
  ↓ jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' })
  ↓ Réponse { user: {...}, token: "eyJ..." }

REQUÊTE PROTÉGÉE
Client → GET /users/me  Header: "Authorization: Bearer eyJ..."
  ↓ authenticate middleware
    ↓ Extraire le token du header
    ↓ redis.exists("blacklist:eyJ...") → token révoqué ?
    ↓ jwt.verify(token, JWT_SECRET) → signature valide ? non expiré ?
    ↓ req.user = { userId, role }
  ↓ Controller → Service → Réponse

DÉCONNEXION
Client → POST /auth/logout  Header: "Authorization: Bearer eyJ..."
  ↓ Décoder le token pour connaître sa date d'expiration
  ↓ redis.set("blacklist:eyJ...", "1", EX: ttl_restant)
  ↓ Le token est maintenant inutilisable jusqu'à sa date d'expiration naturelle
```

### Pourquoi JWT et pas sessions ?

| | JWT | Sessions |
|---|---|---|
| **Stockage serveur** | Aucun (stateless) | Session en BDD ou Redis pour chaque utilisateur |
| **Scalabilité** | Excellent (n'importe quel serveur peut vérifier) | Requiert un état partagé entre serveurs |
| **Mobile** | Idéal (stocké en AsyncStorage) | Moins adapté (cookies navigateur) |
| **Révocation** | Via liste noire Redis | Simple (supprimer la session) |

### Sécurité du mot de passe avec bcrypt

```
Mot de passe: "MonMotDePasse123!"
      ↓ bcrypt.hash("MonMotDePasse123!", 10)
Hash: "$2b$10$F94VsRa...7WJce" (60 caractères, irréversible)

Vérification:
bcrypt.compare("MonMotDePasse123!", "$2b$10$F94VsRa...7WJce") → true
bcrypt.compare("AutreMotDePasse", "$2b$10$F94VsRa...7WJce") → false
```

Le **coût 10** signifie 2^10 = 1024 itérations de hachage. Même avec un ordinateur puissant, tester des millions de mots de passe par force brute prendrait des années.

---

## 7. Infrastructure Docker

```yaml
# docker-compose.yml (simplifié)
services:
  postgres:
    image: postgres:15
    ports: ["5433:5432"]        # 5433 sur l'hôte (5432 déjà occupé par PostgreSQL natif)
    environment:
      POSTGRES_DB: animetracker
      POSTGRES_USER: animetracker_user
      POSTGRES_PASSWORD: ***
    healthcheck:
      test: ["CMD", "pg_isready"]  # vérifie que Postgres est prêt avant de démarrer le backend

  redis:
    image: redis:7
    ports: ["6380:6379"]

  backend:
    build: ./backend
    ports: ["3000:3000"]
    depends_on:
      postgres: { condition: service_healthy }  # attend que Postgres soit prêt
      redis: { condition: service_healthy }
    environment:
      DATABASE_URL: postgres://animetracker_user:***@postgres:5432/animetracker
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ***
      NODE_ENV: development
```

**Points clés :**
- Le port Postgres est remappé sur `5433` car le port `5432` était déjà utilisé par une installation native de PostgreSQL 18 sur Windows
- `depends_on` avec `condition: service_healthy` garantit que le backend ne démarre pas avant que la BDD soit opérationnelle
- Les variables d'environnement sensibles (mots de passe, JWT secret) sont dans `.env` et ne sont **jamais committées** dans git

---

## 8. Tests Jest

### Tests unitaires (`tests/unit/`)

Les tests unitaires testent des **fonctions de service isolées**. Toutes les dépendances externes (BDD, Redis) sont **mockées** (simulées) :

```typescript
// tests/unit/authService.test.ts (exemple simplifié)

// Mock de la BDD — aucune vraie connexion Postgres
jest.mock('../../src/models/User', () => ({
  default: { findOne: jest.fn(), create: jest.fn() }
}));

describe('register()', () => {
  it('devrait créer un utilisateur et retourner un token', async () => {
    // Simulation : User.findOne retourne null (email libre)
    User.findOne.mockResolvedValue(null);
    // Simulation : User.create retourne un utilisateur fictif
    User.create.mockResolvedValue({ id_user: 'uuid', pseudo: 'test', email: 'test@test.fr' });

    const result = await register({ email: 'test@test.fr', password: 'Test1234!', pseudo: 'test' });

    expect(result.token).toBeDefined();          // un token est retourné
    expect(result.user.email).toBe('test@test.fr');
    expect(User.create).toHaveBeenCalledTimes(1); // la BDD a bien été appelée une fois
  });

  it('devrait rejeter si l\'email est déjà pris', async () => {
    // Simulation : l'email existe déjà en BDD
    User.findOne.mockResolvedValue({ id_user: 'existing-uuid' });

    await expect(register({ email: 'pris@test.fr', ... }))
      .rejects.toThrow('Email déjà utilisé'); // erreur attendue
  });
});
```

### Tests d'intégration (`tests/integration/`)

Les tests d'intégration testent les **routes HTTP complètes** (de la requête à la réponse) en mockant les services mais en laissant Express gérer le routage et les middlewares :

```typescript
// tests/integration/auth.test.ts (exemple simplifié)
import request from 'supertest'; // simule des vraies requêtes HTTP
import app from '../../src/app';

describe('POST /api/auth/register', () => {
  it('201 — inscription réussie', async () => {
    // Mock du service authService.register
    mockedAuth.register.mockResolvedValue({
      user: { id: 'uuid', email: 'test@test.fr', pseudo: 'TestUser' },
      token: 'fake-jwt-token'
    });

    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.fr', password: 'Test1234!', pseudo: 'TestUser' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });

  it('400 — validation échoue (email invalide)', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'pasunemail', password: 'Test1234!', pseudo: 'TestUser' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
```

### Résultats

```
Test Suites: 3 passed, 3 total
Tests:       38 passed, 38 total (0 failed)
Time:        ~4s
```

| Fichier | Tests | Couverture |
|---|---|---|
| `authService.test.ts` | 15 tests unitaires | Service d'authentification |
| `userService.test.ts` | 12 tests unitaires | Service utilisateur |
| `auth.test.ts` | 11 tests d'intégration | Routes /auth/* |

---

*Document généré le 28/05/2026 — AnimeTracker v1.0*
