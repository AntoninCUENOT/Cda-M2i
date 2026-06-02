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

      // ── PAGE DE GARDE ────────────────────────────────────────────────────
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
        children: [new TextRun({ text: 'CUENOT ANTONIN — Mai 2026', size: 24, color: GRAY, font: 'Calibri' })],
      }),
      ...Array(4).fill(blank()),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Lis ce document la veille de ta soutenance.', size: 22, italics: true, color: GRAY, font: 'Calibri' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Ne mémorise pas — comprends.', size: 22, italics: true, color: VIOLET, bold: true, font: 'Calibri' })],
      }),
      pageBreak(),

      // ── 1. PITCH 2 MINUTES ───────────────────────────────────────────────
      h1('1.  Ton pitch en 2 minutes'),
      p('Si le jury te demande "présentez votre projet en quelques mots", dis exactement ça :'),
      blank(),
      new Paragraph({
        children: [new TextRun({
          text: '"AnimeTracker est une application mobile que j\'ai développée de A à Z — de la base de données PostgreSQL jusqu\'à l\'interface React Native. Elle permet de gérer sa bibliothèque d\'animés, d\'écrire des avis, d\'échanger en messagerie privée et dans des groupes de discussion par animé. J\'avais présenté un site web pour mon DWWM, donc l\'objectif pour ce CDA était d\'explorer le développement mobile, quelque chose que je n\'avais pas encore pratiqué."',
          size: 22, italics: true, color: DARK, font: 'Calibri',
        })],
        spacing: { before: 100, after: 200 },
        indent: { left: 360, right: 360 },
      }),
      warn('Ne te lance pas tout de suite dans les détails techniques. Laisse le jury poser des questions.'),
      pageBreak(),

      // ── 2. CHIFFRES CLÉS ─────────────────────────────────────────────────
      h1('2.  Les chiffres à connaître par cœur'),
      blank(),
      chiffre('endpoints API REST', '43'),
      chiffre('tables en base de données', '12'),
      chiffre('tests Jest automatisés (100% passent)', '38'),
      chiffre('tests manuels sur émulateur Android', '41'),
      chiffre('fonctionnalités principales', '7'),
      chiffre('jours d\'expiration du token JWT', '7'),
      chiffre('itérations bcrypt (coût de hachage)', '10'),
      chiffre('port PostgreSQL dans Docker', '5433'),
      chiffre('port Redis dans Docker', '6380 → 6379'),
      chiffre('port backend Node.js', '3000'),
      blank(),
      warn('Si tu bloques sur un chiffre exact, dis "environ" — ne devine pas.'),
      pageBreak(),

      // ── 3. STACK TECHNIQUE ───────────────────────────────────────────────
      h1('3.  La stack — à expliquer sans hésiter'),

      h2('Frontend'),
      bullet('React Native + Expo'),
      sub('1 base de code → Android ET iOS. Expo = bundler + libs natives packagées.'),
      bullet('TypeScript'),
      sub('Typage statique. Détecte les erreurs à la compilation, pas en prod.'),
      bullet('Redux Toolkit'),
      sub('Gestion d\'état global. Un slice par domaine : auth, library, reviews, social, chat, groups.'),
      bullet('React Navigation'),
      sub('Deux stacks : AuthStack (Login/Register) et MainStack (Tab Bar + écrans empilés).'),
      bullet('Axios + intercepteurs'),
      sub('Ajoute le JWT automatiquement à chaque requête. Normalise les erreurs.'),
      blank(),

      h2('Backend'),
      bullet('Node.js + Express + TypeScript'),
      sub('Event-loop non bloquant = idéal pour API REST à forte I/O.'),
      bullet('Pattern Controllers / Services'),
      sub('Controller = HTTP. Service = logique métier. Service testable sans démarrer le serveur.'),
      bullet('Zod'),
      sub('Validation des données entrantes. Si rating:"abc" arrive → erreur 400 avant la BDD.'),
      bullet('asyncHandler'),
      sub('Wrapper qui capture les erreurs async et les envoie à errorHandler. Express 4 ne le fait pas nativement.'),
      blank(),

      h2('Infrastructure'),
      bullet('PostgreSQL 15 dans Docker'),
      sub('Port 5433 (5432 déjà occupé par PG natif sur ma machine).'),
      sub('init.sql lancé automatiquement au premier démarrage → crée les tables et les ENUM.'),
      bullet('Redis 7 dans Docker'),
      sub('Blacklist des tokens JWT. 10-100x plus rapide qu\'une requête SQL.'),
      bullet('JWT — JSON Web Token'),
      sub('Signé avec JWT_SECRET. Expire en 7 jours. À la déconnexion → placé en blacklist Redis.'),
      pageBreak(),

      // ── 4. FONCTIONNALITÉS ───────────────────────────────────────────────
      h1('4.  Les 7 fonctionnalités — ce qu\'il faut savoir dire'),

      h2('Auth (inscription / connexion / déconnexion)'),
      bullet('Mot de passe : bcrypt coût 10 → hash irréversible, jamais stocké en clair.'),
      bullet('Token JWT signé → stocké dans SecureStore (Expo), pas AsyncStorage.'),
      bullet('Déconnexion → token ajouté en blacklist Redis avec TTL = durée restante du token.'),
      blank(),

      h2('Bibliothèque personnelle'),
      bullet('Statuts : À_VOIR, EN_COURS, TERMINÉ, ABANDONNÉ — ENUM en base PostgreSQL.'),
      bullet('Contrainte UNIQUE(id_user, id_anime) → un animé ne peut apparaître qu\'une fois.'),
      bullet('Les données des animés viennent de Jikan API (MyAnimeList) — jamais stockées définitivement côté BDD.'),
      blank(),

      h2('Avis (reviews)'),
      bullet('Privé par défaut → l\'utilisateur doit explicitement choisir PUBLIC.'),
      bullet('1 avis max par (utilisateur, animé) → upsert côté service.'),
      bullet('Problème rencontré : avis privé disparaissait après navigation.'),
      sub('Cause : GET /animes/:id/reviews ne retourne que les publics.'),
      sub('Solution : endpoint dédié GET /animes/:id/my-review pour l\'auteur.'),
      blank(),

      h2('Messagerie privée'),
      bullet('3 tables : conversation, conversation_participant, message.'),
      bullet('Le backend vérifie que l\'expéditeur est participant avant d\'insérer le message.'),
      blank(),

      h2('Groupes de discussion'),
      bullet('1 groupe officiel par animé, créé automatiquement à la première demande.'),
      bullet('Problème rencontré : appartenance perdue au redémarrage (Redux éphémère).'),
      sub('Solution : checkAnimeGroup au montage de l\'écran → GET /groups/anime/:id retourne isMember.'),
      blank(),

      h2('Social (follow / unfollow)'),
      bullet('Contrainte CHECK(id_follower ≠ id_following) directement en SQL.'),
      bullet('Problème rencontré : bouton Follow toujours désactivé.'),
      sub('Cause : selectIsFollowing consultait le mauvais champ du store Redux.'),
      sub('Solution : vérification dans state.social.followers (chargé au montage du profil).'),
      blank(),

      h2('Profil utilisateur'),
      bullet('Stats calculées à la demande : épisodes totaux, temps de visionnage, taux de complétion.'),
      bullet('Avatar = index de couleur (0-7) stocké en entier — pas d\'upload d\'image.'),
      pageBreak(),

      // ── 5. DOCKER ────────────────────────────────────────────────────────
      h1('5.  Docker — explique-le clairement'),
      p('Le jury peut te demander "pourquoi Docker ?" ou "comment tu lances ton projet ?".'),
      blank(),

      h2('Pourquoi Docker ?'),
      bullet('Reproductibilité : même environnement sur toutes les machines.'),
      bullet('"Ça marche sur ma machine" = problème éliminé.'),
      bullet('PostgreSQL et Redis dans des conteneurs versionnés — pas de conflit avec les installations locales.'),
      blank(),

      h2('Comment ça se lance ?'),
      bullet('docker compose up -d → démarre PostgreSQL + Redis.'),
      bullet('PostgreSQL exécute automatiquement init.sql au premier démarrage.'),
      bullet('cd backend && npm run dev → backend Node.js sur port 3000.'),
      bullet('npx expo start → frontend, QR code ou émulateur Android.'),
      blank(),

      h2('Contrainte Windows rencontrée'),
      bullet('Docker Desktop sur Windows ne transmet pas les événements de fichiers (inotify).'),
      bullet('Nodemon ne détectait pas les changements de code depuis le conteneur.'),
      tip('Solution : backend lancé directement sur la machine hôte pendant le développement.'),
      pageBreak(),

      // ── 6. TESTS ─────────────────────────────────────────────────────────
      h1('6.  Les tests — sois précis'),

      h2('Tests automatisés Jest (38 tests, 100% pass)'),
      bullet('authService.test.ts — 15 tests unitaires'),
      sub('Inscription, connexion, bcrypt, JWT, blacklist Redis — tout mocké.'),
      bullet('userService.test.ts — 12 tests unitaires'),
      sub('Profil, mot de passe, follow/unfollow, recherche utilisateurs.'),
      bullet('auth.test.ts — 11 tests d\'intégration'),
      sub('Routes HTTP complètes avec Supertest — codes 200/201/400/401/409.'),
      blank(),

      h2('Pourquoi tout est mocké ?'),
      p('Les modèles Sequelize, la BDD et Redis sont mockés avec jest.mock(). Aucune connexion réelle n\'est établie. Ça permet des tests rapides (~4 secondes), fiables et indépendants de l\'infrastructure.'),
      blank(),

      h2('Tests manuels (41 tests, émulateur Android)'),
      bullet('7 tests Auth / 8 Bibliothèque / 7 Avis / 6 Messagerie / 4 Groupes / 5 Social / 4 Profil.'),
      bullet('Tous passent à 100%.'),
      blank(),
      warn('Le jury peut demander pourquoi pas de tests auto sur la bibliothèque/messagerie.'),
      tip('Réponds : "Ce sont des fonctionnalités qui dépendent de l\'état de la BDD et des données Jikan — les tester en unitaire demanderait de mocker énormément de couches. J\'ai fait le choix pragmatique de les valider par tests manuels. C\'est un axe d\'amélioration identifié."'),
      pageBreak(),

      // ── 7. VEILLE TECHNO ─────────────────────────────────────────────────
      h1('7.  Veille techno — les comparaisons clés'),
      p('Le jury peut te demander "pourquoi pas Flutter ?" ou "pourquoi pas MongoDB ?"'),
      blank(),

      h3('Pourquoi React Native plutôt que Flutter ?'),
      bullet('Flutter est excellent mais utilise Dart, un langage que je ne maîtrisais pas.'),
      bullet('React Native m\'a permis de capitaliser sur mes compétences JS/TS du DWWM.'),
      bullet('L\'écosystème npm de React Native est plus large (bibliothèques tierces).'),
      blank(),

      h3('Pourquoi PostgreSQL plutôt que MongoDB ?'),
      bullet('Mes données sont fortement relationnelles (utilisateurs, animés, avis, follows...).'),
      bullet('MongoDB est adapté aux données flexibles — ici le schéma est bien défini.'),
      bullet('PostgreSQL offre des ENUM natifs, UUID, contraintes CHECK, transactions ACID.'),
      blank(),

      h3('Pourquoi JWT plutôt que sessions ?'),
      bullet('JWT est stateless — pas de stockage serveur, scalable.'),
      bullet('Idéal pour mobile (stocké dans SecureStore, envoyé dans chaque requête).'),
      bullet('La blacklist Redis résout le seul inconvénient du JWT : la révocation.'),
      blank(),

      h3('Pourquoi Sequelize plutôt que Prisma ?'),
      bullet('Sequelize est plus mature et établi dans l\'écosystème Node.js.'),
      bullet('Prisma a une meilleure DX (Developer Experience) mais nécessite une génération de client.'),
      bullet('Pour ce projet, Sequelize est suffisant et plus flexible sur les requêtes complexes.'),
      pageBreak(),

      // ── 8. QUESTIONS PIÈGES ──────────────────────────────────────────────
      h1('8.  Questions pièges du jury — prépare ces réponses'),

      ...qa(
        'Qu\'est-ce que tu referais différemment ?',
        'J\'ajouterais des tests d\'intégration pour la bibliothèque et la messagerie. J\'implémenterais aussi un système de refresh token pour éviter les déconnexions forcées à l\'expiration du JWT. Et j\'utiliserais peut-être Prisma plutôt que Sequelize pour un meilleur typage TypeScript automatique.'
      ),

      ...qa(
        'Comment tu gères la sécurité ?',
        'Plusieurs couches : JWT pour l\'authentification, bcrypt coût 10 pour les mots de passe, Zod pour valider toutes les données entrantes, rate limiting (20 req/15min sur les routes auth), Helmet pour les en-têtes HTTP, CORS configuré, et contraintes CHECK en base de données (ex. : id_follower ≠ id_following).'
      ),

      ...qa(
        'C\'est quoi un AsyncThunk ?',
        'C\'est un utilitaire de Redux Toolkit pour gérer les actions asynchrones. Il crée automatiquement trois actions : pending (chargement), fulfilled (succès) et rejected (erreur). Ça évite d\'écrire ce boilerplate à la main et standardise la gestion des états de chargement dans tout le store.'
      ),

      ...qa(
        'Pourquoi tu utilises Redis pour la blacklist et pas PostgreSQL ?',
        'Redis est une base de données en mémoire — les opérations de lecture/écriture sont 10 à 100 fois plus rapides qu\'une requête SQL. Comme la vérification de la blacklist se fait à chaque requête authentifiée, cette performance est critique. Redis supporte aussi nativement le TTL (expiration automatique des clés), ce qui est parfait pour des tokens qui ont une durée de vie limitée.'
      ),

      ...qa(
        'Comment tu aurais fait si c\'était un projet d\'équipe ?',
        'J\'aurais mis en place des branches Git par feature, des pull requests avec code review, un pipeline CI/CD (GitHub Actions) pour lancer les tests automatiquement avant chaque merge, et des conventions de commit claires (conventional commits). Le découpage en slices Redux et en services backend facilite déjà le travail en parallèle.'
      ),

      ...qa(
        'Qu\'est-ce que le RGPD change dans ton projet ?',
        'J\'ai implémenté un endpoint DELETE /users/me qui supprime toutes les données personnelles de l\'utilisateur (suppression en cascade configurée en base). Il y a aussi un endpoint GET /users/me/data pour exporter ses données. Les mots de passe ne sont jamais stockés en clair. Les avis sont privés par défaut pour protéger l\'utilisateur.'
      ),

      ...qa(
        'Pourquoi tu as choisi ce thème ?',
        'C\'est un domaine que je connais bien — ça m\'a permis de me concentrer sur les défis techniques sans avoir à chercher les règles métier. Et l\'objectif principal était de faire une application mobile, ce que je n\'avais pas fait pendant mon DWWM où j\'avais présenté un site web.'
      ),

      pageBreak(),

      // ── 9. DERNIERS CONSEILS ─────────────────────────────────────────────
      h1('9.  Conseils pour le jour J'),

      h2('Avant'),
      bullet('Vérifie que le DOCX s\'ouvre correctement et que toutes les images sont là.'),
      bullet('Relis cette fiche de révision la veille, pas le matin même.'),
      bullet('Prépare quelques screenshots sur ton téléphone si tu dois montrer l\'app.'),
      blank(),

      h2('Pendant la présentation'),
      bullet('Commence par le pitch (2 min), laisse le jury diriger ensuite.'),
      bullet('Si tu ne sais pas → dis-le. "Je ne me souviens pas du chiffre exact mais la logique est..." vaut mieux qu\'une réponse inventée.'),
      bullet('Montre que tu comprends les choix, pas juste que tu les as faits.'),
      bullet('Utilise des exemples concrets : "par exemple, quand j\'ajoute un animé..."'),
      blank(),

      h2('Formules utiles'),
      tip('"J\'ai rencontré ce problème... j\'ai identifié la cause... j\'ai résolu en..."'),
      tip('"J\'ai choisi X plutôt que Y parce que dans ce contexte..."'),
      tip('"C\'est un axe d\'amélioration que j\'ai identifié et que j\'aimerais implémenter en v2."'),
      blank(),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Bonne soutenance Antonin ! 💪', bold: true, size: 28, color: VIOLET, font: 'Calibri' })],
        spacing: { before: 400 },
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  writeFileSync('../documentation/fiche-revision-soutenance.docx', buf);
  console.log('✅ Fiche de révision générée : documentation/fiche-revision-soutenance.docx');
});
