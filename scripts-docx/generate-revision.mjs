import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, PageBreak, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, convertInchesToTwip,
} from 'docx';
import { writeFileSync } from 'fs';

const VIOLET = '8B5CF6';
const DARK   = '1E1B4B';
const GRAY   = '6B7280';
const GREEN  = '065F46';
const RED    = '991B1B';
const ORANGE = '92400E';

const h1 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 36, color: DARK, font: 'Calibri' })],
  spacing: { before: 400, after: 200 },
  border: { bottom: { color: VIOLET, style: BorderStyle.SINGLE, size: 8, space: 4 } },
});

const h2 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 26, color: VIOLET, font: 'Calibri' })],
  spacing: { before: 300, after: 120 },
});

const h3 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 22, color: DARK, font: 'Calibri' })],
  spacing: { before: 200, after: 80 },
});

const p = (text, color = '111827') => new Paragraph({
  children: [new TextRun({ text, size: 22, color, font: 'Calibri' })],
  spacing: { after: 100 },
});

const bullet = (text, color = '111827') => new Paragraph({
  children: [new TextRun({ text, size: 22, color, font: 'Calibri' })],
  bullet: { level: 0 },
  spacing: { after: 80 },
});

const sub = (text, color = GRAY) => new Paragraph({
  children: [new TextRun({ text, size: 20, color, font: 'Calibri' })],
  bullet: { level: 1 },
  spacing: { after: 60 },
});

const blank = () => new Paragraph({ text: '' });

const warn = (text) => new Paragraph({
  children: [new TextRun({ text: '⚠ ' + text, size: 22, color: ORANGE, bold: true, font: 'Calibri' })],
  spacing: { after: 100 },
});

const tip = (text) => new Paragraph({
  children: [new TextRun({ text: '→ ' + text, size: 22, color: GREEN, font: 'Calibri' })],
  spacing: { after: 100 },
});

const qa = (q, a) => [
  new Paragraph({
    children: [new TextRun({ text: 'Q : ' + q, size: 22, bold: true, color: RED, font: 'Calibri' })],
    spacing: { before: 160, after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'R : ' + a, size: 22, color: DARK, font: 'Calibri' })],
    spacing: { after: 120 },
    indent: { left: 360 },
  }),
];

const chiffre = (label, val) => new Paragraph({
  children: [
    new TextRun({ text: val + '  ', size: 32, bold: true, color: VIOLET, font: 'Calibri' }),
    new TextRun({ text: label, size: 22, color: GRAY, font: 'Calibri' }),
  ],
  spacing: { after: 80 },
});

