import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, PageBreak, BorderStyle, ShadingType,
  convertInchesToTwip,
} from 'docx';
import { writeFileSync } from 'fs';

const VIOLET = '7C3AED';
const DARK   = '1E1B4B';
const GRAY   = '6B7280';
const GREEN  = '065F46';
const TEAL   = '0E7490';
const ORANGE = '92400E';

const h1 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 36, color: DARK, font: 'Calibri' })],
  spacing: { before: 400, after: 200 },
  border: { bottom: { color: VIOLET, style: BorderStyle.SINGLE, size: 8, space: 4 } },
});

const h2 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 26, color: VIOLET, font: 'Calibri' })],
  spacing: { before: 280, after: 120 },
});

const h3 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 22, color: DARK, font: 'Calibri' })],
  spacing: { before: 200, after: 80 },
});

const h4 = (text, color = TEAL) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 20, color, font: 'Calibri' })],
  spacing: { before: 160, after: 60 },
});

const p = (text) => new Paragraph({
  children: [new TextRun({ text, size: 22, color: '111827', font: 'Calibri' })],
  spacing: { after: 80 },
});

const bullet = (text, color = '111827') => new Paragraph({
  children: [new TextRun({ text, size: 21, color, font: 'Calibri' })],
  bullet: { level: 0 },
  spacing: { after: 60 },
});

const sub = (text, color = GRAY) => new Paragraph({
  children: [new TextRun({ text, size: 19, color, font: 'Calibri' })],
  bullet: { level: 1 },
  spacing: { after: 50 },
});

const win = (text) => new Paragraph({
  children: [new TextRun({ text: '✓ ' + text, size: 21, color: GREEN, font: 'Calibri' })],
  bullet: { level: 0 },
  spacing: { after: 50 },
});

const lose = (text) => new Paragraph({
  children: [new TextRun({ text: '✗ ' + text, size: 21, color: '991B1B', font: 'Calibri' })],
  bullet: { level: 0 },
  spacing: { after: 50 },
});

const tip = (text) => new Paragraph({
  children: [new TextRun({ text: '→ ' + text, size: 21, color: GREEN, font: 'Calibri' })],
  spacing: { after: 80 },
});

const warn = (text) => new Paragraph({
  children: [new TextRun({ text: '⚠ ' + text, size: 21, color: ORANGE, bold: true, font: 'Calibri' })],
  spacing: { after: 80 },
});

const file = (name, desc) => [
  new Paragraph({
    children: [
      new TextRun({ text: name, size: 21, font: 'Courier New', color: VIOLET, bold: true }),
      new TextRun({ text: '  —  ', size: 21, color: GRAY, font: 'Calibri' }),
      new TextRun({ text: desc, size: 21, color: '111827', font: 'Calibri' }),
    ],
    spacing: { after: 70 },
    indent: { left: 360 },
  }),
];

const blank = () => new Paragraph({ text: '' });
const pb = () => new Paragraph({ children: [new PageBreak()] });
const divider = () => new Paragraph({
  border: { bottom: { color: 'E5E7EB', style: BorderStyle.SINGLE, size: 4, space: 4 } },
  spacing: { before: 100, after: 100 },
});