const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

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

      // ── PAGE DE GARDE ─────────────────────────────────────────────────────
      ...Array(5).fill(blank()),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'FICHE DE RÉVISION', bold: true, size: 52, color: DARK, font: 'Calibri' })],
        spacing: { after: 120 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Soutenance CDA — AnimeTracker', size: 28, color: GRAY, font: 'Calibri' })],
        spacing: { after: 60 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'CUENOT ANTONIN — Juin 2026', size: 24, color: GRAY, font: 'Calibri' })],
      }),
      ...Array(4).fill(blank()),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Lis ce document la veille de ta soutenance.', size: 22, italics: true, color: GRAY, font: 'Calibri' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Ne mémorise pas — comprends pourquoi tu as fait chaque choix.', size: 22, italics: true, color: VIOLET, bold: true, font: 'Calibri' })],
      }),
      pageBreak(),

      // ── 1. PITCH ──────────────────────────────────────────────────────────
      // ── 1. PITCH ──────────────────────────────────────────────────────────
      h1('1.  Ton pitch en 2 minutes'),
      p('Commence toujours par ça si le jury te demande de présenter ton projet :'),
      blank(),
      new Paragraph({
        children: [new TextRun({
          text: '"AnimeTracker est une application mobile full-stack que j\'ai développée de A à Z — de la base de données PostgreSQL jusqu\'à l\'interface React Native. Elle permet de gérer sa bibliothèque d\'animés, d\'écrire des avis publics ou privés, de discuter dans des groupes de discussion par animé, et d\'envoyer des messages privés. J\'ai aussi développé un panneau d\'administration sécurisé pour modérer le contenu. J\'avais présenté un site web pour mon DWWM — l\'objectif pour ce CDA était de passer au mobile, quelque chose que je n\'avais jamais fait."',
          size: 22, italics: true, color: DARK, font: 'Calibri',
        })],
        spacing: { before: 100, after: 160 },
        indent: { left: 360, right: 360 },
      }),
      warn('Arrête-toi là et laisse le jury poser des questions. Ne noie pas le jury dans les détails sans qu\'il les demande.'),
      tip('Si on te demande "qu\'est-ce qui vous a posé le plus de challenge ?" → Parle du hot-reload Windows/Docker OU de l\'avis privé qui disparaissait après navigation.'),
      pageBreak(),

      // ── 2. CHIFFRES CLÉS ──────────────────────────────────────────────────
      h1('2.  Les chiffres à connaître par cœur'),
      blank(),
      chiffre('endpoints API REST (dont 11 admin)', '54'),
      chiffre('tables en base de données', '12'),
      chiffre('tests Jest automatisés — 100% passent', '38'),
      chiffre('tests manuels sur émulateur Android', '41'),
      chiffre('fonctionnalités principales (dont panel admin)', '8'),
      chiffre('jours d\'expiration du token JWT', '7'),
      chiffre('itérations bcrypt (coût de hachage = 2^10)', '10'),
      chiffre('requêtes max par IP sur 15 minutes (rate limiter)', '100'),
      chiffre('couches de sécurité empilées', '9'),
      chiffre('port PostgreSQL hôte (pas 5432 — déjà occupé)', '5433'),
      chiffre('port backend Node.js', '3000'),
      blank(),
      warn('Si tu bloques sur un chiffre exact, dis "environ" ou "de l\'ordre de" — ne devine pas au hasard.'),
      pageBreak(),

      // ── 3. STACK TECHNIQUE ────────────────────────────────────────────────
      h1('3.  La stack — à expliquer sans hésiter'),

      h2('Frontend'),
      bullet('React Native + Expo'),
      sub('Une seule base de code TypeScript compilée en composants natifs Android ET iOS. Expo apporte un bundler préconfiguré (Metro) et des librairies natives packagées (ex: expo-linear-gradient).'),
      sub('Sans Expo : il faudrait Android Studio + Xcode et configurer les builds natifs manuellement.'),
      bullet('TypeScript'),
      sub('Typage statique : si tu passes un string là où un number est attendu, ça échoue à la compilation, pas en production devant l\'utilisateur.'),
      bullet('Redux Toolkit'),
      sub('Store unique centralisé. Un slice par domaine métier : authSlice, librarySlice, reviewsSlice, socialSlice, messagingSlice, groupsSlice, adminSlice.'),
      sub('createAsyncThunk gère automatiquement les états pending/fulfilled/rejected sans boilerplate.'),
      bullet('React Navigation'),
      sub('AuthStack (Login, Register) séparé du MainStack (Tab Bar + écrans modaux). La navigation est conditionnelle selon isAuthenticated dans le store Redux.'),
      bullet('Axios + intercepteurs'),
      sub('Intercepteur REQUEST : injecte le token JWT dans chaque appel automatiquement. Intercepteur RESPONSE : normalise les erreurs en messages lisibles pour l\'UI.'),
      blank(),

      h2('Backend'),
      bullet('Node.js + Express + TypeScript'),
      sub('Event-loop non bloquant : le serveur ne "dort" pas en attendant une réponse BDD — il traite d\'autres requêtes en parallèle. Parfait pour une API REST à forte I/O.'),
      bullet('Pattern Controllers / Services'),
      sub('Controller = gestion HTTP uniquement (req/res, parse params, format réponse).'),
      sub('Service = logique métier pure (requêtes BDD, règles de gestion). Testable sans démarrer Express.'),
      bullet('Zod'),
      sub('Valide la forme des données AVANT qu\'elles atteignent la base. Si rating:"abc" arrive → erreur 400 structurée renvoyée au client, Sequelize n\'est jamais appelé.'),
      sub('Les types sont inférés automatiquement depuis les schémas → le controller est typé sans effort.'),
      bullet('asyncHandler'),
      sub('Express 4 ne capture pas nativement les erreurs dans les fonctions async. Ce wrapper enveloppe chaque controller et transmet les exceptions à next() → errorHandler. Express 5 l\'intègre nativement.'),
      blank(),

      h2('Infrastructure'),
      bullet('PostgreSQL 15 dans Docker (port hôte 5433)'),
      sub('init.sql lancé automatiquement au 1er démarrage → crée les 12 tables, les ENUM, les contraintes CHECK, les triggers updated_at et les index de performance.'),
      sub('Port 5433 car 5432 était déjà occupé par une installation PostgreSQL native sur la machine.'),
      bullet('Redis 7 dans Docker'),
      sub('Utilisé exclusivement pour la blacklist JWT. À chaque requête authentifiée, le middleware vérifie redis.exists("blacklist:token") — 10 à 100x plus rapide qu\'une requête SQL.'),
      sub('TTL natif Redis : quand un token est blacklisté à la déconnexion, il expire automatiquement à sa date d\'expiration naturelle. Pas de nettoyage manuel nécessaire.'),
      bullet('JWT — JSON Web Token'),
      sub('Payload : { userId, role }. Signé avec JWT_SECRET (min 32 caractères). Expire en 7 jours.'),
      sub('Stocké dans AsyncStorage côté mobile. À la déconnexion → POST /auth/logout → blacklist Redis.'),
      pageBreak(),

      // ── 4. FONCTIONNALITÉS ────────────────────────────────────────────────
      h1('4.  Les 8 fonctionnalités — ce qu\'il faut savoir dire'),

      h2('1. Auth (inscription / connexion / déconnexion)'),
      bullet('Inscription : validation Zod (email format, mdp min 8 chars + 1 majuscule + 1 chiffre, pseudo alphanumérique) → bcrypt.hash(mdp, 10) → INSERT → jwt.sign({ userId, role }).'),
      bullet('Connexion : SELECT WHERE email → bcrypt.compare(mdpSaisi, hash) → jwt.sign si OK.'),
      bullet('Déconnexion : décode le token pour connaître son exp → redis.set("blacklist:token", 1, EX: ttl_restant). Token inutilisable immédiatement même s\'il n\'est pas encore expiré.'),
      warn('Le mot de passe en clair n\'est JAMAIS stocké. bcrypt est irréversible : même si la BDD est compromise, les mots de passe sont protégés.'),
      blank(),

      h2('2. Bibliothèque personnelle'),
      bullet('4 statuts : A_VOIR, EN_COURS, TERMINE, ABANDONNE — définis comme ENUM PostgreSQL, pas de string libre possible en base.'),
      bullet('Contrainte UNIQUE(id_user, id_anime) → un animé ne peut apparaître qu\'une seule fois dans la bibliothèque d\'un utilisateur.'),
      bullet('Les données des animés (titre, synopsis, image) viennent de Jikan API (MyAnimeList). Notre backend les cache dans la table anime mais ne les maintient pas — c\'est une cache, pas une source.'),
      blank(),

      h2('3. Avis (reviews)'),
      bullet('Privé par défaut (visibility: PRIVE) → l\'utilisateur choisit explicitement de le rendre PUBLIC.'),
      bullet('1 avis max par (utilisateur, animé) → logique UPSERT côté service : si l\'avis existe → UPDATE, sinon → INSERT.'),
      bullet('Problème rencontré en développement : l\'avis privé disparaissait après navigation.'),
      sub('Cause : GET /animes/:id/reviews ne retourne que les avis PUBLIC (normal — les autres ne doivent pas les voir).'),
      sub('Solution : endpoint dédié GET /animes/:id/my-review → retourne l\'avis de l\'utilisateur connecté quelle que soit sa visibilité.'),
      blank(),

      h2('4. Messagerie privée'),
      bullet('Architecture 3 tables : conversation (conteneur), conversation_participant (lie user ↔ conversation), message (contenu).'),
      bullet('Ce modèle permet d\'étendre facilement à des conversations de groupe (> 2 participants) en v2 sans modifier le schéma.'),
      bullet('Le backend vérifie que l\'expéditeur est bien participant à la conversation avant d\'insérer le message — sinon 403.'),
      blank(),

      h2('5. Groupes de discussion'),
      bullet('1 groupe OFFICIEL par animé, créé automatiquement à la première demande (GET /groups/anime/:id crée si inexistant). Il ne peut pas être supprimé.'),
      bullet('Problème rencontré : l\'appartenance au groupe était perdue au redémarrage de l\'app.'),
      sub('Cause : Redux est en mémoire — état perdu au reload. isMember n\'était pas rechargé au montage.'),
      sub('Solution : checkAnimeGroup() appelé au montage de l\'écran → GET /groups/anime/:id → le backend retourne isMember.'),
      blank(),

      h2('6. Social (follow / unfollow)'),
      bullet('Contrainte CHECK(id_follower ≠ id_following) directement en SQL — double protection car aussi vérifiée dans le service TypeScript.'),
      bullet('Problème rencontré : bouton Follow toujours désactivé même quand non-suivi.'),
      sub('Cause : le selector selectIsFollowing lisait state.social.following au lieu de state.social.followers.'),
      sub('Solution : corriger le selector pour lire le bon tableau.'),
      blank(),

      h2('7. Profil utilisateur'),
      bullet('Stats calculées côté backend à la demande : épisodes totaux vus, temps de visionnage estimé, taux de complétion, note moyenne.'),
      bullet('Avatar = index entier (0-7) mappé à une couleur côté frontend — pas d\'upload de fichier, simplifie la gestion des images.'),
      bullet('RGPD : DELETE /users/me → suppression en cascade de toutes les données. GET /users/me/data → export de toutes les données personnelles.'),
      blank(),

      h2('8. Panneau d\'administration (ADMIN)'),
      bullet('Accessible uniquement aux utilisateurs avec role = "ADMIN" → middleware requireRole("ADMIN") sur toutes les routes /admin/*.'),
      bullet('4 onglets : Stats globales, Gestion utilisateurs, Modération avis, Modération messages de groupe.'),
      bullet('Stats : nb users, nb reviews, nb groupes, nb messages de groupe, nb messages privés, nb animés en cache.'),
      bullet('Gestion users : changer le rôle (USER ↔ ADMIN), suspendre N jours, lever la suspension, supprimer le compte.'),
      bullet('Modération avis : changer la visibilité PUBLIC/PRIVE, supprimer définitivement.'),
      bullet('Modération messages de groupe : soft-delete (deleted_at + id_deleted_by enregistrés pour audit).'),
      warn('Les messages privés ne sont JAMAIS visibles dans le panel admin — seulement leur nombre dans les stats. La vie privée des conversations est préservée.'),
      pageBreak(),

      // ── 5. SÉCURITÉ ───────────────────────────────────────────────────────
      h1('5.  Sécurité — le point fort à développer à l\'oral'),
      p('La sécurité est traitée en 9 couches empilées. Si le jury te demande "comment tu gères la sécurité ?", structure ta réponse couche par couche.'),
      blank(),

      h2('Les 9 couches dans l\'ordre d\'une requête'),
      bullet('1. Helmet → en-têtes HTTP défensifs (voir détail ci-dessous)'),
      bullet('2. Rate Limiter → 100 req / 15 min / IP — bloque la force brute'),
      bullet('3. Payload limit → rejet si body > 10 ko — évite les attaques par saturation'),
      bullet('4. sanitizeBody → échappement HTML de toutes les chaînes (<, >, ", \') → anti-XSS stocké'),
      bullet('5. Zod → validation typée des données (format, longueur, enum) → anti-injection sémantique'),
      bullet('6. authenticate → vérifie JWT + blacklist Redis → anti-replay de token révoqué'),
      bullet('7. requireRole → vérifie role dans le payload JWT → RBAC (Role-Based Access Control)'),
      bullet('8. Sequelize ORM → requêtes paramétrées automatiquement → immunité injection SQL'),
      bullet('9. UUID en PK → identifiants non-prédictibles → pas d\'énumération possible'),
      blank(),

      h2('Helmet — les en-têtes HTTP de sécurité'),
      p('Helmet configure automatiquement les headers HTTP qui protègent contre les attaques web classiques :'),
      bullet('Content-Security-Policy → interdit le chargement de scripts ou styles de sources externes. Empêche les attaques XSS par injection de code depuis un domaine tiers.'),
      bullet('X-Frame-Options: DENY → empêche que l\'app soit chargée dans un <iframe>. Protection contre le clickjacking (l\'attaquant cache ton app derrière une page transparente).'),
      bullet('X-Content-Type-Options: nosniff → empêche le navigateur de "deviner" le type d\'un fichier. Sans ça, un PNG uploadé contenant du JS pourrait être exécuté.'),
      bullet('Strict-Transport-Security (HSTS) → force HTTPS pendant 1 an. Une fois visité une fois en HTTPS, le navigateur refuse de recharger en HTTP.'),
      bullet('X-XSS-Protection → active la protection XSS intégrée aux anciens navigateurs.'),
      bullet('hidePoweredBy → masque "X-Powered-By: Express" — ne donne pas d\'info sur la stack à un attaquant.'),
      blank(),

      h2('Rate Limiting — protection force brute'),
      p('100 requêtes maximum par IP sur une fenêtre de 15 minutes. Si un attaquant essaie de deviner un mot de passe par force brute sur /auth/login, il est bloqué après 100 essais. Avec un mot de passe de 8 caractères (lettres + chiffres), les possibilités se comptent en milliards — 100 essais est négligeable.'),
      blank(),

      h2('sanitizeBody — protection XSS stocké'),
      p('Le middleware sanitizeBody parcourt récursivement le body de chaque requête et échappe < en &lt;, > en &gt;, etc. Si un utilisateur envoie <script>alert("XSS")</script> dans son pseudo, ce texte est stocké sous forme échappée et ne sera jamais exécuté par un navigateur.'),
      blank(),

      h2('RBAC — Contrôle d\'accès par rôle'),
      p('requireRole("ADMIN") est un middleware composable : il lit req.user.role (peuplé par le middleware authenticate depuis le JWT signé côté serveur) et retourne 403 si le rôle ne correspond pas. Un utilisateur ne peut pas falsifier son rôle côté client car le JWT est signé avec JWT_SECRET.'),
      bullet('router.use(authenticate, requireRole("ADMIN")) — une seule ligne protège toutes les routes admin.'),
      bullet('Un USER qui appelle GET /api/admin/stats reçoit 403 Forbidden sans que le service soit appelé.'),
      pageBreak(),

      // ── 6. DOCKER ─────────────────────────────────────────────────────────
      h1('6.  Docker — explique-le clairement'),
      p('Le jury peut te demander "pourquoi Docker ?" ou "comment tu lances ton projet ?".'),
      blank(),

      h2('Pourquoi Docker ?'),
      bullet('Reproductibilité : même environnement sur toutes les machines — plus de "ça marche sur ma machine".'),
      bullet('Versions fixées : postgres:15-alpine et redis:7-alpine ne changeront pas sans action explicite.'),
      bullet('Isolation : PostgreSQL sur port 5433 (pas 5432) pour ne pas entrer en conflit avec une installation native.'),
      bullet('Healthcheck : depends_on + condition: service_healthy → le backend ne démarre que quand PostgreSQL est prêt. Pas de race condition au démarrage.'),
      blank(),

      h2('Comment ça se lance ?'),
      bullet('docker compose up -d → démarre PostgreSQL + Redis. init.sql exécuté automatiquement au 1er démarrage.'),
      bullet('cd backend && npm run dev → backend Node.js port 3000 (en local, pas dans Docker).'),
      bullet('npx expo start → frontend, QR code ou émulateur Android.'),
      blank(),

      h2('Contrainte Windows rencontrée'),
      bullet('Docker Desktop sur Windows ne transmet pas les événements inotify (modification de fichiers) au Linux du conteneur.'),
      bullet('Nodemon ne détectait donc pas les changements de code — hot-reload mort.'),
      tip('Solution adoptée : lancer le backend directement sur la machine hôte (npm run dev) pendant le développement. PostgreSQL et Redis restent dans Docker.'),
      blank(),
      warn('Si on te demande "comment tu déploierais en production ?" → "J\'ajouterais un pipeline CI/CD (GitHub Actions), un Dockerfile pour le backend, et je déploierais sur un VPS ou un service cloud comme Railway ou Render. JWT_SECRET et les mots de passe seraient dans les variables d\'environnement du service, jamais dans le code."'),
      pageBreak(),

      // ── 7. TESTS ──────────────────────────────────────────────────────────
      h1('7.  Les tests — sois précis et structuré'),

      h2('Tests automatisés Jest (38 tests, 100% pass)'),
      bullet('authService.test.ts — 15 tests unitaires'),
      sub('register() : création compte, email déjà pris, pseudo déjà pris.'),
      sub('login() : succès, email inconnu, mauvais mdp, compte inactif.'),
      sub('bcrypt : hash ≠ clair, compare() true/false.'),
      sub('JWT : génération, vérification, token expiré, token malformé, payload contient userId+role.'),
      sub('blacklist Redis : token blacklisté retourne 401.'),
      bullet('userService.test.ts — 12 tests unitaires'),
      sub('Profil : getProfile, updateProfile, changePassword (ancien mdp incorrect → erreur).'),
      sub('Follow/unfollow : succès, se suivre soi-même → erreur, déjà suivi → erreur.'),
      sub('Recherche utilisateurs par pseudo.'),
      bullet('auth.test.ts — 11 tests d\'intégration (Supertest)'),
      sub('Routes HTTP complètes : POST /register, POST /login, POST /logout, GET /me.'),
      sub('Codes de retour vérifiés : 201, 200, 400, 401, 409.'),
      blank(),

      h2('Pourquoi tout est mocké ?'),
      p('jest.mock() sur les modèles Sequelize, la BDD et Redis. Aucune connexion réelle établie. Résultat : tests en ~4 secondes, indépendants de l\'infrastructure, exécutables en CI sans base de données. C\'est la définition des tests unitaires : tester la logique isolément.'),
      blank(),

      h2('Tests manuels (41 cas, émulateur Android)'),
      bullet('7 Auth / 8 Bibliothèque / 7 Avis / 6 Messagerie / 4 Groupes / 5 Social / 4 Profil.'),
      bullet('Tous passent à 100% sur émulateur Android.'),
      blank(),
      warn('Le jury demandera sûrement : "Pourquoi pas de tests auto sur bibliothèque/messagerie/groupes ?"'),
      tip('Réponse : "Ces fonctionnalités orchestrent plusieurs services en chaîne (Jikan API, BDD, Redux). Les tester en unitaire demanderait de mocker une dizaine de couches — le test vérifierait surtout les mocks, pas la logique. J\'ai fait le choix pragmatique de les valider manuellement. L\'ajout de tests d\'intégration avec une BDD de test est un axe d\'amélioration clairement identifié."'),
      pageBreak(),

      // ── 8. VEILLE TECHNO ──────────────────────────────────────────────────
      h1('8.  Veille techno — maîtrise les comparaisons'),
      p('Le jury adore tester si tu as juste "suivi un tuto" ou si tu comprends vraiment pourquoi tu as fait ces choix.'),
      blank(),

      h3('React Native vs Flutter'),
      bullet('Flutter : excellent framework Google, performances natives, compilation AOT. Mais utilise Dart — langage que je ne maîtrisais pas.'),
      bullet('React Native : capitalise sur mes compétences JS/TypeScript du DWWM, écosystème npm très riche, nombreuses ressources pédagogiques.'),
      sub('Le choix technologique doit correspondre aux compétences disponibles dans l\'équipe.'),
      blank(),

      h3('PostgreSQL vs MongoDB'),
      bullet('MongoDB : idéal pour les données flexibles sans schéma fixe (logs, CMS, catalogues variables).'),
      bullet('PostgreSQL : mes données sont relationnelles (un user a plusieurs animes, un anime a plusieurs reviews, etc.). Les jointures, les contraintes d\'intégrité et les ENUM natifs de PostgreSQL sont exactement ce dont j\'avais besoin.'),
      sub('MongoDB aurait nécessité de gérer l\'intégrité manuellement dans le code — PostgreSQL le fait à la base.'),
      blank(),

      h3('JWT vs Sessions serveur'),
      bullet('Sessions : faciles à révoquer, mais nécessitent un stockage serveur partagé entre instances (problème de scalabilité).'),
      bullet('JWT : stateless — n\'importe quel serveur peut vérifier le token sans consulter de base. Idéal pour mobile où les cookies HTTP sont moins naturels.'),
      bullet('L\'inconvénient du JWT (révocation difficile) est résolu par la blacklist Redis — j\'ai le meilleur des deux mondes.'),
      blank(),

      h3('Sequelize vs Prisma'),
      bullet('Prisma : DX supérieure (client typé généré automatiquement), schéma déclaratif intuitif, migrations propres.'),
      bullet('Sequelize : plus mature, plus flexible sur les requêtes complexes, pas de génération de client.'),
      bullet('Mon choix : Sequelize pour la maturité et la flexibilité. En projet d\'équipe aujourd\'hui je pencherais pour Prisma.'),
      blank(),

      h3('Redux Toolkit vs Context React'),
      bullet('Context : simple pour des données globales peu changeantes (thème, locale).'),
      bullet('Redux : optimise les re-rendus (un composant ne se re-rend que si sa slice change), centralise toute la logique asynchrone, DevTools puissants pour déboguer.'),
      bullet('Avec 8 domaines métier (auth, library, reviews, social, messaging, groups, admin, anime), Redux s\'impose.'),
      pageBreak(),

      // ── 9. QUESTIONS PIÈGES ───────────────────────────────────────────────
      h1('9.  Questions du jury — toutes les réponses préparées'),

      ...qa(
        'Comment tu gères la sécurité dans ton projet ?',
        '9 couches empilées : Helmet (en-têtes HTTP défensifs contre XSS, clickjacking, MIME sniffing), rate limiting 100 req/15min, payload limit 10ko, sanitizeBody (échappement HTML), Zod (validation typée), JWT + blacklist Redis (auth), requireRole RBAC (admin), Sequelize ORM (paramétré → anti SQL injection), UUID en clé primaire (non-prédictible). Aucune couche n\'est suffisante seule.'
      ),

      ...qa(
        'C\'est quoi le RBAC et comment tu l\'as implémenté ?',
        'RBAC = Role-Based Access Control. Chaque utilisateur a un rôle (USER ou ADMIN) encodé dans son JWT. Le middleware requireRole("ADMIN") lit req.user.role peuplé par le middleware authenticate et retourne 403 si le rôle ne correspond pas. Toutes les routes /admin/* sont protégées par router.use(authenticate, requireRole("ADMIN")).'
      ),

      ...qa(
        'Pourquoi la blacklist JWT est dans Redis et pas PostgreSQL ?',
        'La vérification se fait à chaque requête authentifiée — c\'est le chemin critique de l\'API. Redis est une base en mémoire : 10 à 100 fois plus rapide qu\'une requête SQL. De plus, Redis supporte nativement le TTL : quand je blackliste un token, je lui donne une durée de vie égale à son expiration naturelle — il disparaît automatiquement sans nettoyage manuel.'
      ),

      ...qa(
        'Qu\'est-ce que tu referais différemment ?',
        'Trois choses : 1) Ajouter des tests d\'intégration pour la bibliothèque et la messagerie (les tester avec une BDD de test dédiée). 2) Implémenter un système de refresh token pour éviter les déconnexions forcées à 7 jours. 3) Utiliser Prisma plutôt que Sequelize pour un meilleur typage TypeScript automatique — j\'ai découvert ses avantages en cours de développement.'
      ),

      ...qa(
        'C\'est quoi un AsyncThunk et pourquoi tu l\'utilises ?',
        'createAsyncThunk est un utilitaire Redux Toolkit pour les actions asynchrones. Il génère automatiquement trois sous-actions : pending (déclenché quand l\'appel API commence → spinner), fulfilled (succès → mise à jour du store), rejected (erreur → message d\'erreur). Sans ça, il faudrait écrire ce boilerplate à la main pour chaque appel API. J\'ai une vingtaine de thunks dans le projet.'
      ),

      ...qa(
        'Pourquoi les avis sont privés par défaut ?',
        'Deux raisons : la protection de l\'utilisateur (il ne doit pas publier accidentellement un avis qu\'il voulait garder pour lui) et le RGPD (principe de privacy by design — la donnée la plus protectrice est le choix par défaut). L\'utilisateur doit faire une action explicite pour rendre un avis public.'
      ),

      ...qa(
        'Comment tu aurais déployé en production ?',
        'Pipeline CI/CD GitHub Actions qui lance les 38 tests Jest à chaque push. Si les tests passent : build Docker du backend, push sur un registry, déploiement sur un VPS ou Railway/Render. PostgreSQL et Redis sur des services managés (Supabase, Upstash). JWT_SECRET et mots de passe dans les variables d\'environnement du service de déploiement, jamais dans le code.'
      ),

      ...qa(
        'Comment tu aurais travaillé en équipe sur ce projet ?',
        'Branches Git par feature (feat/admin-panel, fix/review-visibility), pull requests avec code review obligatoire avant merge, pipeline CI qui bloque le merge si les tests échouent. Le découpage en slices Redux (un par domaine) et en services backend facilite déjà la répartition du travail en parallèle sans conflits.'
      ),

      ...qa(
        'Qu\'est-ce que le RGPD change dans ton projet ?',
        'Trois implémentations concrètes : 1) DELETE /users/me → supprime toutes les données en cascade (conversations, avis, follows, bibliothèque). 2) GET /users/me/data → export de toutes les données personnelles (droit d\'accès). 3) Les mots de passe sont hachés avec bcrypt irréversible → jamais récupérables même en cas de fuite de BDD. Et privacy by design : les avis sont privés par défaut.'
      ),

      ...qa(
        'C\'est quoi la différence entre un test unitaire et un test d\'intégration ?',
        'Test unitaire : teste une fonction isolée avec tout ce qui l\'entoure mocké. Dans authService.test.ts, User.findOne est remplacé par un mock — je teste la logique du service sans vraie BDD. Test d\'intégration : teste le flux complet de la requête HTTP jusqu\'à la réponse. Dans auth.test.ts, Supertest envoie un vrai POST /auth/login à Express — seule la BDD est mockée.'
      ),

      pageBreak(),

      // ── 10. BUGS RÉSOLUS ──────────────────────────────────────────────────
      h1('10.  Les 4 bugs résolus — raconte-les bien'),
      p('Ces bugs montrent ta capacité à diagnostiquer et résoudre des problèmes réels. C\'est ce que les jurys apprécient le plus.'),
      blank(),

      h2('Bug 1 — Avis privé disparaît après navigation'),
      bullet('Symptôme : je crée un avis privé, je navigue vers un autre écran, je reviens → l\'avis a disparu.'),
      bullet('Diagnostic : l\'écran appelait GET /animes/:id/reviews pour recharger — cet endpoint ne retourne que les avis PUBLIC (normal pour les autres utilisateurs).'),
      bullet('Solution : créer un endpoint dédié GET /animes/:id/my-review qui retourne l\'avis de l\'utilisateur connecté quelle que soit sa visibilité.'),
      tip('Ce bug illustre l\'importance de séparer les endpoints selon le contexte utilisateur (lecture publique vs lecture personnelle).'),
      blank(),

      h2('Bug 2 — Bouton Follow toujours désactivé'),
      bullet('Symptôme : le bouton "Suivre" reste grisé même quand l\'utilisateur n\'est pas encore suivi.'),
      bullet('Diagnostic : le selector selectIsFollowing lisait state.social.following (les gens que je suis) au lieu de state.social.followers (ceux qui me suivent). Inversion logique.'),
      bullet('Solution : corriger le selector pour pointer vers le bon tableau du store.'),
      tip('Ce bug illustre l\'importance de nommer précisément les variables : "following" et "followers" sont similaires mais inversés.'),
      blank(),

      h2('Bug 3 — Appartenance groupe perdue au redémarrage'),
      bullet('Symptôme : je rejoins un groupe, je ferme l\'app, je reviens → l\'app ne sait plus que je suis membre.'),
      bullet('Diagnostic : Redux est en mémoire vive — il se réinitialise au rechargement. isMember n\'était calculé qu\'une fois à la navigation et jamais rechargé.'),
      bullet('Solution : ajouter un appel checkAnimeGroup() au montage de l\'écran AnimeGroupScreen → GET /groups/anime/:id → le backend retourne l\'état réel en BDD.'),
      tip('Règle générale : ne jamais faire confiance au state Redux pour des données critiques qui doivent persister — revalider auprès du backend au montage.'),
      blank(),

      h2('Bug 4 — Hot-reload mort sur Windows + Docker'),
      bullet('Symptôme : je modifie un fichier TypeScript du backend, nodemon ne redémarre pas automatiquement.'),
      bullet('Diagnostic : Docker Desktop sur Windows virtualise un Linux pour les conteneurs. Les événements de modification de fichiers (inotify) du système Windows ne sont pas propagés vers le Linux du conteneur.'),
      bullet('Solution : lancer le backend directement sur la machine hôte (npm run dev) en dehors de Docker. PostgreSQL et Redis restent dans Docker. Le backend communique avec eux via localhost:5433 et localhost:6379.'),
      pageBreak(),

      // ── 11. CONSEILS JOUR J ───────────────────────────────────────────────
      h1('11.  Conseils pour le jour J'),

      h2('La veille'),
      bullet('Relis cette fiche de révision entièrement — une seule fois suffit.'),
      bullet('Lance l\'application sur ton téléphone ou émulateur et vérifie que tout fonctionne.'),
      bullet('Prépare 3-4 screenshots de l\'app (login, bibliothèque, panel admin, chat) — à montrer si le jury demande.'),
      bullet('Vérifie que le dossier DOCX s\'ouvre et que les images sont visibles.'),
      blank(),

      h2('Pendant la présentation'),
      bullet('Commence par le pitch (section 1 de cette fiche) — 2 minutes maximum.'),
      bullet('Laisse le jury poser des questions. Ne noie pas avec des détails non demandés.'),
      bullet('Si tu ne sais pas → "Je ne me souviens pas du chiffre exact mais la logique est..." vaut mieux qu\'une réponse inventée.'),
      bullet('Structure chaque réponse : problème → cause → solution. Ça montre ta rigueur.'),
      bullet('Utilise des exemples concrets : "Par exemple, quand un utilisateur se déconnecte..."'),
      blank(),

      h2('Formules qui font bonne impression'),
      tip('"J\'ai rencontré ce problème... j\'ai diagnostiqué la cause... j\'ai résolu en..."'),
      tip('"J\'ai choisi X plutôt que Y parce que dans mon contexte, [raison concrète]."'),
      tip('"C\'est un axe d\'amélioration que j\'ai identifié — en v2 j\'implémenterais [solution]."'),
      tip('"Cette contrainte m\'a appris que [leçon technique]."'),
      blank(),

      warn('Ne dis jamais "j\'ai suivi un tuto pour ça" même si c\'est vrai. Dis plutôt "je me suis documenté sur [concept] et j\'ai adapté à mon cas."'),
      blank(),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Bonne soutenance Antonin !', bold: true, size: 28, color: VIOLET, font: 'Calibri' })],
        spacing: { before: 400 },
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  writeFileSync('../documentation/fiche-revision-soutenance.docx', buf);
  console.log('✅ Fiche de révision générée : documentation/fiche-revision-soutenance.docx');
});