// ─────────────────────────────────────────────────────────────────────────────

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'Calibri', size: 22, color: '111827' },
        paragraph: { spacing: { line: 276 } },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: {
          top:    convertInchesToTwip(1),
          right:  convertInchesToTwip(1.1),
          bottom: convertInchesToTwip(1),
          left:   convertInchesToTwip(1.3),
        },
      },
    },
    children: [

      // ── COVER ────────────────────────────────────────────────────────────
      ...Array(4).fill(blank()),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'FICHE TECHNIQUE', bold: true, size: 48, color: DARK, font: 'Calibri' })],
        spacing: { after: 120 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Stack & Fichiers — AnimeTracker', size: 28, color: GRAY, font: 'Calibri' })],
        spacing: { after: 60 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'CUENOT ANTONIN — CDA Juin 2026', size: 24, color: GRAY, font: 'Calibri' })],
      }),
      ...Array(3).fill(blank()),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Pourquoi ces technologies ? Que fait chaque fichier ?', size: 22, italics: true, color: GRAY, font: 'Calibri' })],
      }),
      pb(),

      // ══════════════════════════════════════════════════════════════════════
      // PARTIE 1 — CHOIX DE STACK
      // ══════════════════════════════════════════════════════════════════════
      h1('PARTIE 1 — Pourquoi ces technologies ?'),

      // ── REACT NATIVE ─────────────────────────────────────────────────────
      h2('1.1  React Native + Expo'),
      p('React Native permet d\'écrire une seule base de code TypeScript compilée en composants natifs Android ET iOS. Expo ajoute un bundler préconfigué (Metro) et des bibliothèques natives packagées.'),
      blank(),
      h4('Pourquoi pas Flutter ?'),
      lose('Flutter utilise Dart — langage inconnu, courbe d\'apprentissage supplémentaire'),
      lose('Écosystème npm inaccessible — toutes mes connaissances JS/TS ne serviraient pas'),
      win('React Native : capitalise sur mes compétences JS/TS du DWWM'),
      win('Écosystème npm immense — chaque lib disponible'),
      win('Méta (Facebook) maintient activement le projet'),
      blank(),
      h4('Pourquoi pas Ionic / Capacitor ?'),
      lose('Ionic = WebView — rendu HTML dans un conteneur, pas vraiment natif'),
      lose('Performances inférieures pour les animations et listes longues'),
      win('React Native = vrais composants natifs Android/iOS → rendu fluide'),
      blank(),
      h4('Pourquoi Expo plutôt que bare React Native ?'),
      win('Expo Go : tester en temps réel sur téléphone physique via QR code'),
      win('Pas besoin d\'Android Studio / Xcode pour les tests basiques'),
      win('Bibliothèques natives préconfigurées : LinearGradient, SecureStore, ImagePicker'),
      lose('Expo managed : légèrement moins flexible que bare pour les modules natifs très custom'),
      tip('Verdict : Expo est le meilleur choix pour un projet CDA seul — rapidité de setup.'),
      divider(),

      // ── TYPESCRIPT ───────────────────────────────────────────────────────
      h2('1.2  TypeScript (Frontend + Backend)'),
      p('TypeScript est un sur-ensemble typé de JavaScript. Les erreurs de type sont détectées à la compilation, pas au runtime devant l\'utilisateur.'),
      blank(),
      h4('Pourquoi pas JavaScript pur ?'),
      lose('JS pur : passer un string où un number est attendu → crash en production'),
      lose('Pas d\'autocomplétion dans l\'IDE → plus lent à développer'),
      lose('Plus difficile à maintenir avec de nombreux fichiers'),
      win('TypeScript : erreur détectée à la compilation → fix avant de lancer l\'app'),
      win('IntelliSense complet dans VS Code — toutes les propriétés suggérées'),
      win('Types servent de documentation vivante — on sait exactement ce que chaque fonction attend'),
      tip('Même langage sur front ET back → une seule compétence couvre tout le projet.'),
      divider(),

      // ── REDUX TOOLKIT ────────────────────────────────────────────────────
      h2('1.3  Redux Toolkit'),
      p('Redux centralise l\'état de l\'app dans un store unique. Redux Toolkit simplifie l\'écriture par rapport à Redux classique.'),
      blank(),
      h4('Pourquoi pas React Context API seul ?'),
      lose('Context : re-render en cascade sur tous les composants abonnés'),
      lose('Pas de DevTools pour déboguer les actions'),
      lose('Pas de gestion native des états asynchrones (loading, error)'),
      win('Redux : re-render optimisé — seuls les composants qui lisent les données modifiées re-rendent'),
      win('DevTools : inspecter et rejouer chaque action'),
      win('createAsyncThunk : gère pending/fulfilled/rejected automatiquement'),
      blank(),
      h4('Pourquoi pas Zustand ou Jotai ?'),
      lose('Zustand/Jotai : très légers mais moins adaptés à 8 domaines métier interconnectés'),
      lose('Moins de ressources pédagogiques pour un niveau CDA'),
      win('Redux Toolkit : standard industriel, très documenté, DevTools puissants'),
      tip('8 slices : authSlice, librarySlice, reviewsSlice, socialSlice, messagingSlice, groupsSlice, animeSlice, adminSlice.'),
      divider(),

      // ── REACT NAVIGATION ─────────────────────────────────────────────────
      h2('1.4  React Navigation'),
      p('React Navigation gère la navigation entre les écrans avec deux stacks typées : AuthStack et MainStack.'),
      blank(),
      h4('Pourquoi pas Expo Router ?'),
      lose('Expo Router : file-based routing — chaque fichier = une route. Plus rigide.'),
      lose('Moins de contrôle sur la navigation conditionnelle auth/non-auth'),
      win('React Navigation : navigation conditionnelle selon isAuthenticated dans Redux'),
      win('Typage fort de chaque route avec ses paramètres (MainStackParamList)'),
      win('Standard React Native depuis des années — très documenté'),
      divider(),

      // ── AXIOS ────────────────────────────────────────────────────────────
      h2('1.5  Axios + Intercepteurs'),
      p('Axios est un client HTTP avec support des intercepteurs — des middlewares qui s\'exécutent avant chaque requête ou après chaque réponse.'),
      blank(),
      h4('Pourquoi pas fetch natif ?'),
      lose('fetch : pas d\'intercepteurs natifs — il faudrait wrapper chaque appel manuellement'),
      lose('fetch : gestion des erreurs plus verbeux (pas d\'exception sur les 4xx/5xx)'),
      win('Axios : intercepteur REQUEST injecte le JWT automatiquement sur chaque appel'),
      win('Axios : intercepteur RESPONSE normalise les erreurs en messages lisibles'),
      win('Axios : timeout configurable, annulation des requêtes'),
      divider(),

      // ── NODE.JS + EXPRESS ────────────────────────────────────────────────
      h2('1.6  Node.js + Express'),
      p('Node.js est un runtime JavaScript côté serveur avec un modèle event-loop non bloquant. Express est le framework HTTP minimaliste le plus répandu.'),
      blank(),
      h4('Pourquoi pas NestJS ?'),
      lose('NestJS : très verbeux — modules, décorateurs, injection de dépendances'),
      lose('Courbe d\'apprentissage élevée pour un projet CDA solo'),
      win('Express : minimaliste, flexible, pas de boilerplate inutile'),
      win('Pattern Controllers/Services auto-imposé sans framework lourd'),
      blank(),
      h4('Pourquoi pas Python (Django/FastAPI) ?'),
      lose('Python : langage différent du frontend → deux compétences à gérer'),
      win('Node.js : TypeScript full-stack → même syntaxe, même outillage'),
      win('Event-loop non bloquant : idéal pour API REST à forte I/O (BDD, Redis, Jikan)'),
      blank(),
      h4('Pourquoi pas Fastify ?'),
      lose('Fastify : plus performant mais moins de ressources pédagogiques'),
      win('Express : standard de facto, doc immense, écosystème mature'),
      divider(),

      // ── SEQUELIZE ────────────────────────────────────────────────────────
      h2('1.7  Sequelize ORM'),
      p('Sequelize permet d\'écrire les requêtes BDD en TypeScript avec des modèles typés plutôt qu\'en SQL brut.'),
      blank(),
      h4('Pourquoi pas Prisma ?'),
      lose('Prisma : requiert une génération de client avant chaque utilisation'),
      lose('Moins flexible sur les requêtes SQL complexes'),
      win('Sequelize : plus mature, flexible sur les requêtes avec Op.in, Op.ne...'),
      win('Requêtes paramétrées automatiquement → immunité injection SQL'),
      blank(),
      h4('Pourquoi pas TypeORM ?'),
      lose('TypeORM : bugs connus, maintenance ralentie depuis 2022'),
      lose('Moins stable que Sequelize sur les associations complexes'),
      win('Sequelize : plus fiable, utilisé par de grands projets en production'),
      blank(),
      h4('Pourquoi pas SQL brut (Knex / pg) ?'),
      lose('SQL brut : plus de code, plus risqué pour les injections si mal utilisé'),
      win('Sequelize : requêtes paramétrées automatiques, modèles typés, associations expressives'),
      divider(),

      // ── ZOD ──────────────────────────────────────────────────────────────
      h2('1.8  Zod — Validation des données'),
      p('Zod valide la forme des données reçues AVANT qu\'elles atteignent la BDD. Si rating:"abc" arrive → erreur 400 avec message structuré.'),
      blank(),
      h4('Pourquoi pas Joi ou Yup ?'),
      lose('Joi : API callback, moins idiomatique avec TypeScript'),
      lose('Yup : moins précis dans l\'inférence TypeScript'),
      win('Zod : inférence TypeScript automatique — les types du schéma servent directement dans le code'),
      win('Zod : erreurs structurées { field: ["message"] } — directement affichables dans le frontend'),
      blank(),
      h4('Pourquoi pas express-validator ?'),
      lose('express-validator : middleware chaîné, moins lisible que les schémas Zod'),
      win('Zod : un objet de schéma = une source de vérité pour validation ET types'),
      divider(),

      // ── JWT + REDIS ───────────────────────────────────────────────────────
      h2('1.9  JWT + Blacklist Redis'),
      p('JWT est un token signé côté serveur, stocké côté client. Redis est une base clé/valeur en mémoire utilisée pour invalider les tokens après déconnexion.'),
      blank(),
      h4('Pourquoi pas les sessions serveur ?'),
      lose('Sessions : stockage serveur requis — problème de scalabilité (serveurs multiples)'),
      lose('Sessions : cookies HTTP peu adaptés au mobile'),
      win('JWT : stateless — n\'importe quel serveur peut vérifier le token sans BDD'),
      win('JWT : idéal mobile — stocké dans AsyncStorage, envoyé dans chaque requête'),
      blank(),
      h4('Inconvénient du JWT résolu par Redis'),
      p('JWT ne peut pas être révoqué avant expiration — si l\'utilisateur se déconnecte, le token reste valide. Solution : blacklist Redis.'),
      win('redis.set("blacklist:token", 1, EX: ttl_restant) → token invalide immédiatement'),
      win('Redis en mémoire : 10-100x plus rapide qu\'une requête SQL'),
      win('TTL natif Redis : expiration automatique, pas de nettoyage manuel'),
      blank(),
      h4('Pourquoi pas OAuth2 / connexion sociale ?'),
      lose('OAuth2 : dépendance à un service externe (Google, GitHub)'),
      lose('Plus complexe à implémenter pour un projet CDA'),
      win('JWT custom : contrôle total, implémentation pédagogique claire'),
      divider(),

      // ── POSTGRESQL ───────────────────────────────────────────────────────
      h2('1.10  PostgreSQL 15'),
      p('PostgreSQL est une base de données relationnelle robuste avec UUID, ENUM, contraintes CHECK et transactions ACID.'),
      blank(),
      h4('Pourquoi pas MongoDB ?'),
      lose('MongoDB : NoSQL orienté documents — adapté aux données flexibles sans schéma fixe'),
      lose('MongoDB : pas de jointures natives, relations gérées manuellement'),
      win('PostgreSQL : mes données sont fortement relationnelles (user→animés→avis→likes)'),
      win('PostgreSQL : ENUM natifs — user_role, anime_status, visibility_type contraints en BDD'),
      win('PostgreSQL : contrainte CHECK : id_follower ≠ id_following directement en SQL'),
      win('PostgreSQL : UUID natifs via uuid_generate_v4() — non prédictibles'),
      blank(),
      h4('Pourquoi pas MySQL ?'),
      lose('MySQL : UUID moins natif, ENUM moins robuste'),
      lose('Moins bon support des contraintes complexes'),
      win('PostgreSQL : meilleur support JSON, full-text search, extensions'),
      divider(),

      // ── REDIS NOSQL ───────────────────────────────────────────────────────
      h2('1.11  Redis 7 (NoSQL clé/valeur)'),
      p('Redis est la composante NoSQL du projet — base de données en mémoire utilisée pour la blacklist JWT.'),
      blank(),
      win('Lecture/écriture 10-100x plus rapide que PostgreSQL'),
      win('TTL natif : les clés expirent automatiquement'),
      win('Satisfait l\'exigence CDA : SQL + NoSQL obligatoires'),
      tip('À l\'oral : "Redis est ma composante NoSQL — base clé/valeur en mémoire. Je n\'ai pas utilisé MongoDB car mes données sont relationnelles, Redis remplissait le besoin NoSQL de manière plus pertinente pour la blacklist JWT."'),
      divider(),

      // ── DOCKER ───────────────────────────────────────────────────────────
      h2('1.12  Docker Compose'),
      p('Docker isole PostgreSQL et Redis dans des conteneurs versionnés et reproductibles.'),
      blank(),
      h4('Pourquoi pas installer PostgreSQL/Redis nativement ?'),
      lose('Natif : conflits de versions entre machines, "ça marche sur ma machine"'),
      lose('Port 5432 déjà occupé par PostgreSQL natif → conflit'),
      win('Docker : postgres:15-alpine et redis:7-alpine — versions fixées, identiques partout'),
      win('Port 5433 pour Postgres → pas de conflit avec une installation native'),
      win('docker compose up -d → toute l\'infra en une commande'),
      win('healthcheck : le backend attend que Postgres soit prêt avant de démarrer'),
      divider(),

      // ── JEST ─────────────────────────────────────────────────────────────
      h2('1.13  Jest + Supertest'),
      p('Jest est le framework de test JavaScript le plus répandu. Supertest simule des requêtes HTTP sans démarrer un vrai serveur.'),
      blank(),
      h4('Pourquoi pas Mocha + Chai ?'),
      lose('Mocha + Chai : configuration plus complexe, plusieurs packages à gérer'),
      win('Jest : tout-en-un — assertions, mocks, couverture, snapshot, sans config'),
      blank(),
      h4('Pourquoi pas Vitest ?'),
      lose('Vitest : excellent mais plus récent, moins de ressources pédagogiques'),
      win('Jest : standard industriel Node.js depuis des années'),
      blank(),
      h4('Stratégie de mock'),
      p('Tous les modèles Sequelize, la BDD et Redis sont mockés avec jest.mock(). Aucune connexion réelle pendant les tests — rapide (~4 secondes) et indépendant de l\'infrastructure.'),
      divider(),

      // ── GITHUB ACTIONS ────────────────────────────────────────────────────
      h2('1.14  GitHub Actions (CI/CD)'),
      p('Pipeline d\'intégration continue qui lint, vérifie les types et lance les 38 tests Jest à chaque push sur main.'),
      blank(),
      h4('Pourquoi pas GitLab CI ou CircleCI ?'),
      lose('GitLab CI : nécessite un GitLab hébergé ou GitLab.com'),
      lose('CircleCI : payant au-delà d\'un certain quota'),
      win('GitHub Actions : intégré nativement à GitHub, gratuit pour les repos publics'),
      win('Marketplace immense — actions prêtes à l\'emploi (setup-node, checkout...)'),
      tip('3 étapes : npm ci → lint → tsc --noEmit → npm test. Le badge ✅ sur le repo prouve que tout passe.'),

      pb(),

      // ══════════════════════════════════════════════════════════════════════
      // PARTIE 2 — FICHIERS RACINE
      // ══════════════════════════════════════════════════════════════════════
      h1('PARTIE 2 — Fichiers du projet'),

      h2('2.1  Racine AnimeTracker/'),
      ...file('App.tsx', 'Point d\'entrée React Native. Monte les providers (Redux Store, SafeAreaProvider, NavigationContainer, ThemeProvider) et charge RootNavigator.'),
      ...file('index.ts', 'Enregistre le composant App auprès du runtime React Native. Requis par Expo.'),
      ...file('app.json', 'Configuration Expo : nom de l\'app, icône, écran de démarrage (splash), schéma de deeplink, permissions.'),
      ...file('package.json', 'Dépendances frontend : react-native, expo, redux, react-navigation, axios...'),
      ...file('tsconfig.json', 'Configuration TypeScript frontend : strict mode, paths, lib ES2022.'),
      ...file('.eslintrc.js', 'Règles ESLint frontend (React Native specific).'),
      ...file('.env.dev', 'Template des variables d\'environnement. Commité car ne contient que des valeurs d\'exemple.'),
      ...file('.env', 'Variables réelles (EXPO_PUBLIC_API_URL). Jamais commité.'),
      ...file('docker-compose.yml', 'Orchestre PostgreSQL (port 5433) et Redis (port 6379) dans des conteneurs Docker.'),
      ...file('Makefile', 'Raccourcis de commandes (make start, make test, make clean...).'),
      blank(),

      h2('2.2  docker/postgres/'),
      ...file('init.sql', 'Script SQL exécuté automatiquement au PREMIER démarrage du conteneur PostgreSQL. Crée les 12 tables, les ENUM, les contraintes CHECK, les triggers updated_at et les index de performance. Écrit manuellement (non généré par Sequelize).'),
      blank(),

      h2('2.3  assets/'),
      ...file('icon.png', 'Icône de l\'application sur l\'écran d\'accueil du téléphone.'),
      ...file('adaptive-icon.png', 'Icône adaptative Android (foreground layer).'),
      ...file('splash-icon.png', 'Image affichée pendant le chargement initial de l\'app.'),
      ...file('favicon.png', 'Favicon pour la version web Expo (si activée).'),
      blank(),

      h2('2.4  .github/workflows/'),
      ...file('ci.yml', 'Pipeline GitHub Actions : déclenché à chaque push sur main. Étapes : checkout → setup Node 20 → npm ci → lint → tsc --noEmit → npm test. Bloque le merge si une étape échoue.'),
      blank(),

      pb(),

      // ══════════════════════════════════════════════════════════════════════
      // PARTIE 3 — FRONTEND src/
      // ══════════════════════════════════════════════════════════════════════
      h1('PARTIE 3 — Frontend src/'),

      h2('3.1  src/types/index.ts'),
      p('Toutes les interfaces TypeScript partagées du frontend. En un seul fichier pour éviter les imports circulaires.'),
      bullet('User, UserRole, AuthResponse — objets retournés par l\'API auth'),
      bullet('Anime, AnimeImages, Genre, Studio — format Jikan API'),
      bullet('UserAnime — entrée de bibliothèque avec statut et épisodes'),
      bullet('Review, Follow, Conversation, Message, GroupMessage — entités sociales'),
      bullet('AdminStats, AdminUser, AdminReview, AdminGroupMessage — panel admin'),
      blank(),

      h2('3.2  src/utils/'),
      ...file('constants.ts', 'Constantes de design system : Spacing (xs→xxxl), FontSize (xs→largeTitle), BorderRadius, Shadows, AnimeStatus labels, StorageKeys AsyncStorage.'),
      ...file('colors.ts', 'Palette de couleurs complète : primary (violet), secondary (cyan), success, warning, error, gray scale, background, text, border, animeStatus par statut.'),
      blank(),

      h2('3.3  src/contexts/'),
      ...file('ThemeContext.tsx', 'Fournit les couleurs du thème (LightColors/DarkColors) à toute l\'app via useTheme(). Lit le thème choisi dans settingsSlice Redux. Tous les composants utilisent colors.primary[500] etc. au lieu de valeurs hardcodées.'),
      ...file('NotificationContext.tsx', 'Context pour les notifications in-app (banners, toasts). Fournit showNotification() aux composants.'),
      blank(),

      h2('3.4  src/navigation/'),
      ...file('types.ts', 'Définit les types de chaque stack de navigation : AuthStackParamList (Login, Register), MainTabParamList (tabs), MainStackParamList (tous les écrans avec leurs paramètres typés). Garantit que navigation.navigate(\'Chat\', { recipientId }) est vérifié à la compilation.'),
      ...file('index.tsx', 'Configure les trois navigateurs : AuthNavigator (Stack), MainTabNavigator (BottomTab avec icônes), MainNavigator (Stack avec tous les écrans). RootNavigator bascule entre Auth et Main selon isAuthenticated dans Redux.'),
      blank(),

      h2('3.5  src/services/'),
      ...file('apiClient.ts', 'Instance Axios préconfigurée. Base URL depuis EXPO_PUBLIC_API_URL, timeout 10s. Intercepteur REQUEST : injecte le JWT depuis AsyncStorage. Intercepteur RESPONSE : normalise les erreurs en messages lisibles.'),
      ...file('jikanApi.ts', 'Appels directs vers Jikan API (MyAnimeList) depuis le frontend — pas via notre backend. Fonctions : searchAnimes(query), getAnimeById(id), getTopAnimes(page).'),
      blank(),

      h2('3.6  src/store/'),
      ...file('index.ts', 'Configure le store Redux avec configureStore(). Combine les 8 reducers. Exporte RootState, AppDispatch, useAppDispatch, useAppSelector (hooks typés).'),
      blank(),
      h3('Slices Redux (src/store/slices/)'),
      ...file('authSlice.ts', 'Gère l\'authentification : user, token, isAuthenticated. Thunks : login, register, logout (blackliste le token). Actions : clearError. Persist user dans AsyncStorage.'),
      ...file('librarySlice.ts', 'Bibliothèque personnelle de l\'utilisateur. State : animes[], isLoading, filter. Thunks : loadLibrary, addToLibrary, updateAnimeStatus, removeFromLibrary. Mapper mapBackendEntry() : snake_case → camelCase.'),
      ...file('reviewsSlice.ts', 'Avis sur les animés. State : reviews[]. Thunks : loadReviewsForAnime, loadMyReview, createReview, updateReview, deleteReview, toggleLikeReview. Sélecteurs : selectPublicReviewsForAnime, selectUserReviewForAnime.'),
      ...file('socialSlice.ts', 'Abonnements sociaux. State : followers[], following[], searchResults[]. Thunks : loadFollowers, loadFollowing, follow, unfollow, searchUsers.'),
      ...file('messagingSlice.ts', 'Messagerie privée. State : conversations[], messages par convId, activeConversationId. Thunks : loadConversations, loadMessages, sendMessage, markAsRead.'),
      ...file('groupsSlice.ts', 'Groupes de discussion. State : groups[], messages par groupId, memberStatus. Thunks : getOrCreateGroup, joinGroup, leaveGroup, loadGroupMessages, sendGroupMessage.'),
      ...file('animeSlice.ts', 'Cache local des données animés Jikan. State : topAnimes[], searchResults[], animeDetails par id. Thunks : searchAnimes, loadTopAnimes, loadAnimeDetail.'),
      ...file('settingsSlice.ts', 'Préférences utilisateur. State : theme (light/dark), notifications. Persist dans AsyncStorage.'),
      ...file('adminSlice.ts', 'Panel d\'administration. State : stats, users, reviews, groupMessages. Thunks : fetchAdminStats, fetchAdminUsers, changeUserRole, suspendUser, deleteUser, etc.'),
      blank(),

      h2('3.7  src/components/'),
      ...file('Button.tsx', 'Bouton réutilisable avec variantes (primary, secondary, outline, danger). Props : title, onPress, loading, disabled, variant.'),
      ...file('Input.tsx', 'Champ texte réutilisable avec label, message d\'erreur, icône optionnelle. Utilise les couleurs du thème.'),
      ...file('Loading.tsx', 'Spinner de chargement centré. Utilisé partout où isLoading est true.'),
      ...file('AnimeCard.tsx', 'Carte affichant un animé : poster, titre, note, statut si dans la bibliothèque. Navigable vers AnimeDetailScreen.'),
      ...file('GradientHeader.tsx', 'Header avec dégradé violet-cyan (primary[700] → primary[500] → secondary[400]). Réutilisé dans ProfileScreen, AnimeGroupScreen, AdminPanelScreen.'),
      ...file('index.ts', 'Barrel export — permet d\'importer depuis \'../components\' sans préciser chaque fichier.'),
      blank(),

      h2('3.8  src/screens/auth/'),
      ...file('LoginScreen.tsx', 'Formulaire de connexion. Champs email + password. Dispatch login(). Gère les erreurs (mauvais identifiants). Lien vers RegisterScreen.'),
      ...file('RegisterScreen.tsx', 'Formulaire d\'inscription. Champs email + pseudo + password. Validation locale avant dispatch register(). Affiche les erreurs de validation Zod retournées par l\'API.'),
      blank(),

      h2('3.9  src/screens/main/'),
      ...file('HomeScreen.tsx', 'Écran d\'accueil : top animés depuis Jikan, récents de la bibliothèque, accès rapide aux fonctionnalités.'),
      ...file('SearchScreen.tsx', 'Recherche d\'animés via Jikan API. Debounce de 500ms. FlatList des résultats avec navigation vers AnimeDetailScreen.'),
      ...file('AnimeDetailScreen.tsx', 'Détail d\'un animé : poster, synopsis, genres, note, épisodes. Boutons : ajouter à la bibliothèque, voir les avis, rejoindre le groupe.'),
      ...file('LibraryScreen.tsx', 'Bibliothèque personnelle avec filtres (À voir, En cours, Terminé, Abandonné). FlatList de AnimeCard. Swipe pour modifier le statut.'),
      ...file('MessagesScreen.tsx', 'Liste des conversations privées avec last message et badge non lu. Tri par date du dernier message.'),
      ...file('ChatScreen.tsx', 'Conversation privée avec un autre utilisateur. Messages en temps réel (mode pull). Envoi de message avec apiClient.'),
      ...file('NewMessageScreen.tsx', 'Recherche d\'un utilisateur pour démarrer une nouvelle conversation. Dispatch getOrCreateConversation().'),
      ...file('AnimeGroupScreen.tsx', 'Groupe de discussion d\'un animé. Messages du groupe. Header gradient avec titre de l\'animé. Join/Leave group.'),
      ...file('ProfileScreen.tsx', 'Profil de l\'utilisateur connecté : stats bibliothèque, temps de visionnage, followers/following, mes avis. Bouton admin si role=ADMIN. Déconnexion.'),
      ...file('UserProfileScreen.tsx', 'Profil public d\'un autre utilisateur. Stats, bouton Follow/Unfollow. Ses avis publics.'),
      ...file('EditProfileScreen.tsx', 'Modification du profil : pseudo, bio, avatar. PATCH /users/me.'),
      ...file('SettingsScreen.tsx', 'Paramètres : thème clair/sombre, préférences notifications. Accès RGPD (supprimer compte, exporter données).'),
      ...file('AdminPanelScreen.tsx', 'Panel admin avec 4 onglets : Stats, Utilisateurs, Avis, Messages groupes. Accessible uniquement si role=ADMIN. Actions : changer rôle, suspendre, supprimer, modérer.'),
      blank(),

      pb(),

      // ══════════════════════════════════════════════════════════════════════
      // PARTIE 4 — BACKEND
      // ══════════════════════════════════════════════════════════════════════
      h1('PARTIE 4 — Backend backend/src/'),

      h2('4.1  Fichiers racine backend/'),
      ...file('app.ts', 'Configuration Express. Monte dans l\'ordre : Helmet (headers sécurité) → CORS → Rate Limiting → express.json (limit 10kb) → sanitizeBody → routes /api → notFound → errorHandler.'),
      ...file('server.ts', 'Point d\'entrée. Connexion BDD → connexion Redis → démarrage Express sur env.port. Si une connexion échoue → process.exit(1).'),
      ...file('jest.config.js', 'Configuration Jest : preset ts-jest, roots tests/, collectCoverageFrom (services + middlewares + schemas + utils), seuils de couverture.'),
      ...file('nodemon.json', 'Configuration du hot-reload nodemon : surveille src/**/*.ts, redémarre avec ts-node.'),
      ...file('.eslintrc.js', 'Règles ESLint backend : @typescript-eslint/recommended + type-checking, explicit-function-return-type en warn, no-console en warn, prefer-const error.'),
      ...file('tsconfig.json', 'Configuration TypeScript backend : target ES2022, strict, sourceMap, noUnusedLocals, noImplicitReturns.'),
      ...file('Dockerfile', 'Image Docker pour déploiement production du backend (node:20-alpine, npm ci, npm run build, node dist/server.js).'),
      blank(),

      h2('4.2  backend/src/config/'),
      ...file('env.ts', 'Valide et parse les variables d\'environnement avec Zod au démarrage. Si une variable manque → console.error + process.exit(1). Exporte env.postgres, env.redis, env.jwt, etc.'),
      ...file('database.ts', 'Crée l\'instance Sequelize (PostgreSQL, pool 10 connexions). Exporte connectDatabase() qui appelle sequelize.authenticate().'),
      ...file('redis.ts', 'Crée le client Redis (ioredis). Exporte redis et connectRedis(). Événements : connect, error.'),
      blank(),

      h2('4.3  backend/src/types/index.ts'),
      p('Types TypeScript partagés côté backend.'),
      bullet('UserRole — "USER" | "MODERATEUR" | "ADMIN"'),
      bullet('JwtPayload — { userId, role, iat, exp }'),
      bullet('AuthenticatedRequest — Request avec user?: JwtPayload'),
      bullet('ApiResponse<T> — { success, data?, message?, errors? }'),
      bullet('PaginatedResult<T> — { data, total, page, limit, totalPages }'),
      blank(),

      h2('4.4  backend/src/middlewares/'),
      ...file('authenticate.ts', 'Vérifie le JWT sur les routes protégées. 3 étapes : extraire le token du header → vérifier blacklist Redis → jwt.verify(). Peuple req.user = { userId, role }. Exporte aussi requireRole(...roles) pour le RBAC.'),
      ...file('errorHandler.ts', 'Handler d\'erreur Express centralisé. Intercepte : AppError (4xx avec message) → ZodError (400 + errors par field) → erreurs inconnues (500). Toutes les erreurs passent ici via next(err).'),
      ...file('notFound.ts', 'Middleware qui intercepte les routes non trouvées et retourne 404 { success: false, message: "Route introuvable" }.'),
      ...file('sanitize.ts', 'Parcourt récursivement le body de chaque requête et échappe les caractères HTML (<, >, ", \'). Protection contre le XSS stocké.'),
      blank(),

      h2('4.5  backend/src/utils/'),
      ...file('asyncHandler.ts', 'Wrapper qui enveloppe les controllers async et transmet les exceptions non catchées à next(). Indispensable avec Express 4 qui ne gère pas nativement les erreurs async.'),
      blank(),

      h2('4.6  backend/src/schemas/'),
      ...file('auth.ts', 'Schémas Zod pour l\'auth. registerSchema : email format, password min 8 chars + majuscule + chiffre, pseudo alphanumérique. loginSchema : email + password non vide.'),
      ...file('review.ts', 'upsertReviewSchema : rating number 0-10 multiple de 0.5, comment max 2000 chars optionnel, visibility enum PUBLIC|PRIVE optionnel.'),
      ...file('user.ts', 'updateProfileSchema (pseudo, bio, photo optionnels), changePasswordSchema (currentPassword + newPassword min 8 chars).'),
      ...file('userAnime.ts', 'addAnimeSchema : animeId number, status enum, episodesWatched number. updateAnimeSchema : mêmes champs optionnels.'),
      blank(),

      h2('4.7  backend/src/models/'),
      p('Un fichier = une table PostgreSQL. Chaque modèle étend Model<InferAttributes, InferCreationAttributes> pour le typage Sequelize.'),
      ...file('User.ts', 'Table user. Champs : id_user (UUID PK), email (unique), password (hash), pseudo (unique), photo, bio, role (ENUM USER|MODERATEUR|ADMIN), is_active, is_suspended, suspension_end_date.'),
      ...file('Anime.ts', 'Cache des animés Jikan. id_anime = ID MyAnimeList (INTEGER, non auto-incrémenté). title, synopsis, image_url, episodes, score, year, last_fetched_at.'),
      ...file('UserAnime.ts', 'Table user_anime. Bibliothèque personnelle. Contrainte UNIQUE(id_user, id_anime). status (ENUM), episodes_watched.'),
      ...file('Review.ts', 'Table review. rating DECIMAL(3,1), comment TEXT, visibility (ENUM PUBLIC|PRIVE default PRIVE), likes_count. Contrainte UNIQUE(id_user, id_anime).'),
      ...file('Follow.ts', 'Table follow. id_follower + id_following (FK vers user). Contrainte UNIQUE(follower, following). Contrainte CHECK(follower ≠ following).'),
      ...file('Conversation.ts', 'Conteneur d\'une conversation privée. Un seul champ utile : id_conversation (UUID PK).'),
      ...file('ConversationParticipant.ts', 'Lie un user à une conversation. Contrainte UNIQUE(id_conversation, id_user).'),
      ...file('Message.ts', 'Message dans une conversation. id_sender (FK user), content TEXT, is_read BOOLEAN.'),
      ...file('Group.ts', 'Groupe de discussion. name, type (ENUM OFFICIEL|PERSONNALISE), id_anime (nullable), id_creator, is_public. Index UNIQUE sur (id_anime) WHERE type=\'OFFICIEL\'.'),
      ...file('GroupMember.ts', 'Membre d\'un groupe. id_group + id_user. is_moderator BOOLEAN. Contrainte UNIQUE(id_group, id_user).'),
      ...file('GroupMessage.ts', 'Message dans un groupe. id_author, content, created_at. deleted_at + id_deleted_by pour le soft-delete de modération.'),
      ...file('associations.ts', 'Définit toutes les associations Sequelize : Review.belongsTo(User as \'author\'), Review.belongsTo(Anime), UserAnime.belongsTo(User/Anime), Follow.belongsTo(User x2), GroupMessage.belongsTo(User/Group).'),
      blank(),

      h2('4.8  backend/src/routes/'),
      p('Chaque fichier monte les routes d\'un domaine sur le Router Express. Les controllers sont wrappés par asyncHandler.'),
      ...file('index.ts', 'Dispatcher central. Monte : /auth, /animes, /users, /conversations, /groups, /admin. Gère aussi GET /health.'),
      ...file('auth.ts', 'POST /register, POST /login, POST /logout, GET /me.'),
      ...file('users.ts', 'GET|PATCH|DELETE /me, PATCH /me/password, GET /me/animes, /me/stats, /me/data. GET /search. POST|DELETE /:userId/follow. GET /:userId/followers|following.'),
      ...file('animes.ts', 'GET /search?q=, GET /top, GET /:id. GET|POST /animes/:id/reviews, GET /animes/:id/my-review. DELETE /users/me/reviews/:id, POST /users/me/reviews/:id/like.'),
      ...file('messages.ts', 'GET / (conversations), POST /with/:recipientId, GET|POST /:id/messages, PATCH /:id/read, DELETE /:id.'),
      ...file('groups.ts', 'GET|POST /anime/:animeId, GET /:id, POST /:id/join, DELETE /:id/leave, GET|POST /:id/messages.'),
      ...file('admin.ts', 'Toutes les routes admin protégées par authenticate + requireRole(\'ADMIN\'). 11 endpoints : stats, users CRUD + suspend, reviews modération, group-messages modération.'),
      blank(),

      h2('4.9  backend/src/controllers/'),
      p('Controller = gestion HTTP uniquement. Extrait les paramètres, appelle le service, formate la réponse. Ne contient jamais de logique métier.'),
      ...file('authController.ts', 'registerController, loginController, logoutController, getMeController.'),
      ...file('userController.ts', 'getProfile, updateProfile, changePassword, deleteAccount, exportData, searchUsers, getUserStats, follow, unfollow, getFollowers, getFollowing.'),
      ...file('animeController.ts', 'searchAnimes, getTopAnimes, getAnimeById. Délègue vers animeService (qui appelle jikanService).'),
      ...file('userAnimeController.ts', 'addAnime, updateAnime, removeAnime. Opérations sur la bibliothèque de l\'utilisateur.'),
      ...file('reviewController.ts', 'getReviews, getMyReview, upsertReview, deleteReview, toggleLike.'),
      ...file('messageController.ts', 'getConversations, getOrCreateConversation, getMessages, sendMessage, markAsRead, deleteConversation.'),
      ...file('groupController.ts', 'getAnimeGroupStatus, getOrCreateGroup, joinGroup, leaveGroup, getGroupMessages, sendGroupMessage, getGroupInfo.'),
      ...file('adminController.ts', 'getStats, listUsers, changeUserRole, suspendUser, unsuspendUser, deleteUser, listReviews, deleteReview, changeReviewVisibility, listGroupMessages, deleteGroupMessage.'),
      blank(),

      h2('4.10  backend/src/services/'),
      p('Service = logique métier pure. Ne connaît pas HTTP. Requêtes Sequelize, règles de gestion, AppError pour les cas invalides. Testable indépendamment des routes.'),
      ...file('authService.ts', 'register() : unicité email+pseudo → bcrypt.hash(12) → User.create() → jwt.sign(). login() : User.findOne → bcrypt.compare → jwt.sign(). logout() : blacklist Redis avec TTL.'),
      ...file('userService.ts', 'getProfile, updateProfile, changePassword (compare ancien), deleteAccount, exportUserData, searchUsers, getUserStats (stats calculées), follow (vérif anti-self), unfollow.'),
      ...file('userAnimeService.ts', 'addAnime, updateAnime (statut, épisodes), removeAnime. UPSERT logique pour éviter les doublons.'),
      ...file('reviewService.ts', 'getAnimeReviews (que les publics), getMyReview (toutes visibilités), upsertReview (1 max par user+animé), deleteReview (vérif ownership), toggleLike.'),
      ...file('animeService.ts', 'Cherche l\'animé dans le cache BDD → si absent ou trop vieux → appelle jikanService → sauvegarde dans BDD → retourne.'),
      ...file('jikanService.ts', 'Appels vers https://api.jikan.moe/v4. Fonctions : searchAnimes, getAnimeById, getTopAnimes. Mappe le format Jikan vers notre modèle Anime.'),
      ...file('messageService.ts', 'getOrCreateConversation (cherche existante, sinon transaction Sequelize pour créer conv + 2 participants), getConversations, getMessages, sendMessage, markAsRead, deleteConversation.'),
      ...file('groupService.ts', 'getOrCreateOfficialGroup (un seul par animé), joinGroup, leaveGroup, getGroupMessages, sendGroupMessage, getAnimeGroupStatus, getGroupInfo.'),
      ...file('adminService.ts', 'getStats (6 count()), listUsers, changeUserRole, suspendUser/unsuspendUser, deleteUser, listReviews, deleteReview, changeReviewVisibility, listGroupMessages, softDeleteGroupMessage.'),
      blank(),

      h2('4.11  backend/tests/'),
      ...file('setup.ts', 'Configuration Jest globale : mock de sequelize (init, authenticate), mock de ioredis, mock de bcrypt. S\'exécute avant chaque test.'),
      ...file('unit/authService.test.ts', '15 tests unitaires : register (succès, email pris, pseudo pris), login (succès, email inconnu, mauvais mdp), bcrypt hash/compare, JWT sign/verify/expire/malformé, blacklist Redis.'),
      ...file('unit/userService.test.ts', '12 tests unitaires : getProfile (trouvé/non trouvé), updateProfile, changePassword (bon/mauvais ancien mdp), follow (succès/self/déjà suivi), searchUsers.'),
      ...file('integration/auth.test.ts', '11 tests d\'intégration avec Supertest : POST /register (201, 409 email pris, 409 pseudo pris, 400 validation), POST /login (200, 401 email inconnu, 401 mauvais mdp), POST /logout, GET /me.'),

      pb(),

      // ══════════════════════════════════════════════════════════════════════
      // PARTIE 5 — AIDE-MÉMOIRE
      // ══════════════════════════════════════════════════════════════════════
      h1('PARTIE 5 — Aide-mémoire oral'),

      h2('5.1  Chiffres à retenir'),
      bullet('54 endpoints API REST (dont 11 admin)'),
      bullet('12 tables PostgreSQL'),
      bullet('38 tests Jest — 100% pass en ~4 secondes'),
      bullet('41 tests manuels sur émulateur Android'),
      bullet('9 couches de sécurité empilées'),
      bullet('8 slices Redux (1 par domaine métier)'),
      bullet('8 controllers + 8 services backend'),
      bullet('4 schémas Zod de validation'),
      bullet('13 écrans React Native (2 auth + 11 main)'),
      blank(),

      h2('5.2  Quand le jury demande "pourquoi X plutôt que Y ?"'),
      tip('React Native > Flutter → Dart inconnu, capitalise sur JS/TS du DWWM'),
      tip('Express > NestJS → moins verbeux, pas de boilerplate inutile pour ce projet'),
      tip('Sequelize > Prisma → plus mature, flexible sur requêtes complexes'),
      tip('PostgreSQL > MongoDB → données relationnelles, ENUM/UUID/CHECK natifs'),
      tip('Redis (NoSQL) > stocker sessions en BDD → 10-100x plus rapide, TTL natif'),
      tip('JWT > Sessions → stateless, idéal mobile, scalable'),
      tip('Zod > Joi → inférence TypeScript automatique'),
      tip('Jest > Mocha → tout-en-un, standard Node.js'),
      tip('GitHub Actions > CircleCI → intégré GitHub, gratuit repos publics'),
      blank(),

      h2('5.3  Flux d\'une requête de bout en bout'),
      p('Exemple : l\'utilisateur envoie un avis (POST /api/animes/16498/reviews)'),
      bullet('1. Helmet vérifie les headers HTTP'),
      bullet('2. Rate limiter : < 100 req/15min pour cette IP'),
      bullet('3. Payload limit : body < 10kb'),
      bullet('4. sanitizeBody : échappe les < > dans le commentaire'),
      bullet('5. authenticate : extrait token → vérifie blacklist Redis → jwt.verify()'),
      bullet('6. upsertReviewSchema.parse(req.body) → valide rating, comment, visibility'),
      bullet('7. reviewController appelle reviewService.upsertReview()'),
      bullet('8. reviewService vérifie si l\'avis existe → UPDATE ou CREATE'),
      bullet('9. Sequelize génère une requête paramétrée SQL'),
      bullet('10. Response { success: true, data: review } → 201 Created'),

      blank(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Bonne soutenance Antonin !', bold: true, size: 26, color: VIOLET, font: 'Calibri' })],
        spacing: { before: 400 },
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  writeFileSync('../documentation/fiche-technique-stack-fichiers.docx', buf);
  console.log('✅ Fiche technique générée : documentation/fiche-technique-stack-fichiers.docx');
});
